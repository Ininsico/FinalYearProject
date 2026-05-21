import { motion } from 'framer-motion'
import { Scan, Eye, Hand, Mic } from 'lucide-react'

const capabilities = [
  {
    title: 'Visual SLAM Engine',
    desc: '6-DoF positional mapping and environmental understanding for precise spatial awareness in dynamic environments.',
    icon: Scan,
    accent: '#22ff66',
    border: 'rgba(34,255,102,0.25)',
    bg: 'rgba(34,255,102,0.08)',
  },
  {
    title: 'Foveated Gaze Tracker',
    desc: 'Infrared pupil tracking enabling dynamic foveated rendering for optimal performance and power efficiency.',
    icon: Eye,
    accent: '#22ff88',
    border: 'rgba(34,255,136,0.25)',
    bg: 'rgba(34,255,136,0.08)',
  },
  {
    title: 'Hand Skeleton Tracking',
    desc: '21-point hand skeleton detection for natural gesture-based interaction without controllers.',
    icon: Hand,
    accent: '#33ff33',
    border: 'rgba(51,255,51,0.25)',
    bg: 'rgba(51,255,51,0.08)',
  },
  {
    title: 'Edge Voice Assistant',
    desc: 'Local offline NLP processing for voice commands without cloud dependency or latency.',
    icon: Mic,
    accent: '#66ff33',
    border: 'rgba(102,255,51,0.25)',
    bg: 'rgba(102,255,51,0.08)',
  },
]

export function CapabilitiesSection() {
  return (
    <section id="features" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-accent text-xs font-mono tracking-[0.3em] uppercase">
            Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-text mt-4 mb-4">
            Built for Spatial Computing
          </h2>
          <p className="text-muted max-w-xl mx-auto leading-relaxed">
            Every subsystem is engineered for real-time performance on custom AVR hardware,
            pushing the boundaries of what wearable computing can achieve.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -6, borderColor: cap.accent, boxShadow: '0 0 40px rgba(34,255,102,0.08)' }}
              className="glass-panel rounded-2xl p-8 transition-all duration-300 group cursor-default"
              style={{ borderColor: 'rgba(26,46,36,0.6)' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: cap.bg, border: `1px solid ${cap.border}` }}
              >
                <cap.icon className="w-6 h-6" style={{ color: cap.accent }} />
              </div>
              <h3 className="text-lg font-bold text-text mb-2">{cap.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{cap.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
