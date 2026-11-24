import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "../../lib/gsap"
import { STATS } from "../../lib/content"
import { Container } from "../layout"
import Reveal from "../Reveal"

export default function Stats() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const els = gsap.utils.toArray("[data-count]")
        const tweens = els.map((el) => {
          const end = Number(el.dataset.count)
          const obj = { v: 0 }
          return gsap.to(obj, {
            v: end,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            onUpdate: () => { el.textContent = String(Math.round(obj.v)) },
          })
        })
        return () => tweens.forEach((t) => t.kill())
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} data-bg="#f4f1eb" className="border-t border-line py-14 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="display max-w-[18ch] text-step-2 text-ink-950">
            The catalogue, in numbers.
          </h2>
        </Reveal>
        <dl className="mt-10 grid gap-8 sm:grid-cols-3">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="border-t border-line pt-6">
                <dd className="display text-step-4 leading-none tabular text-ink-950">
                  <span data-count={s.value}>0</span>
                  {s.suffix}
                </dd>
                <dt className="mt-4 max-w-[28ch] text-step--1 text-ink-600">{s.label}</dt>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  )
}
