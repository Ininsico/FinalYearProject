import { Container } from "../layout"

export default function Manifesto() {
  return (
    <section className="bg-paper py-16 sm:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <h2 className="display max-w-[26ch] text-step-3 text-ink-950">
            Taught like a subject,{" "}
            <em className="text-accent-ink">not like a video library.</em>
          </h2>
          <div className="border-t border-line pt-6 lg:border-t-0 lg:pt-0">
            <p className="max-w-[44ch] text-step-0 leading-[1.7] text-ink-600">
              Short lessons, worked practice and an assessment at the end of every
              module. Instructors decide what earns its place, and AI keeps the
              material from going stale.
            </p>
            <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-500">
              7 courses live · 5 subjects · 4 lesson formats
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
