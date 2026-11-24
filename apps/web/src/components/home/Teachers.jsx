import { Container } from "../layout"

const TEACHERS = [
  { name: "Aleeza", image: "/teachers/Aleeza.jpg" },
  { name: "David", image: "/teachers/david.png" },
  { name: "Kim Yaun", image: "/teachers/KimYaun.jpg" },
  { name: "Lisa", image: "/teachers/Lisa.jpg" },
  { name: "Xavier", image: "/teachers/Xavier.png" },
]

// Each half of the track is exactly one viewport wide and holds the five teachers
// once, spread across it. The track loops by one full half, so a teacher is never
// on screen twice at the same time, and the scroll never visibly restarts.
const HALVES = [0, 1]

export default function Teachers() {
  return (
    <section id="teachers" className="border-t border-line bg-paper py-14 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-step-2 text-ink-950">The AI teachers.</h2>
          <p className="max-w-[44ch] text-step--1 text-ink-500">
            Each one is a trained persona with their own voice and pace.
          </p>
        </div>
        <ul className="sr-only">
          {TEACHERS.map((t) => (
            <li key={t.name}>{t.name}, AI teacher</li>
          ))}
        </ul>
      </Container>

      <div className="mt-10 overflow-hidden border-y border-line py-8" aria-hidden="true">
        <div className="ticker-track flex w-max" style={{ "--ticker-duration": "30s" }}>
          {HALVES.map((k) => (
            <div
              key={k}
              className="flex w-screen shrink-0 items-start justify-around px-3"
            >
              {TEACHERS.map((t) => (
                <span key={t.name} className="flex flex-col items-center gap-3">
                  <img
                    src={t.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-14 w-14 rounded-full border border-line object-cover sm:h-24 sm:w-24 lg:h-28 lg:w-28"
                  />
                  <span className="whitespace-nowrap text-[0.8rem] text-ink-700">
                    {t.name}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Container>
        <p className="mt-6 text-center text-[0.8rem] text-ink-500">
          More AI teachers are coming soon.
        </p>
      </Container>
    </section>
  )
}
