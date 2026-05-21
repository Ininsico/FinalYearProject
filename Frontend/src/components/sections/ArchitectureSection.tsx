import { motion } from 'framer-motion'
import { Server, Cpu, Globe, ArrowRight } from 'lucide-react'

const services = [
  {
    name: 'Node.js Gateway',
    port: ':3000',
    desc: 'HTTP REST API and WebSocket server orchestrating real-time data flow between all subsystems.',
    icon: Server,
    color: '#22ff66',
    delay: 0,
  },
  {
    name: 'Rust EKF Core',
    port: '',
    desc: 'Extended Kalman Filter for 250Hz sensor fusion, offloaded as a dedicated high-performance binary.',
    icon: Cpu,
    color: '#22ff88',
    delay: 0.15,
  },
  {
    name: 'Go Sync Server',
    port: ':4000',
    desc: 'Thread-safe spatial anchor database providing distributed coordinate synchronization.',
    icon: Globe,
    color: '#33ff33',
    delay: 0.3,
  },
]

export function ArchitectureSection() {
  return (
    <section id="architecture" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-accent text-xs font-mono tracking-[0.3em] uppercase">
            System Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-text mt-4 mb-4">
            Distributed by Design
          </h2>
          <p className="text-muted max-w-xl mx-auto leading-relaxed">
            Three specialized services working in concert to deliver real-time spatial
            computing with minimal latency.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((svc) => (
            <motion.div
              key={svc.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: svc.delay }}
              whileHover={{ y: -4 }}
              className="glass-panel rounded-2xl p-8 transition-all duration-300 hover:border-accent/30"
            >
              <div className="flex items-center justify-between mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${svc.color}15`,
                    border: `1px solid ${svc.color}30`,
                  }}
                >
                  <svc.icon className="w-6 h-6" style={{ color: svc.color }} />
                </div>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: svc.color,
                    boxShadow: `0 0 12px ${svc.color}`,
                  }}
                />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-bold text-text">{svc.name}</h3>
                {svc.port && (
                  <span className="text-[10px] font-mono text-muted bg-faint px-2 py-0.5 rounded">
                    {svc.port}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted leading-relaxed">{svc.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-4 mt-12 text-xs font-mono text-muted"
        >
          <span className="px-4 py-2 glass-panel rounded-lg">AVR Glasses</span>
          <ArrowRight className="w-4 h-4 text-accent" />
          <span className="px-4 py-2 glass-panel rounded-lg border-accent/30 text-accent">Node.js :3000</span>
          <ArrowRight className="w-4 h-4 text-accent" />
          <span className="px-4 py-2 glass-panel rounded-lg">Rust EKF</span>
          <ArrowRight className="w-4 h-4 text-accent" />
          <span className="px-4 py-2 glass-panel rounded-lg">Go :4000</span>
        </motion.div>
      </div>
    </section>
  )
}
