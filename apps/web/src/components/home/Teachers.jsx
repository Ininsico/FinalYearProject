import { Container } from "../layout"
import { Micro } from "./ui"

const TEACHERS = [
  { name: "Aleeza", image: "/teachers/Aleeza.jpg" },
  { name: "David", image: "/teachers/david.png" },
  { name: "Kim Yaun", image: "/teachers/KimYaun.jpg" },
  { name: "Lisa", image: "/teachers/Lisa.jpg" },
  { name: "Xavier", image: "/teachers/Xavier.png" },
]

// Each half of the track is exactly one viewport wide and holds the five teachers
// once, so a teacher is never on screen twice at the same time. The track loops by
// one full half, keeping the scroll seamless.
const HALVES = [0, 1]

export default function Teachers() {
  return (
    <section id="teachers" className="border-y border-paper/10 bg-ink-950 py-16 text-paper sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.02] tracking-[-0.02em]">
            The AI teachers.
          </h2>
          <Micro className="text-paper/60">Each with their own voice and pace</Micro>
        </div>
        <ul className="sr-only">
          {TEACHERS.map((t) => (
            <li key={t.name}>{t.name}, AI teacher</li>
          ))}
        </ul>
      </Container>

      <div className="mt-12 overflow-hidden border-y border-paper/10 py-10" aria-hidden="true">
        <div className="ticker-track flex w-max" style={{ "--ticker-duration": "30s" }}>
          {HALVES.map((k) => (
            <div key={k} className="flex w-screen shrink-0 items-start justify-around px-3">
              {TEACHERS.map((t) => (
                <span key={t.name} className="flex flex-col items-center gap-3">
                  <img
                    src={t.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-14 w-14 rounded-full border border-paper/20 object-cover sm:h-24 sm:w-24 lg:h-28 lg:w-28"
                  />
                  <span className="whitespace-nowrap font-mono text-[0.66rem] uppercase tracking-[0.08em] text-paper/70">
                    {t.name}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Container>
        <p className="mt-8 text-center font-mono text-[0.68rem] uppercase tracking-[0.08em] text-paper/60">
          More AI teachers are coming soon
        </p>
      </Container>
    </section>
  )
}
