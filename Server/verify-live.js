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

  const script = `
echo "— checkout —"
git -C /var/www/fablet-src log --oneline -1
git -C /var/www/fablet-src status --porcelain | head -3
echo "— units —"
systemctl is-active fablet-api fablet-ai
systemctl is-enabled fablet-ai
echo "— backend env (masked) —"
grep -E '^(AI_SERVICE_URL|AI_SERVICE_KEY)=' /var/www/fablet-src/Backend/.env | sed 's/=\\(.\\{12\\}\\).*/=\\1…/'
echo "— ai health —"
curl -s --max-time 8 http://127.0.0.1:8001/health || echo "AI UNREACHABLE"
echo
echo "— api direct —"
curl -s --max-time 8 -o /dev/null -w '%{http_code}\\n' 'http://127.0.0.1:4000/api/dictionary?limit=1'
echo "— api via nginx —"
curl -s --max-time 8 -o /dev/null -w '%{http_code}\\n' -H 'Host: fablet.artdevelopers.site' 'http://127.0.0.1/api/dictionary?limit=1'
echo "— frontend served —"
head -c 400 /var/www/fablet/index.html | grep -o 'assets/index-[A-Za-z0-9_-]*\\.js'
echo "— backups —"
ls -d /root/fablet-deploy-* 2>/dev/null | tail -2
cat /root/fablet-deploy-*/previous-rev.txt 2>/dev/null | tail -1
echo "— api recent log —"
journalctl -u fablet-api -n 6 --no-pager | tail -6
echo "— ai recent log —"
journalctl -u fablet-ai -n 6 --no-pager | tail -6
`;
  const res = await ssh.execCommand(script);
  console.log(res.stdout);
  if (res.stderr && res.stderr.trim()) console.log('[stderr]', res.stderr.trim());
  ssh.dispose();
}

main().catch((e) => {
  console.error('VERIFY FAILED:', e.message);
  process.exit(1);
});
