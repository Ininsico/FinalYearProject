import { useCallback, useEffect, useState } from "react"
import { fetchAudit } from "../../lib/admin"

const ACTIONS = [
  "", "user.updated", "institution.registered", "institution.updated",
  "institution.member_added", "subscription.activated", "subscription.activated_by_admin",
  "subscription.canceled", "subscription.resumed", "payment.settled_by_admin",
]

export default function AdminAudit() {
  const [events, setEvents] = useState(null)
  const [action, setAction] = useState("")
  const [error, setError] = useState("")

  const load = useCallback(() => fetchAudit(action).then((d) => setEvents(d.events)).catch((e) => setError(e.message)), [action])
  useEffect(() => { load() }, [load])

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Audit</p>
          <h1 className="display mt-3 text-step-3 text-ink-950">Change log</h1>
        </div>
        <label className="flex items-center gap-2 text-step--1 text-ink-600">
          Action
          <select value={action} onChange={(e) => setAction(e.target.value)} className="field w-[240px] py-2">
            {ACTIONS.map((a) => <option key={a} value={a}>{a || "All"}</option>)}
          </select>
        </label>
      </div>

      <p className="mt-6 max-w-[60ch] text-step--1 leading-relaxed text-ink-500">
        Append-only. Written by role changes, institution edits, subscription activation and
        payments. No screen or endpoint can edit or delete an entry.
      </p>

      {error && <p role="alert" className="mt-5 text-step--1 text-red-700">{error}</p>}

      <ul className="mt-8 border-t border-line">
        {!events && <li className="py-10 text-center text-step--1 text-ink-500">Loading…</li>}
        {events?.length === 0 && <li className="py-10 text-center text-step--1 text-ink-500">Nothing recorded.</li>}
        {events?.map((e) => (
          <li key={e._id} className="grid gap-2 border-b border-line py-4 lg:grid-cols-[220px_minmax(0,1fr)_180px] lg:items-baseline lg:gap-6">
            <span className="font-mono text-[0.72rem] text-accent-ink">{e.action}</span>
            <span className="text-step--1 text-ink-700">
              {e.targetType}{e.targetId ? ` · ${String(e.targetId).slice(-8)}` : ""}
              {e.actorEmail || e.actorId ? <span className="text-ink-500"> by {e.actorEmail || String(e.actorId).slice(-8)}</span> : null}
            </span>
            <span className="text-step--1 text-ink-500 lg:text-right">
              {new Date(e.at).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}
