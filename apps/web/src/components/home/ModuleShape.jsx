import Ticker from "../Ticker"
import { Container } from "../layout"

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
    <section className="border-t border-line bg-paper py-14 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-step-2 text-ink-950">Inside a module.</h2>
          <p className="max-w-[44ch] text-step--1 text-ink-500">
            Every module follows the same shape, so you always know where you are.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="dash-flow absolute left-0 right-0 top-3.5 hidden h-px lg:block" aria-hidden="true" />
          <ol className="grid gap-10 lg:grid-cols-3 lg:gap-8">
            {STAGES.map((s, i) => (
              <li key={s.title} className="relative lg:pr-10">
                <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-line-2 bg-paper text-[0.78rem] font-medium text-ink-950">
                  {i + 1}
                </span>
                <h3 className="display mt-4 text-step-1 text-ink-950">{s.title}</h3>
                <p className="mt-2 max-w-[40ch] text-step--1 leading-relaxed text-ink-600">
                  {s.body}
                </p>
                <span className="mt-4 inline-block border border-line-2 bg-paper-2 px-3 py-1 text-[0.78rem] text-ink-700">
                  {s.formats}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Container>

      <div className="mt-12 border-y border-line bg-paper-2 py-5">
        <Ticker items={FORMATS} duration={38} itemClassName="display text-step-1 text-ink-950" />
      </div>
    </section>
  )
}
