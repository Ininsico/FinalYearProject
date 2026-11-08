const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

// --- creds -----------------------------------------------------------------
for (const line of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split('\n')) {
  const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const HOST = process.env.FABLET_SSH_HOST;
const USER = process.env.FABLET_SSH_USER;
const PASS = process.env.FABLET_SSH_PASS;

// --- inputs ----------------------------------------------------------------
const AI_DIR = path.join(__dirname, '..', 'AI');
const groqKey = fs
  .readFileSync(path.join(AI_DIR, '.env'), 'utf8')
  .split('\n')
  .find((l) => l.startsWith('GROQ_API_KEY='))
  .slice('GROQ_API_KEY='.length)
  .trim();

const REPO = '/var/www/fablet-src';
const TEMP = path.join(__dirname, 'tmp-deploy');

let step = 0;
const results = [];

async function sh(ssh, label, command, { optional = false } = {}) {
  step += 1;
  console.log(`\n===== [${step}] ${label} =====`);
  console.log(`$ ${command.length > 200 ? command.slice(0, 200) + ' …' : command}`);
  const started = Date.now();
  const res = await ssh.execCommand(command);
  const secs = Math.round((Date.now() - started) / 1000);
  const out = (res.stdout || '').trim();
  if (out) console.log(out.split('\n').slice(-25).join('\n'));
  if (res.stderr && res.stderr.trim()) console.log('[stderr] ' + res.stderr.trim().split('\n').slice(-10).join('\n'));
  console.log(`→ exit ${res.code} (${secs}s)`);
  results.push({ label, code: res.code, secs });
  if (res.code !== 0 && !optional) throw new Error(`Step failed: ${label}`);
  return res;
}

async function main() {
  fs.mkdirSync(TEMP, { recursive: true });
  const ssh = new NodeSSH();
  console.log(`connecting to ${USER}@${HOST} …`);
  await ssh.connect({ host: HOST, username: USER, password: PASS, port: 22, readyTimeout: 30000 });
  console.log('connected');

  // 0 — preflight sanity -----------------------------------------------------
  await sh(ssh, 'sanity', 'set -e; hostname; git -C ' + REPO + ' rev-parse --abbrev-ref HEAD; test -f ' + REPO + '/Backend/.env && echo backend-env-ok');

  // 0b — existing AI key (idempotent) ---------------------------------------
  const keyProbe = await ssh.execCommand(`grep '^AI_SERVICE_KEY=' ${REPO}/AI/.env 2>/dev/null | cut -d= -f2`);
  const aiKey = (keyProbe.stdout || '').trim() || 'fablet-ai-' + crypto.randomBytes(24).toString('hex');
  console.log(`\nAI shared key: ${aiKey.slice(0, 10)}… (${(keyProbe.stdout || '').trim() ? 'reused' : 'generated'})`);

  // 1 — backup --------------------------------------------------------------
  const backup = await sh(
    ssh,
    'backup current site + checkout rev',
    `set -e
TS=$(date +%Y%m%d-%H%M%S)
DIR=/root/fablet-deploy-$TS
mkdir -p $DIR
tar czf $DIR/frontend.tar.gz -C /var/www/fablet . 2>/dev/null
git -C ${REPO} rev-parse HEAD > $DIR/previous-rev.txt
cp /etc/systemd/system/fablet-api.service $DIR/ 2>/dev/null || true
echo "backup dir: $DIR"
ls -la $DIR | tail -n +2`
  );
  const backupDir = ((backup.stdout.match(/backup dir: (\S+)/) || [])[1] || '').trim();

  // 2 — pull the pushed commit ---------------------------------------------
  await sh(
    ssh,
    'update checkout to origin/main',
    `cd ${REPO} && git fetch origin && git reset --hard origin/main && git log --oneline -1 && git status --porcelain | head -5`
  );

  // 3 — backend deps + AI env ----------------------------------------------
  await sh(
    ssh,
    'backend npm ci',
    `cd ${REPO}/Backend && npm ci --include=dev --no-audit --no-fund --loglevel=error 2>&1 | tail -5`
  );
  await sh(
    ssh,
    'backend env: AI service wiring',
    `cd ${REPO}/Backend
if grep -q '^AI_SERVICE_URL=' .env; then sed -i 's|^AI_SERVICE_URL=.*|AI_SERVICE_URL=http://127.0.0.1:8001|' .env; else echo 'AI_SERVICE_URL=http://127.0.0.1:8001' >> .env; fi
if grep -q '^AI_SERVICE_KEY=' .env; then sed -i 's|^AI_SERVICE_KEY=.*|AI_SERVICE_KEY=${aiKey}|' .env; else echo 'AI_SERVICE_KEY=${aiKey}' >> .env; fi
grep -E '^(AI_SERVICE_URL|AI_SERVICE_KEY)=' .env | sed 's/=\\(.\\{10\\}\\).*/=\\1…/'`
  );

  // 4 — frontend build + deploy --------------------------------------------
  await sh(
    ssh,
    'frontend npm ci',
    `cd ${REPO}/Frontend && npm ci --include=dev --no-audit --no-fund --loglevel=error 2>&1 | tail -5`
  );
  await sh(ssh, 'frontend build', `cd ${REPO}/Frontend && npm run build 2>&1 | tail -12`);
  await sh(
    ssh,
    'publish dist to nginx root',
    `rsync -a --delete --exclude .well-known ${REPO}/Frontend/dist/ /var/www/fablet/ && ls /var/www/fablet | head -5 && grep -o 'assets/index-[A-Za-z0-9_-]*\\.js' /var/www/fablet/index.html`
  );

  // 5 — system packages (tesseract for OCR) --------------------------------
  await sh(
    ssh,
    'install python venv + tesseract',
    `export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq python3-venv python3-pip tesseract-ocr >/dev/null
python3 -V; tesseract --version 2>&1 | head -1`
  );

  // 6 — AI service venv + deps ---------------------------------------------
  await sh(
    ssh,
    'AI venv + pip install',
    `cd ${REPO}/AI
[ -d .venv ] || python3 -m venv .venv
.venv/bin/pip install --quiet --upgrade pip
.venv/bin/pip install --quiet -r requirements.txt
.venv/bin/python -c "import flask, chromadb, onnxruntime, pypdf, pytesseract, docx; print('ai deps ok')"`
  );

  // 7 — AI env ---------------------------------------------------------------
  const aiEnv = [
    `GROQ_API_KEY=${groqKey}`,
    'GROQ_MODEL=openai/gpt-oss-120b',
    'GROQ_FALLBACK_MODEL=gpt-oss-20b',
    '',
    '# Shared secret the Node backend sends in X-AI-Key',
    `AI_SERVICE_KEY=${aiKey}`,
    'AI_PORT=8001',
    '',
    '# Hard guardrails',
    'AI_MAX_REQUESTS_PER_MIN=20',
    'AI_DAILY_REQUEST_BUDGET=500',
    'AI_DAILY_TOKEN_BUDGET=600000',
    'AI_MAX_TOKENS_PER_CALL=1200',
    'AI_MAX_PROMPT_CHARS=12000',
    '',
  ].join('\n');
  const aiEnvPath = path.join(TEMP, 'ai.env');
  fs.writeFileSync(aiEnvPath, aiEnv);
  await sh(
    ssh,
    'upload AI/.env',
    `mkdir -p ${REPO}/AI && cat > ${REPO}/AI/.env <<'ENVEOF'\n${aiEnv}ENVEOF\nchmod 600 ${REPO}/AI/.env && echo ai-env-written`
  );

  // 8 — chroma embedding model cache ---------------------------------------
  const cacheDir = path.join(process.env.USERPROFILE, '.cache', 'chroma');
  if (fs.existsSync(path.join(cacheDir, 'onnx_models', 'all-MiniLM-L6-v2'))) {
    const tarPath = path.join(TEMP, 'chroma-cache.tar.gz');
    if (!fs.existsSync(tarPath)) {
      console.log('\npacking local chroma model cache …');
      execSync(
        `tar -czf "${tarPath}" -C "${cacheDir}" onnx_models/all-MiniLM-L6-v2`,
        { stdio: 'inherit' }
      );
    }
    console.log('uploading chroma cache (' + Math.round(fs.statSync(tarPath).size / 1048576) + ' MB) …');
    await ssh.putFile(tarPath, '/root/chroma-cache.tar.gz');
    await sh(
      ssh,
      'install chroma model cache',
      `set -e
mkdir -p /root/.cache/chroma
tar xzf /root/chroma-cache.tar.gz -C /root/.cache/chroma
rm -f /root/chroma-cache.tar.gz
du -sh /root/.cache/chroma/onnx_models/all-MiniLM-L6-v2`
    );
  } else {
    console.log('\n(no local chroma cache — the VM will download the model on first use)');
  }

  // 9 — systemd unit for the AI service ------------------------------------
  const unit = `[Unit]
Description=Fablet AI service (Flask + ChromaDB)
After=network.target

[Service]
Type=simple
WorkingDirectory=${REPO}/AI
ExecStart=${REPO}/AI/.venv/bin/python ${REPO}/AI/app.py
EnvironmentFile=${REPO}/AI/.env
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
`;
  await sh(
    ssh,
    'install fablet-ai.service',
    `cat > /etc/systemd/system/fablet-ai.service <<'UNITEOF'\n${unit}UNITEOF\nsystemctl daemon-reload && systemctl enable --now fablet-ai && sleep 3 && systemctl is-active fablet-ai`
  );

  // 10 — restart the backend ------------------------------------------------
  await sh(
    ssh,
    'restart fablet-api',
    `systemctl restart fablet-api && sleep 4 && systemctl is-active fablet-api`
  );

  // 11 — verify --------------------------------------------------------------
  await sh(
    ssh,
    'verify services + endpoints',
    `set +e
echo '— units —'
systemctl is-active fablet-api fablet-ai
echo '— backend direct —'
curl -s -o /dev/null -w 'api /api/dictionary: %{http_code}\\n' 'http://127.0.0.1:4000/api/dictionary?limit=1'
echo '— ai direct —'
curl -s http://127.0.0.1:8001/health
echo
echo '— site —'
curl -s -o /dev/null -w 'frontend: %{http_code}\\n' -H 'Host: fablet.artdevelopers.site' http://127.0.0.1/
echo '— api through nginx —'
curl -s -o /dev/null -w 'via nginx /api/dictionary: %{http_code}\\n' -H 'Host: fablet.artdevelopers.site' 'http://127.0.0.1/api/dictionary?limit=1'
echo '— api log tail —'
journalctl -u fablet-api -n 8 --no-pager | tail -8`
  );

  // 12 — final summary -------------------------------------------------------
  console.log('\n================ DEPLOY SUMMARY ================');
  for (const r of results) console.log(`${r.code === 0 ? 'ok  ' : 'FAIL'}  ${r.secs}s  ${r.label}`);
  console.log(`backup dir on VM: ${backupDir}`);
  console.log('================================================');
  ssh.dispose();
}

main().catch((e) => {
  console.error('\nDEPLOY FAILED:', e.message);
  process.exit(1);
});
