import { useNavigate } from "react-router-dom"
import { Container } from "../layout"

const PLANS = [
  {
    name: "Student Basic",
    who: "A single learner",
    price: "Free",
    cta: "Create an account",
    to: "/signup",
  },
  {
    name: "Student Pro",
    who: "A single learner, premium",
    price: "9 USDT a month",
    cta: "Create an account",
    to: "/signup",
    highlight: true,
  },
  {
    name: "Institution Starter",
    who: "A department or small institution",
    price: "49 USDT a month, 10 seats",
    cta: "Register an institution",
    to: "/institutions/register",
  },
  {
    name: "Institution Scale",
    who: "A whole institution",
    price: "149 USDT a month, 50 seats",
    cta: "Register an institution",
    to: "/institutions/register",
  },
]

export default function Plans() {
  const navigate = useNavigate()
  return (
    <section className="border-t border-line bg-paper-2 py-14 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-step-2 text-ink-950">What it costs.</h2>
          <p className="max-w-[44ch] text-step--1 text-ink-500">
            Paid in USDT on the TRX network. A deposit activates the plan
            automatically.
          </p>
        </div>

        <div className="mt-10 border border-line">
          <div className="hidden grid-cols-[1.1fr_1.2fr_1fr_auto] gap-6 border-b border-line px-5 py-3 text-[0.8rem] font-medium text-ink-500 md:grid">
            <span>Plan</span>
            <span>Who it is for</span>
            <span>Price</span>
            <span aria-hidden="true" />
          </div>
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`grid gap-2 border-b border-line px-5 py-5 last:border-b-0 md:grid-cols-[1.1fr_1.2fr_1fr_auto] md:items-center md:gap-6 ${
                p.highlight ? "bg-accent-soft" : "bg-paper"
              }`}
            >
              <span className="display text-step-1 text-ink-950">{p.name}</span>
              <span className="text-step--1 text-ink-600">{p.who}</span>
              <span className="text-step--1 tabular text-ink-950">{p.price}</span>
              <button
                onClick={() => navigate(p.to)}
                className="link-underline justify-self-start text-step--1 md:justify-self-end"
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-4 text-step--1 text-ink-500">
          Premium modules and the AI video agent are part of Student Pro and every
          institution plan.
        </p>
      </Container>
    </section>
  )
}
