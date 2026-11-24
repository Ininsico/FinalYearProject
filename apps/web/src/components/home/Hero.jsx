import { useNavigate } from "react-router-dom"
import { ArrowRight } from "@phosphor-icons/react"
import { Container } from "../layout"

const FACTS = [
  "Seven courses are live across five subjects, from calculus to design systems.",
  "Student accounts are free. Premium modules and the AI video agent are 9 USDT a month.",
  "Institutions register on seat plans and publish their own modules.",
]

export default function Hero() {
  const navigate = useNavigate()
  return (
    <section className="border-b border-line bg-paper">
      <Container className="grid gap-12 pb-16 pt-28 sm:pt-36 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-20">
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
        </div>

        <div className="border border-line bg-paper-2">
          {FACTS.map((f) => (
            <p
              key={f}
              className="border-t border-line px-6 py-5 text-step--1 leading-relaxed text-ink-700 first:border-t-0"
            >
              {f}
            </p>
          ))}
          <div className="border-t border-line px-6 py-5">
            <button
              onClick={() => navigate("/institutions/register")}
              className="link-underline text-step--1 font-medium"
            >
              Register your institution
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
}
