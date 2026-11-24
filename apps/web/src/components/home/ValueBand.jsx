import { Container } from "../layout"
import { Micro } from "./ui"

const STATEMENTS = [
  {
    title: "AI drafts the material",
    body: "Descriptions, lesson text and quizzes are written on demand, then edited by the people who teach them.",
  },
  {
    title: "Instructors decide",
    body: "Every module has an owner. Nothing publishes without an editor deciding it is right.",
  },
  {
    title: "Students get the real thing",
    body: "Short lessons, worked practice and an assessment that checks the whole module.",
  },
]

export default function ValueBand() {
  return (
    <section className="bg-paper py-16 sm:py-24">
      <Container>
        <Micro className="text-ink-500">Why Fablet</Micro>
        <p className="display mt-6 max-w-[20ch] text-[clamp(2rem,4.4vw,4rem)] leading-[1.02] tracking-[-0.02em] text-ink-950">
          AI drafts. Instructors decide. You learn.
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {STATEMENTS.map((s) => (
            <div key={s.title} className="border-t border-line pt-5">
              <h2 className="display text-step-1 text-ink-950">{s.title}</h2>
              <p className="mt-2 text-step--1 leading-relaxed text-ink-600">{s.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
