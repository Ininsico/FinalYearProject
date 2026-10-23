import { useCallback, useEffect, useState } from "react"
import { CircleNotch, Warning, Lightning } from "@phosphor-icons/react"
import { fetchPayments, settlePayment } from "../../lib/admin"

const tone = (s) =>
  s === "confirmed" || s === "overpaid"
    ? "bg-accent-soft text-accent-ink"
    : s === "mismatch" || s === "expired"
      ? "bg-red-50 text-red-700"
      : "bg-paper-3 text-ink-600"

export default function AdminPayments() {
  const [rows, setRows] = useState(null)
  const [busy, setBusy] = useState("")
  const [error, setError] = useState("")

  const load = useCallback(() => fetchPayments().then((d) => setRows(d.payments)).catch((e) => setError(e.message)), [])
  useEffect(() => { load() }, [load])

  async function settle(id) {
    setBusy(id)
    setError("")
    try {
      await settlePayment(id)
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
        <p className="eyebrow">Payments</p>
        <h1 className="display mt-3 text-step-3 text-ink-950">Crypto payment intents</h1>
        <p className="mt-4 max-w-[56ch] leading-relaxed text-ink-600">
          Deposits are matched read-only against Binance history. "Settle" marks an intent paid
          without waiting for a chain deposit — for demos and support.
        </p>
      </div>

      {error && (
        <p role="alert" className="mt-5 flex items-start gap-2 text-step--1 text-red-700">
          <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <div className="mt-8 overflow-hidden border border-line">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              {["Reference", "Account", "Plan", "Expected", "Matched", "Status", ""].map((h, i) => (
                <th key={i} scope="col" className="px-4 py-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!rows && <tr><td colSpan={7} className="px-4 py-10 text-center text-step--1 text-ink-500">Loading…</td></tr>}
            {rows?.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-step--1 text-ink-500">No payment intents yet.</td></tr>}
            {rows?.map((p) => {
              const settled = p.status === "confirmed" || p.status === "overpaid"
              return (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-[0.72rem] text-ink-700">{p.reference}{p.demo && <span className="ml-2 text-[0.62rem] uppercase text-ink-400">demo</span>}</td>
                  <td className="px-4 py-3 font-mono text-[0.72rem] text-ink-600">{p.accountId}</td>
                  <td className="px-4 py-3 text-step--1 text-ink-900">{p.planId}</td>
                  <td className="px-4 py-3 text-step--1 tabular text-ink-700">{p.expectedAmount} {p.asset}</td>
                  <td className="px-4 py-3 text-step--1 tabular text-ink-700">{p.matchedTotal} {p.asset}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-[0.66rem] uppercase tracking-[0.12em] ${tone(p.status)}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!settled && (
                      <button onClick={() => settle(p.id)} disabled={busy === p.id} className="btn btn-ghost h-9">
                        {busy === p.id ? <CircleNotch size={14} weight="bold" className="animate-spin" /> : <Lightning size={14} weight="fill" />}
                        Settle
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
