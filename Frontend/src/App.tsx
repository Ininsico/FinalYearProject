import { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Header } from './components/common/Header'
import { Footer } from './components/common/Footer'
import { LandingPage } from './pages/LandingPage'
import { ConsolePage } from './pages/ConsolePage'
import type { SpatialAnchor, TelemetryData } from './types'

const API = 'http://localhost:3000'
const WS_URL = 'ws://localhost:3000'

export default function App() {
  /* ── State Hooks ── */
  const [isConnected, setIsConnected] = useState(false)
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null)
  const [anchors, setAnchors] = useState<SpatialAnchor[]>([])
  const [newAnchorName, setNewAnchorName] = useState('')
  const [addingAnchor, setAddingAnchor] = useState(false)
  
  // Custom View Controls
  const [isConsoleOpen, setIsConsoleOpen] = useState(false)

  // Waveguide Subsystems States
  const [slamEnabled, setSlamEnabled] = useState(true)
  const [gazeEnabled, setGazeEnabled] = useState(true)
  const [handEnabled, setHandEnabled] = useState(true)
  const [voiceEnabled, setVoiceEnabled] = useState(false)

  const wsRef = useRef<WebSocket | null>(null)

  /* ── Initial REST Synchronization ── */
  useEffect(() => {
    fetch(`${API}/api/status`)
      .then(r => r.json())
      .then((d: { status: string; telemetry: TelemetryData }) => {
        setTelemetry(d.telemetry)
      })
      .catch(() => {})

    fetch(`${API}/api/anchors`)
      .then(r => r.json())
      .then((d: SpatialAnchor[]) => {
        setAnchors(d)
      })
      .catch(() => {})
  }, [])

  /* ── Live Websocket Streaming ── */
  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        setIsConnected(true)
      }

      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data)
          switch (msg.type) {
            case 'INIT':
              setTelemetry(msg.payload.telemetry)
              setAnchors(msg.payload.spatialAnchors)
              break
            case 'TELEMETRY_UPDATED':
              setTelemetry(msg.payload)
              break
            case 'ANCHOR_ADDED':
              setAnchors(prev => {
                if (prev.some(a => a.id === msg.payload.id)) return prev
                return [...prev, msg.payload]
              })
              break
            case 'ANCHOR_REMOVED':
              setAnchors(prev => prev.filter(a => a.id !== msg.payload.id))
              break
            case 'ORIENTATION_FUSED':
              setTelemetry(prev => {
                if (!prev) return null
                return { ...prev, orientation: msg.payload }
              })
              break
          }
        } catch { /* Suppress bad frames */ }
      }

      ws.onclose = () => {
        setIsConnected(false)
        setTimeout(connect, 3000)
      }

      ws.onerror = () => ws.close()
    }

    connect()
    return () => wsRef.current?.close()
  }, [])

  /* ── Anchor Manipulation ── */
  const addAnchor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAnchorName.trim()) return
    setAddingAnchor(true)
    try {
      const res = await fetch(`${API}/api/anchors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newAnchorName }),
      })
      if (res.ok) {
        setNewAnchorName('')
      }
    } catch {
      // Suppress failed anchor save alerts
    } finally {
      setAddingAnchor(false)
    }
  }

  const deleteAnchor = async (id: string) => {
    try {
      await fetch(`${API}/api/anchors/${id}`, { method: 'DELETE' })
    } catch {
      // Suppress deletion errors
    }
  }

  /* ── Dynamic Math Elements ── */
  const isOn = telemetry?.isGlassOn ?? false
  const temp = telemetry?.temp ?? 0
  const npuLoad = telemetry?.npuLoad ?? 0
  const imuDrift = telemetry?.imuDrift ?? 0
  const orientation = telemetry?.orientation

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-text relative flex flex-col font-sans grid-bg">
      {/* Background Mesh Glow overlay */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] aspect-square rounded-full bg-emerald/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-cyan/5 blur-[160px] pointer-events-none" />

      {/* HEADER BRANDING */}
      <Header
        isConsoleOpen={isConsoleOpen}
        setIsConsoleOpen={setIsConsoleOpen}
      />

      <AnimatePresence mode="wait">
        {!isConsoleOpen ? (
          <LandingPage key="landing" onLaunchConsole={() => setIsConsoleOpen(true)} />
        ) : (
          <ConsolePage
            key="console"
            isOn={isOn}
            isConnected={isConnected}
            temp={temp}
            npuLoad={npuLoad}
            imuDrift={imuDrift}
            orientation={orientation}
            slamEnabled={slamEnabled}
            setSlamEnabled={setSlamEnabled}
            gazeEnabled={gazeEnabled}
            setGazeEnabled={setGazeEnabled}
            handEnabled={handEnabled}
            setHandEnabled={setHandEnabled}
            voiceEnabled={voiceEnabled}
            setVoiceEnabled={setVoiceEnabled}
            anchors={anchors}
            newAnchorName={newAnchorName}
            setNewAnchorName={setNewAnchorName}
            addingAnchor={addingAnchor}
            onAddAnchor={addAnchor}
            onDeleteAnchor={deleteAnchor}
          />
        )}
      </AnimatePresence>

      {/* CLEAN STATS FOOTER */}
      <Footer />
    </div>
  )
}
