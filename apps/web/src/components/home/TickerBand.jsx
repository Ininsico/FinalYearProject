import Ticker from "../Ticker"

const ROW_A = [
  "Courses drafted with AI",
  "Directed by instructors",
  "Short lessons, real assessments",
  "Free to start",
]

const ROW_B = [
  "Mathematics",
  "Physics",
  "Computer Science",
  "Business",
  "Design",
  "Seat plans for institutions",
]

export default function TickerBand() {
  return (
    <section className="border-y border-line bg-paper-2 py-6 sm:py-8">
      <Ticker
        items={ROW_A}
        duration={30}
        itemClassName="display text-step-2 text-ink-950"
      />
      <Ticker
        items={ROW_B}
        duration={42}
        reverse
        className="mt-2"
        itemClassName="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-500"
      />
    </section>
  )
}
