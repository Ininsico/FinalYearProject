import { Container } from "../layout"

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
      <h3 className="display text-step-1 text-ink-950">{title}</h3>
      <ul className="mt-4">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 border-t border-line py-4 text-step--1 leading-relaxed text-ink-700"
          >
            <span
              className="mt-[0.45rem] inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-accent"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function WhoDoesWhat() {
  return (
    <section className="border-t border-line bg-paper py-14 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-step-2 text-ink-950">Who does what.</h2>
          <p className="max-w-[42ch] text-step--1 text-ink-500">
            The AI does the drafting. A person signs off every module.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Column title="The AI" items={AI} />
          <div className="lg:border-l lg:border-line lg:pl-16">
            <Column title="The instructor" items={INSTRUCTORS} />
          </div>
        </div>
      </Container>
    </section>
  )
}
