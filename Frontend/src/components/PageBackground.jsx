import { useRef } from "react"
import { useLocation } from "react-router-dom"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "../lib/gsap"

// A fixed layer behind the page whose colour cross-fades as each section with a
// `data-bg` attribute passes the middle of the viewport.
export default function PageBackground() {
  const { pathname } = useLocation()
  const layer = useRef(null)

  useGSAP(
    () => {
      const el = layer.current
      if (!el) return
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { backgroundColor: "#f9f7f3" })
      })

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const sections = gsap.utils.toArray("[data-bg]")
        if (!sections.length) {
          gsap.set(el, { backgroundColor: "#f9f7f3" })
          return
        }
        gsap.set(el, { backgroundColor: sections[0].dataset.bg })

        const triggers = sections.map((section) => {
          const color = section.dataset.bg
          const go = () => gsap.to(el, { backgroundColor: color, duration: 0.8, ease: "power2.out" })
          return ScrollTrigger.create({
            trigger: section,
            start: "top 62%",
            end: "bottom 62%",
            onEnter: go,
            onEnterBack: go,
          })
        })
        return () => triggers.forEach((t) => t.kill())
      })
    },
    { scope: layer, dependencies: [pathname], revertOnUpdate: true }
  )

  return <div ref={layer} aria-hidden="true" className="fixed inset-0 -z-10 bg-paper" />
}
