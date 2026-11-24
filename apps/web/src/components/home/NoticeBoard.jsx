import { Container } from "../layout"

const NOTICES = [
  {
    title: "New faculty joining",
    body: "More AI teachers are being trained right now and will be announced here as they join.",
  },
  {
    title: "Institutions",
    body: "Register, choose seats, and publish your own modules into the shared catalogue.",
  },
  {
    title: "Payments",
    body: "Plans are paid in USDT on TRX and activate automatically when the deposit matches.",
  },
]

export default function NoticeBoard() {
  return (
    <section className="border-t border-line bg-paper-3 py-14 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-step-2 text-ink-950">From the notice board.</h2>
          <p className="max-w-[40ch] text-step--1 text-ink-500">
            Short notes on what is changing this term.
          </p>
        </div>

        <ul className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
          {NOTICES.map((n) => (
            <li key={n.title} className="bg-paper-3 p-6">
              <h3 className="display text-step-1 text-ink-950">{n.title}</h3>
              <p className="mt-2 text-step--1 leading-relaxed text-ink-600">{n.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
