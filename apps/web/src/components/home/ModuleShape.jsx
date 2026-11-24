import { Container } from "../layout"
import { Micro } from "./ui"

const LESSONS = [
  { title: "Foundation lesson", format: "Video", minutes: 8 },
  { title: "Core reading", format: "Reading", minutes: 15 },
  { title: "Worked practice", format: "Exercise", minutes: 30 },
  { title: "Module assessment", format: "Quiz", minutes: 15, assessment: true },
]

export default function ModuleShape() {
  return (
    <section className="bg-paper py-16 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
          <div>
            <Micro className="text-ink-500">Inside a module</Micro>
            <h2 className="display mt-6 text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.02] tracking-[-0.02em] text-ink-950">
              One module, start to finish.
            </h2>
            <p className="mt-6 max-w-[48ch] text-step-0 leading-[1.7] text-ink-600">
              Every module follows the same arc: a taught foundation, a worked practice,
              then an assessment that covers all of it. The pacing is fixed, so you
              always know what a sitting costs before you start it.
            </p>
            <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ink-500">
              About 68 minutes, end to end
            </p>
          </div>

          <div className="overflow-hidden rounded-[15px] border border-line bg-paper">
            <div className="flex items-center justify-between border-b border-line bg-paper-2 px-5 py-3">
              <Micro dot={false} className="text-ink-500">
                Module anatomy
              </Micro>
              <Micro dot={false} className="text-ink-400">
                4 lessons
              </Micro>
            </div>

            <ol className="divide-y divide-line">
              {LESSONS.map((l, i) => (
                <li
                  key={l.title}
                  className={`flex items-center gap-4 px-5 py-4 transition-colors duration-300 ${
                    l.assessment ? "bg-accent-soft" : "hover:bg-paper-2"
                  }`}
                >
                  <span className="font-mono text-[0.68rem] text-ink-400">0{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="display text-step-1 text-ink-950">{l.title}</p>
                    <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-500">
                      {l.format}
                    </p>
                  </div>
                  <span className="font-mono text-[0.68rem] tabular-nums text-ink-600">
                    {l.minutes} min
                  </span>
                  {l.assessment ? (
                    <span className="h-1.5 w-1.5 rotate-45 bg-accent" aria-hidden="true" />
                  ) : null}
                </li>
              ))}
            </ol>

            <div className="flex items-center justify-between gap-4 border-t border-line bg-paper-2 px-5 py-3">
              <Micro dot={false} className="text-ink-500">
                Complete all four to unlock the next module
              </Micro>
              <span className="flex items-center gap-3">
                <span className="block h-[3px] w-20 overflow-hidden rounded-full bg-line-2">
                  <span className="block h-full w-3/4 rounded-full bg-accent" />
                </span>
                <span className="font-mono text-[0.68rem] tabular-nums text-ink-600">3 / 4</span>
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
