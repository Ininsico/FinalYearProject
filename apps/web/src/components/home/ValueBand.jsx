import { Container } from "../layout"

const VALUES = [
  {
    n: "01",
    title: "Built with AI",
    body: "Descriptions, lesson text and quizzes are drafted on demand, then refined by the people who teach them.",
  },
  {
    n: "02",
    title: "Directed by instructors",
    body: "Every module has an owner. Nothing publishes without an editor deciding it is right.",
  },
  {
    n: "03",
    title: "Taught to students",
    body: "Short video, reading, exercise and quiz lessons, sequenced foundations first.",
  },
]

export default function ValueBand() {
  return (
    <section className="bg-ink-950 py-14 text-paper sm:py-20">
      <Container>
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          {VALUES.map((v) => (
            <div key={v.n} className="border-t border-paper/20 pt-5">
              <span className="font-mono text-[0.7rem] tabular text-accent">{v.n}</span>
              <h2 className="display mt-3 text-step-1 text-paper">{v.title}</h2>
              <p className="mt-2 text-step--1 leading-relaxed text-paper/70">{v.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
