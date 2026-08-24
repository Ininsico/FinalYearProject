import { useState } from 'react'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'

const faqs = [
  {
    q: 'What exactly is Fablet?',
    a: 'Fablet is a self-orchestrating swarm of agentic AIs. You describe an outcome in plain language, and a coordinated network of specialized agents plans, builds, runs, and refines it for you — no engineering team required.',
  },
  {
    q: 'Do I need to know how to code?',
    a: 'No. The entire point is no-code by default. You brief the swarm in natural language and it handles architecture, wiring, and delivery behind the scenes.',
  },
  {
    q: 'What can I actually build with it?',
    a: 'Anything the swarm can orchestrate: personalized courses, comedy and news channels, branded media, enterprise workflows, internal tools, and beyond. One foundation, every domain.',
  },
  {
    q: 'How does the orchestration work?',
    a: 'A single brief is decomposed into a sequenced plan, assigned to specialized agents that execute in parallel, then operated and optimized end to end. You stay focused on the vision.',
  },
  {
    q: 'Is my data and IP safe?',
    a: 'Your briefs, assets, and outputs stay within your workspace. The swarm improves from usage patterns, not by exposing your private content.',
  },
  {
    q: 'How much does it cost?',
    a: 'Fablet is built to remove gatekeepers — no budget wall, no permission required to start. Specific plans and pricing are coming soon; reach out on the contact page to get early access.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section className="py-28 bg-planet-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-planet-900 text-white text-xs font-bold rounded-md tracking-wider mb-6">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-planet-900 leading-tight">
            Frequently asked questions
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className={`rounded-xl border bg-white transition-colors ${
                  isOpen ? 'border-blue-400/60 shadow-lg' : 'border-planet-100'
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-planet-900">{f.q}</span>
                  <Plus
                    className={`w-5 h-5 shrink-0 text-blue-500 transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-planet-600 leading-relaxed">{f.a}</p>
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
