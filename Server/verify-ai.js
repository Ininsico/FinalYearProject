const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');

for (const line of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split('\n')) {
  const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

async function main() {
  const ssh = new NodeSSH();
  await ssh.connect({
    host: process.env.FABLET_SSH_HOST,
    username: process.env.FABLET_SSH_USER,
    password: process.env.FABLET_SSH_PASS,
    port: 22,
    readyTimeout: 30000,
  });
  const res = await ssh.execCommand(`
echo "— chroma model cache —"
du -sh /root/.cache/chroma/onnx_models/all-MiniLM-L6-v2 2>/dev/null || echo "cache missing"
ls /root/.cache/chroma/onnx_models/all-MiniLM-L6-v2/onnx 2>/dev/null | head -5
echo "— ai status —"
curl -s --max-time 8 http://127.0.0.1:8001/status || echo "status endpoint unreachable"
echo
echo "— ai venv python —"
/var/www/fablet-src/AI/.venv/bin/python -V
echo "— tesseract —"
tesseract --version 2>&1 | head -1
`);
  console.log(res.stdout);
  if (res.stderr && res.stderr.trim()) console.log('[stderr]', res.stderr.trim());
  ssh.dispose();
}

main().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
