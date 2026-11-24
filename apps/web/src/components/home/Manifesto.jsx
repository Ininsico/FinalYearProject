import { Container } from "../layout"

export default function Manifesto() {
  return (
    <section className="bg-paper py-16 sm:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <h2 className="display max-w-[24ch] text-step-3 text-ink-950">
            Taught like a subject, not like a video library.
          </h2>
          <div>
            <p className="max-w-[46ch] text-step-0 leading-[1.7] text-ink-600">
              A course is a sequence, not a shelf. Foundations come first, practice
              follows, and the module closes with an assessment, so finishing means
              something.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
