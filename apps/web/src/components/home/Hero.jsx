import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container } from "../layout"
import { ArrowIcon, Cross, Micro, Pill } from "./ui"

const FACULTY = [
  { name: "Aleeza", image: "/teachers/nobgaleeza.png", line: "Mathematics, explained until it clicks" },
  { name: "David", image: "/teachers/nobgdavid.png", line: "Physics, rebuilt from first principles" },
  { name: "Kim Yaun", image: "/teachers/nobgkimyaun.png", line: "Computer science, one idea at a time" },
  { name: "Lisa", image: "/teachers/nobglisa.png", line: "Business, taught by the pitch" },
]

function FacultyCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((v) => (v + 1) % FACULTY.length), 4200)
    return () => clearInterval(id)
  }, [])

  const active = FACULTY[index]

  return (
    <div className="relative mx-auto w-full max-w-[420px] lg:mx-0 lg:ml-auto">
      <Cross className="absolute -left-5 -top-5 hidden text-ink-400 sm:block" />
      <Cross className="absolute -bottom-5 -right-5 hidden text-ink-400 sm:block" />

      <div aria-hidden="true" className="flex items-center justify-center gap-4">
        <span className="hidden h-1.5 w-1.5 rotate-45 bg-accent sm:block" />

        <span className="relative inline-block">
          <span className="absolute left-[3px] top-[3px] select-none whitespace-nowrap font-sans text-[clamp(2rem,4.6vw,3.6rem)] font-bold italic leading-none tracking-[-0.02em] text-accent-soft">
            {active.name}
          </span>
          <span className="relative whitespace-nowrap font-sans text-[clamp(2rem,4.6vw,3.6rem)] font-bold italic leading-none tracking-[-0.02em] text-transparent [-webkit-text-stroke:2px_var(--color-ink-950)]">
            {active.name}
          </span>
        </span>

        <span className="hidden h-1.5 w-1.5 rotate-45 bg-accent sm:block" />
      </div>

      <div className="relative mt-3 h-[200px] sm:h-[230px]" aria-hidden="true">
        {FACULTY.map((t, i) => (
          <img
            key={t.name}
            src={t.image}
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            className={`absolute inset-0 mx-auto h-full w-auto object-contain transition-all duration-700 ease-out ${
              i === index ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          />
        ))}
      </div>

      <ul className="sr-only">
        {FACULTY.map((t) => (
          <li key={t.name}>
            {t.name}, AI teacher: {t.line}
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-line pt-3" aria-hidden="true">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ink-500">{active.line}</p>
        <Micro dot={false} className="text-ink-400">
          AI teacher
        </Micro>
      </div>
    </div>
  )
}

export default function Hero() {
  const navigate = useNavigate()
  return (
    <section className="relative overflow-hidden bg-paper lg:flex lg:min-h-[100svh] lg:flex-col">
      <Container className="pb-10 pt-20 sm:pt-24 lg:flex-1">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end">
          <div>
            <h1 className="font-sans text-[clamp(2.2rem,5.4vw,5.2rem)] font-bold leading-[0.95] tracking-[-0.03em] text-ink-950">
              AI Agents
              <br />
              The Next Gen Teachers
            </h1>
            <p className="mt-6 max-w-[54ch] text-step-0 leading-[1.7] text-ink-600">
              Fablet is an online academy where AI teachers carry the course: short
              lessons, worked practice and an assessment at the end of every module,
              all directed by the instructors who own what publishes. Start free, or
              bring your whole institution onto one curriculum.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Pill onClick={() => navigate("/signup")} tone="dark">
                Create a free account
                <ArrowIcon />
              </Pill>
              <Pill onClick={() => navigate("/institutions/register")} tone="outline">
                For institutions
              </Pill>
            </div>
          </div>

          <FacultyCarousel />
        </div>
      </Container>

      <div className="flex items-center justify-center gap-5 pb-6 text-ink-400">
        <Cross />
        <Micro dot={false} className="text-ink-500">
          Scroll to explore
        </Micro>
        <Cross />
      </div>
    </section>
  )
}
