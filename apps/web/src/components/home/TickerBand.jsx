import Ticker from "../Ticker"

const TEACHING = [
  "Courses drafted with AI",
  "Directed by instructors",
  "Short lessons, worked practice",
  "Assessment at the end of every module",
]

const SUBJECTS = [
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
        items={TEACHING}
        duration={32}
        itemClassName="display text-step-1 text-ink-950"
      />
      <Ticker
        items={SUBJECTS}
        duration={44}
        reverse
        className="mt-2"
        itemClassName="text-step--1 text-ink-500"
      />
    </section>
  )
}
