import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "../../lib/gsap"
import {
  Robot, Brain, PaintBrush, FilmStrip, Waveform, Microphone,
  Translate, MagnifyingGlass, ChartLine, Sparkle, Cube, Broadcast,
} from "@phosphor-icons/react"
import { Container } from "../layout"

const ICONS = [Robot, Brain, PaintBrush, FilmStrip, Waveform, Microphone, Translate, MagnifyingGlass, ChartLine, Sparkle, Cube, Broadcast]

export default function IconBand() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const nodes = gsap.utils.toArray("[data-fly]", root.current)
        const tweens = nodes.map((el, i) => {
          const dir = i % 2 === 0 ? -1 : 1
          return gsap.from(el, {
            x: dir * (260 + (i % 4) * 70),
            y: i % 3 === 0 ? -40 : 40,
            rotate: dir * 40,
            autoAlpha: 0,
            duration: 1.2,
            ease: "power3.out",
            delay: (i % 6) * 0.05,
            scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
          })
        })
        return () => tweens.forEach((t) => t.kill())
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} data-bg="#f9f7f3" className="border-t border-line py-20 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <p className="eyebrow">The roster</p>
          <p className="max-w-[38ch] text-step--1 text-ink-500">
            Specialists across language, vision, audio, and validation, coordinated
            through one shared memory.
          </p>
        </div>

        <ul className="mt-14 flex flex-wrap items-center justify-center gap-4 sm:gap-6" aria-label="Agent specialisms">
          {ICONS.map((Icon, i) => (
            <li
              key={i}
              data-fly
              className="flex h-16 w-16 items-center justify-center rounded-full border border-line bg-paper-2 text-ink-800 transition-all duration-300 hover:-translate-y-1 hover:border-accent-ink hover:text-accent-ink sm:h-20 sm:w-20"
            >
              <Icon size={26} weight="regular" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
