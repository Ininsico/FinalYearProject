import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

const milestones = [
  {
    year: '2024 Q3',
    title: 'Concept & Research',
    desc: 'Initial hardware research and architectural planning for the AVR platform. Evaluated waveguide optics, sensor suites, and compute modules.',
  },
  {
    year: '2024 Q4',
    title: 'Hardware Prototyping',
    desc: 'Custom PCB design, display driver integration, and sensor array calibration on early breadboard prototypes.',
  },
  {
    year: '2025 Q1',
    title: 'Core Software Stack',
    desc: 'Node.js orchestration layer, Rust EKF sensor fusion offloader, and Go-based spatial anchor synchronization service.',
  },
  {
    year: '2025 Q3',
    title: 'Computer Vision Pipeline',
    desc: 'Visual-inertial SLAM integration, 21-point hand skeleton tracking, and foveated gaze estimation systems.',
  },
  {
    year: '2026 Q1',
    title: 'Full Stack Integration',
    desc: 'End-to-end integration with WebSocket telemetry streaming, real-time subsystem control, and desktop companion app.',
  },
  {
    year: '2026 Q2',
    title: 'FYP Demonstration',
    desc: 'Complete AVR prototype showcasing spatial computing capabilities with live telemetry and interactive controls.',
  },
]

export function TimelineSection() {
  return (
    <section id="timeline" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-accent text-xs font-mono tracking-[0.3em] uppercase">
            Development Timeline
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-text mt-4 mb-4">
            The Journey So Far
          </h2>
          <p className="text-muted max-w-xl mx-auto leading-relaxed">
            From concept to prototype — two years of research, engineering, and iteration.
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent/50 to-transparent md:-translate-x-px" />

          {milestones.map((m, i) => {
            const isLeft = i % 2 === 0
            return (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex items-start gap-8 mb-12 md:mb-16 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'} hidden md:block`}>
                  <div className="glass-panel rounded-2xl p-6">
                    <span
                      className="text-xs font-mono font-bold tracking-wider"
                      style={{ color: '#22ff66' }}
                    >
                      {m.year}
                    </span>
                    <h3 className="text-base font-bold text-text mt-1 mb-2">{m.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{m.desc}</p>
                  </div>
                </div>

                <div className="relative flex items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border"
                    style={{
                      backgroundColor: 'rgba(34,255,102,0.1)',
                      borderColor: 'rgba(34,255,102,0.3)',
                    }}
                  >
                    <Clock className="w-5 h-5" style={{ color: '#22ff66' }} />
                  </div>
                </div>

                <div className="flex-1 md:hidden">
                  <div className="glass-panel rounded-2xl p-6">
                    <span
                      className="text-xs font-mono font-bold tracking-wider"
                      style={{ color: '#22ff66' }}
                    >
                      {m.year}
                    </span>
                    <h3 className="text-base font-bold text-text mt-1 mb-2">{m.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
