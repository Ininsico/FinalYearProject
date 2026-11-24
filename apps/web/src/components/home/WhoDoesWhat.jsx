import { Container } from "../layout"
import { Micro } from "./ui"

const SIDES = [
  {
    numeral: "01",
    tag: "Drafts",
    title: "The AI",
    items: [
      "Drafts descriptions, lesson text and quizzes.",
      "Turns uploaded notes, PDFs and images into module content.",
      "Redrafts the material when a subject moves.",
    ],
  },
  {
    numeral: "02",
    tag: "Signs off",
    title: "The instructor",
    items: [
      "Owns the module and its pacing.",
      "Edits every draft and approves what publishes.",
      "Decides what the assessment has to prove.",
    ],
  },
]

export default function WhoDoesWhat() {
  return (
    <section className="bg-ink-950 py-16 text-paper sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.02] tracking-[-0.02em]">
            One writes. One signs off.
          </h2>
          <Micro className="text-paper/60">Nothing publishes without both</Micro>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {SIDES.map((s) => (
            <article
              key={s.title}
              className="rounded-[15px] border border-paper/10 bg-paper/5 p-7 transition-colors duration-300 hover:bg-paper/10 sm:p-9"
            >
              <div className="flex items-start justify-between">
                <span className="relative inline-block" aria-hidden="true">
                  <span className="absolute left-[3px] top-[3px] select-none font-sans text-[clamp(2rem,3.4vw,2.8rem)] font-bold italic leading-none tracking-[-0.03em] text-accent-soft">
                    {s.numeral}
                  </span>
                  <span className="relative font-sans text-[clamp(2rem,3.4vw,2.8rem)] font-bold italic leading-none tracking-[-0.03em] text-transparent [-webkit-text-stroke:2px_var(--color-paper)]">
                    {s.numeral}
                  </span>
                </span>
                <Micro dot={false} className="text-paper/50">
                  {s.tag}
                </Micro>
              </div>

              <h3 className="display mt-8 text-[clamp(1.8rem,3vw,2.6rem)]">{s.title}</h3>

              <ul className="mt-6 space-y-3">
                {s.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-step--1 leading-relaxed text-paper/75"
                  >
                    <span
                      className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
