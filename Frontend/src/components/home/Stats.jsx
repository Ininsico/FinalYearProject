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
    <section ref={root} data-bg="#f1ecf9" className="border-t border-line py-20 sm:py-28">
      <Container>
        <Reveal>
          <p className="eyebrow">By the numbers</p>
        </Reveal>
        <dl className="mt-12 grid gap-10 sm:grid-cols-3">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="border-t border-line pt-6">
                <dd className="display text-step-5 leading-none tabular text-ink-950">
                  <span data-count={s.value}>0</span>
                  {s.suffix}
                </dd>
                <dt className="mt-4 max-w-[26ch] text-step--1 text-ink-600">{s.label}</dt>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  )
}
