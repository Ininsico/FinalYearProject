import { useState, useEffect, useRef } from "react";
import { 
  Sliders, Cpu, Terminal, Compass, RefreshCw, 
  Activity, Play, CheckCircle2, AlertCircle, Wifi
} from "lucide-react";

interface TelemetryData {
  temp: number;
  npuLoad: number;
  imuDrift: number;
  batteryLevel: number;
  isGlassOn: boolean;
}

function App() {
  const [activeTab, setActiveTab] = useState<"calibration" | "flashing">("calibration");

  // REST / WS Telemetry State
  const [wsConnected, setWsConnected] = useState(false);
  const [backendTelemetry, setBackendTelemetry] = useState<TelemetryData | null>(null);

  // Calibration Parameters
  const [fx, setFx] = useState(525.0);
  const [fy, setFy] = useState(525.0);
  const [cx, setCx] = useState(320.0);
  const [cy, setCy] = useState(240.0);
  const [k1, setK1] = useState(-0.15);
  const [k2, setK2] = useState(0.05);

  // Flasher State
  const [selectedPort, setSelectedPort] = useState("COM3 (Silicon Labs CP210x)");
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashProgress, setFlashProgress] = useState(0);
  const [flashLog, setFlashLog] = useState<string[]>([]);
  const flashLogEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll flasher logs
  useEffect(() => {
    flashLogEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [flashLog]);

  // Connect to Backend WebSocket
  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimeout: number;

    function connect() {
      socket = new WebSocket("ws://localhost:3000");

      socket.onopen = () => {
        setWsConnected(true);
        console.log("[DesktopApp] Connected to Backend WebSocket");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "INIT") {
            setBackendTelemetry(data.payload.telemetry);
          } else if (data.type === "TELEMETRY_UPDATED") {
            setBackendTelemetry(data.payload);
          }
        } catch (err) {
          console.error("Error parsing WS message:", err);
        }
      };

      socket.onclose = () => {
        setWsConnected(false);
        console.log("[DesktopApp] WebSocket disconnected. Retrying in 3s...");
        reconnectTimeout = window.setTimeout(connect, 3000);
      };

      socket.onerror = () => {
        socket?.close();
      };
    }

    connect();

    return () => {
      socket?.close();
      clearTimeout(reconnectTimeout);
    };
  }, []);

  // simulated serial flasher logic
  const handleStartFlash = () => {
    if (isFlashing) return;
    setIsFlashing(true);
    setFlashProgress(0);
    setFlashLog([]);

    const logStages = [
      { prg: 5, msg: "Initializing serial bootloader handshake on port " + selectedPort + "..." },
      { prg: 10, msg: "Connection acquired. Chip ID: ESP32-S3 (XTensa LX7 Dual-Core)." },
      { prg: 20, msg: "Sending software reset vector. Synchronization pattern accepted." },
      { prg: 30, msg: "Reading current partition table from flash address 0x8000..." },
      { prg: 40, msg: "Allocating RTOS OTA firmware target space. Block size: 4096 bytes." },
      { prg: 50, msg: "Erasing sectors 0x00010000 to 0x001A0000 (1.6 MB)..." },
      { prg: 65, msg: "Erased successfully in 450ms." },
      { prg: 75, msg: "Flashing chunk 1/4 (400 KB) - Address: 0x10000 [OK]" },
      { prg: 85, msg: "Flashing chunk 2/4 (400 KB) - Address: 0x50000 [OK]" },
      { prg: 90, msg: "Flashing chunk 3/4 (400 KB) - Address: 0x90000 [OK]" },
      { prg: 95, msg: "Flashing chunk 4/4 (400 KB) - Address: 0xD0000 [OK]" },
      { prg: 98, msg: "Verifying binary checksum (SHA-256 integrity signature) [MATCHED]" },
      { prg: 100, msg: "OTA update successfully completed. Resetting device boot vector. Hardware active." }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage >= logStages.length) {
        clearInterval(interval);
        setIsFlashing(false);
        return;
      }
      
      const stage = logStages[currentStage];
      setFlashProgress(stage.prg);
      setFlashLog((prev) => [...prev, stage.msg]);
      currentStage++;
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header Bar */}
      <header className="border-b border-slate-900 bg-slate-950 px-6 py-4 flex justify-between items-center select-none">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-none">AETHER AVR DESKTOP</h1>
            <p className="text-[10px] text-slate-400 mt-1">Calibration Suite & RTOS Flashing Utility</p>
          </div>
        </div>

        {/* Sync & Connection Telemetry */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-xs">
            <Wifi className={`w-3.5 h-3.5 ${wsConnected ? "text-cyan-400 animate-pulse" : "text-slate-600"}`} />
            <span className="text-slate-400">Core Link:</span>
            <span className={wsConnected ? "text-cyan-400 font-semibold" : "text-slate-600 font-semibold"}>
              {wsConnected ? "SYNCED" : "OFFLINE"}
            </span>
          </div>

          {backendTelemetry && (
            <div className="hidden sm:flex items-center gap-4 pl-4 border-l border-slate-800 text-xs">
              <div className="flex items-center gap-1">
                <Activity className="text-slate-500 w-3.5 h-3.5" />
                <span className="text-slate-300 font-mono">{backendTelemetry.temp}°C</span>
              </div>
              <div className="flex items-center gap-1">
                <Cpu className="text-slate-500 w-3.5 h-3.5" />
                <span className="text-slate-300 font-mono">{backendTelemetry.npuLoad}% NPU</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Grid View */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Navigation Sidebar */}
        <aside className="w-64 bg-slate-950 border-r border-slate-900 p-4 flex flex-col gap-2 select-none">
          <span className="text-[10px] text-slate-500 font-bold tracking-wider px-3 uppercase">Utilities</span>
          
          <button
            onClick={() => setActiveTab("calibration")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 transition ${
              activeTab === "calibration" 
                ? "bg-slate-900 text-cyan-400 border border-slate-800" 
                : "text-slate-400 hover:bg-slate-900/40 hover:text-white"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Optics & VIO Calibration</span>
          </button>

          <button
            onClick={() => setActiveTab("flashing")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 transition ${
              activeTab === "flashing" 
                ? "bg-slate-900 text-violet-400 border border-slate-800" 
                : "text-slate-400 hover:bg-slate-900/40 hover:text-white"
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>RTOS Flasher (UART)</span>
          </button>
        </aside>

        {/* Content Body Workspace */}
        <main className="flex-1 p-6 overflow-y-auto bg-slate-950">
          
          {/* Tab 1: Optics & Camera Calibration */}
          {activeTab === "calibration" && (
            <div className="flex flex-col gap-6 max-w-5xl">
              <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 relative">
                <h2 className="text-lg font-bold text-white mb-2">Stereo VIO Optics Calibration</h2>
                <p className="text-xs text-slate-400 mb-6">
                  Fine-tune focal lengths and distortion parameters to align structural depth projections on the optical waveguide lens.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Visual simulated target alignment box */}
                  <div className="bg-slate-950 border border-slate-900 rounded-xl relative overflow-hidden aspect-video flex items-center justify-center">
                    <div className="absolute inset-0 opacity-10 grid-paper pointer-events-none" style={{ backgroundImage: "radial-gradient(#00e5ff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                    
                    {/* Simulated calibration lens grid */}
                    <div className="w-48 h-48 border border-dashed border-cyan-500/20 rounded-full flex items-center justify-center relative">
                      <div className="w-24 h-24 border border-dashed border-cyan-500/40 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-cyan-400 rounded-full animate-ping" />
                        <div className="w-2 h-2 bg-cyan-400 rounded-full absolute" />
                      </div>
                      
                      {/* Dynamic crosshair overlay aligning to cx/cy */}
                      <div className="absolute bg-cyan-400/30" style={{ left: 0, right: 0, top: "50%", height: "1px" }} />
                      <div className="absolute bg-cyan-400/30" style={{ top: 0, bottom: 0, left: "50%", width: "1px" }} />
                    </div>

                    <div className="absolute bottom-3 left-3 bg-slate-900/80 px-2.5 py-1 rounded text-[10px] font-mono text-cyan-400 border border-slate-800">
                      VIO Latency: 1.84ms • Calibration Sync Matrix Active
                    </div>
                  </div>

                  {/* Tuning Slider controls */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Calibration Matrix</h3>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-slate-300">Focal Length x (fx)</span>
                        <span className="text-cyan-400 font-bold">{fx.toFixed(1)} px</span>
                      </div>
                      <input 
                        type="range" min="400" max="700" step="0.5" value={fx} 
                        onChange={(e) => setFx(parseFloat(e.target.value))}
                        className="w-full accent-cyan-500 bg-slate-900 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-slate-300">Focal Length y (fy)</span>
                        <span className="text-cyan-400 font-bold">{fy.toFixed(1)} px</span>
                      </div>
                      <input 
                        type="range" min="400" max="700" step="0.5" value={fy} 
                        onChange={(e) => setFy(parseFloat(e.target.value))}
                        className="w-full accent-cyan-500 bg-slate-900 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span className="text-slate-300">Principal cx</span>
                          <span className="text-cyan-400 font-bold">{cx}</span>
                        </div>
                        <input 
                          type="range" min="200" max="450" step="1" value={cx} 
                          onChange={(e) => setCx(parseInt(e.target.value))}
                          className="w-full accent-cyan-500 bg-slate-900 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span className="text-slate-300">Principal cy</span>
                          <span className="text-cyan-400 font-bold">{cy}</span>
                        </div>
                        <input 
                          type="range" min="150" max="350" step="1" value={cy} 
                          onChange={(e) => setCy(parseInt(e.target.value))}
                          className="w-full accent-cyan-500 bg-slate-900 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-900 my-2" />
                    <h3 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Radial Distortion Parameters</h3>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-slate-300">Distortion k1</span>
                        <span className="text-cyan-400 font-bold">{k1.toFixed(3)}</span>
                      </div>
                      <input 
                        type="range" min="-0.3" max="0.1" step="0.001" value={k1} 
                        onChange={(e) => setK1(parseFloat(e.target.value))}
                        className="w-full accent-cyan-500 bg-slate-900 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-slate-300">Distortion k2</span>
                        <span className="text-cyan-400 font-bold">{k2.toFixed(3)}</span>
                      </div>
                      <input 
                        type="range" min="-0.05" max="0.15" step="0.001" value={k2} 
                        onChange={(e) => setK2(parseFloat(e.target.value))}
                        className="w-full accent-cyan-500 bg-slate-900 rounded-lg cursor-pointer"
                      />
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: RTOS Firmware Flashing Utility */}
          {activeTab === "flashing" && (
            <div className="flex flex-col gap-6 max-w-4xl">
              <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-2">Embedded RTOS Firmware Flasher</h2>
                <p className="text-xs text-slate-400 mb-6">
                  Inject compiled firmware binaries directly into the glass's onboard ESP32-S3 spatial processor over serial USB interface.
                </p>

                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Port Selector */}
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">Target Serial Port</label>
                      <select 
                        disabled={isFlashing}
                        value={selectedPort}
                        onChange={(e) => setSelectedPort(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-900 text-slate-200 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-violet-500 transition"
                      >
                        <option>COM3 (Silicon Labs CP210x USB to UART Bridge)</option>
                        <option>COM5 (USB JTAG Debugger Interface)</option>
                        <option>/dev/ttyUSB0 (Generic UART Interface)</option>
                      </select>
                    </div>

                    {/* Start Action Button */}
                    <div className="flex items-end">
                      <button
                        onClick={handleStartFlash}
                        disabled={isFlashing}
                        className="w-full bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-50 text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {isFlashing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        <span>{isFlashing ? "Flashing Core RTOS..." : "Initiate OTA Flash"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {isFlashing || flashProgress > 0 ? (
                    <div className="w-full bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Flash Status</span>
                        <span className="text-violet-400 font-mono font-bold">{flashProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-violet-600 to-indigo-400 h-full transition-all duration-300"
                          style={{ width: `${flashProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : null}

                  {/* Console Log Feed */}
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">UART Flasher Log Stream</label>
                    <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 h-52 font-mono text-[11px] overflow-y-auto flex flex-col gap-1 shadow-inner text-slate-300">
                      {flashLog.length === 0 ? (
                        <span className="text-slate-600 italic">Console idling. Select a port and initiate OTA flash...</span>
                      ) : (
                        flashLog.map((log, index) => (
                          <div key={index} className="flex gap-3 py-0.5">
                            {log.includes("[OK]") || log.includes("completed") ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : log.includes(" handshake") ? (
                              <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 border border-dashed border-violet-500/50 rounded-full shrink-0 animate-spin" />
                            )}
                            <span>{log}</span>
                          </div>
                        ))
                      )}
                      <div ref={flashLogEndRef} />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}

export default App;
