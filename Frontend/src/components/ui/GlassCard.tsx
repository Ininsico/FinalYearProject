import React from 'react'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
}

export function GlassCard({ children, className = '', glow = false }: GlassCardProps) {
  return (
    <div className={`glass-panel rounded-2xl p-6 transition-all duration-300 hover:border-accent/20 ${glow ? 'glow-green' : ''} ${className}`}>
      {children}
    </div>
  )
}
