const { NodeSSH } = require('node-ssh');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load local .env (deploy creds) if present. Never committed — gitignored.
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
      if (m && !(m[1] in process.env)) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
    }
  }
} catch {}

const HOST = process.env.FABLET_SSH_HOST || '169.58.119.44';
const USER = process.env.FABLET_SSH_USER || 'root';
const PASS = process.env.FABLET_SSH_PASS;
const REMOTE = '/var/www/fablet';

if (!PASS) {
  console.error('FABLET_SSH_PASS is not set. Refusing to deploy.');
  process.exit(1);
}
const FRONTEND = path.join(__dirname, '..', 'Frontend');
const DIST = path.join(FRONTEND, 'dist');
const TAR = path.join(__dirname, 'dist.tar');

async function main() {
  if (!fs.existsSync(DIST)) {
    console.log('dist missing, building...');
    execSync('npm run build', { cwd: FRONTEND, stdio: 'inherit' });
  }

  console.log('tarring dist...');
  execSync(`tar -cf "${TAR}" -C "${DIST}" .`);

  const ssh = new NodeSSH();
  console.log('connecting to', HOST);
  await ssh.connect({ host: HOST, username: USER, password: PASS, port: 22 });
  console.log('connected');

  console.log('uploading dist.tar...');
  await ssh.putFile(TAR, '/root/dist.tar');

  console.log('extracting ->', REMOTE);
  const ex = await ssh.execCommand(
    `rm -rf ${REMOTE} && mkdir -p ${REMOTE} && tar -xf /root/dist.tar -C ${REMOTE} && rm -f /root/dist.tar`
  );
  if (ex.code !== 0) { console.error('extract failed:\n', ex.stderr || ex.stdout); process.exit(1); }

  console.log('installing nginx site...');
  await ssh.putFile(path.join(__dirname, 'nginx-fablet.conf'), '/etc/nginx/sites-available/fablet');
  const ng = await ssh.execCommand(
    'ln -sf /etc/nginx/sites-available/fablet /etc/nginx/sites-enabled/fablet && nginx -t && systemctl reload nginx'
  );
  if (ng.code !== 0) { console.error('nginx error:\n', ng.stderr || ng.stdout); process.exit(1); }

  fs.unlinkSync(TAR);
  console.log('DEPLOY OK');
  ssh.dispose();
}

main().catch((e) => { console.error(e); process.exit(1); });
