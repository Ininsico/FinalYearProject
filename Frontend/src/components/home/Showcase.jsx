import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "../../lib/gsap"
import { Container } from "../layout"

const PANELS = [
  {
    kicker: "01 — Brief",
    title: "You describe the outcome.",
    body: "Plain language in. The swarm reads intent, not a specification, and treats one sentence as a complete brief.",
    points: ["Natural language input", "No-code by default", "Any domain"],
  },
  {
    kicker: "02 — Build",
    title: "The swarm plans and builds.",
    body: "The orchestrator sequences the work and instantiates specialists that reason against a shared warehouse of content.",
    points: ["Decomposed plan", "Parallel agents", "Shared memory"],
  },
  {
    kicker: "03 — Operate",
    title: "It runs, and keeps improving.",
    body: "Fablet validates and refines what it built, then sustains it. Every run feeds the warehouse, so the next is better.",
    points: ["Semantic QA", "Iterative refinement", "Sustained operation"],
  },
]

export default function Showcase() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
        const panels = gsap.utils.toArray("[data-panel]", root.current)
        gsap.set(panels.slice(1), { yPercent: 60, autoAlpha: 0 })
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 2.6}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        panels.forEach((p, i) => {
          if (i === 0) return
          tl.to(panels[i - 1], { yPercent: -45, autoAlpha: 0, ease: "power2.in", duration: 1 }, i - 1)
            .to(p, { yPercent: 0, autoAlpha: 1, ease: "power2.out", duration: 1 }, i - 1)
        })
        return () => tl.kill()
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} data-bg="#f4f1eb" className="border-t border-line lg:h-screen lg:overflow-hidden">
      <div className="lg:flex lg:h-full lg:flex-col lg:justify-center lg:pt-28 lg:pb-12">
        <Container className="pt-20 sm:pt-28 lg:pt-0">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <p className="eyebrow">The run</p>
            <p className="max-w-[34ch] text-step--1 text-ink-500">
              Three movements, one production. Scroll to advance.
            </p>
          </div>

          <div className="relative mt-12 lg:h-[440px]">
            {PANELS.map((p) => (
              <article
                key={p.kicker}
                data-panel
                className="border-t border-line pt-10 lg:absolute lg:inset-0"
              >
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
                  <div>
                    <p className="eyebrow text-accent-ink">{p.kicker}</p>
                    <h3 className="display mt-5 max-w-[16ch] text-step-4 text-ink-950">{p.title}</h3>
                  </div>
                  <div>
                    <p className="max-w-[52ch] text-step-1 leading-[1.6] text-ink-600">{p.body}</p>
                    <ul className="mt-8 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
                      {p.points.map((pt) => (
                        <li key={pt} className="bg-paper px-4 py-4 text-step--1 text-ink-700">{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </div>
    </section>
  )
}
