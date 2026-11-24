import { useNavigate } from "react-router-dom"
import { Container } from "../layout"
import { ArrowIcon, Micro, Pill } from "./ui"

const CAPABILITIES = [
  "Follows every lesson you finish and every answer you miss",
  "Flags weak spots and queues the practice that fixes them",
  "Builds a revision plan around your exam date",
  "Answers questions inside the lesson panel",
  "Escalates to your instructor when a question is out of its depth",
]

const MESSAGES = [
  "Morning — Module 04 is three-quarters done. The assessment is the last step.",
  "You have missed the same kind of question three times this week. I have queued the practice set that fixes it.",
  "Your exam is in 12 days. Want a revision plan built from your six weakest modules?",
]

export default function Assistant() {
  const navigate = useNavigate()
  return (
    <section id="assistant" className="bg-paper-2 py-16 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16">
          <div className="lg:order-2">
            <Micro className="text-ink-500">The AI assistant</Micro>
            <h2 className="display mt-6 text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.02] tracking-[-0.02em] text-ink-950">
              An assistant that watches your progress.
            </h2>
            <p className="mt-6 max-w-[50ch] text-step-0 leading-[1.7] text-ink-600">
              The assistant rides along with your course. It sees every lesson you
              finish and every answer you miss, then tells you what to do about it
              before you have to ask.
            </p>

            <ul className="mt-8 border-t border-line">
              {CAPABILITIES.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-3 border-b border-line py-3.5 text-step--1 leading-relaxed text-ink-700"
                >
                  <span
                    className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                  {c}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Pill onClick={() => navigate("/signup")} tone="dark">
                Create a free account
                <ArrowIcon />
              </Pill>
            </div>
          </div>

          <div className="lg:order-1">
            <div className="overflow-hidden rounded-[15px] border border-line bg-paper">
              <div className="flex items-center justify-between border-b border-line bg-paper-2 px-5 py-3">
                <span className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ink-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  Fablet AI
                </span>
                <Micro dot={false} className="text-ink-400">
                  Study companion
                </Micro>
              </div>

              <div className="space-y-3 p-5">
                {MESSAGES.map((m) => (
                  <p
                    key={m}
                    className="max-w-[46ch] rounded-[12px] rounded-tl-[4px] border border-line bg-paper-2 px-4 py-3 text-step--1 leading-relaxed text-ink-800"
                  >
                    {m}
                  </p>
                ))}
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none flex select-none items-center justify-between gap-4 border-t border-line bg-paper-2 px-5 py-3"
              >
                <span className="font-mono text-[0.68rem] text-ink-400">
                  Ask anything about this lesson…
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-950 text-paper">
                  <ArrowIcon />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
