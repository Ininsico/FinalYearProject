import { useNavigate } from "react-router-dom"
import { ArrowRight } from "@phosphor-icons/react"
import { Container } from "../layout"

const SUBJECTS = [
  {
    name: "Mathematics",
    body: "Calculus from first principles, and the linear algebra behind every model.",
  },
  {
    name: "Physics",
    body: "Kinematics, Newton's laws and energy methods, rebuilt with worked examples.",
  },
  {
    name: "Computer Science",
    body: "Python fundamentals and the data structures that follow them.",
  },
  {
    name: "Business",
    body: "Idea validation, lean canvases and the first pitch.",
  },
  {
    name: "Design",
    body: "Tokens, components and documentation that keep a product coherent.",
  },
]

export default function Subjects() {
  const navigate = useNavigate()
  return (
    <section id="subjects" className="bg-paper py-14 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display max-w-[20ch] text-step-2 text-ink-950">
            Five subjects. One standard.
          </h2>
          <p className="max-w-[44ch] text-step--1 text-ink-500">
            The catalogue opens with seven courses across these subjects, each built on
            the same lesson format: video, reading, exercise and quiz.
          </p>
        </div>

        <ul className="mt-10">
          {SUBJECTS.map((s, i) => (
            <li
              key={s.name}
              className="grid gap-2 border-t border-line py-5 md:grid-cols-[56px_220px_minmax(0,1fr)] md:items-baseline md:gap-6"
            >
              <span className="font-mono text-[0.7rem] tabular text-ink-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display text-step-1 text-ink-950">{s.name}</h3>
              <p className="max-w-[56ch] text-step--1 leading-relaxed text-ink-600">{s.body}</p>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4 border-t border-line pt-6">
          <p className="max-w-[52ch] text-step--1 text-ink-500">
            The catalogue grows module by module, and institutions publish into it too.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <button onClick={() => navigate("/signup")} className="btn btn-accent">
              Create your free account
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </button>
            <button onClick={() => navigate("/pricing")} className="link-underline text-step--1">
              See pricing
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
}
