import { GlassCard } from '../ui/GlassCard'

interface ConnectionsOverviewProps {
  isConnected: boolean
  isOn: boolean
}

export function ConnectionsOverview({ isConnected, isOn }: ConnectionsOverviewProps) {
  const connections = [
    {
      label: 'Node.js Gateway',
      detail: 'Port 3000 · HTTP/WS',
      active: isConnected,
      color: 'bg-cyan shadow-[0_0_6px_var(--color-cyan)]',
    },
    {
      label: 'Rust EKF Core',
      detail: 'Offloaded calculations',
      active: isConnected && isOn,
      color: 'bg-purple shadow-[0_0_6px_var(--color-purple)]',
    },
    {
      label: 'Go Spatial Sync',
      detail: 'Port 4000 · Coordinate bank',
      active: isConnected,
      color: 'bg-emerald shadow-[0_0_6px_var(--color-emerald)]',
    },
  ]

  return (
    <GlassCard className="p-4">
      <div className="grid grid-cols-3 gap-4">
        {connections.map(({ label, detail, active, color }) => (
          <div key={label} className="rounded-xl p-3 bg-surface border border-border">
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${active ? color : 'bg-muted/30'}`} />
              <span className="text-[11px] font-bold text-accent">{label}</span>
            </div>
            <p className="text-[9px] font-mono text-muted">{detail}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
