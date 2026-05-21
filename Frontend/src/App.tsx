import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Eye, Hand, Mic, Cpu, Battery, Thermometer, Database, 
  Radio, Activity, Terminal, Layers, Power, 
  Plus, Trash2, RefreshCw, Wifi
} from 'lucide-react'

interface SpatialAnchor {
  id: string
  name: string
  x: number
  y: number
  z: number
  confidence: number
}

interface LogEntry {
  timestamp: string
  system: string
  message: string
  type: 'info' | 'warn' | 'success'
}

function App() {
  // Device States
  const [isOn, setIsOn] = useState(true)
  const [batteryLevel, setBatteryLevel] = useState(88)
  const [temp, setTemp] = useState(38)
  const [npuLoad, setNpuLoad] = useState(42)
  const [imuDrift, setImuDrift] = useState(0.02)
  
  // Toggle Subsystems
  const [slamEnabled, setSlamEnabled] = useState(true)
  const [gazeEnabled, setGazeEnabled] = useState(true)
  const [handEnabled, setHandEnabled] = useState(true)
  const [voiceEnabled, setVoiceEnabled] = useState(false)

  // Spatial Anchors
  const [anchors, setAnchors] = useState<SpatialAnchor[]>([
    { id: '1', name: 'Workstation Anchor', x: 0.12, y: 1.45, z: -0.58, confidence: 99.4 },
    { id: '2', name: 'Smart Display Anchor', x: -1.42, y: 1.10, z: 0.85, confidence: 97.2 },
    { id: '3', name: 'Dynamic Room Bounds', x: 2.30, y: 0.05, z: -1.90, confidence: 91.8 },
  ])
  const [newAnchorName, setNewAnchorName] = useState('')

  // Simulated Log Console
  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: '16:40:53', system: 'OS/KERNEL', message: 'RTOS initialization completed. Boot time: 42ms.', type: 'success' },
    { timestamp: '16:40:54', system: 'SENSOR/IMU', message: '6-DoF EKF alignment acquired with 0.02 deg drift.', type: 'info' },
    { timestamp: '16:40:54', system: 'AI/SLAM', message: 'VIO SLAM tracker running at solid 90Hz.', type: 'success' },
    { timestamp: '16:40:56', system: 'DISPLAY/ATW', message: 'Asynchronous Time-Warp driver enabled (MicroLED waveguide).', type: 'info' },
  ])

  const consoleEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll logs
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  // Simulate Telemetry Changes
  useEffect(() => {
    if (!isOn) return
    const interval = setInterval(() => {
      // Simulate slight battery depletion
      setBatteryLevel((b) => Math.max(10, +(b - 0.05).toFixed(2)))
      // Temperature fluctuations based on system state
      const baseTemp = 35 + (slamEnabled ? 2 : 0) + (handEnabled ? 1.5 : 0) + (gazeEnabled ? 1 : 0)
      setTemp(+(baseTemp + Math.sin(Date.now() / 10000) * 0.4).toFixed(1))
      // Drift simulator
      setImuDrift(+(0.02 + Math.sin(Date.now() / 5000) * 0.005).toFixed(4))
      // NPU load simulator
      const targetLoad = (slamEnabled ? 30 : 0) + (handEnabled ? 25 : 0) + (gazeEnabled ? 15 : 0) + (voiceEnabled ? 10 : 0)
      setNpuLoad(Math.max(5, Math.floor(targetLoad + Math.random() * 8)))

      // Random system events/logs
      if (Math.random() > 0.75) {
        const systems = ['AI/SLAM', 'OS/POWER', 'SENSOR/IMU', 'BACKEND/ANCHOR', 'AI/GAZE']
        const system = systems[Math.floor(Math.random() * systems.length)]
        let message = ''
        let type: 'info' | 'warn' | 'success' = 'info'

        switch(system) {
          case 'AI/SLAM':
            message = Math.random() > 0.8 ? 'Tracking quality degraded slightly due to lighting change.' : 'Loop closure detected. Local map optimized.'
            type = message.includes('degraded') ? 'warn' : 'success'
            break
          case 'OS/POWER':
            message = 'Dynamic voltage scaling adapted. Thermal throttling index: 0.'
            type = 'info'
            break
          case 'SENSOR/IMU':
            message = 'Recalibrating accelerometer offset based on static reference.'
            type = 'info'
            break
          case 'BACKEND/ANCHOR':
            message = 'Spatial point cloud synced with global database in 18ms.'
            type = 'success'
            break
          case 'AI/GAZE':
            message = 'Foveated rendering bounding boxes updated. Focus target: display.'
            type = 'info'
            break
        }

        const now = new Date()
        const ts = now.toTimeString().split(' ')[0]
        setLogs((prev) => [...prev.slice(-30), { timestamp: ts, system, message, type }])
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isOn, slamEnabled, handEnabled, gazeEnabled, voiceEnabled])

  const togglePower = () => {
    setIsOn(!isOn)
    const now = new Date()
    const ts = now.toTimeString().split(' ')[0]
    setLogs((prev) => [
      ...prev,
      { 
        timestamp: ts, 
        system: 'OS/POWER', 
        message: isOn ? 'Entering deep sleep state. Hardware suspended.' : 'Resuming from sleep. Booting core services.', 
        type: isOn ? 'warn' : 'success' 
      }
    ])
  }

  const addAnchor = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAnchorName.trim()) return

    const newAnchor: SpatialAnchor = {
      id: Date.now().toString(),
      name: newAnchorName,
      x: +(Math.random() * 4 - 2).toFixed(2),
      y: +(Math.random() * 2).toFixed(2),
      z: -(Math.random() * 3).toFixed(2),
      confidence: +(90 + Math.random() * 10).toFixed(1)
    }

    setAnchors((prev) => [...prev, newAnchor])
    setNewAnchorName('')

    const now = new Date()
    const ts = now.toTimeString().split(' ')[0]
    setLogs((prev) => [
      ...prev,
      { 
        timestamp: ts, 
        system: 'BACKEND/ANCHOR', 
        message: `Registered new spatial anchor: "${newAnchor.name}" [${newAnchor.x}, ${newAnchor.y}, ${newAnchor.z}]`, 
        type: 'success' 
      }
    ])
  }

  const deleteAnchor = (id: string, name: string) => {
    setAnchors((prev) => prev.filter((a) => a.id !== id))
    const now = new Date()
    const ts = now.toTimeString().split(' ')[0]
    setLogs((prev) => [
      ...prev,
      { 
        timestamp: ts, 
        system: 'BACKEND/ANCHOR', 
        message: `De-registered spatial anchor: "${name}"`, 
        type: 'warn' 
      }
    ])
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Dynamic Glassmorphic Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-900/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white m-0 leading-none">AETHER AVR</h1>
            <p className="text-xs text-slate-400 mt-1">Core Stack Controller & Telemetry</p>
          </div>
        </div>

        {/* Global Hardware Status Icons */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Wifi className={`w-4 h-4 ${isOn ? 'text-cyan-400' : 'text-slate-600'}`} />
            <span className="text-slate-400 hidden sm:inline">Edge-Link:</span>
            <span className={isOn ? 'text-cyan-400 font-medium' : 'text-slate-500 font-medium'}>
              {isOn ? 'Connected (5G)' : 'Disconnected'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm border-l border-slate-800 pl-6">
            <Battery className={`w-4 h-4 ${isOn ? (batteryLevel > 20 ? 'text-emerald-400' : 'text-rose-500 animate-bounce') : 'text-slate-600'}`} />
            <span className={isOn ? (batteryLevel > 20 ? 'text-emerald-400' : 'text-rose-400') : 'text-slate-500'}>
              {isOn ? `${Math.floor(batteryLevel)}%` : 'OFF'}
            </span>
          </div>

          <button 
            onClick={togglePower}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              isOn 
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white' 
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isOn ? 'Power Down' : 'Power Up'}</span>
          </button>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Subsystem Status, Toggles & Metrics */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          
          {/* Card: Live Telemetry */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-violet-400" />
              Hardware Telemetry
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4">
                <span className="text-xs text-slate-400 block">Silicon / CPU Temp</span>
                <span className={`text-2xl font-bold font-mono tracking-tight block mt-1 ${isOn ? (temp > 45 ? 'text-amber-400' : 'text-cyan-400') : 'text-slate-600'}`}>
                  {isOn ? `${temp}°C` : '--'}
                </span>
                <div className="flex items-center gap-1 mt-2">
                  <Thermometer className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[10px] text-slate-500">Limits: Max 65°C</span>
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4">
                <span className="text-xs text-slate-400 block">NPU Spatial Load</span>
                <span className={`text-2xl font-bold font-mono tracking-tight block mt-1 ${isOn ? 'text-violet-400' : 'text-slate-600'}`}>
                  {isOn ? `${npuLoad}%` : '--'}
                </span>
                <div className="flex items-center gap-1 mt-2">
                  <Cpu className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[10px] text-slate-500">Dedicated AI core</span>
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4 col-span-2">
                <span className="text-xs text-slate-400 block">IMU Sensor Gyro Drift</span>
                <div className="flex justify-between items-baseline mt-1">
                  <span className={`text-xl font-bold font-mono tracking-tight ${isOn ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {isOn ? `${imuDrift} deg/s` : '--'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Tolerance: &lt;0.05</span>
                </div>
                {/* Visual Drift Tracker Bar */}
                <div className="w-full bg-slate-900 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-500" 
                    style={{ width: isOn ? `${(imuDrift / 0.05) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card: Active AI & Stack Controllers */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Software Subsystems
            </h2>

            <div className="flex flex-col gap-4">
              
              {/* Subsystem Toggle: SLAM */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${slamEnabled && isOn ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-900 text-slate-500'}`}>
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-white block">Visual SLAM Engine</span>
                    <span className="text-[10px] text-slate-500 block">6-DoF positional mapping</span>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  disabled={!isOn}
                  checked={slamEnabled && isOn}
                  onChange={() => setSlamEnabled(!slamEnabled)}
                  className="w-9 h-5 bg-slate-800 checked:bg-cyan-500 rounded-full cursor-pointer appearance-none relative after:absolute after:top-[2px] after:left-[2px] after:w-4 after:h-4 after:bg-slate-400 after:rounded-full after:transition-all checked:after:translate-x-4 checked:after:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                />
              </div>

              {/* Subsystem Toggle: Eye Gaze */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${gazeEnabled && isOn ? 'bg-violet-500/10 text-violet-400' : 'bg-slate-900 text-slate-500'}`}>
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-white block">Foveated Gaze Tracker</span>
                    <span className="text-[10px] text-slate-500 block">Infrared pupil vectors</span>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  disabled={!isOn}
                  checked={gazeEnabled && isOn}
                  onChange={() => setGazeEnabled(!gazeEnabled)}
                  className="w-9 h-5 bg-slate-800 checked:bg-violet-500 rounded-full cursor-pointer appearance-none relative after:absolute after:top-[2px] after:left-[2px] after:w-4 after:h-4 after:bg-slate-400 after:rounded-full after:transition-all checked:after:translate-x-4 checked:after:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                />
              </div>

              {/* Subsystem Toggle: Hand Tracking */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${handEnabled && isOn ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-900 text-slate-500'}`}>
                    <Hand className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-white block">Joint Hand Tracking</span>
                    <span className="text-[10px] text-slate-500 block">21-point hand skeleton</span>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  disabled={!isOn}
                  checked={handEnabled && isOn}
                  onChange={() => setHandEnabled(!handEnabled)}
                  className="w-9 h-5 bg-slate-800 checked:bg-purple-500 rounded-full cursor-pointer appearance-none relative after:absolute after:top-[2px] after:left-[2px] after:w-4 after:h-4 after:bg-slate-400 after:rounded-full after:transition-all checked:after:translate-x-4 checked:after:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                />
              </div>

              {/* Subsystem Toggle: NLP Voice */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${voiceEnabled && isOn ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-900 text-slate-500'}`}>
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-white block">Edge Voice Assistant</span>
                    <span className="text-[10px] text-slate-500 block">Local offline NLP engine</span>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  disabled={!isOn}
                  checked={voiceEnabled && isOn}
                  onChange={() => setVoiceEnabled(!voiceEnabled)}
                  className="w-9 h-5 bg-slate-800 checked:bg-amber-500 rounded-full cursor-pointer appearance-none relative after:absolute after:top-[2px] after:left-[2px] after:w-4 after:h-4 after:bg-slate-400 after:rounded-full after:transition-all checked:after:translate-x-4 checked:after:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Center/Right Column: Spatial Cloud Anchors & simulated 3D coordinates */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm flex flex-col flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                Cloud Spatial Anchors Sync
              </h2>
              <span className="text-xs text-slate-500 font-mono">Status: SYNCED</span>
            </div>

            {/* Create New Spatial Anchor Form */}
            <form onSubmit={addAnchor} className="flex gap-2 mb-6">
              <input 
                type="text" 
                disabled={!isOn}
                value={newAnchorName}
                onChange={(e) => setNewAnchorName(e.target.value)}
                placeholder="Anchor Name (e.g., Desk Boundary)" 
                className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={!isOn || !newAnchorName.trim()}
                className="bg-cyan-500 text-slate-950 font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5 hover:bg-cyan-400 disabled:opacity-50 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Anchor</span>
              </button>
            </form>

            {/* Table of anchors */}
            <div className="overflow-x-auto border border-slate-800/80 rounded-xl bg-slate-950/40 flex-1 min-h-[220px]">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                    <th className="p-4 font-semibold">Anchor Node Name</th>
                    <th className="p-4 font-semibold">Coordinates (X, Y, Z)</th>
                    <th className="p-4 font-semibold text-right">Confidence</th>
                    <th className="p-4 font-semibold text-center w-12">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {anchors.map((anchor) => (
                      <motion.tr 
                        key={anchor.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="border-b border-slate-900 hover:bg-slate-900/30 transition text-slate-300"
                      >
                        <td className="p-4 font-medium text-white flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                          {anchor.name}
                        </td>
                        <td className="p-4 font-mono text-xs">
                          [{anchor.x.toFixed(2)}, {anchor.y.toFixed(2)}, {anchor.z.toFixed(2)}]
                        </td>
                        <td className="p-4 text-right">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            anchor.confidence > 95 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {anchor.confidence}%
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            disabled={!isOn}
                            onClick={() => deleteAnchor(anchor.id, anchor.name)}
                            className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {/* Futuristic Log / RTOS Diagnostic Console */}
      <footer className="border-t border-slate-800 bg-slate-950 p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center max-w-[1550px] w-full mx-auto">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">RTOS Live Diagnostic Output</h2>
          </div>
          <button 
            onClick={() => setLogs([])}
            className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Clear logs
          </button>
        </div>

        <div className="max-w-[1550px] w-full mx-auto bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 font-mono text-xs h-36 overflow-y-auto flex flex-col gap-1.5 shadow-inner">
          {logs.length === 0 ? (
            <span className="text-slate-600 italic">No output logs standard...</span>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="flex gap-4 hover:bg-slate-800/20 py-0.5 rounded px-1">
                <span className="text-slate-500">[{log.timestamp}]</span>
                <span className={`font-semibold min-w-[100px] ${
                  log.type === 'warn' ? 'text-amber-400' : log.type === 'success' ? 'text-emerald-400' : 'text-cyan-400'
                }`}>
                  {log.system}
                </span>
                <span className={log.type === 'warn' ? 'text-amber-200' : log.type === 'success' ? 'text-slate-100' : 'text-slate-300'}>
                  {log.message}
                </span>
              </div>
            ))
          )}
          <div ref={consoleEndRef} />
        </div>
      </footer>
    </div>
  )
}

export default App
