import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "../../lib/gsap"
import { NotePencil, TreeStructure, Stack, Database, ShieldCheck, Lightning } from "@phosphor-icons/react"
import { Container } from "../layout"
import SplitHeading from "../SplitHeading"

const ITEMS = [
  { icon: NotePencil, title: "One brief", body: "A sentence is a complete input. No specs, diagrams, or tickets." },
  { icon: TreeStructure, title: "Sequenced plan", body: "The orchestrator decomposes the goal and assigns the specialists it needs." },
  { icon: Stack, title: "Parallel build", body: "Independent work streams run at once, against one shared understanding." },
  { icon: Database, title: "Shared memory", body: "A hybrid store of structured edges and embeddings holds the whole production." },
  { icon: ShieldCheck, title: "Semantic QA", body: "Outputs are validated against intent, not just syntax, then corrected." },
  { icon: Lightning, title: "Runs itself", body: "Fablet monitors, improves, and sustains what it built, run after run." },
]

export default function Capabilities() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray("[data-cap]", root.current)
        const tweens = cards.map((el, i) =>
          gsap.from(el, {
            autoAlpha: 0,
            x: i % 2 === 0 ? -90 : 90,
            y: 40,
            rotate: i % 2 === 0 ? -5 : 5,
            duration: 1,
            ease: "power3.out",
            delay: (i % 3) * 0.07,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          })
        )
        return () => tweens.forEach((t) => t.kill())
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} data-bg="#f9f7f3" className="border-t border-line py-20 sm:py-28">
      <Container>
        <p className="eyebrow">Capabilities</p>
        <SplitHeading as="h2" className="mt-5 max-w-[20ch] text-step-4 text-ink-950 display">
          Everything between a sentence and a shipped thing.
        </SplitHeading>

        <ul className="mt-16 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map(({ icon: Icon, title, body }) => (
            <li key={title} data-cap className="group bg-paper p-8 transition-colors duration-300 hover:bg-paper-2">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent-ink transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
                <Icon size={22} weight="regular" aria-hidden="true" />
              </span>
              <h3 className="display mt-6 text-step-2 text-ink-950">{title}</h3>
              <p className="mt-3 max-w-[34ch] leading-relaxed text-ink-600">{body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
