import { Container } from "../layout"
import { Micro } from "./ui"

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
    <section className="bg-paper-2 py-16 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.02] tracking-[-0.02em] text-ink-950">
            The academy at a glance.
          </h2>
          <Micro className="text-ink-500">Key facts</Micro>
        </div>

        <dl className="mt-10">
          {FACTS.map(({ label, value, note }) => (
            <div
              key={label}
              className="grid gap-2 rounded-[12px] px-4 py-5 transition-colors duration-300 hover:bg-paper md:grid-cols-[minmax(0,1fr)_260px_minmax(0,1.4fr)] md:items-baseline md:gap-8"
            >
              <dt className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ink-500">{label}</dt>
              <dd className="display text-step-2 tabular text-ink-950">{value}</dd>
              <dd className="text-step--1 leading-relaxed text-ink-600">{note}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
