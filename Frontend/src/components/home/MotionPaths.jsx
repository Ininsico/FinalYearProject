import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "../../lib/gsap"
import {
  Brain, PaintBrush, FilmStrip, Waveform, Microphone, Translate,
  MagnifyingGlass, ChartLine, Sparkle, Cube, Broadcast, Robot,
  TreeStructure, ShieldCheck,
} from "@phosphor-icons/react"
import { Container } from "../layout"

// Each node rides its own arc segment, so the swarm never moves in lockstep.
const NODES = [
  { icon: Brain, path: "mp-a", start: 0, end: 1, scale: 1.7 },
  { icon: PaintBrush, path: "mp-b", start: 0.18, end: 1, scale: 1.3 },
  { icon: FilmStrip, path: "mp-c", start: 0, end: 0.86, scale: 1.55 },
  { icon: Waveform, path: "mp-d", start: 0.12, end: 1, scale: 1.35 },
  { icon: Microphone, path: "mp-a", start: 0.3, end: 1, scale: 1.45 },
  { icon: Translate, path: "mp-c", start: 0.22, end: 1, scale: 1.25 },
  { icon: MagnifyingGlass, path: "mp-b", start: 0, end: 0.78, scale: 1.6 },
  { icon: ChartLine, path: "mp-d", start: 0, end: 0.9, scale: 1.3 },
  { icon: Sparkle, path: "mp-a", start: 0.05, end: 0.72, scale: 1.5 },
  { icon: Cube, path: "mp-c", start: 0.34, end: 1, scale: 1.4 },
  { icon: Broadcast, path: "mp-b", start: 0.08, end: 0.94, scale: 1.3 },
  { icon: Robot, path: "mp-d", start: 0.26, end: 1, scale: 1.65 },
  { icon: TreeStructure, path: "mp-a", start: 0.4, end: 1, scale: 1.28 },
  { icon: ShieldCheck, path: "mp-b", start: 0.3, end: 1, scale: 1.45 },
]

export default function MotionPaths() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const nodes = gsap.utils.toArray("[data-node]", root.current)
        const tweens = []

        nodes.forEach((el, i) => {
          const cfg = NODES[i]
          const path = `#${cfg.path}`
          const scrub = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 }

          // Travel a segment of the path, auto-rotating to the tangent.
          tweens.push(
            gsap.to(el, {
              motionPath: {
                path,
                align: path,
                alignOrigin: [0.5, 0.5],
                autoRotate: true,
                start: cfg.start,
                end: cfg.end,
              },
              ease: "none",
              scrollTrigger: scrub,
            })
          )

          // Entrance: fly in small and fade up, then zoom in hard…
          tweens.push(
            gsap.fromTo(
              el,
              { scale: 0.3, autoAlpha: 0 },
              {
                scale: cfg.scale,
                autoAlpha: 1,
                ease: "power2.inOut",
                scrollTrigger: { ...scrub, start: "top bottom", end: "center center" },
              }
            )
          )
          // …then zoom back out and fade as it leaves.
          tweens.push(
            gsap.to(el, {
              scale: 0.35,
              autoAlpha: 0,
              ease: "power2.inOut",
              scrollTrigger: { ...scrub, start: "center center", end: "bottom top" },
            })
          )

          // Third axis: a turn in 3D space.
          tweens.push(
            gsap.fromTo(
              el,
              { rotateY: -80, rotateX: 30 },
              { rotateY: 80, rotateX: -30, ease: "sine.inOut", scrollTrigger: scrub }
            )
          )
        })

        return () => tweens.forEach((t) => t.kill())
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} data-bg="#f4f1eb" className="relative overflow-hidden border-t border-line py-24 sm:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">In motion</p>
            <h2 className="display mt-5 max-w-[20ch] text-step-4 text-ink-950">
              Agents on their run, from brief to output.
            </h2>
          </div>
          <p className="max-w-[36ch] text-step--1 text-ink-500">
            Every specialist travels its own path through the production, coordinated
            through one shared warehouse.
          </p>
        </div>
      </Container>

      <div className="relative mx-auto mt-10 h-[420px] w-full max-w-[1240px] px-6 sm:h-[520px] sm:px-8" style={{ perspective: "900px" }}>
        <svg
          viewBox="0 0 1200 520"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <path id="mp-a" d="M -80 420 C 260 420 300 80 600 80 C 900 80 960 420 1280 420" fill="none" stroke="var(--color-line-2)" strokeWidth="1" strokeDasharray="3 7" />
          <path id="mp-b" d="M -80 110 C 240 110 360 440 620 440 C 880 440 950 100 1280 100" fill="none" stroke="var(--color-line-2)" strokeWidth="1" strokeDasharray="3 7" />
          <path id="mp-c" d="M 560 -70 C 700 150 460 370 590 580" fill="none" stroke="var(--color-line-2)" strokeWidth="1" strokeDasharray="3 7" />
          <path id="mp-d" d="M -80 280 C 200 20 430 520 710 280 C 940 90 1080 430 1280 240" fill="none" stroke="var(--color-line-2)" strokeWidth="1" strokeDasharray="3 7" />
        </svg>

        {NODES.map(({ icon: Icon }, i) => (
          <span
            key={i}
            data-node
            aria-hidden="true"
            className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-paper text-accent-ink shadow-[0_10px_30px_-12px_rgba(20,18,30,0.35)]"
            style={{ willChange: "transform, opacity" }}
          >
            <Icon size={24} weight="regular" />
          </span>
        ))}
      </div>
    </section>
  )
}
