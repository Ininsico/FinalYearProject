import { Container } from "../layout"

const FACTS = [
  { label: "Courses live", value: "7", note: "and growing module by module" },
  { label: "Subjects", value: "5", note: "from calculus to design systems" },
  { label: "Lesson formats", value: "4", note: "video, reading, exercise and quiz" },
  { label: "Assessment", value: "Every module", note: "a quiz covers the whole of it" },
  { label: "Student accounts", value: "Free", note: "Pro is 9 USDT a month" },
  { label: "Institution plans", value: "49 to 149 USDT", note: "10 to 50 seats, billed monthly" },
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

        <dl className="mt-10 border-t border-line">
          {FACTS.map(({ label, value, note }) => (
            <div
              key={label}
              className="grid gap-1 border-b border-line py-5 md:grid-cols-[minmax(0,1fr)_200px_minmax(0,1.5fr)] md:items-baseline md:gap-8"
            >
              <dt className="text-[0.8rem] text-ink-500">{label}</dt>
              <dd className="display text-step-1 tabular text-ink-950">{value}</dd>
              <dd className="text-step--1 leading-relaxed text-ink-600">{note}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
