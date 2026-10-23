import { useNavigate } from "react-router-dom"
import { ArrowRight } from "@phosphor-icons/react"
import { PageHero, Section, SectionHeading, Prose } from "../components/layout"
import Reveal from "../components/Reveal"

const VALUES = [
  ["Intellectual honesty", "We scope claims to the techniques that back them, and document the limits as carefully as the capabilities."],
  ["Augment, do not replace", "The goal is to handle labour-intensive production so people focus on the decisions that actually need them."],
  ["Systems, not scripts", "We build shared understanding between agents, because glue code between tools is where the labour goes."],
]

export default function About() {
  const navigate = useNavigate()
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A self-orchestrating network of AI agents."
        lede="Fablet is a conceptual architecture for autonomous swarm orchestration in content creation, and the reference implementation behind this site."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <SectionHeading eyebrow="The thesis" title="Orchestration is the bottleneck." />
          <Prose>
            <p>
              The demand for diverse digital content is growing faster than any team can
              scale. Generative models promised to break that curve, but in practice they
              shifted the work from crafting to orchestrating: assembling disjointed tools,
              each with its own prompting strategy, validation, and quality control.
            </p>
            <p>
              Fablet's thesis is that this orchestration tax can be automated by giving
              agents a shared semantic understanding of the content, instead of rigid
              interfaces. A single brief becomes a sequenced plan, executed by specialists
              that reason about the same warehouse of characters, scenes, and decisions.
            </p>
            <p>
              The research contribution is integration, not invention. Every component
              here is an established technique; the work is making them cohere into a
              system that addresses a real production problem, and evaluating it honestly
              against practical metrics.
            </p>
          </Prose>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Principles" title="How we build." />
        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          {VALUES.map(([h, b], i) => (
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
        <div className="flex flex-wrap items-center justify-between gap-8 border border-line bg-paper-2 p-10 sm:p-14">
          <h2 className="display max-w-[18ch] text-step-3 text-ink-950">
            The people behind the swarm.
          </h2>
          <button onClick={() => navigate("/team")} className="btn btn-primary">
            Meet the team
            <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </Section>
    </>
  )
}
