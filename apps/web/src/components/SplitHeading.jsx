import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, SplitText } from "../lib/gsap"

export default function SplitHeading({
  children,
  className = "",
  as: Tag = "h1",
  delay = 0,
  start = "top 82%",
  immediate = false,
}) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { visibility: "visible" })
        gsap.fromTo(
          el,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.6,
            delay,
            ease: "power1.out",
            scrollTrigger: immediate ? undefined : { trigger: el, start, once: true },
          }
        )
      })

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let split
        let cancelled = false
        const run = () => {
          if (cancelled || !el.isConnected) return
          split = new SplitText(el, { type: "lines", mask: "lines" })
          gsap.set(el, { visibility: "visible" })
          gsap.from(split.lines, {
            yPercent: 115,
            opacity: 0,
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.08,
            delay,
            scrollTrigger: immediate ? undefined : { trigger: el, start, once: true },
          })
        }
        // Split only once the webfonts are in, otherwise the line masks are
        // measured against fallback metrics and clip the swapped-in glyphs.
        if (document.fonts?.ready) {
          document.fonts.ready.then(run)
        } else {
          run()
        }
        return () => {
          cancelled = true
          split?.revert()
        }
      })
    },
    { scope: ref }
  )

  return (
    <Tag ref={ref} className={className} style={{ visibility: "hidden" }}>
      {children}
    </Tag>
  )
}
