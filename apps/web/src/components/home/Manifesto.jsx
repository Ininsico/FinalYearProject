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

        <p className="display mt-12 max-w-[22ch] text-[clamp(2.2rem,5vw,4.6rem)] leading-[1.02] tracking-[-0.02em]">
          Taught like a subject, not like a video library.
        </p>

        <p className="mt-8 max-w-[40ch] text-step-2 leading-[1.25] text-paper">
          A course is a sequence, not a shelf. Foundations first, practice next, then an
          assessment that means something.
        </p>
      </Container>
    </section>
  )
}
