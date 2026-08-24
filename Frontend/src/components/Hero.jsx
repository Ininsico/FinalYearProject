import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import HeroBackground from './landing/HeroBackground'

export default function Hero() {
  const navigate = useNavigate()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative min-h-[110vh] overflow-hidden">
      <HeroBackground baseColor="#070b1c" />

      <motion.div
        className="relative z-10"
        style={{ opacity: heroOpacity, scale: heroScale, transformOrigin: 'center top' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 text-center">
          <motion.img
            src="/fablet-logo.png"
            alt="Fablet"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-10 h-20 w-auto"
          />

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight"
          >
            Transforming human potential through Agentic AIs Orchestration
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-8 max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed"
          >
            Fablet is a self-orchestrating AI swarm that powers anything you can
            imagine — from personalized education and adaptive media to comedy,
            news, and enterprise tools. No coding, no silos, no gatekeepers. Just
            a single, intelligent foundation that creates, adapts, and operates
            across every domain, end to end. Whether you're a student, creator, or
            entrepreneur, Fablet removes the friction so you can focus on what
            matters: bringing your vision to life.
          </motion.p>

           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 1.2 }}
             className="mt-9 flex flex-wrap items-center justify-center gap-4"
           >
             <button
               onClick={() => navigate('/contact')}
               className="px-7 py-3.5 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-colors"
             >
               Contact
             </button>
             <button
               onClick={() => navigate('/about')}
               className="px-7 py-3.5 rounded-xl border-2 border-blue-500/40 text-blue-200 font-semibold hover:bg-blue-500/10 transition-colors"
             >
               About
             </button>
           </motion.div>

          <motion.img
             src="/fablet-secondarylogo.png"
            alt=""
            aria-hidden="true"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="mx-auto mt-16 h-12 w-auto opacity-70"
          />
        </div>
      </motion.div>
    </section>
  )
}
