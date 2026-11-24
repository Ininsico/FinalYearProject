import { useNavigate } from "react-router-dom"
import { ArrowRight, Check } from "@phosphor-icons/react"
import { Container } from "../layout"

const POINTS = [
  "Seat plans from 10 to 50 members",
  "Shared course library across the institution",
  "AI course building from a brief or your own notes",
  "Notes and PDFs extracted into modules",
  "Members, roles and billing in one console",
  "Productions and agents on the generation side",
]

export default function Institutions() {
  const navigate = useNavigate()
  return (
    <section className="border-t border-line bg-accent-soft py-14 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-16">
          <div>
            <h2 className="display max-w-[20ch] text-step-2 text-ink-950">
              Bring the whole academy to your institution.
            </h2>
            <p className="mt-5 max-w-[56ch] text-step-0 leading-[1.7] text-ink-700">
              Register once, choose a seat plan, and run every course, member and module
              from one console. Institutions build modules with the same editor the
              platform uses: describe a course once and AI drafts the description,
              lessons and quizzes, or upload existing notes and PDFs. Publish to the
              shared catalogue and your members enrol under one bill.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <button onClick={() => navigate("/institutions/register")} className="btn btn-primary">
                Register your institution
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </button>
              <button onClick={() => navigate("/pricing")} className="link-underline text-step--1 text-ink-800">
                See seat plans
              </button>
            </div>
          </div>

          <ul className="space-y-3">
            {POINTS.map((p) => (
              <li
                key={p}
                className="flex items-start gap-3 border-b border-line-2 pb-3 text-step--1 leading-relaxed text-ink-800 last:border-b-0 last:pb-0"
              >
                <Check size={15} weight="bold" className="mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
