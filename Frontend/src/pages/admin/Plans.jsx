import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CircleNotch, Warning, CaretRight } from "@phosphor-icons/react"
import { fetchPlans } from "../../lib/admin"
import SubscriptionsNav from "../../components/admin/SubscriptionsNav"

const fmtPrice = (n) => (Number(n) === 0 ? "Free" : `${n} USDT`)

export default function AdminPlans() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchPlans().then(setData).catch((e) => setError(e.message))
  }, [])

  const open = (planId) => navigate(`/admin/subscriptions/plans/${encodeURIComponent(planId)}`)

  return (
    <>
      <div>
        <p className="eyebrow">Subscriptions</p>
        <h1 className="display mt-3 text-step-3 text-ink-950">Plans & features</h1>
      </div>
      <p className="mt-4 max-w-[72ch] leading-relaxed text-ink-600">
        The live catalogue. Open a plan to edit its price, seats and the premium features it
        unlocks — changes apply immediately to checkout, payment matching and entitlements.
      </p>

      <SubscriptionsNav />

      {error && (
        <p role="alert" className="mt-6 flex items-start gap-2 text-step--1 text-red-700">
          <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <div className="mt-6 overflow-hidden border border-line">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              {["Plan", "Audience", "Price", "Seats", "Unlocks", ""].map((h, i) => (
                <th key={i} scope="col" className="px-4 py-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!data && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-step--1 text-ink-500">
                  <CircleNotch size={16} weight="bold" className="inline animate-spin" aria-hidden="true" /> Loading
                </td>
              </tr>
            )}
            {data?.plans?.map((plan) => (
              <tr
                key={plan.id}
                onClick={() => open(plan.id)}
                onKeyDown={(e) => { if (e.key === "Enter") open(plan.id) }}
                tabIndex={0}
                className="cursor-pointer border-b border-line transition-colors last:border-0 hover:bg-paper-2 focus-visible:bg-paper-2"
              >
                <td className="px-4 py-3">
                  <span className="block text-step--1 text-ink-950">{plan.name}</span>
                  <span className="block max-w-[60ch] text-[0.74rem] text-ink-500">{plan.summary}</span>
                </td>
                <td className="px-4 py-3 text-step--1 text-ink-600">{plan.audience}</td>
                <td className="px-4 py-3 text-step--1 tabular text-ink-900">{fmtPrice(plan.amountUsdt)}</td>
                <td className="px-4 py-3 text-step--1 tabular text-ink-600">{plan.entitlements.seats}</td>
                <td className="px-4 py-3">
                  {plan.entitlements.features.length ? (
                    <span className="flex flex-wrap gap-1.5">
                      {plan.entitlements.features.map((f) => (
                        <span key={f} className="border border-accent/40 bg-accent-soft px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-accent-ink">
                          {f}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="text-step--1 text-ink-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-ink-400"><CaretRight size={15} weight="bold" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
