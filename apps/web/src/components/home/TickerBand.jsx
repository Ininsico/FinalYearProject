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
    <section className="border-y border-paper/10 bg-ink-950 py-5 text-paper">
      <Ticker
        items={TEACHING}
        duration={30}
        itemClassName="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-paper/85"
      />
      <Ticker
        items={SUBJECTS}
        duration={44}
        reverse
        className="mt-2"
        itemClassName="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-paper/40"
      />
    </section>
  )
}
