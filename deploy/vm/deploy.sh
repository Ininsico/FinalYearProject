#!/usr/bin/env bash
# Fablet deploy script — runs on the server, invoked by the webhook listener.
# Pulls main, migrates the layout if needed, installs, builds, publishes,
# restarts the services, and health-checks the result.
set -euo pipefail
export GIT_TERMINAL_PROMPT=0
export HOME="${HOME:-/root}"
REPO=/var/www/fablet-src
WEB_ROOT=/var/www/fablet
LOG_DIR="$REPO/logs"
mkdir -p "$LOG_DIR"
exec > >(tee -a "$LOG_DIR/deploy.log") 2>&1
echo "=== Deploy started $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="
BEFORE="$(git -C "$REPO" rev-parse HEAD)"
echo "--- Pulling main ---"
git -C "$REPO" fetch --prune origin
git -C "$REPO" reset --hard origin/main
AFTER="$(git -C "$REPO" rev-parse HEAD)"
echo "Commit: $(git -C "$REPO" rev-parse --short HEAD) $(git -C "$REPO" log -1 --pretty=%s)"

# Keep the runtime copy of this script in sync with the repo copy.
# Syntax-checked before replacing; the previous version is kept as .bak.
SYNC="$REPO/deploy/vm/deploy.sh"
if [ -f "$SYNC" ] && ! cmp -s "$SYNC" /opt/fablet-deploy/deploy.sh && bash -n "$SYNC"; then
  cp -a /opt/fablet-deploy/deploy.sh /opt/fablet-deploy/deploy.sh.bak
  cp "$SYNC" /opt/fablet-deploy/deploy.sh
  chmod 755 /opt/fablet-deploy/deploy.sh
  echo "deploy.sh updated from repo; next deploy uses it"
fi

# Layout: apps/web + apps/api + services/ai (new) or flat dirs (legacy).
if [ -d "$REPO/apps/web" ]; then
  WEB="$REPO/apps/web"; API="$REPO/apps/api"; AI="$REPO/services/ai"; LAYOUT=new
else
  WEB="$REPO/Frontend"; API="$REPO/Backend"; AI="$REPO/AI"; LAYOUT=legacy
fi
echo "--- Layout: $LAYOUT ---"

# One-time migration of gitignored runtime state from the legacy layout.
if [ "$LAYOUT" = "new" ]; then
  for pair in "Backend:apps/api" "Frontend:apps/web" "AI:services/ai"; do
    old="$REPO/${pair%%:*}"; dst="$REPO/${pair##*:}"
    for item in .env data node_modules dist; do
      [ -e "$old/$item" ] && [ ! -e "$dst/$item" ] && mv "$old/$item" "$dst/$item" && echo "migrated ${pair%%:*}/$item" || true
    done
  done
fi

echo "--- Disk before installs ---"
df -h / || true
AVAIL=$(df --output=avail -m / | tail -1 | tr -d ' ')
echo "disk available: ${AVAIL}MB"
if [ "${AVAIL:-9999}" -lt 500 ]; then
  echo "low disk - clearing npm cache and build caches"
  npm cache clean --force || true
  rm -rf "$API/node_modules/.cache" "$WEB/node_modules/.vite" 2>/dev/null || true
fi

echo "--- Installing backend dependencies ---"
( cd "$API" && npm install --include=dev --no-audit --no-fund --prefer-offline )
echo "--- Installing frontend dependencies ---"
( cd "$WEB" && npm install --include=dev --no-audit --no-fund --prefer-offline )
echo "--- Building frontend ---"
rm -rf "$WEB/dist"
( cd "$WEB" && npm run build )

echo "--- Verifying build output ---"
test -f "$WEB/dist/index.html"
MISSING=""
for ref in $(grep -oE '/assets/[A-Za-z0-9._-]+' "$WEB/dist/index.html" | sort -u || true); do
  [ -f "$WEB/dist${ref}" ] || MISSING="$MISSING $ref"
