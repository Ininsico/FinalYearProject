import { Container } from "../layout"
import Reveal from "../Reveal"
import SplitHeading from "../SplitHeading"

export default function Statement() {
  return (
    <section data-bg="#f9f7f3" className="border-t border-line py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <p className="font-mono text-[0.7rem] tabular text-accent-ink">01</p>
          </Reveal>
          <div>
            <SplitHeading as="h2" className="max-w-[24ch] text-step-4 text-ink-950 display">
              Most courses are written once, then left to rot.
            </SplitHeading>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <Reveal delay={0.05}>
                <p className="text-step-0 leading-[1.7] text-ink-600">
                  A subject moves, a class differs, and a syllabus recorded last year
                  teaches neither. Static material is why online learning so often feels
                  like watching instead of studying.
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="text-step-0 leading-[1.7] text-ink-600">
                  Fablet keeps its courses alive. AI drafts the descriptions, lessons and
                  quizzes on demand, instructors edit and direct them, and the material
                  students study is the material instructors last shaped.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
