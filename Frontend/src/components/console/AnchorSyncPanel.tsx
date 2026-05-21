import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Database, Plus, Trash2 } from 'lucide-react'
import type { SpatialAnchor } from '../../types'
import { GlassCard } from '../ui/GlassCard'
import { SubTag } from '../ui/SubTag'

interface AnchorSyncPanelProps {
  isConnected: boolean
  anchors: SpatialAnchor[]
  newAnchorName: string
  setNewAnchorName: (name: string) => void
  addingAnchor: boolean
  onAddAnchor: (e: React.FormEvent) => void
  onDeleteAnchor: (id: string, name: string) => void
}

export function AnchorSyncPanel({
  isConnected,
  anchors,
  newAnchorName,
  setNewAnchorName,
  addingAnchor,
  onAddAnchor,
  onDeleteAnchor,
}: AnchorSyncPanelProps) {
  return (
    <GlassCard className="flex flex-col flex-1">
      <div className="flex items-center justify-between mb-5 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-muted" />
          <h2 className="text-xs font-bold tracking-widest uppercase text-accent">
            Spatial Anchor Persist Sync
          </h2>
        </div>
        <SubTag color={isConnected ? 'emerald' : 'gray'}>
          {isConnected ? 'Sync Active' : 'Offline'}
        </SubTag>
      </div>

      {/* Add anchor input */}
      <form onSubmit={onAddAnchor} className="flex gap-2 mb-5">
        <input
          type="text"
          value={newAnchorName}
          onChange={e => setNewAnchorName(e.target.value)}
          placeholder="Register new anchor point (Name)..."
          disabled={!isConnected}
          className="flex-1 rounded-xl px-4 py-2.5 text-xs outline-none bg-surface border border-border text-accent transition focus:border-cyan/50 placeholder-muted/40 disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={!isConnected || !newAnchorName.trim() || addingAnchor}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase bg-cyan hover:opacity-90 text-bg transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_15px_rgba(8,145,178,0.2)]"
        >
          <Plus className="w-4 h-4" />
          <span>Add anchor</span>
        </button>
      </form>

      {/* Table details */}
      <div className="rounded-xl border border-border overflow-hidden flex-1 bg-surface">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-faint border-b border-border text-muted">
              {['Anchor Symbol', 'Dimensions (X, Y, Z)', 'Confidence', 'Remove'].map(h => (
                <th key={h} className="px-4 py-3 font-bold tracking-widest uppercase text-[9px] font-mono">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {anchors.map(anchor => (
                <motion.tr
                  key={anchor.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="border-b border-border hover:bg-faint transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_4px_var(--color-cyan)]" />
                      <span className="font-bold text-accent">{anchor.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-muted text-[10px]">
                    [{anchor.x.toFixed(2)}, {anchor.y.toFixed(2)}, {anchor.z.toFixed(2)}]
                  </td>
                  <td className="px-4 py-3">
                    <SubTag color={anchor.confidence > 95 ? 'emerald' : 'amber'}>
                      {anchor.confidence.toFixed(1)}%
                    </SubTag>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onDeleteAnchor(anchor.id, anchor.name)}
                      className="p-1 rounded bg-surface hover:bg-red/10 border border-border hover:border-red/20 text-muted hover:text-red transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {anchors.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-[10px] font-mono text-muted uppercase italic">
                  No spatial coordinate markers synced.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}
