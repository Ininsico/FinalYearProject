import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Check, ArrowRight } from "@phosphor-icons/react"
import { PageHero, Section, SectionHeading } from "../components/layout"
import Reveal from "../components/Reveal"
import Faq from "../components/home/Faq"
import { fetchPlans } from "../lib/billing"

function PlanCard({ plan, cta, onCta }) {
  return (
    <Reveal>
      <article
        className={`flex h-full flex-col border p-8 ${
          plan.highlighted ? "border-ink-950 bg-ink-950 text-paper" : "border-line bg-paper-2"
        }`}
      >
        <p className={`eyebrow ${plan.highlighted ? "text-paper/60" : ""}`}>
          {plan.audience === "institution" ? "Institution" : "Student"}
        </p>
        <h3 className={`display mt-5 text-step-3 ${plan.highlighted ? "text-paper" : "text-ink-950"}`}>
          {plan.name}
        </h3>
        <p className={`mt-6 text-step-2 tabular ${plan.highlighted ? "text-paper" : "text-ink-950"}`}>
          {plan.amountUsdt === 0 ? "Free" : `${plan.amountUsdt} USDT`}
        </p>
        <p className={`mt-1 text-step--1 ${plan.highlighted ? "text-paper/60" : "text-ink-500"}`}>{plan.period}</p>
        <p className={`mt-4 text-step--1 leading-relaxed ${plan.highlighted ? "text-paper/75" : "text-ink-600"}`}>
          {plan.summary}
        </p>
        <ul className={`mt-8 flex-1 space-y-3 border-t pt-6 ${plan.highlighted ? "border-paper/20" : "border-line"}`}>
          {plan.features.map((f) => (
            <li key={f} className={`flex items-baseline gap-3 text-step--1 ${plan.highlighted ? "text-paper/85" : "text-ink-700"}`}>
              <Check size={15} weight="bold" className="shrink-0 translate-y-[2px]" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
        <button onClick={onCta} className={`btn mt-9 w-full ${plan.highlighted ? "btn-accent" : "btn-ghost"}`}>
          {cta}
          <ArrowRight size={15} weight="bold" aria-hidden="true" />
        </button>
      </article>
    </Reveal>
  )
}

export default function Pricing() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    fetchPlans().then((d) => setPlans(d.plans)).catch((e) => setError(e.message))
  }, [])

  const students = plans.filter((p) => p.audience === "student")
  const institutions = plans.filter((p) => p.audience === "institution")

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Pay in USDT. Unlock the swarm."
        lede="Students start free and upgrade for the agentic orchestration and the AI video agent. Institutions subscribe on a seat-based plan, paid in crypto."
      />

      <Section>
        {error && <p role="alert" className="mb-8 text-step--1 text-red-700">{error}</p>}

        <SectionHeading eyebrow="For students" title="Start free. Upgrade for the agents." />
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {students.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              cta={plan.amountUsdt === 0 ? "Create a free account" : "Get Student Pro"}
              onCta={() => navigate("/signup")}
            />
          ))}
        </div>

        <div className="mt-20">
          <SectionHeading
            eyebrow="For institutions"
            title="Seat-based plans for a whole organisation."
            lede="Onboard through the institution module, then pay in USDT to cover every seat."
          />
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {institutions.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                cta="Register your institution"
                onCta={() => navigate("/institutions/register")}
              />
            ))}
          </div>
        </div>

        <p className="mt-12 max-w-[70ch] text-step--1 leading-relaxed text-ink-500">
          All prices are charged in USDT on the TRX network. A deposit is matched against the exact
          amount within a small tolerance and activates the subscription automatically.
        </p>
      </Section>

      <Faq />
    </>
  )
}
