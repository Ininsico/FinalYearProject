import { Container } from "../layout"
import { ArrowButton, Micro } from "./ui"

const STATEMENTS = [
  {
    title: "AI drafts",
    body: "Descriptions, lesson text and quizzes are written on demand, then edited by the people who teach them.",
  },
  {
    title: "Instructors decide",
    body: "Every module has an owner. Nothing publishes without an editor deciding it is right.",
  },
  {
    title: "You learn",
    body: "Short lessons, worked practice and an assessment that checks the whole module.",
  },
]

export default function ValueBand() {
  return (
    <section className="bg-paper py-16 sm:py-24">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <Micro className="text-ink-500">Why Fablet</Micro>
          <Micro dot={false} className="text-ink-400">
            01 — 03
          </Micro>
        </div>

        <p className="display mt-8 max-w-[24ch] text-[clamp(2.2rem,4.6vw,4.2rem)] leading-[1.02] tracking-[-0.02em] text-ink-950">
          AI drafts. Instructors decide. You learn.
        </p>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[15px] border border-line bg-line sm:grid-cols-3">
          {STATEMENTS.map((s, i) => (
            <article
              key={s.title}
              className="group relative bg-paper-2 p-7 transition-colors duration-300 hover:bg-paper sm:p-9"
            >
              <div className="relative inline-block" aria-hidden="true">
                <span className="absolute left-[3px] top-[3px] select-none font-sans text-[clamp(2.6rem,4.2vw,3.6rem)] font-bold italic leading-none tracking-[-0.03em] text-accent-soft">
                  0{i + 1}
                </span>
                <span className="relative font-sans text-[clamp(2.6rem,4.2vw,3.6rem)] font-bold italic leading-none tracking-[-0.03em] text-transparent [-webkit-text-stroke:2px_var(--color-ink-950)]">
                  0{i + 1}
                </span>
              </div>

              <h3 className="display mt-8 text-step-2 text-ink-950">{s.title}</h3>
              <p className="mt-3 max-w-[36ch] text-step--1 leading-relaxed text-ink-600">{s.body}</p>

              <span
                aria-hidden="true"
                className="mt-6 block h-1.5 w-1.5 rotate-45 bg-accent transition-transform duration-300 group-hover:rotate-[135deg]"
              />
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <ArrowButton
            onClick={() =>
              document.getElementById("assistant")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Meet the assistant
          </ArrowButton>
        </div>
      </Container>
    </section>
  )
}
