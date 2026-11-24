import { useNavigate } from "react-router-dom"
import { Container } from "../layout"
import { ArrowIcon, Micro, Pill } from "./ui"

const PLANS = [
  {
    name: "Student Basic",
    who: "A single learner",
    price: "Free",
    period: "forever",
    features: [
      "Every course Fablet publishes, free",
      "Progress tracking module by module",
      "The AI assistant in every lesson",
    ],
    cta: "Create an account",
    to: "/signup",
    tone: "dark",
  },
  {
    name: "Student Pro",
    who: "A single learner, premium",
    price: "9 USDT",
    period: "a month",
    features: [
      "Everything in Basic",
      "The AI video agent, on every module",
      "40% off with the OpenUp code",
    ],
    cta: "Create an account",
    to: "/signup",
    featured: true,
  },
  {
    name: "Institution Starter",
    who: "A department or small institution",
    price: "49 USDT",
    period: "a month, 10 seats",
    features: [
      "10 member seats",
      "Shared course library",
      "The AI course builder",
      "One institution console",
    ],
    cta: "Register an institution",
    to: "/institutions/register",
    tone: "outline",
  },
  {
    name: "Institution Scale",
    who: "A whole institution",
    price: "149 USDT",
    period: "a month, 50 seats",
    features: [
      "50 member seats",
      "Everything in Starter",
      "Unlimited modules",
      "Billing in one console",
    ],
    cta: "Register an institution",
    to: "/institutions/register",
    tone: "outline",
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

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((p) => (
            <article
              key={p.name}
              className={`relative flex h-full flex-col rounded-[15px] border p-6 transition-colors duration-300 sm:p-8 ${
                p.featured
                  ? "border-ink-950 bg-ink-950 text-paper"
                  : "border-line bg-paper hover:border-line-2 hover:bg-paper-2"
              }`}
            >
              {p.featured && (
                <span className="absolute right-6 top-7 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-accent-soft sm:right-7 sm:top-8">
                  Most popular
                </span>
              )}

              <div>
                <Micro dot={false} className={p.featured ? "text-paper/60" : "text-ink-500"}>
                  {p.who}
                </Micro>
                <h3 className="display mt-4 text-step-2">{p.name}</h3>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className="display text-[clamp(2rem,3.2vw,2.8rem)] tabular-nums">
                    {p.price}
                  </span>
                  <span
                    className={`font-mono text-[0.62rem] uppercase tracking-[0.08em] ${
                      p.featured ? "text-paper/60" : "text-ink-500"
                    }`}
                  >
                    {p.period}
                  </span>
                </p>
              </div>

              <ul
                className={`mt-6 flex-1 space-y-3 border-t pt-6 ${
                  p.featured ? "border-paper/15" : "border-line"
                }`}
              >
                {p.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-start gap-3 text-step--1 leading-relaxed ${
                      p.featured ? "text-paper/80" : "text-ink-700"
                    }`}
                  >
                    <span
                      className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent"
                      aria-hidden="true"
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Pill
                  onClick={() => navigate(p.to)}
                  tone={p.featured ? "light" : p.tone}
                  className="w-full"
                >
                  {p.cta}
                  <ArrowIcon />
                </Pill>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ink-500">
          Courses Fablet publishes are free; courses published by institutions are
          priced by them. The AI video agent is part of Student Pro and every
          institution plan
        </p>
      </Container>
    </section>
  )
}
