import { useEffect, useState } from "react"
import { fetchPlans } from "../../lib/admin"

export default function AdminPlans() {
  const [plans, setPlans] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => { fetchPlans().then((d) => setPlans(d.plans)).catch((e) => setError(e.message)) }, [])

  if (error) return <p role="alert" className="text-step--1 text-red-700">{error}</p>

  return (
    <>
      <div>
        <p className="eyebrow">Plans</p>
        <h1 className="display mt-3 text-step-3 text-ink-950">Catalogue</h1>
        <p className="mt-4 max-w-[56ch] leading-relaxed text-ink-600">
          Prices and entitlements come from the server's plan module, which is also what the
          payment matcher compares deposits against.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {plans?.map((plan) => (
          <article key={plan.id} className="border border-line p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="display text-step-2 text-ink-950">{plan.name}</h2>
              <span className="eyebrow">{plan.audience}</span>
            </div>
            <p className="display mt-4 text-step-3 tabular text-ink-950">
              {plan.amountUsdt === 0 ? "Free" : `${plan.amountUsdt} USDT`}
            </p>
            <p className="mt-1 text-step--1 text-ink-500">{plan.period}</p>
            <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line">
              <div className="bg-paper p-3">
                <dt className="eyebrow">Seats</dt>
                <dd className="mt-1 text-step--1 tabular text-ink-900">{plan.entitlements.seats}</dd>
              </div>
              <div className="bg-paper p-3">
                <dt className="eyebrow">Features</dt>
                <dd className="mt-1 text-step--1 text-ink-900">
                  {plan.entitlements.features.length ? plan.entitlements.features.join(", ") : "—"}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </>
  )
}
