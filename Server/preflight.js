const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');

// Load deploy creds from Server/.env (gitignored).
for (const line of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split('\n')) {
  const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const HOST = process.env.FABLET_SSH_HOST;
const USER = process.env.FABLET_SSH_USER;
const PASS = process.env.FABLET_SSH_PASS;

async function run(ssh, label, command, timeoutMs = 60000) {
  const res = await ssh.execCommand(command, { execOptions: { pty: false } });
  const out = (res.stdout || '').trim();
  const err = (res.stderr || '').trim();
  console.log(`\n### ${label} (exit ${res.code})`);
  if (out) console.log(out.split('\n').slice(0, 25).join('\n'));
  if (err) console.log('[stderr] ' + err.split('\n').slice(0, 8).join('\n'));
  return res;
}

async function main() {
  const ssh = new NodeSSH();
  console.log(`connecting to ${USER}@${HOST} ...`);
  await ssh.connect({ host: HOST, username: USER, password: PASS, port: 22, readyTimeout: 30000 });
  console.log('connected');

  await run(ssh, 'host', 'hostname; uname -sr; (cat /etc/os-release | head -2 | tr "\\n" " ")');
  await run(ssh, 'toolchain', 'node -v; npm -v; python3 -V; which python3; which pip3; which tesseract || echo "no tesseract"; nginx -v 2>&1');
  await run(ssh, 'resources', 'df -h / | tail -1; free -m | sed -n 2p; nproc');
  await run(ssh, 'api service', 'systemctl is-active fablet-api; systemctl is-enabled fablet-api; systemctl status fablet-api --no-pager 2>&1 | head -6');
  await run(ssh, 'checkout state', 'git -C /var/www/fablet-src log --oneline -1; git -C /var/www/fablet-src status --porcelain | head -10; git -C /var/www/fablet-src branch --show-current');
  await run(ssh, 'github reachability', 'cd /var/www/fablet-src && GIT_TERMINAL_PROMPT=0 timeout 25 git ls-remote origin refs/heads/main 2>&1 | head -3', 40000);
  await run(ssh, 'web root', 'ls /var/www/fablet | head -8; ls /var/www/fablet-src/Backend/.env 2>/dev/null && echo "backend .env present"');
  await run(ssh, 'ai dir', 'ls /var/www/fablet-src/AI 2>/dev/null | head -12 || echo "no AI dir yet"');
  await run(ssh, 'ai service', 'systemctl is-active fablet-ai 2>/dev/null || echo "no fablet-ai unit"');
  await run(ssh, 'ports', 'ss -ltnp | grep -E "4000|8001|80|443" || netstat -ltnp 2>/dev/null | grep -E "4000|8001" ');

  ssh.dispose();
  console.log('\npreflight done');
}

main().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
