import erebusLogo from '../../assets/erebus_logo.png'

interface HeaderProps {
  isConsoleOpen: boolean
  setIsConsoleOpen: (open: boolean) => void
}

export function Header({
  isConsoleOpen,
  setIsConsoleOpen,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-border py-4 px-8 flex items-center justify-between">
      {/* Sleek, professional transparent logo header branding */}
      <div className="flex items-center gap-3 select-none">
        <div className="w-8 h-8 relative flex items-center justify-center">
          <img src={erebusLogo} alt="Erebus Logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <h1 className="text-sm font-black tracking-[0.2em] uppercase text-accent m-0">
            Erebus <span className="text-cyan font-semibold">AVR</span>
          </h1>
          <p className="text-[9px] font-mono tracking-wider text-muted uppercase m-0 mt-0.5">FinalYearProject</p>
        </div>
      </div>

      {/* Dev Console Route Switcher */}
      <div>
        <button
          type="button"
          onClick={() => setIsConsoleOpen(!isConsoleOpen)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase border transition-all duration-300 cursor-pointer ${
            isConsoleOpen 
              ? 'bg-cyan border-cyan text-bg font-bold shadow-[0_4px_15px_rgba(8,145,178,0.15)]' 
              : 'bg-faint border-border hover:border-cyan/40 hover:bg-cyan/5 text-text'
          }`}
        >
          <span>{isConsoleOpen ? 'Exit Control Panel' : 'Launch Control Console'}</span>
        </button>
      </div>
    </header>
  )
}
