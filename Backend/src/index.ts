import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ES module fixes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SpatialAnchor {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  confidence: number;
}

interface TelemetryData {
  temp: number;
  npuLoad: number;
  imuDrift: number;
  batteryLevel: number;
  isGlassOn: boolean;
  orientation?: {
    roll: number;
    pitch: number;
    yaw: number;
  };
}

// Global state
let spatialAnchors: SpatialAnchor[] = [
  { id: "1", name: "Workstation Anchor", x: 0.12, y: 1.45, z: -0.58, confidence: 99.4 },
  { id: "2", name: "Smart Display Anchor", x: -1.42, y: 1.10, z: 0.85, confidence: 97.2 },
  { id: "3", name: "Dynamic Room Bounds", x: 2.30, y: 0.05, z: -1.90, confidence: 91.8 },
];

let telemetry: TelemetryData = {
  temp: 38.0,
  npuLoad: 42,
  imuDrift: 0.02,
  batteryLevel: 88.0,
  isGlassOn: true,
  orientation: { roll: 0, pitch: 0, yaw: 0 }
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// WebSocket Clients set
const clients = new Set<WebSocket>();

// 1. LINK UP: Spawning the Rust Computational Core (EKF Sensor Fusion)
let rustProcess: ChildProcessWithoutNullStreams | null = null;
const rustBinPathDebug = path.join(__dirname, "../rust/target/debug/rust_offloader.exe");
const rustBinPathRelease = path.join(__dirname, "../rust/target/release/rust_offloader.exe");

let activeRustPath = "";
if (fs.existsSync(rustBinPathRelease)) {
  activeRustPath = rustBinPathRelease;
} else if (fs.existsSync(rustBinPathDebug)) {
  activeRustPath = rustBinPathDebug;
}

if (activeRustPath) {
  console.log(`[BOOT] Rust EKF computational offloader binary detected at: ${activeRustPath}`);
  try {
    rustProcess = spawn(activeRustPath);

    rustProcess.stdout.on("data", (data) => {
      const output = data.toString();
      // Parse EKF calculations out of Rust stdout
      // Expected format: "... Yaw: <val> | Pitch: <val> | Roll: <val>"
      if (output.includes("Output Vector")) {
        const match = output.match(/Yaw:\s*([\d\.-]+)\s*\|\s*Pitch:\s*([\d\.-]+)\s*\|\s*Roll:\s*([\d\.-]+)/);
        if (match && telemetry.isGlassOn) {
          telemetry.orientation = {
            yaw: parseFloat(match[1]),
            pitch: parseFloat(match[2]),
            roll: parseFloat(match[3]),
          };
          // Broadcast orientation change to all WebSocket frontends immediately
          broadcast({ type: "ORIENTATION_FUSED", payload: telemetry.orientation });
        }
      }
    });

    rustProcess.stderr.on("data", (data) => {
      console.warn(`[RUST-WARN] ${data.toString().trim()}`);
    });

    rustProcess.on("close", (code) => {
      console.log(`[RUST] Process exited with code ${code}`);
      rustProcess = null;
    });

  } catch (err) {
    console.error("[BOOT] Failed to spawn Rust process:", err);
  }
} else {
  console.log("[BOOT] WARNING: Rust EKF computational offloader binary not found.");
  console.log("       To link Rust EKF calculations, run 'cargo build' inside 'Backend/rust' and restart Node.");
  console.log("       Falling back to standard hardware trajectory telemetry emulation.");
}

// 2. LINK UP: Propagating and syncing Spatial Anchors with Go High-Concurrency Server
const GO_SERVER_URL = "http://localhost:4000";

async function syncWithGoServer(anchor: SpatialAnchor) {
  try {
    console.log(`[LINK/GO] Syncing anchor "${anchor.name}" with Go coordinate service...`);
    const response = await fetch(`${GO_SERVER_URL}/api/go/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(anchor),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`[LINK/GO] Sync SUCCESS. Go assigned ID: ${data.id}`);
    } else {
      console.warn(`[LINK/GO] Sync returned non-200 status: ${response.status}`);
    }
  } catch (err: any) {
    console.warn(`[LINK/GO] Connection to Go server failed: ${err.message}. (Is Go server running on port 4000?)`);
  }
}

// REST API Endpoints
app.get("/", (_req, res) => {
  res.json({ 
    message: "AETHER AVR Core Main Backend is running online.",
    rust_fusion_linked: rustProcess !== null,
    go_sync_linked: GO_SERVER_URL,
  });
});

app.get("/api/status", (_req, res) => {
  res.json({
    status: "CONNECTED",
    telemetry,
    rust_offloader_active: rustProcess !== null,
  });
});

app.get("/api/anchors", (_req, res) => {
  res.json(spatialAnchors);
});

// REST: Create and automatically sync with Go
app.post("/api/anchors", async (req, res) => {
  const { name, x, y, z, confidence } = req.body;
  if (!name) {
    res.status(400).json({ error: "Anchor name is required" });
    return;
  }
  
  const newAnchor: SpatialAnchor = {
    id: Date.now().toString(),
    name,
    x: typeof x === "number" ? x : +(Math.random() * 4 - 2).toFixed(2),
    y: typeof y === "number" ? y : +(Math.random() * 2).toFixed(2),
    z: typeof z === "number" ? z : -(Math.random() * 3).toFixed(2),
    confidence: typeof confidence === "number" ? confidence : +(90 + Math.random() * 10).toFixed(1),
  };

  spatialAnchors.push(newAnchor);
  
  // Broadcast update to all active frontends
  broadcast({ type: "ANCHOR_ADDED", payload: newAnchor });
  
  // Asynchronously propagate coordinate registration to the Go Sync Server
  syncWithGoServer(newAnchor);

  res.status(201).json(newAnchor);
});

app.delete("/api/anchors/:id", (req, res) => {
  const { id } = req.params;
  const exists = spatialAnchors.some(a => a.id === id);
  if (!exists) {
    res.status(404).json({ error: "Anchor not found" });
    return;
  }
  
  spatialAnchors = spatialAnchors.filter(a => a.id !== id);
  broadcast({ type: "ANCHOR_REMOVED", payload: { id } });
  
  res.json({ success: true, message: `Anchor ${id} deleted` });
});

app.post("/api/telemetry", (req, res) => {
  const { temp, npuLoad, imuDrift, batteryLevel, isGlassOn } = req.body;
  
  telemetry = {
    temp: typeof temp === "number" ? temp : telemetry.temp,
    npuLoad: typeof npuLoad === "number" ? npuLoad : telemetry.npuLoad,
    imuDrift: typeof imuDrift === "number" ? imuDrift : telemetry.imuDrift,
    batteryLevel: typeof batteryLevel === "number" ? batteryLevel : telemetry.batteryLevel,
    isGlassOn: typeof isGlassOn === "boolean" ? isGlassOn : telemetry.isGlassOn,
    orientation: telemetry.orientation,
  };

  broadcast({ type: "TELEMETRY_UPDATED", payload: telemetry });
  res.json(telemetry);
});

// Create HTTP Server & WebSocket Server
const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  clients.add(ws);
  console.log(`[WS] Client connected. Total: ${clients.size}`);
  
  ws.send(JSON.stringify({ type: "INIT", payload: { telemetry, spatialAnchors } }));

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log("[WS] Received message:", data);
      
      switch (data.type) {
        case "TRIGGER_GESTURE":
          broadcast({ type: "GESTURE_TRIGGERED", payload: { gesture: data.payload.gesture, timestamp: new Date().toTimeString().split(" ")[0] } });
          break;
        case "PING":
          ws.send(JSON.stringify({ type: "PONG" }));
          break;
      }
    } catch (err) {
      console.error("[WS] Error parsing message:", err);
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log(`[WS] Client disconnected. Total: ${clients.size}`);
  });
});

// Broadcast payload to all active WS clients
function broadcast(message: { type: string; payload: any }) {
  const rawMessage = JSON.stringify(message);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(rawMessage);
    }
  }
}

// Telemetry trajectory fallback simulation loop (runs if Rust core is inactive)
setInterval(() => {
  if (!telemetry.isGlassOn) return;
  
  telemetry.batteryLevel = Math.max(5, +(telemetry.batteryLevel - 0.02).toFixed(2));
  telemetry.temp = +(36.0 + Math.sin(Date.now() / 15000) * 1.5).toFixed(1);
  telemetry.imuDrift = +(0.015 + Math.sin(Date.now() / 8000) * 0.005).toFixed(4);
  telemetry.npuLoad = Math.max(10, Math.floor(40 + Math.sin(Date.now() / 5000) * 15 + Math.random() * 5));

  // Fallback orientation mock movement if Rust binary isn't active
  if (!rustProcess && telemetry.orientation) {
    telemetry.orientation = {
      yaw: +(telemetry.orientation.yaw + 0.1).toFixed(4),
      pitch: +(Math.sin(Date.now() / 5000) * 5.0).toFixed(4),
      roll: +(Math.cos(Date.now() / 8000) * 2.0).toFixed(4),
    };
  }

  broadcast({ type: "TELEMETRY_UPDATED", payload: telemetry });
}, 4000);

server.listen(PORT, () => {
  console.log(`[HTTP/WS] Core Orchestration server active on port ${PORT}`);
});
