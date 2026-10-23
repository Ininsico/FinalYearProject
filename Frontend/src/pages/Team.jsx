import { useNavigate } from "react-router-dom"
import { ArrowRight } from "@phosphor-icons/react"
import { PageHero, Section } from "../components/layout"
import Reveal from "../components/Reveal"
import { TEAM } from "../lib/content"

export default function Team() {
  const navigate = useNavigate()
  return (
    <>
      <PageHero
        eyebrow="Team"
        title="Built by three people. Run by agents."
        lede="Fablet is the final year project of the COMSATS Abbottabad team behind it."
      />

      <Section>
        <ul className="grid gap-12 sm:grid-cols-3">
          {TEAM.map((m, i) => (
            <li key={m.name}>
              <Reveal delay={i * 0.08}>
                {m.image ? (
                  <img
                    src={m.image}
                    alt=""
                    width="120"
                    height="120"
                    loading="lazy"
                    decoding="async"
                    className="h-[120px] w-[120px] rounded-[3px] object-cover grayscale"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex h-[120px] w-[120px] items-center justify-center rounded-[3px] bg-accent-soft"
                  >
                    <span className="display text-step-4 text-accent-ink">{m.name.slice(0, 1)}</span>
                  </span>
                )}
                <p className="display mt-6 text-step-2 text-ink-950">{m.name}</p>
                <p className="mt-1 eyebrow">{m.role}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="flex flex-wrap items-center justify-between gap-8 border border-line bg-paper-2 p-10 sm:p-14">
          <h2 className="display max-w-[20ch] text-step-3 text-ink-950">
            We are hiring builders who care about systems.
          </h2>
          <button onClick={() => navigate("/careers")} className="btn btn-primary">
            See open roles
            <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </Section>
    </>
  )
}
