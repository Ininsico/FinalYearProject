import { useNavigate } from "react-router-dom"
import { ArrowRight } from "@phosphor-icons/react"
import Marquee from "../Marquee"
import { Container } from "../layout"
import Reveal from "../Reveal"
import SplitHeading from "../SplitHeading"

const CAPABILITIES = [
  "Seat plans from 10 to 50 members",
  "Shared course library",
  "AI course building from a brief",
  "Notes and PDFs extracted into modules",
  "Members, roles and billing in one console",
  "Productions and agents on the generation side",
]

export default function Institutions() {
  const navigate = useNavigate()
  return (
    <section data-bg="#ede9e0" className="border-t border-line py-20 sm:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SplitHeading as="h2" className="max-w-[18ch] text-step-4 text-ink-950 display">
            Bring the whole academy to your institution.
          </SplitHeading>
          <p className="max-w-[38ch] text-step--1 text-ink-500">
            Register once, choose a seat plan, and run every course, member and module
            from one console.
          </p>
        </div>
      </Container>

      <div className="mt-14 border-y border-line py-6">
        <Marquee
          items={CAPABILITIES}
          speed={70}
          itemClassName="mx-7 display text-step-2 text-ink-700"
        />
      </div>

      <Container className="mt-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
          <Reveal>
            <p className="max-w-[58ch] text-step-0 leading-[1.7] text-ink-600">
              Institutions build modules with the same editor the platform uses: describe
              a course once and AI drafts the description, lessons and quizzes, or upload
              existing notes and PDFs and they are extracted into the module. Publish to
              the shared catalogue, and your members enrol under one bill.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:justify-end">
              <button onClick={() => navigate("/institutions/register")} className="btn btn-primary">
                Register your institution
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </button>
              <button onClick={() => navigate("/pricing")} className="link-underline text-step--1">
                See seat plans
              </button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
