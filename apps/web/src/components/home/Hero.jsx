import { useNavigate } from "react-router-dom"
import { ArrowRight } from "@phosphor-icons/react"
import { Container } from "../layout"

export default function Hero() {
  const navigate = useNavigate()
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-x-0 top-0 h-[420px] opacity-60"
          style={{
            backgroundImage: "radial-gradient(var(--color-line-2) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(60% 80% at 30% 0%, black, transparent)",
            WebkitMaskImage: "radial-gradient(60% 80% at 30% 0%, black, transparent)",
          }}
        />
        <svg
          className="art-spin absolute -right-44 -top-44 h-[520px] w-[520px]"
          viewBox="0 0 520 520"
          fill="none"
        >
          <circle cx="260" cy="260" r="240" stroke="var(--color-line-2)" strokeWidth="1" strokeDasharray="2 9" />
          <circle cx="260" cy="260" r="180" stroke="var(--color-accent)" strokeOpacity="0.3" strokeWidth="1" />
        </svg>
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent-soft" />
        <svg className="art-float absolute right-[30%] top-28 h-12 w-12" viewBox="0 0 48 48">
          <rect x="14" y="14" width="20" height="20" transform="rotate(45 24 24)" fill="var(--color-accent)" />
        </svg>
        <svg className="art-float-slow absolute bottom-24 right-[12%] h-10 w-10" viewBox="0 0 40 40">
          <rect
            x="12"
            y="12"
            width="16"
            height="16"
            transform="rotate(45 20 20)"
            fill="none"
            stroke="var(--color-ink-950)"
            strokeWidth="1.5"
          />
        </svg>
        <svg className="art-float absolute left-[38%] top-16 h-7 w-7" viewBox="0 0 28 28">
          <rect
            x="8"
            y="8"
            width="12"
            height="12"
            transform="rotate(45 14 14)"
            fill="var(--color-paper-3)"
            stroke="var(--color-line-2)"
          />
        </svg>
      </div>

      <Container className="relative grid gap-12 pb-16 pt-28 sm:pt-36 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-20">
        <div>
          <h1 className="display text-[clamp(2.4rem,1.7rem+2.8vw,3.8rem)] text-ink-950">
            An online academy, taught by AI teachers.
          </h1>
          <p className="mt-6 max-w-[54ch] text-step-0 leading-[1.7] text-ink-600">
            Fablet writes its courses with AI, keeps them current with the instructors
            who own them, and teaches them in short lessons, worked practice and an
            assessment at the end of every module.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button onClick={() => navigate("/signup")} className="btn btn-accent">
              Create a free account
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </button>
            <a href="#teachers" className="link-underline text-step--1">
              Meet the teachers
            </a>
          </div>
          <p className="mt-10 max-w-[46ch] border-t border-line pt-5 text-step--1 text-ink-500">
            Free student accounts, seven courses live across five subjects, and seat
            plans for institutions.
          </p>
        </div>

        <figure className="border border-line bg-paper-2">
          <img
            src="/teachers/Aleeza.jpg"
            alt="Aleeza, an AI teacher at Fablet"
            className="aspect-[4/5] w-full object-cover object-top"
          />
          <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line px-5 py-3">
            <span className="display text-step-1 text-ink-950">Aleeza</span>
            <span className="text-[0.8rem] text-ink-500">AI teacher, faculty of five</span>
          </figcaption>
        </figure>
      </Container>
    </section>
  )
}
