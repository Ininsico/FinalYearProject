import { Books, Certificate, ChalkboardTeacher, GraduationCap } from "@phosphor-icons/react"
import { Container } from "../layout"
import { Cross } from "./ui"

const ICONS = [GraduationCap, Books, ChalkboardTeacher, Certificate]

export default function Manifesto() {
  return (
    <section className="bg-accent py-20 text-paper sm:py-28">
      <Container>
        <div className="flex items-center justify-between text-paper/70">
          <Cross />
          <Cross className="hidden sm:block" />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
          <div
            aria-hidden="true"
            className="mx-auto grid w-full max-w-[420px] grid-cols-2 gap-px overflow-hidden rounded-[15px] border border-paper/25 bg-paper/25 lg:mx-0"
          >
            {ICONS.map((Icon, i) => (
              <span
                key={i}
                className="group flex aspect-[4/3] items-center justify-center bg-accent transition-colors duration-300 hover:bg-accent-ink"
              >
                <Icon
                  size={38}
                  weight="light"
                  className="text-paper transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                />
              </span>
            ))}
          </div>

          <div className="ml-auto max-w-[52rem] text-right">
            <p className="display text-[clamp(2.2rem,5vw,4.6rem)] leading-[1.02] tracking-[-0.02em]">
              Structured to be finished.
            </p>
            <p className="ml-auto mt-8 max-w-[42ch] text-step-2 leading-[1.3] text-paper">
              Authored with AI, signed off by instructors, and sequenced module by module —
              so you always know what comes next, and what finishing it proves.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
