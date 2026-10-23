import { useNavigate } from "react-router-dom"
import { ArrowRight } from "@phosphor-icons/react"
import { Container } from "../layout"
import Reveal from "../Reveal"
import SplitHeading from "../SplitHeading"

export default function ClosingCta() {
  const navigate = useNavigate()
  return (
    <section className="border-t border-line bg-ink-950 py-24 text-paper sm:py-32">
      <Container>
        <SplitHeading as="h2" className="max-w-[16ch] text-step-5 text-paper display">
          Turn intent into something real.
        </SplitHeading>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Reveal>
            <button onClick={() => navigate("/contact")} className="btn btn-accent">
              Request access
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </button>
          </Reveal>
          <Reveal delay={0.08}>
            <a href="mailto:fablet@artdevelopers.site" className="link-underline text-step--1 text-paper/80">
              fablet@artdevelopers.site
            </a>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
