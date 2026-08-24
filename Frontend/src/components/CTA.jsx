import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatedGradient from './AnimatedGradient'

const WORDS = [
  'agentic',
  'orchestrated',
  'autonomous',
  'limitless',
  'self-building',
]

export default function CTA() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % WORDS.length), 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative py-28 overflow-hidden">
      <AnimatedGradient
        config={{
          preset: 'custom',
          color1: '#ffffff',
          color2: '#eef2ff',
          color3: '#dbeafe',
          shape: 'Edge',
          shapeSize: 45,
          proportion: 65,
          scale: 0.45,
          speed: 14,
          distortion: 22,
          swirl: 55,
          softness: 95,
        }}
      />
      <div className="absolute inset-0 bg-white/40" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <span className="inline-block mb-5 px-4 py-1.5 rounded-md bg-blue-600 text-white text-xs font-bold tracking-wider">
          OUR IDEA
        </span>
        <h2 className="text-4xl sm:text-6xl font-extrabold text-planet-900 leading-tight">
          Built by a swarm of AIs.
        </h2>
        <div className="text-4xl sm:text-6xl font-extrabold text-blue-600 leading-tight">
          <span className="relative inline-block h-[1.2em] overflow-hidden align-bottom">
            <AnimatePresence mode="wait">
              <motion.span
                key={WORDS[i]}
                className="inline-block whitespace-nowrap"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                exit={{ y: '-110%' }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
              >
                {WORDS[i]}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>

        <p className="mt-6 text-lg text-planet-600 leading-relaxed max-w-2xl mx-auto">
          Fablet is a self-orchestrating network of agentic AIs. Tell it what to
          make — a course, a channel, a product, a workflow — and specialized
          agents plan, build, run, and refine it for you. No engineers. No code.
          No limits. Just intent, turned into something real.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#"
            className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
          >
            Read our launch article
          </a>
          <a
            href="#"
            className="px-7 py-3.5 rounded-xl border border-planet-300 text-planet-800 hover:bg-planet-100 font-semibold transition-colors"
          >
            Jump on a call
          </a>
          <a
            href="#"
            className="px-7 py-3.5 rounded-xl bg-planet-900 hover:bg-planet-800 text-white font-semibold transition-colors"
          >
            Sign up here
          </a>
        </div>
      </div>
    </section>
  )
}
