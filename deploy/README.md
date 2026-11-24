# Deploy tooling

Everything in this folder operates on the production VM
(`fablet.artdevelopers.site`). The live pipeline is webhook-driven; the full
runbook lives in [../docs/deployment.md](../docs/deployment.md).

| Path | Role |
| --- | --- |
| `vm/server.py` | Reference copy of the webhook receiver running at `/opt/fablet-deploy/server.py` |
| `vm/deploy.sh` | Reference copy of the deploy script; the runtime copy at `/opt/fablet-deploy/deploy.sh` self-syncs from this file (syntax-checked, keeps a `.bak`) |
| `deploy-live.js` | Full manual deploy from a workstation: deps, AI env, systemd units, verification |
| `deploy-fablet.sh` | VM-side build + publish script (kept for manual runs) |
| `preflight.js` / `verify-live.js` / `verify-ai.js` | Read-only checks of the VM, live services, and the AI stack |
| `nginx-fablet.conf`, `fablet-api.service` | Reference configs installed on the VM |
| `node-ssh.js` | First-generation manual deploy, kept for reference |

Workstation scripts read `deploy/.env` (gitignored) for the `FABLET_SSH_*`
credentials:

```sh
cd deploy && npm install
npm run preflight     # inspect the VM
npm run deploy        # full manual deploy
npm run verify        # verify the live site
```