done
if [ -n "$MISSING" ]; then
  echo "build is missing referenced assets:$MISSING"
  exit 1
fi

echo "--- Publishing dist -> $WEB_ROOT (staged) ---"
STAGE=/var/www/fablet-stage
rm -rf "$STAGE"
mkdir -p "$STAGE"
rsync -a --exclude .well-known "$WEB/dist/" "$STAGE/"
SYNCED=0
for attempt in 1 2 3; do
  if rsync -a --delete --exclude .well-known "$STAGE/" "$WEB_ROOT/"; then
    SYNCED=1
    break
  fi
  echo "publish attempt $attempt failed"
  df -h / || true
  sleep 3
done
rm -rf "$STAGE"
if [ "$SYNCED" != "1" ]; then
  echo "PUBLISH FAILED - web root not updated"
  df -h / || true
  exit 1
fi
echo "publish ok"

changed() { [ "$BEFORE" != "$AFTER" ] && git -C "$REPO" diff --name-only "$BEFORE" "$AFTER" -- "$1" | grep -q .; }

# The systemd units follow the layout so paths can never drift.
if [ "$LAYOUT" = "new" ]; then
  cat > /etc/systemd/system/fablet-api.service <<UNIT_API
[Unit]
Description=Fablet API service
After=network.target

[Service]
Type=simple
WorkingDirectory=$API
ExecStart=/usr/bin/env node $API/src/index.js
EnvironmentFile=$API/.env
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
UNIT_API
  cat > /etc/systemd/system/fablet-ai.service <<UNIT_AI
[Unit]
Description=Fablet AI service (Flask + ChromaDB)
After=network.target

[Service]
Type=simple
WorkingDirectory=$AI
ExecStart=$AI/.venv/bin/python $AI/app.py
EnvironmentFile=$AI/.env
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
UNIT_AI
  systemctl daemon-reload
  systemctl enable fablet-api fablet-ai >/dev/null 2>&1 || true
fi

if changed AI || changed services/ai; then
  echo "--- AI service changed: dependencies + restart ---"
  if [ ! -x "$AI/.venv/bin/python" ]; then
    echo "creating AI venv"
    python3 -m venv "$AI/.venv"
  fi
  "$AI/.venv/bin/pip" install --quiet --upgrade pip
  "$AI/.venv/bin/pip" install --quiet -r "$AI/requirements.txt"
  "$AI/.venv/bin/python" -c "import flask, chromadb, onnxruntime, pypdf, pytesseract, docx; print('ai deps ok')"
  systemctl restart fablet-ai
  sleep 2
  systemctl is-active fablet-ai
fi

echo "--- Restarting fablet-api ---"
systemctl restart fablet-api
API_CODE=000
for i in $(seq 1 30); do
  API_CODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 'http://127.0.0.1:4000/api/dictionary?limit=1' || true)
  [ "$API_CODE" = "200" ] && break
  sleep 2
done
echo "api ready: $API_CODE (waited up to 60s)"
systemctl is-active fablet-api
echo "--- Health checks ---"
echo "api direct: $API_CODE"
curl -s -o /dev/null -w 'site via nginx: %{http_code}\n' -H 'Host: fablet.artdevelopers.site' http://127.0.0.1/ || true
curl -s --max-time 8 http://127.0.0.1:8001/health || echo 'ai unreachable'
echo

# Clean up what the layout migration left behind.
if [ "$LAYOUT" = "new" ]; then
  rm -rf "$REPO/Server/node_modules" "$REPO/Server/tmp-deploy" 2>/dev/null || true
  if [ -x "$AI/.venv/bin/python" ] && [ -d "$REPO/AI/.venv" ] && [ "$AI" != "$REPO/AI" ]; then
    rm -rf "$REPO/AI/.venv"
  fi
  for d in Backend Frontend AI Server Research sandbox OperatingSystem; do
    [ -d "$REPO/$d" ] && rmdir "$REPO/$d" 2>/dev/null || true
  done
fi

echo "=== Deploy finished $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="
