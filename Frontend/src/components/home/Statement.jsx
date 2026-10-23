import { Container, Eyebrow } from "../layout"
import Reveal from "../Reveal"
import SplitHeading from "../SplitHeading"

export default function Statement() {
  return (
    <section data-bg="#f9f7f3" className="border-t border-line py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <Eyebrow>The problem</Eyebrow>
          </Reveal>
          <div>
            <SplitHeading as="h2" className="max-w-[24ch] text-step-4 text-ink-950 display">
              Generative AI did not remove the bottleneck. It moved it.
            </SplitHeading>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <Reveal delay={0.05}>
                <p className="text-step-0 leading-[1.7] text-ink-600">
                  The shortage was never foundation models. It is the manual work of
                  stitching them together: separate integrations, separate prompting,
                  separate validation, separate quality control. Production stays almost
                  as labour-intensive as before, just shifted from crafting to
                  orchestration.
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="text-step-0 leading-[1.7] text-ink-600">
                  Fablet automates that orchestration layer. Agents share a single
                  semantic understanding of the content instead of passing rigid payloads,
                  so the swarm adapts to the brief rather than the brief contorting to the
                  tooling.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
