export function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted uppercase tracking-wider">
        <span>&copy; {new Date().getFullYear()} Project Erebus</span>
        <div className="flex gap-6">
          <span className="hover:text-accent transition cursor-pointer">GitHub</span>
          <span className="hover:text-accent transition cursor-pointer">Docs</span>
          <span className="hover:text-accent transition cursor-pointer">Contact</span>
        </div>
        <span>AVR Spatial Computing Platform</span>
      </div>
    </footer>
  )
}
