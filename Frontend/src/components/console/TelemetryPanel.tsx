import { motion } from 'framer-motion'
import { Activity, Thermometer, Cpu } from 'lucide-react'
import type { Orientation } from '../../types'
import { GlassCard } from '../ui/GlassCard'

interface TelemetryPanelProps {
  isOn: boolean
  temp: number
  npuLoad: number
  imuDrift: number
  orientation?: Orientation
}

export function TelemetryPanel({
  isOn,
  temp,
  npuLoad,
  imuDrift,
  orientation = { yaw: 0, pitch: 0, roll: 0 },
}: TelemetryPanelProps) {
  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-5 border-b border-border pb-3">
        <Activity className="w-4 h-4 text-muted" />
        <h2 className="text-xs font-bold tracking-widest uppercase text-accent">
          Hardware Telemetry
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Temp */}
        <div className="rounded-xl p-4 bg-surface border border-border">
          <div className="flex items-center gap-1.5 mb-2">
            <Thermometer className="w-3.5 h-3.5 text-red" />
            <span className="text-[9px] tracking-wider uppercase text-muted font-mono">Temp</span>
          </div>
          <span className="text-2xl font-bold font-mono text-accent">
            {isOn ? `${temp}°C` : '—'}
          </span>
          <p className="text-[9px] font-mono mt-1 text-muted uppercase">Max limit: 65°C</p>
        </div>

        {/* NPU */}
        <div className="rounded-xl p-4 bg-surface border border-border">
          <div className="flex items-center gap-1.5 mb-2">
            <Cpu className="w-3.5 h-3.5 text-cyan" />
            <span className="text-[9px] tracking-wider uppercase text-muted font-mono">NPU Load</span>
          </div>
          <span className="text-2xl font-bold font-mono text-accent">
            {isOn ? `${npuLoad}%` : '—'}
          </span>
          <p className="text-[9px] font-mono mt-1 text-muted uppercase">Edge Compute</p>
        </div>

        {/* IMU Drift Slider (Dynamic Display) */}
        <div className="col-span-2 rounded-xl p-4 bg-surface border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] tracking-wider uppercase text-muted font-mono">IMU Gyro Drift</span>
            <span className="text-[9px] font-mono text-cyan uppercase">Target &lt; 0.05</span>
          </div>
          <span className="text-xl font-bold font-mono text-accent">
            {isOn ? `${imuDrift} °/s` : '—'}
          </span>
          <div className="mt-3 rounded-full overflow-hidden h-1 bg-faint">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan to-purple"
              animate={{ width: isOn ? `${Math.min((imuDrift / 0.05) * 100, 100)}%` : '0%' }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>

        {/* Dynamic orientation readout */}
        {isOn && (
          <div className="col-span-2 rounded-xl p-4 bg-surface border border-border">
            <span className="text-[9px] tracking-wider uppercase block mb-3 text-muted font-mono">
              Rust EKF Live Matrix
            </span>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {(['yaw', 'pitch', 'roll'] as const).map(axis => (
                <div key={axis} className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase text-muted">{axis}</span>
                  <span className="text-accent font-bold">{orientation[axis].toFixed(3)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
