# Deployment

Fablet ships through a custom GitHub-webhook pipeline on the VM. No GitHub
Actions: GitHub notifies the VM, and the VM pulls `origin/main` and rebuilds
itself in place.

## How a push ships

1. Someone pushes to `main` on `github.com/Ininsico/FinalYearProject`.
2. GitHub sends a signed `push` webhook (HMAC-SHA256, `X-Hub-Signature-256`) to
   `https://fablet.artdevelopers.site/__deploy/`.
3. nginx proxies `/__deploy/` to `127.0.0.1:9097` (`fablet-deploy.service`).
   The receiver verifies the signature, accepts only `refs/heads/main`, and
   launches the deploy under `flock` so runs never overlap.
4. `/opt/fablet-deploy/deploy.sh` pulls, migrates the layout if needed,
   installs, builds, publishes, restarts, and health-checks.

Reference copies of both the receiver and the deploy script live in
[`deploy/vm/`](../deploy/vm). The deploy script replaces its own runtime copy
from `deploy/vm/deploy.sh` on each run (syntax-checked first, previous version
kept as `.bak`), so future pipeline changes ship through the same pipeline as
everything else.

If the receiver is down, GitHub records the failed delivery in the repo's
webhook settings, where it can be redelivered.

## What a deploy does

1. `git fetch --prune origin && git reset --hard origin/main` in `/var/www/fablet-src`
2. Migrates gitignored runtime state (`.env`, `node_modules`, AI data) when the
   checkout moves from the legacy flat layout to `apps/` + `services/`
3. `npm install --include=dev` in `apps/api` and `apps/web`
4. `npm run build` in `apps/web`
5. `rsync -a --delete --exclude .well-known apps/web/dist/ /var/www/fablet/`
6. rewrites the systemd units to match the current layout, then daemon-reloads
7. restarts `fablet-api` and waits for the API to answer 200 (up to 60s); the
   AI service is only reinstalled and restarted when files under `services/ai`
   changed
8. logs health checks and finishes; failures are visible in the deploy log

## Where things live on the VM

| Thing | Path |
| --- | --- |
| Deploy receiver | `/opt/fablet-deploy/server.py` — systemd `fablet-deploy`, `127.0.0.1:9097` |
| Deploy script | `/opt/fablet-deploy/deploy.sh` (self-syncs from `deploy/vm/deploy.sh`) |
| Webhook secret | `/opt/fablet-deploy/.secret` |
| Webhook log | `/var/www/fablet-src/logs/webhook.log` |
| Deploy log | `/var/www/fablet-src/logs/deploy.log` |
| Git checkout built from | `/var/www/fablet-src` |
| nginx root | `/var/www/fablet` |
| API service | `fablet-api.service` — runs `apps/api`, port 4000 |
| AI service | `fablet-ai.service` — runs `services/ai`, port 8001 |

Recreating the GitHub hook (repo Settings → Webhooks) if ever needed:
payload URL `https://fablet.artdevelopers.site/__deploy/`, content type
`application/json`, events: `push` only, secret = contents of
`/opt/fablet-deploy/.secret`.

## Repository layout (November 2026 restructure)

| Before | After |
| --- | --- |
| `Frontend/` | `apps/web/` |
| `Backend/` | `apps/api/` |
| `MobileApp/` | `apps/mobile/` |
| `DesktopApp/` | `apps/desktop/` |
| `AI/` | `services/ai/` |
| `Server/` | `deploy/` |
| `CI-CD.md` | `docs/deployment.md` (this file) |
| `README.md` (concept spec) | `docs/architecture/vision.md` |
| `Research/` | `docs/research/` |
| `OperatingSystem/`, `sandbox/` | removed (empty placeholders) |

## Database

The backend runs against the local MongoDB on the VM —
`mongodb://127.0.0.1:27017/FinalYearProjectFablet`, set in
`/var/www/fablet-src/apps/api/.env`. Nightly logical backups land in
`/root/db-backups/fablet-local-*.archive` (cron `/etc/cron.d/fablet-backup`,
14-day retention).

To pull data in from the old Atlas cluster once it is reachable again:

```sh
bash /opt/fablet-deploy/restore-atlas.sh
```

## Manual operations

```sh
# deploy right now (exactly what the webhook runs)
bash /opt/fablet-deploy/deploy.sh

# watch a deploy as it happens
tail -f /var/www/fablet-src/logs/deploy.log

# service states
systemctl status fablet-api fablet-ai fablet-deploy

# workstation checks (reads deploy/.env for SSH credentials)
cd deploy && npm run preflight && npm run verify

# local equivalents of the build steps
cd apps/web && npm ci && npm run build
cd apps/api && npm ci && npm start
```
