import { motion } from 'framer-motion'
import { ArrowDown, Code2 } from 'lucide-react'

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          animate={{ y: [0, -40, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/10 blur-[150px] pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, 40, 0], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan/10 blur-[150px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[200px] pointer-events-none"
        />
      </div>

      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-mono tracking-[0.2em] uppercase mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Final Year Project &middot; 2026
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6">
            <span className="text-text">Project</span>{' '}
            <span className="bg-gradient-to-r from-[#22ff66] to-[#22ff88] bg-clip-text text-transparent">
              Erebus
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            An Augmented Virtual Reality spatial computing platform powered by
            real-time sensor fusion, edge AI, and distributed systems.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="#features"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-accent text-bg font-bold px-8 py-4 rounded-xl text-sm tracking-wider uppercase hover:brightness-110 transition shadow-[0_0_30px_rgba(34,255,102,0.15)]"
            >
              Explore the Platform
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 border border-border text-text font-bold px-8 py-4 rounded-xl text-sm tracking-wider uppercase hover:border-accent/50 hover:text-accent transition"
            >
              <Code2 className="w-4 h-4" />
              Source Code
            </motion.a>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-[9px] font-mono tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}
