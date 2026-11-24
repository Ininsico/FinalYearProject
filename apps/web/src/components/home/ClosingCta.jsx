import { useNavigate } from "react-router-dom"
import Ticker from "../Ticker"
import { Container } from "../layout"
import { ArrowIcon, Pill } from "./ui"

export default function ClosingCta() {
  const navigate = useNavigate()
  return (
    <section className="border-t border-paper/10 bg-ink-950 text-paper">
      <div className="border-b border-paper/10 py-5">
        <Ticker
          items={[
            "Every Fablet course, free",
            "Seven courses live",
            "Taught by AI teachers",
            "Directed by instructors",
            "Institution courses, priced by them",
          ]}
          duration={36}
          itemClassName="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-paper/60"
        />
      </div>

      <Container className="py-16 sm:py-24">
        <p className="display max-w-[16ch] text-[clamp(2.1rem,6vw,5.4rem)] leading-[1] tracking-[-0.02em]">
          Every course we publish is free.
        </p>
        <p className="mt-6 max-w-[46ch] text-step--1 leading-relaxed text-paper/70">
          Create a student account and every module Fablet publishes opens at no cost.
          Courses published by institutions are priced by them — free or paid — and
          register in the same place.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Pill onClick={() => navigate("/signup")} tone="light">
            Create your free account
            <ArrowIcon />
          </Pill>
          <Pill onClick={() => navigate("/institutions/register")} tone="outlineLight">
            Register an institution
          </Pill>
        </div>
      </Container>
    </section>
  )
}
