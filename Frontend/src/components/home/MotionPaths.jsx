import { useEffect, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "../../lib/gsap"
import {
  MathOperations, Atom, Flask, Code, Calculator, ChartLine,
  Briefcase, PaintBrush, BookOpen, Notebook, GraduationCap,
  Certificate, Lightbulb, Compass,
} from "@phosphor-icons/react"
import { Container } from "../layout"

// Each node rides its own arc segment, so the subjects never move in lockstep.
// Nodes on one path are spaced 0.22 apart — a stream of disciplines, never a pile-up.
const NODES = [
  { icon: MathOperations, path: "mp-a", start: 0, end: 0.34, scale: 1.25 },
  { icon: Atom, path: "mp-b", start: 0, end: 0.34, scale: 1.05 },
  { icon: Flask, path: "mp-c", start: 0, end: 0.4, scale: 1.15 },
  { icon: Code, path: "mp-d", start: 0, end: 0.4, scale: 1 },
  { icon: Calculator, path: "mp-a", start: 0.22, end: 0.56, scale: 1.1 },
  { icon: ChartLine, path: "mp-b", start: 0.22, end: 0.56, scale: 1.2 },
  { icon: Briefcase, path: "mp-c", start: 0.3, end: 0.7, scale: 0.95 },
  { icon: PaintBrush, path: "mp-d", start: 0.3, end: 0.7, scale: 1.05 },
  { icon: BookOpen, path: "mp-a", start: 0.44, end: 0.78, scale: 1.15 },
  { icon: Notebook, path: "mp-b", start: 0.44, end: 0.78, scale: 1 },
  { icon: GraduationCap, path: "mp-c", start: 0.6, end: 1, scale: 1.3 },
  { icon: Certificate, path: "mp-d", start: 0.6, end: 1, scale: 0.95 },
  { icon: Lightbulb, path: "mp-a", start: 0.66, end: 1, scale: 1 },
  { icon: Compass, path: "mp-b", start: 0.66, end: 1, scale: 1.1 },
]

/**
 * The curves are drawn per breakpoint and the icons live *inside* the SVG, so
 * they stay glued to their arcs at every viewport size — no drift, no clipped
 * fly-aways. Scroll drives travel; fade-in/out windows keep the whole set
 * visible while the section is on screen.
 */
const LAYOUTS = {
  wide: {
    viewBox: "0 0 1200 560",
    badge: 25,
    glyph: 25,
    paths: [
      { id: "mp-a", d: "M 70 470 C 320 470 320 110 600 110 C 880 110 900 470 1130 470" },
      { id: "mp-b", d: "M 70 140 C 280 140 400 480 620 480 C 850 480 930 130 1130 130" },
      { id: "mp-c", d: "M 610 40 C 780 180 440 380 600 520" },
      { id: "mp-d", d: "M 70 300 C 250 60 430 500 700 300 C 930 120 1040 450 1130 260" },
    ],
  },
  narrow: {
    viewBox: "0 0 640 760",
    badge: 24,
    glyph: 23,
    paths: [
      { id: "mp-a", d: "M 80 90 C 560 140 90 320 550 380 C 300 430 560 600 110 670" },
      { id: "mp-b", d: "M 550 100 C 110 190 570 330 120 430 C 420 480 90 630 520 670" },
      { id: "mp-c", d: "M 320 50 C 520 210 140 330 340 460 C 540 590 220 650 330 710" },
      { id: "mp-d", d: "M 100 220 C 300 60 260 420 420 310 C 550 220 520 560 540 640" },
    ],
  },
}

export default function MotionPaths() {
  const root = useRef(null)
  const [narrow, setNarrow] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  )

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)")
    const onChange = (event) => setNarrow(event.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  useGSAP(
    () => {
      const nodes = gsap.utils.toArray("[data-node]", root.current)
      const mm = gsap.matchMedia(root)

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        nodes.forEach((el, i) => {
          const cfg = NODES[i]
          const path = `#${cfg.path}`

          // Travel this node's segment across the section's pass through the viewport.
          gsap.to(el, {
            motionPath: { path, start: cfg.start, end: cfg.end, autoRotate: true },
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          })

          // Fly in small while the section approaches — staggered so the set
          // flows in rather than popping as one block.
          gsap.fromTo(
            el,
            { scale: 0.35, autoAlpha: 0 },
            {
              scale: cfg.scale,
              autoAlpha: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: root.current,
                start: `top ${92 - (i % 4) * 4}%`,
                end: `top ${58 - (i % 4) * 4}%`,
                scrub: 0.6,
              },
            }
          )

          // …and only leave once the section itself is on the way out.
          gsap.to(el, {
            scale: cfg.scale * 0.55,
            autoAlpha: 0,
            ease: "power2.in",
            scrollTrigger: {
              trigger: root.current,
              start: "bottom 22%",
              end: "bottom -20%",
              scrub: 0.6,
            },
          })
        })
      })

      // Reduced motion: place the set statically along its arcs — no drift, no gaps.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        nodes.forEach((el, i) => {
          const cfg = NODES[i]
          gsap.set(el, {
            motionPath: {
              path: `#${cfg.path}`,
              start: cfg.start + (cfg.end - cfg.start) * 0.5,
            },
            scale: cfg.scale,
          })
        })
      })

      return () => mm.revert()
    },
    { scope: root, dependencies: [narrow], revertOnUpdate: true }
  )

  const layout = narrow ? LAYOUTS.narrow : LAYOUTS.wide

  return (
    <section
      ref={root}
      data-bg="#f4f1eb"
      className="relative overflow-hidden border-t border-line py-20 sm:py-28"
      style={{ color: "var(--color-accent-ink)" }}
    >
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="display max-w-[20ch] text-step-4 text-ink-950">
            Every course is a path, not a playlist.
          </h2>
          <p className="max-w-[36ch] text-step--1 text-ink-500">
            Foundations, practice, proof. Each course is charted in that order, and the
            lessons follow the line.
          </p>
        </div>
      </Container>

      <div className="mx-auto mt-10 w-full max-w-[1240px] px-4 sm:px-8">
        <svg
          viewBox={layout.viewBox}
          className="block h-auto w-full"
          aria-hidden="true"
          focusable="false"
        >
          {layout.paths.map((path) => (
            <path
              key={path.id}
              id={path.id}
              d={path.d}
              fill="none"
              stroke="var(--color-line-2)"
              strokeWidth="1"
              strokeDasharray="3 7"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {NODES.map(({ icon: Icon }, i) => (
            <g key={i} data-node style={{ willChange: "transform, opacity" }}>
              <circle
                r={layout.badge}
                fill="var(--color-paper)"
                stroke="var(--color-line-2)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                style={{ filter: "drop-shadow(0 10px 18px rgba(20,18,30,0.16))" }}
              />
              <Icon
                size={layout.glyph}
                x={-layout.glyph / 2}
                y={-layout.glyph / 2}
                weight="regular"
                color="currentColor"
              />
            </g>
          ))}
        </svg>
      </div>
    </section>
  )
}
