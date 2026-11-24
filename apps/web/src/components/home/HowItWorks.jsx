import { Container } from "../layout"

const STEPS = [
  {
    n: "1",
    title: "Create a free account",
    body: "An email and a password. The free catalogue opens immediately.",
  },
  {
    n: "2",
    title: "Choose your course",
    body: "Browse by subject and level; premium modules are marked before you start.",
  },
  {
    n: "3",
    title: "Study and practise",
    body: "Short lessons and worked exercises, at your own pace.",
  },
  {
    n: "4",
    title: "Finish the module",
    body: "A quiz that checks the whole module, then you move to the next one.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-line bg-paper-2 py-14 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-step-2 text-ink-950">How the academy works.</h2>
          <p className="max-w-[42ch] text-step--1 text-ink-500">
            Four steps from a free account to finishing your first module.
          </p>
        </div>

        <ol className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="bg-paper p-6">
              <span className="display text-step-1 text-accent-ink">{s.n}</span>
              <h3 className="display mt-2 text-step-1 text-ink-950">{s.title}</h3>
              <p className="mt-2 text-step--1 leading-relaxed text-ink-600">{s.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
