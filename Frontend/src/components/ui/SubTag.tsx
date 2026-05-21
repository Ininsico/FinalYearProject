import React from 'react'

interface SubTagProps {
  children: React.ReactNode
  color?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'red' | 'gray'
}

export function SubTag({ children, color = 'cyan' }: SubTagProps) {
  const styles: Record<string, string> = {
    cyan:    'bg-cyan/10 text-cyan border border-cyan/20',
    purple:  'bg-purple/10 text-purple border border-purple/20',
    emerald: 'bg-emerald/10 text-emerald border border-emerald/20',
    amber:   'bg-amber/10 text-amber border border-amber/20',
    red:     'bg-red/10 text-red border border-red/20',
    gray:    'bg-faint text-muted border border-border',
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase font-mono ${styles[color]}`}>
      {children}
    </span>
  )
}
