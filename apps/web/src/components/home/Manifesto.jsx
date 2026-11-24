import { Container } from "../layout"
import { Cross } from "./ui"

export default function Manifesto() {
  return (
    <section className="bg-accent py-20 text-paper sm:py-28">
      <Container>
        <div className="flex items-center justify-between text-paper/70">
          <Cross />
          <Cross className="hidden sm:block" />
        </div>

        <div className="mt-12 ml-auto max-w-[52rem] text-right">
          <p className="display text-[clamp(2.2rem,5vw,4.6rem)] leading-[1.02] tracking-[-0.02em]">
            Structured to be finished.
          </p>
          <p className="ml-auto mt-8 max-w-[42ch] text-step-2 leading-[1.3] text-paper">
            Authored with AI, signed off by instructors, and sequenced module by module —
            so you always know what comes next, and what finishing it proves.
          </p>
        </div>
      </Container>
    </section>
  )
}
