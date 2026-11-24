# CI/CD

Deploys run through a custom GitHub-webhook pipeline on the deploy VM.
No GitHub Actions, no external build services: GitHub notifies the VM, the VM
pulls `origin/main` and rebuilds itself in place.

## How a push ships

1. Someone pushes to `main` on `github.com/Ininsico/FinalYearProject`.
2. GitHub sends a `push` webhook (HMAC-SHA256 signed, `X-Hub-Signature-256`) to
   `https://fablet.artdevelopers.site/__deploy/`.
3. nginx proxies `/__deploy/` to the deploy receiver on `127.0.0.1:9097`
   (`fablet-deploy.service`). The receiver verifies the signature, accepts only
   `refs/heads/main`, and launches the deploy under `flock` so runs never overlap.
4. The deploy script pulls, installs, builds, publishes, restarts, and health-checks.

If the receiver is down, GitHub records the failed delivery in the repo's webhook
settings, where it can be redelivered.

## What a deploy does

`/opt/fablet-deploy/deploy.sh`:

1. `git fetch --prune origin && git reset --hard origin/main` in `/var/www/fablet-src`
2. `npm install --include=dev` in `Backend/` and `Frontend/`
3. `npm run build` in `Frontend/`
4. `rsync -a --delete --exclude .well-known Frontend/dist/ /var/www/fablet/`
5. restarts `fablet-api` and waits for the API to answer 200 (up to 60s)
6. when anything under `AI/` changed, installs AI deps and restarts `fablet-ai`
7. logs health checks and finishes; failures are visible in the deploy log

## Where things live on the VM

| Thing | Path |
| --- | --- |
| Deploy receiver | `/opt/fablet-deploy/server.py` — systemd `fablet-deploy`, `127.0.0.1:9097` |
| Deploy script | `/opt/fablet-deploy/deploy.sh` |
| Webhook secret | `/opt/fablet-deploy/.secret` |
| Webhook log | `/var/www/fablet-src/logs/webhook.log` |
| Deploy log | `/var/www/fablet-src/logs/deploy.log` |
| Git checkout built from | `/var/www/fablet-src` |
| nginx root | `/var/www/fablet` |
| API service | `fablet-api.service` (port 4000) |
| AI service | `fablet-ai.service` (port 8001) |

Recreating the GitHub hook (repo Settings → Webhooks) if ever needed:
payload URL `https://fablet.artdevelopers.site/__deploy/`, content type
`application/json`, events: `push` only, secret = contents of
`/opt/fablet-deploy/.secret`.

## Database

The backend runs against the local MongoDB on the VM —
`mongodb://127.0.0.1:27017/FinalYearProjectFablet`, set in
`/var/www/fablet-src/Backend/.env`. Nightly logical backups land in
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

# local equivalents of the build steps
cd Frontend && npm ci && npm run build
cd Backend && npm ci && npm start
```
