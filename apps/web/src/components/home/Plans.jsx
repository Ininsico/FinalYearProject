import { useNavigate } from "react-router-dom"
import { Container } from "../layout"
import { ArrowIcon, Micro } from "./ui"

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
    <section className="bg-paper py-16 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.02] tracking-[-0.02em] text-ink-950">
            What it costs.
          </h2>
          <Micro className="text-ink-500">Paid in USDT on TRX</Micro>
        </div>

        <div className="mt-10 border-t border-line">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`grid gap-2 border-b border-line px-4 py-6 transition-colors duration-300 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_240px_auto] md:items-baseline md:gap-8 ${
                p.highlight ? "bg-accent-soft" : "hover:bg-paper-2"
              }`}
            >
              <h3 className="display text-step-2 text-ink-950">{p.name}</h3>
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ink-500">
                {p.who}
              </span>
              <span className="display text-step-1 tabular text-ink-950">{p.price}</span>
              <button
                onClick={() => navigate(p.to)}
                className="group inline-flex items-center gap-2 justify-self-start font-mono text-[0.68rem] uppercase tracking-[0.08em] underline decoration-line-2 underline-offset-[6px] transition-colors duration-300 hover:decoration-ink-950 md:justify-self-end"
              >
                {p.cta}
                <ArrowIcon />
              </button>
            </div>
          ))}
        </div>

        <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ink-500">
          Premium modules and the AI video agent are part of Student Pro and every
          institution plan
        </p>
      </Container>
    </section>
  )
}
