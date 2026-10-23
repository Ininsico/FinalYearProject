import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useGSAP } from "@gsap/react"
import { ArrowRight, ArrowDown } from "@phosphor-icons/react"
import { gsap } from "../../lib/gsap"
import { Container } from "../layout"
import SplitHeading from "../SplitHeading"

const META = ["24 agent roles", "Model-agnostic", "4 content domains", "No-code by default"]

export default function Hero() {
  const navigate = useNavigate()
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Entrance
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const meta = gsap.from("[data-hero-meta]", {
          autoAlpha: 0,
          y: 16,
          duration: 0.9,
          delay: 0.5,
          stagger: 0.08,
        })
        const cue = gsap.to("[data-hero-cue]", { y: 8, duration: 1.1, repeat: -1, yoyo: true, ease: "sine.inOut" })
        return () => {
          meta.kill()
          cue.kill()
        }
      })

      // Scroll-driven: backdrop parallax + content fly-out
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const scope = { trigger: root.current }
        const bg = gsap.to("[data-hero-bg]", {
          yPercent: 42,
          ease: "none",
          scrollTrigger: { ...scope, start: "top top", end: "bottom top", scrub: true },
        })
        const content = gsap.to("[data-hero-content]", {
          yPercent: -18,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { ...scope, start: "top top", end: "bottom 45%", scrub: true },
        })
        return () => {
          bg.kill()
          content.kill()
        }
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} data-bg="#f9f7f3" className="relative overflow-hidden pt-40 pb-16 sm:pt-52">
      <span
        data-hero-bg
        aria-hidden="true"
        className="display pointer-events-none absolute -right-[4vw] top-16 select-none whitespace-nowrap text-[32vw] leading-none text-ink-950/[0.035]"
      >
        swarm
      </span>

      <Container>
        <div data-hero-content className="relative">
          <p className="eyebrow">Agentic AI orchestration</p>

          <SplitHeading
            as="h1"
            immediate
            delay={0.08}
            className="mt-8 max-w-[15ch] text-step-6 text-ink-950 display"
          >
            Tell it what to make.
            <br />
            <em className="text-accent-ink">The swarm builds it.</em>
          </SplitHeading>

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
            <p data-hero-meta className="max-w-[52ch] text-step-1 leading-[1.5] text-ink-600">
              Fablet is a self-orchestrating network of AI agents. Brief it in plain
              language and it plans, builds, runs, and refines the result, so you ship
              without an engineering team.
            </p>

            <div data-hero-meta className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:justify-end">
              <button onClick={() => navigate("/signup")} className="btn btn-accent">
                Get started
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </button>
              <button onClick={() => navigate("/platform")} className="link-underline text-step--1">
                See how it works
              </button>
            </div>
          </div>

          <div data-hero-meta className="mt-16 flex items-center justify-between border-t border-line pt-6">
            <ul className="flex flex-wrap gap-x-8 gap-y-2">
              {META.map((m) => (
                <li key={m} className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-500">
                  {m}
                </li>
              ))}
            </ul>
            <span data-hero-cue className="hidden text-ink-400 lg:block" aria-hidden="true">
              <ArrowDown size={18} weight="bold" />
            </span>
          </div>
        </div>
      </Container>
    </section>
  )
}
