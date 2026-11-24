import { Container } from "../layout"
import { Micro } from "./ui"

const EXAMS = [
  {
    code: "MDCAT",
    name: "Medical entry",
    line: "Physics, Chemistry and Biology, taught to the MDCAT syllabus and paced to the paper.",
  },
  {
    code: "CSS",
    name: "Civil services",
    line: "History, Geology and the written papers, prepared one subject at a time.",
  },
  {
    code: "BOARD",
    name: "School and college",
    line: "Matric, FSc and A-Levels, subject by subject, with the practice built in.",
  },
]

const TOPICS = [
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geology",
  "Mathematics",
  "English",
  "Current affairs",
]

export default function Exams() {
  return (
    <section className="relative overflow-hidden border-y border-paper/10 bg-ink-950 py-16 text-paper sm:py-24">
      <div className="grid-backdrop pointer-events-none absolute inset-0" aria-hidden="true" />

      <Container className="relative">
        <div className="flex items-end justify-between gap-6">
          <Micro className="text-paper/60">Exams</Micro>
          <Micro dot={false} className="text-paper/40">
            Whatever you are sitting
          </Micro>
        </div>

        <h2 className="display mt-8 max-w-[26ch] text-[clamp(2.2rem,4.6vw,4.2rem)] leading-[1.02] tracking-[-0.02em]">
          MDCAT, CSS — whatever the exam, we have got you.
        </h2>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[15px] border border-paper/10 bg-paper/10 sm:grid-cols-3">
          {EXAMS.map((e) => (
            <article
              key={e.code}
              className="group bg-ink-950 p-7 transition-colors duration-300 hover:bg-paper/5 sm:p-9"
            >
              <span
                aria-hidden="true"
                className="font-sans text-[clamp(1.7rem,2.8vw,2.4rem)] font-bold italic leading-none tracking-[-0.02em] text-transparent [-webkit-text-stroke:2px_var(--color-paper)]"
              >
                {e.code}
              </span>
              <h3 className="display mt-6 text-step-2">{e.name}</h3>
              <p className="mt-3 max-w-[36ch] text-step--1 leading-relaxed text-paper/70">{e.line}</p>
              <span
                aria-hidden="true"
                className="mt-6 block h-1.5 w-1.5 rotate-45 bg-accent transition-transform duration-300 group-hover:rotate-[135deg]"
              />
            </article>
          ))}
        </div>

        <div className="mt-16">
          <Micro className="text-paper/60">Topics on the shelf</Micro>
          <ul className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[15px] border border-paper/10 bg-paper/10 sm:grid-cols-4">
            {TOPICS.map((t) => (
              <li
                key={t}
                className="bg-ink-950 px-5 py-4 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-paper/70 transition-colors duration-300 hover:bg-paper/5 hover:text-paper"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
