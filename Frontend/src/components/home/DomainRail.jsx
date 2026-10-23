import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "../../lib/gsap"
import { DOMAINS } from "../../lib/content"
import { Container } from "../layout"
import SplitHeading from "../SplitHeading"

export default function DomainRail() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
        const track = root.current.querySelector("[data-rail]")
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 64)
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        return () => tween.kill()
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} data-bg="#f1ecf9" className="border-t border-line lg:h-screen lg:overflow-hidden">
      <div className="lg:flex lg:h-full lg:flex-col lg:justify-center lg:pt-28 lg:pb-16">
        <Container className="pt-20 sm:pt-28 lg:pt-0">
          <p className="eyebrow">Domains</p>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <SplitHeading as="h2" className="max-w-[18ch] text-step-4 text-ink-950 display">
              One foundation. Every surface.
            </SplitHeading>
            <p className="max-w-[34ch] text-step--1 text-ink-500">
              The same agent swarm, re-tuned per domain through the warehouse. No
              re-engineering when the brief changes.
            </p>
          </div>
        </Container>

        <div className="mt-12 overflow-x-auto pb-4 lg:overflow-visible lg:pb-0 [scrollbar-width:none]">
          <div data-rail className="flex w-max gap-6 px-6 sm:px-8 lg:pl-[max(1.5rem,calc((100vw-1240px)/2+2rem))]">
            {DOMAINS.map((d, i) => (
              <article
                key={d.key}
                className="flex w-[84vw] shrink-0 flex-col justify-between border border-line bg-paper-2 p-8 sm:w-[420px] lg:w-[460px] lg:p-10"
              >
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[0.7rem] tabular text-accent-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="eyebrow">{d.tag}</span>
                  </div>
                  <h3 className="display mt-8 text-step-3 text-ink-950">{d.name}</h3>
                  <p className="mt-5 max-w-[42ch] leading-relaxed text-ink-600">{d.body}</p>
                </div>
                <ul className="mt-10 space-y-3 border-t border-line pt-6">
                  {d.points.map((p) => (
                    <li key={p} className="flex items-baseline gap-3 text-step--1 text-ink-700">
                      <span className="mt-[6px] block h-[5px] w-[5px] shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
