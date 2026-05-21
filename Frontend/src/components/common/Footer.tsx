export function Footer() {
  return (
    <footer className="border-t border-border py-6 px-8 glass-panel select-none mt-auto">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-muted uppercase tracking-wider">
        <span>© {new Date().getFullYear()} Project Erebus</span>
        <span>FinalYearProject — AVR Spatial Computing Platform</span>
      </div>
    </footer>
  )
}
