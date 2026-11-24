import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "../lib/gsap"

export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
  y = 26,
  delay = 0,
  start = "top 88%",
}) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.fromTo(
          el,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.5,
            delay,
            ease: "power1.out",
            scrollTrigger: { trigger: el, start, once: true },
          }
        )
      })
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            delay,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start, once: true },
          }
        )
      })
    },
    { scope: ref }
  )

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
