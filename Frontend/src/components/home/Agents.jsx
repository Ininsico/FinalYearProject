import { AGENT_ROLES } from "../../lib/content"
import Marquee from "../Marquee"
import { Container } from "../layout"
import Reveal from "../Reveal"
import SplitHeading from "../SplitHeading"

export default function Agents() {
  return (
    <section data-bg="#ede9e0" className="border-t border-line py-20 sm:py-28">
      <Container>
        <p className="eyebrow">The swarm</p>
        <SplitHeading as="h2" className="mt-5 max-w-[20ch] text-step-4 text-ink-950 display">
          Not a fixed set of agents. A roster that grows with the brief.
        </SplitHeading>
      </Container>

      <div className="mt-14 border-y border-line py-6">
        <Marquee
          items={AGENT_ROLES}
          speed={80}
          itemClassName="mx-7 display text-step-2 text-ink-700"
        />
        <ul className="sr-only">
          {AGENT_ROLES.map((r) => (
            <li key={r}>{r} agent</li>
          ))}
        </ul>
      </div>

      <Container className="mt-10">
        <Reveal>
          <p className="max-w-[54ch] text-step-0 leading-relaxed text-ink-600">
            Agents are instantiated per production. When the roster lacks a capability,
            a new agent type is fine-tuned from a foundation model and registered, with
            no change to the orchestration core.
          </p>
        </Reveal>
      </Container>
    </section>
  )
}
