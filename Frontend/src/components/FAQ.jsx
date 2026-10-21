import { useState } from "react"
import { Plus } from "lucide-react"
import { motion } from "framer-motion"

const FAQS = [
  {
    q: "What exactly is Fablet?",
    a: "Fablet is a self-orchestrating swarm of AI agents. You describe an outcome in plain language, and a coordinated network of specialists plans, builds, runs, and refines it for you, with no engineering team required.",
  },
  {
    q: "Do I need to know how to code?",
    a: "No. Fablet is no-code by default. You brief the swarm in natural language and it handles architecture, wiring, and delivery behind the scenes.",
  },
  {
    q: "What can I actually build with it?",
    a: "Anything the swarm can orchestrate: personalized courses, comedy and news channels, branded media, enterprise workflows, internal tools, and beyond. One foundation, every domain.",
  },
  {
    q: "How does the orchestration work?",
    a: "A single brief is decomposed into a sequenced plan, assigned to specialist agents that execute in parallel, then operated and optimized end to end. You stay focused on the vision.",
  },
  {
    q: "Is my data and IP safe?",
    a: "Your briefs, assets, and outputs stay within your workspace. The swarm improves from usage patterns, not by exposing your private content.",
  },
  {
    q: "How much does it cost?",
    a: "Fablet is built to remove gatekeepers, so there is no budget wall to start. Plans and pricing are coming soon. Reach out on the contact page to request early access.",
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section className="bg-paper px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">FAQ</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-12 divide-y divide-ink-200 border-y border-ink-200">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-lg font-semibold text-ink-950">{f.q}</span>
                  <Plus
                    className={`h-5 w-5 shrink-0 text-ink-500 transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pr-10 leading-relaxed text-ink-600">{f.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
