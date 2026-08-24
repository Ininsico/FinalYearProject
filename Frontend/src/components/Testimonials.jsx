import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Arslan',
    role: 'Independent Creator',
    image: '/arslan.png',
    text: 'I described a comedy channel in one sentence and the swarm shipped the first three episodes by morning. This is what building is supposed to feel like.',
  },
  {
    name: 'Huzaifa',
    role: 'Head of Operations, Northwind',
    image: '/huzafia.png',
    text: 'We retired three internal tools and replaced them with a single Fablet workflow. No engineers, no tickets — just the outcome we wanted.',
  },
  {
    name: 'AhmedUllah',
    role: 'Solo Founder',
    image: '/ahmedullah.jpg',
    text: 'As a non-technical founder I built an entire ed-tech product without writing a line of code. The agents handled the wiring end to end.',
  },
  {
    name: 'Ayyan',
    role: 'Newsroom Lead',
    image: '/ayyan.jpg',
    text: 'Our daily brief writes, fact-checks, and publishes itself now. The swarm adapts to the stories our readers actually open.',
  },
  {
    name: 'Noman',
    role: 'Product Designer',
    image: '/noman.jpg',
    text: 'Fablet is the first platform where the idea and the shipped thing are the same distance apart. That changes everything.',
  },
  {
    name: 'Mudasir',
    role: 'Startup Accelerator',
    image: '/mudasri.png',
    text: 'Every cohort now launches with a Fablet swarm behind it. What used to take a team takes an afternoon.',
  },
]

const reveal = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0 },
}

export default function Testimonials() {
  return (
    <section id="about" className="py-28 bg-planet-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-planet-900 text-white text-xs font-bold rounded-md tracking-wider mb-6">
            FROM THE BUILDERS
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-planet-900 leading-tight">
            The swarm is already shipping.
          </h2>
          <p className="mt-6 text-lg text-planet-600 leading-relaxed">
            Founders, creators, and operators use Fablet to turn a brief into a
            working product — without code, silos, or gatekeepers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.1, ease: 'easeOut' }}
              className="group relative flex flex-col p-7 rounded-2xl bg-white border border-planet-100 hover:border-blue-400/50 hover:shadow-xl transition-all"
            >
              <Quote className="w-7 h-7 text-blue-500/40 mb-4" />
              <p className="text-planet-700 text-sm leading-relaxed mb-6 flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {t.image ? (
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-planet-900 text-sm">{t.name}</p>
                  <p className="text-xs text-planet-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
