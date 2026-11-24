import { PageHero, Section, SectionHeading, Prose, Container } from "../components/layout"
import Steps from "../components/home/Steps"
import Reveal from "../components/Reveal"
import { AGENT_ROLES } from "../lib/content"

const ARCHITECTURE = [
  {
    title: "Specialized agents",
    body: "Fine-tuned foundation models, each owning one expertise domain: narrative, visual, temporal, audio, validation, rendering. New agents are registered as the roster needs them.",
  },
  {
    title: "Content identity warehouse",
    body: "A hybrid store: structured data for deterministic relationships, vector embeddings for semantic understanding. It is the swarm's shared memory, not a passive file dump.",
  },
  {
    title: "Orchestration framework",
    body: "Drives workflow patterns from the swarm's shared view of production state, rather than rigid, pre-programmed pipelines that break when the brief changes.",
  },
]

const PATTERNS = [
  ["Linear pipeline", "Agents process sequentially for straightforward content."],
  ["Parallel processing", "Independent elements are generated simultaneously."],
  ["Iterative refinement", "Agents cycle generation and validation to reach quality."],
  ["Human-in-the-loop", "Expert oversight is interleaved at strategic decisions."],
]

export default function Platform() {
  return (
    <>
      <PageHero
        eyebrow="Platform"
        title="How the swarm works."
        lede="Fablet replaces manual orchestration with a coordinated swarm of specialized agents that share one understanding of the content being created."
      />

      <Steps />

      <Section>
        <SectionHeading
          eyebrow="Architecture"
          title="Three load-bearing parts."
          lede="Deliberately decoupled, so each can evolve independently as models improve."
        />
        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          {ARCHITECTURE.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08}>
              <div className="border-t border-line pt-6">
                <span className="font-mono text-[0.7rem] tabular text-accent-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display mt-4 text-step-2 text-ink-950">{a.title}</h3>
                <p className="mt-4 leading-relaxed text-ink-600">{a.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <SectionHeading eyebrow="Agent catalog" title="Twenty-four roles, and counting." />
          <div>
            <Prose>
              <p>
                A non-exhaustive catalog of agent roles the swarm can instantiate. Each
                is a fine-tuned model with a defined input and output contract, and the
                roster is not fixed: missing capabilities become new agent types.
              </p>
            </Prose>
            <ul className="mt-10 grid grid-cols-2 gap-x-8 gap-y-3 border-t border-line pt-6 sm:grid-cols-3">
              {AGENT_ROLES.map((r) => (
                <li key={r} className="flex items-baseline gap-2 text-step--1 text-ink-700">
                  <span className="block h-[4px] w-[4px] shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Orchestration" title="Patterns chosen by the work, not the tooling." />
        <dl className="mt-16">
          {PATTERNS.map(([name, body], i) => (
            <Reveal key={name} delay={i * 0.05}>
              <div className="grid gap-2 border-t border-line py-7 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] lg:gap-16">
                <dt className="display text-step-2 text-ink-950">{name}</dt>
                <dd className="max-w-[60ch] leading-relaxed text-ink-600">{body}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </Section>

      <Section>
        <Container className="px-0">
          <Reveal>
            <div className="border border-line bg-paper-2 p-10 sm:p-14">
              <p className="eyebrow">Model-agnostic</p>
              <h2 className="display mt-5 max-w-[20ch] text-step-3 text-ink-950">
                Swap the models. Keep the understanding.
              </h2>
              <p className="mt-5 max-w-[58ch] leading-relaxed text-ink-600">
                Fablet defines interfaces and data formats rather than depending on any
                single provider. The warehouse persists the swarm's collective knowledge
                across model replacements, so better foundations make the whole system
                better without a rewrite.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  )
}
