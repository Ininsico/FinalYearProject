import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "../lib/gsap"

export default function ScrollProgress() {
  const bar = useRef(null)

  useGSAP(() => {
    const el = bar.current
    if (!el) return
    gsap.set(el, { scaleX: 0, transformOrigin: "0% 50%" })
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => gsap.set(el, { scaleX: self.progress }),
    })
    return () => st.kill()
  })

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[var(--z-overlay)] h-[2px] bg-transparent"
    >
      <div ref={bar} className="h-full w-full bg-accent-ink" />
    </div>
  )
}
