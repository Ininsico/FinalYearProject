import { Layers, Radio, Eye, Hand, Mic } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { SystemToggle } from '../ui/SystemToggle'

interface SubsystemsPanelProps {
  isOn: boolean
  slamEnabled: boolean
  setSlamEnabled: (val: boolean) => void
  gazeEnabled: boolean
  setGazeEnabled: (val: boolean) => void
  handEnabled: boolean
  setHandEnabled: (val: boolean) => void
  voiceEnabled: boolean
  setVoiceEnabled: (val: boolean) => void
}

export function SubsystemsPanel({
  isOn,
  slamEnabled,
  setSlamEnabled,
  gazeEnabled,
  setGazeEnabled,
  handEnabled,
  setHandEnabled,
  voiceEnabled,
  setVoiceEnabled,
}: SubsystemsPanelProps) {
  const subsystems = [
    {
      label: 'Visual SLAM Engine',
      sub: '6-DoF positional mapping',
      icon: Radio,
      enabled: slamEnabled,
      set: setSlamEnabled,
      color: 'text-cyan',
    },
    {
      label: 'Foveated Gaze Tracker',
      sub: 'Infrared pupil vectors',
      icon: Eye,
      enabled: gazeEnabled,
      set: setGazeEnabled,
      color: 'text-purple',
    },
    {
      label: 'Joint Hand Tracking',
      sub: '21-point hand skeleton',
      icon: Hand,
      enabled: handEnabled,
      set: setHandEnabled,
      color: 'text-emerald',
    },
    {
      label: 'Edge Voice Assistant',
      sub: 'Local offline NLP',
      icon: Mic,
      enabled: voiceEnabled,
      set: setVoiceEnabled,
      color: 'text-amber',
    },
  ]

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-5 border-b border-border pb-3">
        <Layers className="w-4 h-4 text-muted" />
        <h2 className="text-xs font-bold tracking-widest uppercase text-accent">
          Glass Subsystems
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {subsystems.map(({ label, sub, icon: Icon, enabled, set, color }) => (
          <div
            key={label}
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface border border-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-faint border border-border">
                <Icon className={`w-4 h-4 ${enabled && isOn ? color : 'text-muted/30'}`} />
              </div>
              <div>
                <span className="text-xs font-semibold block text-accent">{label}</span>
                <span className="text-[9px] text-muted font-mono uppercase">{sub}</span>
              </div>
            </div>
            <SystemToggle
              checked={enabled && isOn}
              onChange={() => set(!enabled)}
              disabled={!isOn}
            />
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
