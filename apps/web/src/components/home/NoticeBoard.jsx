import { Container } from "../layout"
import { Micro } from "./ui"

const NOTICES = [
  {
    tag: "Faculty",
    title: "New teachers joining",
    body: "More AI teachers are being trained right now and will be announced here as they join.",
  },
  {
    tag: "Institutions",
    title: "Bring your own modules",
    body: "Register, choose seats, and publish your own modules into the shared catalogue.",
  },
  {
    tag: "Payments",
    title: "USDT, matched automatically",
    body: "Plans are paid on the TRX network and activate when the deposit matches.",
  },
]

export default function NoticeBoard() {
  return (
    <section className="bg-paper-3 py-16 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.02] tracking-[-0.02em] text-ink-950">
            From the notice board.
          </h2>
          <Micro className="text-ink-500">This term</Micro>
        </div>

        <ul className="mt-10 border-t border-line">
          {NOTICES.map((n) => (
            <li
              key={n.title}
              className="grid gap-2 border-b border-line px-4 py-6 transition-colors duration-300 hover:bg-paper md:grid-cols-[140px_minmax(0,1fr)_minmax(0,1.3fr)] md:items-baseline md:gap-8"
            >
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ink-500">
                {n.tag}
              </span>
              <h3 className="display text-step-2 text-ink-950">{n.title}</h3>
              <p className="max-w-[52ch] text-step--1 leading-relaxed text-ink-600">{n.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
