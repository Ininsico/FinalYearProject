import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "../../lib/gsap"
import { STEPS } from "../../lib/content"
import { Container } from "../layout"
import SplitHeading from "../SplitHeading"

export default function Steps() {
  const root = useRef(null)
  const [active, setActive] = useState(0)
  const last = useRef(-1)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const i = Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length))
            if (i !== last.current) {
              last.current = i
              setActive(i)
            }
          },
        })
        return () => st.kill()
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} data-bg="#ede9e0" className="relative border-t border-line lg:h-[320vh]">
      <div className="lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:items-center lg:pt-28 lg:pb-20">
        <Container className="py-20 sm:py-28 lg:py-0">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <div>
              <p className="eyebrow">How it works</p>
              <SplitHeading
                as="h2"
                className="mt-5 max-w-[14ch] text-step-4 text-ink-950 display"
              >
                From one sentence to a running system.
              </SplitHeading>

              <ol className="mt-12 hidden lg:block">
                {STEPS.map((s, i) => (
                  <li
                    aria-hidden="true"
                    className={`flex items-baseline gap-5 border-t border-line py-4 transition-colors duration-300 ${
                      i === active ? "text-ink-950" : "text-ink-400"
                    }`}
                  >
                    <span className="font-mono text-[0.7rem] tabular">{s.n}</span>
                    <span className="display text-step-2">{s.title}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Desktop: pinned, cross-fading detail */}
            <div className="hidden lg:block">
              <div className="relative min-h-[280px]">
                {STEPS.map((s, i) => (
                  <div
                    key={s.n}
                    className={`absolute inset-0 transition-all duration-500 ease-out ${
                      i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
                    }`}
                    aria-hidden={i !== active}
                  >
                    <p className="display text-step-5 leading-none text-accent-ink">{s.n}</p>
                    <h3 className="display mt-6 text-step-3 text-ink-950">{s.title}</h3>
                    <p className="mt-5 max-w-[44ch] text-step-1 leading-[1.6] text-ink-600">{s.body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex gap-2" aria-hidden="true">
                {STEPS.map((s, i) => (
                  <span
                    key={s.n}
                    className={`h-[2px] flex-1 transition-colors duration-500 ${
                      i <= active ? "bg-accent-ink" : "bg-line-2"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Mobile: simple stacked list */}
            <ol className="lg:hidden">
              {STEPS.map((s) => (
                <li key={s.n} className="border-t border-line py-6">
                  <span className="font-mono text-[0.7rem] tabular text-accent-ink">{s.n}</span>
                  <h3 className="display mt-3 text-step-3 text-ink-950">{s.title}</h3>
                  <p className="mt-3 max-w-[52ch] leading-relaxed text-ink-600">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </div>
    </section>
  )
}
