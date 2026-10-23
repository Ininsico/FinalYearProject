import { PageHero, Section, SectionHeading } from "../components/layout"
import Reveal from "../components/Reveal"

const PRINCIPLES = [
  ["Ship the whole thing", "We prototype end to end, because a swarm only proves itself when a real production runs."],
  ["Write it down", "Architecture, decisions, failures. If it is not documented, it does not exist."],
  ["Stay honest", "We calibrate claims to evidence and report deltas against real baselines."],
]

export default function Careers() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Come build the orchestration layer."
        lede="Fablet is an early project with an ambitious scope. We look for people who prefer building systems to building slides."
      />

      <Section>
        <SectionHeading eyebrow="How we work" title="Three things we care about." />
        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          {PRINCIPLES.map(([h, b], i) => (
            <Reveal key={h} delay={i * 0.08}>
              <div className="border-t border-line pt-6">
                <h3 className="display text-step-2 text-ink-950">{h}</h3>
                <p className="mt-4 leading-relaxed text-ink-600">{b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Open roles" title="Nothing open right now." />
        <Reveal>
          <div className="mt-10 border border-dashed border-line-2 px-8 py-16 text-center">
            <p className="mx-auto max-w-[44ch] text-step-0 leading-relaxed text-ink-600">
              We are not hiring for a specific role at the moment. If you think you can
              move the swarm forward, introduce yourself anyway.
            </p>
            <a href="mailto:fablet@artdevelopers.site" className="btn btn-primary mt-8">
              Introduce yourself
            </a>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
