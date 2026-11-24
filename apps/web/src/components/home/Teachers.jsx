import Ticker from "../Ticker"
import { Container } from "../layout"

const TEACHERS = [
  { name: "Aleeza", image: "/teachers/Aleeza.jpg" },
  { name: "David", image: "/teachers/david.png" },
  { name: "Kim Yaun", image: "/teachers/KimYaun.jpg" },
  { name: "Lisa", image: "/teachers/Lisa.jpg" },
  { name: "Xavier", image: "/teachers/Xavier.png" },
]

// Doubled so the half-track is wide enough to loop seamlessly on large screens.
const LOOP = [...TEACHERS, ...TEACHERS]

const ITEMS = LOOP.map((t, i) => (
  <span key={i} className="flex w-28 flex-col items-center gap-3 sm:w-32">
    <img
      src={t.image}
      alt=""
      loading="lazy"
      decoding="async"
      className="h-24 w-24 rounded-full border border-line object-cover sm:h-28 sm:w-28"
    />
    <span className="text-step--1 text-ink-700">{t.name}</span>
  </span>
))

export default function Teachers() {
  return (
    <section id="teachers" className="border-t border-line bg-paper py-14 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-step-2 text-ink-950">Meet the AI teachers.</h2>
          <p className="max-w-[44ch] text-step--1 text-ink-500">
            A trained persona behind every voice, with their own delivery and pacing.
          </p>
        </div>
        <ul className="sr-only">
          {TEACHERS.map((t) => (
            <li key={t.name}>{t.name}, AI teacher</li>
          ))}
        </ul>
      </Container>

      <div className="mt-10 border-y border-line py-8">
        <Ticker items={ITEMS} duration={34} separator={null} itemClassName="mx-4 sm:mx-6" />
      </div>

      <Container>
        <p className="mt-6 text-center font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-500">
          More AI teachers soon
        </p>
      </Container>
    </section>
  )
}
