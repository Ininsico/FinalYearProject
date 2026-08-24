import { motion } from 'framer-motion'
import AnimatedGradient from './AnimatedGradient'

const reveal = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
}

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const domains = [
  {
    title: 'Education',
    desc: 'Adaptive, bilingual learning experiences that teach, test, and tutor in real time — built and maintained by the swarm.',
  },
  {
    title: 'Media & Entertainment',
    desc: 'Comedy, commentary, and branded content engines that research, write, produce, and publish on their own.',
  },
  {
    title: 'News & Information',
    desc: 'Always-on reporting and summarization, tuned to any audience, region, or tone without a newsroom.',
  },
  {
    title: 'Enterprise',
    desc: 'Internal tools, automations, and customer-facing systems composed on demand and run end to end.',
  },
]

const steps = [
  {
    n: '01',
    title: 'Brief',
    desc: 'You describe an outcome in plain language. No specs, no diagrams, no tickets.',
  },
  {
    n: '02',
    title: 'Plan',
    desc: 'The orchestrator decomposes the goal and assigns specialized agents across the network.',
  },
  {
    n: '03',
    title: 'Execute',
    desc: 'Agents build in parallel — assets, content, and systems shipped with human-quality oversight.',
  },
  {
    n: '04',
    title: 'Operate',
    desc: 'Fablet monitors, optimizes, and sustains what it built, improving with every run.',
  },
]

const pillars = [
  {
    title: 'No code',
    desc: 'Intent becomes a working system. The swarm handles architecture, wiring, and delivery.',
  },
  {
    title: 'No silos',
    desc: 'One orchestration core powers every domain — education, media, enterprise, and beyond.',
  },
  {
    title: 'No gatekeepers',
    desc: 'Anyone can build. No engineering team, no budget wall, no permission required.',
  },
  {
    title: 'Self-improving',
    desc: 'Every task feeds the swarm. It gets sharper, faster, and more capable over time.',
  },
]

function LogoMark() {
  return (
    <img
      src="/fablet-logo.png"
      alt="Fablet"
      className="h-16 w-auto mx-auto mb-8"
    />
  )
}

export default function Vision() {
  return (
    <>
      {/* Section 2 — One Swarm, Every Domain */}
      <section className="relative py-28 overflow-hidden">
        <AnimatedGradient config={{ preset: 'Oceanic' }} />
        <div className="absolute inset-0 bg-[#070b1c]/75" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block px-4 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-md tracking-wider mb-6">
                THE SURFACE AREA
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
                One foundation. Infinite surfaces.
              </h2>
              <p className="mt-6 text-lg text-slate-300 leading-relaxed">
                The same swarm that teaches also entertains, reports, and ships
                software. It is not one product — it is the substrate every product
                is built on.
              </p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {domains.map((d, i) => (
              <Reveal key={d.title} delay={i * 0.08}>
                <div className="h-full p-7 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/50 transition-colors">
                  <h3 className="text-xl font-bold text-white mb-3">{d.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{d.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — How the Orchestration Works */}
      <section className="relative py-28 overflow-hidden">
        <AnimatedGradient config={{ preset: 'Aurora' }} />
        <div className="absolute inset-0 bg-[#0a001a]/75" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block px-4 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-md tracking-wider mb-6">
                THE MECHANICS
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
                From a sentence to a running system.
              </h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="relative">
                  <span className="block text-5xl font-extrabold text-white/30 mb-4">{s.n}</span>
                  <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Why Fablet */}
      <section className="relative py-28 overflow-hidden">
        <AnimatedGradient
          config={{
            preset: 'custom',
            color1: '#050816',
            color2: '#0b1530',
            color3: '#3b82f6',
            shape: 'Edge',
            shapeSize: 40,
            proportion: 70,
            scale: 0.5,
            speed: 18,
            distortion: 30,
            swirl: 70,
            softness: 90,
          }}
        />
        <div className="absolute inset-0 bg-[#070b1c]/75" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <LogoMark />
              <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
                No code. No silos. No gatekeepers.
              </h2>
              <p className="mt-6 text-lg text-slate-300 leading-relaxed">
                Fablet removes the friction between an idea and its existence, so you
                can stay focused on the vision.
              </p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="h-full p-7 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/50 transition-colors">
                  <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
