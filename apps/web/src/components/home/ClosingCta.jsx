import { useNavigate } from "react-router-dom"
import { ArrowRight } from "@phosphor-icons/react"
import Ticker from "../Ticker"
import { Container } from "../layout"

export default function ClosingCta() {
  const navigate = useNavigate()
  return (
    <section className="border-t border-line bg-ink-950 text-paper">
      <div className="border-b border-paper/15 py-5">
        <Ticker
          items={[
            "Free to start",
            "Seven courses live",
            "Taught by AI teachers",
            "Directed by instructors",
          ]}
          duration={36}
          itemClassName="display text-step-1 text-paper/85"
        />
      </div>

      <Container className="flex flex-wrap items-end justify-between gap-8 py-16 sm:py-20">
        <div>
          <h2 className="display max-w-[16ch] text-step-3 text-paper">
            Your first course is free.
          </h2>
          <p className="mt-3 max-w-[46ch] text-step--1 leading-relaxed text-paper/70">
            Create a student account and the whole free catalogue opens. Institutions
            register in the same place.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <button onClick={() => navigate("/signup")} className="btn btn-accent">
            Create your free account
            <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </button>
          <button
            onClick={() => navigate("/institutions/register")}
            className="link-underline text-step--1 text-paper/80"
          >
            Register an institution
          </button>
        </div>
      </Container>
    </section>
  )
}
