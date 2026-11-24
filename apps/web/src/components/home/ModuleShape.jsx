import Ticker from "../Ticker"
import { Container } from "../layout"
import { Micro } from "./ui"

const STAGES = [
  {
    title: "Foundations",
    body: "A welcome video and the core reading for the subject.",
    formats: "Video and reading",
  },
  {
    title: "Practice",
    body: "A guided exercise sized for one sitting, with a sample solution to check against.",
    formats: "Exercise",
  },
  {
    title: "Assessment",
    body: "A quiz that covers the whole module, not just the last page.",
    formats: "Quiz",
  },
]

const FORMATS = [
  "Video, 8 minutes",
  "Reading, 15 minutes",
  "Exercise, 30 minutes",
  "Quiz, 15 minutes",
]

export default function ModuleShape() {
  return (
    <section className="bg-paper py-16 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.02] tracking-[-0.02em] text-ink-950">
            Inside a module.
          </h2>
          <Micro className="text-ink-500">The same shape every time</Micro>
        </div>

        <div className="relative mt-14">
          <div className="dash-flow absolute left-0 right-0 top-4 hidden h-px lg:block" aria-hidden="true" />
          <ol className="grid gap-12 lg:grid-cols-3 lg:gap-8">
            {STAGES.map((s, i) => (
              <li key={s.title} className="relative lg:pr-10">
                <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-line-2 bg-paper font-mono text-[0.68rem] text-ink-950">
                  {i + 1}
                </span>
                <h3 className="display mt-5 text-step-2 text-ink-950">{s.title}</h3>
                <p className="mt-2 max-w-[40ch] text-step--1 leading-relaxed text-ink-600">{s.body}</p>
                <span className="mt-5 inline-block rounded-full border border-line-2 px-4 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-ink-700">
                  {s.formats}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Container>

      <div className="mt-14 border-y border-line bg-paper-2 py-5">
        <Ticker
          items={FORMATS}
          duration={38}
          itemClassName="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ink-700"
        />
      </div>
    </section>
  )
}
