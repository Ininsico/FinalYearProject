import { Container } from "../layout"

const FACTS = [
  ["Courses live in the catalogue", "7, and growing module by module"],
  ["Subjects", "5, from calculus to design systems"],
  ["Lesson formats", "Video, reading, exercise and quiz"],
  ["Assessment", "At the end of every module"],
  ["Student accounts", "Free; Pro is 9 USDT a month"],
  ["Institution plans", "10 to 50 seats, 49 to 149 USDT a month"],
]

export default function Facts() {
  return (
    <section className="border-y border-line bg-paper-2 py-14 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-step-2 text-ink-950">The academy at a glance.</h2>
          <p className="max-w-[40ch] text-step--1 text-ink-500">
            Straight facts, before you sign up for anything.
          </p>
        </div>

        <dl className="mt-10">
          {FACTS.map(([k, v]) => (
            <div
              key={k}
              className="grid gap-1 border-t border-line py-4 last:border-b md:grid-cols-[260px_minmax(0,1fr)] md:gap-6"
            >
              <dt className="text-step--1 text-ink-500">{k}</dt>
              <dd className="text-step--1 text-ink-950">{v}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
