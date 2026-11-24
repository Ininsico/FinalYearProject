import { useNavigate } from "react-router-dom"
import { ArrowRight } from "@phosphor-icons/react"
import { Container } from "../layout"

const PANEL = [
  { value: "7", label: "courses" },
  { value: "5", label: "subjects" },
  { value: "4", label: "lesson formats" },
]

const META = [
  "Free student tier",
  "Courses in 5 subjects",
  "AI course building",
  "Seat plans for institutions",
]

export default function Hero() {
  const navigate = useNavigate()
  return (
    <section className="border-b border-line bg-paper">
      <Container className="grid gap-12 pb-14 pt-28 sm:pt-36 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-16">
        <div>
          <h1 className="display text-[clamp(2.5rem,1.7rem+3vw,4rem)] text-ink-950">
            An online academy, <em className="text-accent-ink">taught with AI.</em>
          </h1>
          <p className="mt-6 max-w-[56ch] text-step-0 leading-[1.7] text-ink-600">
            Fablet runs courses across mathematics, physics, computer science, business
            and design. AI drafts the material, instructors direct it, and students
            learn in short lessons, exercises and assessments.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button onClick={() => navigate("/signup")} className="btn btn-accent">
              Create your free account
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </button>
            <a href="#catalogue" className="link-underline text-step--1">
              Browse the catalogue
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-5">
            {META.map((m) => (
              <li key={m} className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-500">
                {m}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <div className="border border-line bg-paper-3 p-6">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink-500">
              The opening catalogue
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {PANEL.map((s) => (
                <div key={s.label}>
                  <p className="display text-step-3 leading-none tabular text-ink-950">{s.value}</p>
                  <p className="mt-2 text-[0.72rem] leading-snug text-ink-600">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-line-2 bg-accent-soft p-6">
            <p className="display text-step-1 text-accent-ink">Start free</p>
            <p className="mt-2 text-step--1 leading-relaxed text-ink-700">
              Every free module opens with a student account. Student Pro unlocks
              premium modules and the AI video agent for 9 USDT a month.
            </p>
          </div>

          <div className="bg-ink-950 p-6 text-paper">
            <p className="display text-step-1">For institutions</p>
            <p className="mt-2 text-step--1 leading-relaxed text-paper/70">
              Seat plans for whole departments, a shared course library, and the same AI
              course tools the platform uses.
            </p>
            <button
              onClick={() => navigate("/institutions/register")}
              className="btn btn-accent mt-4 h-10"
            >
              Register your institution
              <ArrowRight size={15} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
}
