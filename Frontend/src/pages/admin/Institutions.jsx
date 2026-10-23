import { useCallback, useEffect, useState } from "react"
import { Warning } from "@phosphor-icons/react"
import { fetchInstitutions, updateInstitution } from "../../lib/admin"

const STATUSES = ["trialing", "active", "canceled", "suspended"]

export default function AdminInstitutions() {
  const [rows, setRows] = useState(null)
  const [busy, setBusy] = useState("")
  const [error, setError] = useState("")

  const load = useCallback(() => fetchInstitutions().then((d) => setRows(d.institutions)).catch((e) => setError(e.message)), [])
  useEffect(() => { load() }, [load])

  async function patch(id, body) {
    setBusy(id)
    setError("")
    try {
      await updateInstitution(id, body)
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
        <p className="eyebrow">Institutions</p>
        <h1 className="display mt-3 text-step-3 text-ink-950">B2B accounts</h1>
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
              {["Institution", "Plan", "Members", "Seats", "Status"].map((h) => (
                <th key={h} scope="col" className="px-4 py-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!rows && <tr><td colSpan={5} className="px-4 py-10 text-center text-step--1 text-ink-500">Loading…</td></tr>}
            {rows?.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-step--1 text-ink-500">No institutions yet.</td></tr>}
            {rows?.map((i) => (
              <tr key={i.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 text-step--1 text-ink-900">{i.name}</td>
                <td className="px-4 py-3 text-step--1 text-ink-600">{i.subscription?.planId ?? i.planId}</td>
                <td className="px-4 py-3 text-step--1 tabular text-ink-600">{i.members}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="1"
                    defaultValue={i.seats}
                    disabled={busy === i.id}
                    onBlur={(e) => Number(e.target.value) !== i.seats && patch(i.id, { seats: Number(e.target.value) })}
                    aria-label={`Seats for ${i.name}`}
                    className="field w-[90px] py-1.5 text-step--1"
                  />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={i.status}
                    disabled={busy === i.id}
                    onChange={(e) => patch(i.id, { status: e.target.value })}
                    aria-label={`Status for ${i.name}`}
                    className="field w-[140px] py-1.5 text-step--1"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
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
