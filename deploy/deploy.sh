#!/usr/bin/env bash
# Server-side helper (run on the box as root). node-ssh.js does this over SSH;
# this file is kept for reference / manual runs. The self-signed cert at
# /etc/ssl/certs/fablet.crt already exists and is reused.
set -e
ln -sf /etc/nginx/sites-available/fablet /etc/nginx/sites-enabled/fablet
nginx -t
systemctl reload nginx
echo "fablet live at /var/www/fablet"
