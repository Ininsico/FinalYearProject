import { Container } from "../layout"

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
    <section className="bg-ink-950 py-14 text-paper sm:py-20">
      <Container>
        <p className="display max-w-[26ch] text-step-2 text-paper">
          AI drafts. Instructors decide. You learn.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {STATEMENTS.map((s) => (
            <div key={s.title} className="border-t border-paper/20 pt-5">
              <h2 className="display text-step-1 text-paper">{s.title}</h2>
              <p className="mt-2 text-step--1 leading-relaxed text-paper/70">{s.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
