import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

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
}

// Initial Simulated In-Memory Database State
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
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Express REST API
app.get("/", (_req, res) => {
  res.json({ message: "AETHER AVR Core Main Backend is running online." });
});

// REST: Get Glass Status & Telemetry
app.get("/api/status", (_req, res) => {
  res.json({
    status: "CONNECTED",
    telemetry,
  });
});

// REST: Get All Spatial Anchors
app.get("/api/anchors", (_req, res) => {
  res.json(spatialAnchors);
});

// REST: Register New Spatial Anchor
app.post("/api/anchors", (req, res) => {
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
  
  // Broadcast update to all connected clients
  broadcast({ type: "ANCHOR_ADDED", payload: newAnchor });
  
  res.status(201).json(newAnchor);
});

// REST: Delete Spatial Anchor
app.delete("/api/anchors/:id", (req, res) => {
  const { id } = req.params;
  const exists = spatialAnchors.some(a => a.id === id);
  if (!exists) {
    res.status(404).json({ error: "Anchor not found" });
    return;
  }
  
  spatialAnchors = spatialAnchors.filter(a => a.id !== id);
  
  // Broadcast deletion to all connected clients
  broadcast({ type: "ANCHOR_REMOVED", payload: { id } });
  
  res.json({ success: true, message: `Anchor ${id} deleted` });
});

// REST: Update Telemetry Data
app.post("/api/telemetry", (req, res) => {
  const { temp, npuLoad, imuDrift, batteryLevel, isGlassOn } = req.body;
  
  telemetry = {
    temp: typeof temp === "number" ? temp : telemetry.temp,
    npuLoad: typeof npuLoad === "number" ? npuLoad : telemetry.npuLoad,
    imuDrift: typeof imuDrift === "number" ? imuDrift : telemetry.imuDrift,
    batteryLevel: typeof batteryLevel === "number" ? batteryLevel : telemetry.batteryLevel,
    isGlassOn: typeof isGlassOn === "boolean" ? isGlassOn : telemetry.isGlassOn,
  };

  broadcast({ type: "TELEMETRY_UPDATED", payload: telemetry });
  res.json(telemetry);
});

// Create HTTP Server & WebSocket Server
const server = createServer(app);
const wss = new WebSocketServer({ server });

// WebSocket connection pooling
const clients = new Set<WebSocket>();

wss.on("connection", (ws) => {
  clients.add(ws);
  console.log(`[WS] Client connected. Total: ${clients.size}`);
  
  // Send initial data to new client immediately
  ws.send(JSON.stringify({ type: "INIT", payload: { telemetry, spatialAnchors } }));

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log("[WS] Received message:", data);
      
      // Handle incoming messages from Desktop client / Mobile app
      switch (data.type) {
        case "TRIGGER_GESTURE":
          // Broadcast gesture to all clients
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

// Helper: Broadcast payload to all active WS clients
function broadcast(message: { type: string; payload: any }) {
  const rawMessage = JSON.stringify(message);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(rawMessage);
    }
  }
}

// Auto-Simulation of hardware state changes over time
setInterval(() => {
  if (!telemetry.isGlassOn) return;
  
  // Dynamic battery drop
  telemetry.batteryLevel = Math.max(5, +(telemetry.batteryLevel - 0.02).toFixed(2));
  // Temperature wave fluctuation
  telemetry.temp = +(36.0 + Math.sin(Date.now() / 15000) * 1.5).toFixed(1);
  // Drift changes slightly
  telemetry.imuDrift = +(0.015 + Math.sin(Date.now() / 8000) * 0.005).toFixed(4);
  // NPU load waves
  telemetry.npuLoad = Math.max(10, Math.floor(40 + Math.sin(Date.now() / 5000) * 15 + Math.random() * 5));

  broadcast({ type: "TELEMETRY_UPDATED", payload: telemetry });
}, 4000);

server.listen(PORT, () => {
  console.log(`[HTTP/WS] Core Backend server active on port ${PORT}`);
});
