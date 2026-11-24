import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "../../lib/gsap"
import { Container } from "../layout"
import SplitHeading from "../SplitHeading"

const STEPS = [
  {
    n: "01",
    title: "Choose your course",
    body: "The catalogue opens with mathematics, physics, computer science, business and design. Filter by subject and level, with premium modules clearly marked.",
  },
  {
    n: "02",
    title: "Learn in short lessons",
    body: "Video, reading and worked examples, foundations first, each sized to finish in one sitting rather than one semester.",
  },
  {
    n: "03",
    title: "Practise, then prove it",
    body: "Hands-on exercises with sample solutions, closed by a module quiz that covers the whole ground, not just the last page.",
  },
  {
    n: "04",
    title: "Grow on your plan",
    body: "Start free with the whole free catalogue. Student Pro unlocks premium modules and the AI video agent, and institutions bring their members on seat plans.",
  },
]

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
    <section ref={root} data-bg="#ede9e0" className="relative border-t border-line lg:h-[240vh]">
      <div className="lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:items-center lg:pt-24 lg:pb-16">
        <Container className="py-14 sm:py-20 lg:py-0">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            <div>
              <p className="font-mono text-[0.7rem] tabular text-ink-400">02</p>
              <SplitHeading
                as="h2"
                className="mt-5 max-w-[14ch] text-step-3 text-ink-950 display"
              >
                How the academy works.
              </SplitHeading>

              <ol className="mt-10 hidden lg:block">
                {STEPS.map((s, i) => (
                  <li
                    aria-hidden="true"
                    className={`flex items-baseline gap-5 border-t border-line py-4 transition-colors duration-300 ${
                      i === active ? "text-ink-950" : "text-ink-400"
                    }`}
                  >
                    <span className="font-mono text-[0.7rem] tabular">{s.n}</span>
                    <span className="display text-step-1">{s.title}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Desktop: pinned, cross-fading detail */}
            <div className="hidden lg:block">
              <div className="relative min-h-[240px]">
                {STEPS.map((s, i) => (
                  <div
                    key={s.n}
                    className={`absolute inset-0 transition-all duration-500 ease-out ${
                      i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
                    }`}
                    aria-hidden={i !== active}
                  >
                    <p className="display text-step-4 leading-none text-ink-400">{s.n}</p>
                    <h3 className="display mt-5 text-step-2 text-ink-950">{s.title}</h3>
                    <p className="mt-4 max-w-[46ch] text-step-0 leading-[1.7] text-ink-600">{s.body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-2" aria-hidden="true">
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
                  <span className="font-mono text-[0.7rem] tabular text-ink-400">{s.n}</span>
                  <h3 className="display mt-3 text-step-2 text-ink-950">{s.title}</h3>
                  <p className="mt-2 max-w-[52ch] leading-relaxed text-ink-600">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </div>
    </section>
  )
}
