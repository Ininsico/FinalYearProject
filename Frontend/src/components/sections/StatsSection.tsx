import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Gauge, Target, Timer } from 'lucide-react'

interface Stat {
  value: number
  suffix: string
  label: string
  desc: string
  icon: typeof Zap
  color: string
  decimals?: number
}

const stats: Stat[] = [
  {
    value: 250,
    suffix: 'Hz',
    label: 'IMU Sampling Rate',
    desc: 'Sensor fusion at 250Hz for smooth orientation tracking',
    icon: Gauge,
    color: '#22ff66',
  },
  {
    value: 987,
    suffix: '%',
    label: 'Gesture Accuracy',
    desc: '98.7% hand tracking precision with sub-millimeter error',
    icon: Target,
    color: '#22ff88',
    decimals: 1,
  },
  {
    value: 3,
    suffix: 'ms',
    label: 'End-to-End Latency',
    desc: 'From sensor read to display update in under 3 milliseconds',
    icon: Zap,
    color: '#33ff33',
  },
  {
    value: 5,
    suffix: '\u00b0',
    label: 'Orientation Drift',
    desc: 'Less than 0.01\u00b0 drift per minute of continuous operation',
    icon: Timer,
    color: '#66ff33',
    decimals: 0,
  },
]

function AnimatedValue({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || hasAnimated) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true)
          const duration = 2000
          const startTime = performance.now()

          const tick = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Number((eased * value).toFixed(decimals)))
            if (progress < 1) requestAnimationFrame(tick)
          }

          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, hasAnimated, decimals])

  return (
    <span ref={ref}>
      {count.toFixed(decimals)}{suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <section id="metrics" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-accent text-xs font-mono tracking-[0.3em] uppercase">
            Performance Metrics
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-text mt-4 mb-4">
            By the Numbers
          </h2>
          <p className="text-muted max-w-xl mx-auto leading-relaxed">
            Real-world performance benchmarks measured during prototype testing.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="glass-panel rounded-2xl p-8 text-center"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5"
                style={{
                  backgroundColor: `${stat.color}15`,
                  border: `1px solid ${stat.color}30`,
                }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <div
                className="text-4xl sm:text-5xl font-black font-mono mb-2"
                style={{ color: stat.color }}
              >
                <AnimatedValue value={stat.value} suffix={stat.suffix} decimals={stat.decimals ?? 0} />
              </div>
              <h3 className="text-sm font-bold text-text mb-1">{stat.label}</h3>
              <p className="text-[11px] text-muted leading-relaxed">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
