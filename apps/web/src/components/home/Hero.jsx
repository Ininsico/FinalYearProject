import { useNavigate } from "react-router-dom"
import { ArrowRight } from "@phosphor-icons/react"
import { Container } from "../layout"

export default function Hero() {
  const navigate = useNavigate()
  return (
    <section className="border-b border-line bg-paper">
      <Container className="grid gap-12 pb-16 pt-28 sm:pt-36 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-20">
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
