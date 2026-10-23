import { useCallback, useEffect, useState } from "react"
import { fetchSubscriptions, adminActivateSubscription, fetchPlans } from "../../lib/admin"

export default function AdminSubscriptions() {
  const [rows, setRows] = useState(null)
  const [plans, setPlans] = useState([])
  const [error, setError] = useState("")
  const [busy, setBusy] = useState("")

  const load = useCallback(async () => {
    try {
      const [subs, p] = await Promise.all([fetchSubscriptions(), fetchPlans()])
      setRows(subs.subscriptions)
      setPlans(p.plans)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function activate(accountId, planId) {
    setBusy(accountId)
    try {
      await adminActivateSubscription(accountId, planId)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy("")
    }
  }

  return (
    <>
      <div>
        <p className="eyebrow">Subscriptions</p>
        <h1 className="display mt-3 text-step-3 text-ink-950">Billing accounts</h1>
        <p className="mt-4 max-w-[56ch] leading-relaxed text-ink-600">
          One subscription per account. Activating here grants a paid period without a payment —
          useful for demos and support.
        </p>
      </div>

      {error && <p role="alert" className="mt-5 text-step--1 text-red-700">{error}</p>}

      <div className="mt-8 overflow-hidden border border-line">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              {["Account", "Type", "Plan", "Status", "Period end", "Grant"].map((h) => (
                <th key={h} scope="col" className="px-4 py-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!rows && <tr><td colSpan={6} className="px-4 py-10 text-center text-step--1 text-ink-500">Loading…</td></tr>}
            {rows?.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-step--1 text-ink-500">No subscriptions yet.</td></tr>}
            {rows?.map((s) => (
              <tr key={s.accountId} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-mono text-[0.72rem] text-ink-600">{s.accountId}</td>
                <td className="px-4 py-3 text-step--1 text-ink-600">{s.accountType}</td>
                <td className="px-4 py-3 text-step--1 text-ink-900">{s.planId}</td>
                <td className="px-4 py-3 text-step--1 text-ink-600">{s.status}</td>
                <td className="px-4 py-3 text-step--1 text-ink-500">
                  {s.currentPeriodEnd ? new Date(s.currentPeriodEnd).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3">
                  <select
                    defaultValue=""
                    disabled={busy === s.accountId}
                    onChange={(e) => e.target.value && activate(s.accountId, e.target.value)}
                    aria-label={`Grant plan to ${s.accountId}`}
                    className="field w-[170px] py-1.5 text-step--1"
                  >
                    <option value="">Grant a plan…</option>
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
