import { Container } from "../layout"
import { Micro } from "./ui"

const STEPS = [
  {
    n: "01",
    title: "Create a free account",
    body: "An email and a password. The free catalogue opens immediately.",
  },
  {
    n: "02",
    title: "Choose your course",
    body: "Browse by subject and level; premium modules are marked before you start.",
  },
  {
    n: "03",
    title: "Study and practise",
    body: "Short lessons and worked exercises, at your own pace.",
  },
  {
    n: "04",
    title: "Finish the module",
    body: "A quiz that checks the whole module, then you move to the next one.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-paper-2 py-16 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.02] tracking-[-0.02em] text-ink-950">
            How the academy works.
          </h2>
          <Micro className="text-ink-500">Four steps</Micro>
        </div>

        <ol className="mt-10 border-t border-line">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="grid gap-2 border-b border-line px-4 py-6 transition-colors duration-300 hover:bg-paper md:grid-cols-[90px_minmax(0,1fr)_minmax(0,1.3fr)] md:items-baseline md:gap-8"
            >
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ink-500">
                Step {s.n}
              </span>
              <h3 className="display text-step-2 text-ink-950">{s.title}</h3>
              <p className="max-w-[52ch] text-step--1 leading-relaxed text-ink-600">{s.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
