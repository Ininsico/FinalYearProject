import { PageHero, Section, SectionHeading, Prose } from "../components/layout"
import Reveal from "../components/Reveal"

const INDEX = [
  ["Getting started", "Install the frontend and server, run migrations, and create your first production."],
  ["CLI reference", "Create productions, query the warehouse, manage agents, and run benchmarks."],
  ["API reference", "REST endpoints for productions, warehouse entities, agents, and feedback."],
  ["Warehouse schema", "Entities, relationships, generations, productions, and genre templates."],
]

const CODE = `# Brief the swarm
fablet swarm create --brief "A 3-minute explainer on photosynthesis" --genre educational

# Inspect the warehouse
fablet warehouse query --kind character
fablet warehouse search --text "hopeful scene"`

export default function Docs() {
  return (
    <>
      <PageHero
        eyebrow="Documentation"
        title="Build on Fablet."
        lede="Everything you need to run a production, query the warehouse, and extend the swarm with your own agents."
      />

      <Section>
        <div className="grid gap-10 sm:grid-cols-2">
          {INDEX.map(([h, b], i) => (
            <Reveal key={h} delay={i * 0.06}>
              <div className="border-t border-line pt-6">
                <h2 className="display text-step-2 text-ink-950">{h}</h2>
                <p className="mt-3 max-w-[46ch] leading-relaxed text-ink-600">{b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <SectionHeading eyebrow="Quickstart" title="From install to first run." />
          <div>
            <Prose>
              <p>
                Fablet runs on a modest workstation or standard cloud infrastructure:
                PostgreSQL with pgvector for the warehouse, Node for the server, and a
                static build for the frontend.
              </p>
            </Prose>
            <Reveal>
              <pre className="mt-8 overflow-x-auto border border-line bg-paper-2 p-6 font-mono text-[0.78rem] leading-relaxed text-ink-800">
                <code>{CODE}</code>
              </pre>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  )
}
