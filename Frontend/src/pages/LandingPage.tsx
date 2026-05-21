import { motion } from 'framer-motion'
import erebusLogo from '../assets/erebus_logo.png'

interface LandingPageProps {
  onLaunchConsole: () => void
}

export function LandingPage({ onLaunchConsole }: LandingPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 gap-8"
    >
      {/* Center Container: Minimal, elegant and incredibly premium branding statement */}
      <div className="flex flex-col items-center gap-6 max-w-2xl">
        <motion.div 
          className="w-32 h-32 relative flex items-center justify-center mb-2"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <img src={erebusLogo} alt="Erebus Logo" className="w-full h-full object-contain" />
        </motion.div>

        <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-accent m-0 uppercase leading-none">
          Project Erebus
        </h2>
        
        <p className="text-base sm:text-lg text-muted font-mono tracking-widest uppercase m-0">
          FinalYearProject
        </p>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={onLaunchConsole}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan to-purple text-bg font-extrabold px-8 py-4 rounded-xl text-xs tracking-wider uppercase transition hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] duration-200 shadow-[0_6px_25px_rgba(8,145,178,0.2)] cursor-pointer"
        >
          <span>Open Control Console</span>
        </button>
      </div>
    </motion.div>
  )
}
