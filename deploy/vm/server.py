#!/usr/bin/env python3
# Fablet deploy webhook receiver — GitHub push -> deploy.sh
# Mirrors the house pattern: HMAC-verified POST from GitHub, refs/heads/main only.
# Runtime copy: /opt/fablet-deploy/server.py (systemd: fablet-deploy, 127.0.0.1:9097)
import hashlib, hmac, json, os, subprocess
from http.server import BaseHTTPRequestHandler, HTTPServer

HOST = "127.0.0.1"
PORT = 9097
BASE = "/opt/fablet-deploy"
SECRET_FILE = os.path.join(BASE, ".secret")
DEPLOY_SH = os.path.join(BASE, "deploy.sh")
LOG_FILE = "/var/www/fablet-src/logs/webhook.log"

def log(msg):
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    with open(LOG_FILE, "a") as f:
        f.write(msg + "\n")
    print(msg, flush=True)

def load_secret():
    with open(SECRET_FILE, "rb") as f:
        return f.read().strip()

class Handler(BaseHTTPRequestHandler):
    def _send(self, code, body=b"ok"):
        self.send_response(code)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.rstrip("/") in ("", "/health"):
            self._send(200, b"healthy")
        else:
            self._send(404, b"not found")

    def do_POST(self):
        if self.path.rstrip("/") not in ("", "/deploy"):
            self._send(404, b"not found")
            return
        length = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(length) if length else b""
        signature = self.headers.get("X-Hub-Signature-256", "")
        expected = "sha256=" + hmac.new(load_secret(), body, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expected, signature):
            log("rejected: bad signature")
            self._send(401, b"bad signature")
            return
        event = self.headers.get("X-GitHub-Event", "")
        if event == "ping":
            log("ping received")
            self._send(200, b"pong")
            return
        if event != "push":
            self._send(200, b"ignored")
            return
        try:
            payload = json.loads(body or b"{}")
        except Exception:
            payload = {}
        if payload.get("ref") != "refs/heads/main":
            log("ignored non-main push: %s" % payload.get("ref"))
            self._send(200, b"ignored")
            return
        after = payload.get("after", "")
        log("accepted push %s -> starting deploy" % after)
        cmd = "flock /tmp/fablet-deploy.lock bash %s" % DEPLOY_SH
        subprocess.Popen(["/bin/bash", "-lc", cmd],
                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        self._send(202, b"deploying")

    def log_message(self, fmt, *args):
        pass

if __name__ == "__main__":
    log("webhook listening on %s:%d" % (HOST, PORT))
    HTTPServer((HOST, PORT), Handler).serve_forever()
