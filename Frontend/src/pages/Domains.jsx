import { useNavigate } from "react-router-dom"
import { ArrowRight } from "@phosphor-icons/react"
import { PageHero, Section, Container } from "../components/layout"
import Reveal from "../components/Reveal"
import SplitHeading from "../components/SplitHeading"
import { DOMAINS } from "../lib/content"

export default function Domains() {
  const navigate = useNavigate()
  return (
    <>
      <PageHero
        eyebrow="Domains"
        title="One foundation. Every surface."
        lede="The same swarm, re-tuned per domain through the warehouse. Loading a different template changes the output without touching agent code."
      />

      {DOMAINS.map((d, i) => (
        <Section key={d.key}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <div>
              <span className="font-mono text-[0.7rem] tabular text-accent-ink">
                {String(i + 1).padStart(2, "0")}
              </span>
              <SplitHeading as="h2" className="mt-5 max-w-[14ch] text-step-4 text-ink-950 display">
                {d.name}
              </SplitHeading>
              <p className="mt-4 eyebrow">{d.tag}</p>
            </div>
            <div>
              <p className="max-w-[56ch] text-step-1 leading-[1.6] text-ink-600">{d.body}</p>
              <ul className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
                {d.points.map((p) => (
                  <li key={p} className="bg-paper p-5 text-step--1 text-ink-700">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      ))}

      <Section>
        <Container className="px-0">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-6 border border-line bg-paper-2 p-10 sm:p-14">
              <h2 className="display max-w-[18ch] text-step-3 text-ink-950">
                Have a domain that is not listed?
              </h2>
              <button onClick={() => navigate("/contact")} className="btn btn-primary">
                Brief the swarm
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  )
}
