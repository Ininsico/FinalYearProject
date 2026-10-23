import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "../../lib/gsap"

export default function ParallaxBand() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true }
        const w = gsap.to("[data-parallax-word]", { yPercent: -32, ease: "none", scrollTrigger: st })
        const l = gsap.to("[data-parallax-line]", { yPercent: 22, ease: "none", scrollTrigger: st })
        return () => {
          w.kill()
          l.kill()
        }
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} data-bg="#f9f7f3" className="relative overflow-hidden border-t border-line py-32 sm:py-44">
      <span
        data-parallax-word
        aria-hidden="true"
        className="display pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[22vw] leading-none text-ink-950/[0.04]"
      >
        orchestrate
      </span>
      <div className="relative mx-auto max-w-[1240px] px-6 sm:px-8">
        <p data-parallax-line className="display mx-auto max-w-[22ch] text-center text-step-3 text-ink-950">
          Stop assembling tools. Start directing a swarm.
        </p>
      </div>
    </section>
  )
}
