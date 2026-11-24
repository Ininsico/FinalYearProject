import { Container } from "../layout"
import { Micro } from "./ui"

const AI = [
  "Drafts descriptions, lesson text and quizzes.",
  "Turns uploaded notes, PDFs and images into module content.",
  "Redrafts the material when a subject moves.",
]

const INSTRUCTORS = [
  "Owns the module and its pacing.",
  "Edits every draft and approves what publishes.",
  "Decides what the assessment has to prove.",
]

function Column({ title, items }) {
  return (
    <div>
      <Micro dot={false} className="text-paper/50">
        {title}
      </Micro>
      <ul className="mt-6 border-t border-paper/10">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 border-b border-paper/10 py-4 text-step--1 leading-relaxed text-paper/80 transition-colors duration-300 hover:bg-paper/5"
          >
            <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function WhoDoesWhat() {
  return (
    <section className="bg-ink-950 py-16 text-paper sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.02] tracking-[-0.02em]">
            Who does what.
          </h2>
          <Micro className="text-paper/60">The AI drafts. A person signs off.</Micro>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Column title="The AI" items={AI} />
          <Column title="The instructor" items={INSTRUCTORS} />
        </div>
      </Container>
    </section>
  )
}
