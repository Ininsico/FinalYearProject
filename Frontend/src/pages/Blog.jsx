import { useNavigate, Link } from "react-router-dom"
import { ArrowUpRight } from "@phosphor-icons/react"
import { PageHero, Section } from "../components/layout"
import Reveal from "../components/Reveal"

const NOTES = [
  {
    tag: "Orchestration",
    title: "The bottleneck was never the models",
    excerpt: "Why adopting generative AI today shifts labour from crafting to orchestrating, and what Fablet does about it.",
  },
  {
    tag: "Data",
    title: "The content identity warehouse",
    excerpt: "Structured edges for deterministic relationships, vector embeddings for meaning. Why the hybrid store is the point.",
  },
  {
    tag: "Agents",
    title: "Agents are not a fixed set",
    excerpt: "The roster is instantiated per production, and new agent types are fine-tuned when a capability is missing.",
  },
  {
    tag: "Design",
    title: "Model-agnostic by design",
    excerpt: "Interfaces and data formats survive model churn, so better foundations improve the system without a rewrite.",
  },
]

export default function Blog() {
  const navigate = useNavigate()
  return (
    <>
      <PageHero
        eyebrow="Notes"
        title="Field notes from the swarm."
        lede="Short pieces on the architecture, the decisions behind it, and what we are learning as we build."
      />

      <Section>
        <ul>
          {NOTES.map((n, i) => (
            <li key={n.title} className="border-b border-line first:border-t">
              <Reveal delay={i * 0.05}>
                <button
                  onClick={() => navigate("/research")}
                  className="group grid w-full gap-3 py-8 text-left lg:grid-cols-[160px_minmax(0,1fr)_auto] lg:items-baseline lg:gap-12"
                >
                  <span className="eyebrow">{n.tag}</span>
                  <span>
                    <span className="display block text-step-2 text-ink-950 transition-colors group-hover:text-accent-ink">
                      {n.title}
                    </span>
                    <span className="mt-3 block max-w-[56ch] leading-relaxed text-ink-600">{n.excerpt}</span>
                  </span>
                  <ArrowUpRight
                    size={22}
                    weight="bold"
                    aria-hidden="true"
                    className="hidden text-ink-400 transition-colors group-hover:text-accent-ink lg:block"
                  />
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-[46ch] text-step-0 leading-relaxed text-ink-600">
            Want the full picture rather than the notes? The complete architecture write-up
            is public.
          </p>
          <Link to="/research" className="btn btn-primary">
            Read the architecture
          </Link>
        </div>
      </Section>
    </>
  )
}
