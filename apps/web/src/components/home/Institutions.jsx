import { useNavigate } from "react-router-dom"
import { Container } from "../layout"
import { ArrowIcon, Cross, Micro, Pill } from "./ui"

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
    <section className="relative overflow-hidden border-t border-line bg-accent-soft py-16 sm:py-24">
      <Container>
        <div className="flex items-center justify-between text-accent-ink/50">
          <Cross />
          <Cross className="hidden sm:block" />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-16">
          <div>
            <Micro className="text-accent-ink">For institutions</Micro>
            <h2 className="display mt-6 max-w-[18ch] text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.02] tracking-[-0.02em] text-ink-950">
              Bring the whole academy to your institution.
            </h2>
            <p className="mt-6 max-w-[54ch] text-step-0 leading-[1.7] text-ink-700">
              Register once, choose a seat plan, and run every course, member and module
              from one console. Institutions build modules with the same editor the
              platform uses, publish to the shared catalogue, and their members enrol
              under one bill.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Pill onClick={() => navigate("/institutions/register")} tone="dark">
                Register your institution
                <ArrowIcon />
              </Pill>
              <Pill onClick={() => navigate("/pricing")} tone="outline">
                See seat plans
              </Pill>
            </div>
          </div>

          <ul className="border-t border-accent-ink/20">
            {POINTS.map((p) => (
              <li
                key={p}
                className="flex items-start gap-3 border-b border-accent-ink/20 py-4 text-step--1 leading-relaxed text-ink-800 transition-colors duration-300 hover:bg-paper/40"
              >
                <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-ink" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
