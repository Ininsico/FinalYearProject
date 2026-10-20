#!/usr/bin/env bash
# Build the Fablet frontend from this checkout and deploy it to the nginx web
# root, then restart the API service. Run on the server as root.
#
#   REPO_DIR    git checkout to build from              (default /var/www/fablet-src)
#   WEB_ROOT    nginx root for fablet.artdevelopers.site (default /var/www/fablet)
#   API_SERVICE systemd unit for the backend            (default fablet-api)
set -euo pipefail

REPO_DIR="${REPO_DIR:-/var/www/fablet-src}"
WEB_ROOT="${WEB_ROOT:-/var/www/fablet}"
API_SERVICE="${API_SERVICE:-fablet-api}"

echo "[deploy] installing frontend deps"
cd "$REPO_DIR/Frontend"
npm ci --no-audit --no-fund

echo "[deploy] building frontend"
npm run build

echo "[deploy] syncing $REPO_DIR/Frontend/dist -> $WEB_ROOT"
rsync -a --delete --exclude ".well-known" "$REPO_DIR/Frontend/dist/" "$WEB_ROOT/"

echo "[deploy] restarting $API_SERVICE"
systemctl restart "$API_SERVICE"

echo "[deploy] done"
