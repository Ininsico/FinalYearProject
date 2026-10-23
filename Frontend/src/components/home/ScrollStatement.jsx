import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, SplitText } from "../../lib/gsap"
import { Container } from "../layout"

export default function ScrollStatement() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const target = root.current.querySelector("[data-words]")
        const split = new SplitText(target, { type: "words" })
        gsap.set(split.words, { opacity: 0.14 })
        const tw = gsap.to(split.words, {
          opacity: 1,
          ease: "none",
          stagger: 0.4,
          scrollTrigger: {
            trigger: root.current,
            start: "top 72%",
            end: "bottom 68%",
            scrub: 0.6,
          },
        })
        return () => {
          tw.kill()
          split.revert()
        }
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} data-bg="#f9f7f3" className="border-t border-line py-28 sm:py-40">
      <Container>
        <p className="eyebrow">The idea</p>
        <p data-words className="display mt-8 max-w-[26ch] text-step-4 text-ink-950">
          A brief is not a prompt. It is an outcome, and the swarm is the machine that
          turns one into the other.
        </p>
      </Container>
    </section>
  )
}
