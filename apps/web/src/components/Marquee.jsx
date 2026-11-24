import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "../lib/gsap"

export default function Marquee({ items, speed = 70, className = "", itemClassName = "" }) {
  const wrap = useRef(null)

  useGSAP(
    () => {
      const track = wrap.current?.querySelector("[data-marquee-track]")
      if (!track) return
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const half = track.scrollWidth / 2
        const tween = gsap.to(track, { x: -half, duration: half / speed, ease: "none", repeat: -1 })
        return () => tween.kill()
      })
    },
    { scope: wrap }
  )

  return (
    <div ref={wrap} className={`overflow-hidden ${className}`} aria-hidden="true">
      <div data-marquee-track className="flex w-max">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {items.map((it, i) => (
              <span key={`${k}-${i}`} className={itemClassName}>
                {it}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
