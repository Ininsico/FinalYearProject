import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CircleNotch, Warning, MagnifyingGlass, CaretRight } from "@phosphor-icons/react"
import { fetchSubscriptions } from "../../lib/admin"
import StatusBadge from "../../components/admin/StatusBadge"
import SubscriptionsNav from "../../components/admin/SubscriptionsNav"

const STATUSES = ["trialing", "active", "canceled", "expired"]

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—"

export default function AdminSubscriptions() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("")
  const [type, setType] = useState("")
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    try {
      setData(await fetchSubscriptions({ q: query, status, type }))
    } catch (err) {
      setError(err.message)
    }
  }, [query, status, type])

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [load])

  const open = (accountId) => navigate(`/admin/subscriptions/${encodeURIComponent(accountId)}`)

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Subscriptions</p>
          <h1 className="display mt-3 text-step-3 text-ink-950">Billing accounts</h1>
        </div>
        {data && (
          <p className="text-step--1 text-ink-500">
            {data.total} account{data.total === 1 ? "" : "s"}
          </p>
        )}
      </div>
      <p className="mt-4 max-w-[72ch] leading-relaxed text-ink-600">
        One subscription per account, student or institution. Open an account to edit its plan,
        status, seats and billing period — every change lands in the audit trail.
      </p>

      <SubscriptionsNav />

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <label className="relative min-w-[240px] flex-1">
          <span className="sr-only">Search accounts</span>
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email"
            className="field pl-9"
          />
        </label>
        <label className="flex items-center gap-2 text-step--1 text-ink-600">
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="field w-[160px] py-2">
            <option value="">All</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 text-step--1 text-ink-600">
          Type
          <select value={type} onChange={(e) => setType(e.target.value)} className="field w-[150px] py-2">
            <option value="">All</option>
            <option value="user">user</option>
            <option value="institution">institution</option>
          </select>
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-5 flex items-start gap-2 text-step--1 text-red-700">
          <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <div className="mt-6 overflow-hidden border border-line">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              {["Account", "Type", "Plan", "Status", "Period end", "Updated", ""].map((h, i) => (
                <th key={i} scope="col" className="px-4 py-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!data && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-step--1 text-ink-500">
                  <CircleNotch size={16} weight="bold" className="inline animate-spin" aria-hidden="true" /> Loading
                </td>
              </tr>
            )}
            {data?.subscriptions?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-step--1 text-ink-500">
                  No subscriptions match.
                </td>
              </tr>
            )}
            {data?.subscriptions?.map((s) => (
              <tr
                key={s.accountId}
                onClick={() => open(s.accountId)}
                onKeyDown={(e) => { if (e.key === "Enter") open(s.accountId) }}
                tabIndex={0}
                className="cursor-pointer border-b border-line transition-colors last:border-0 hover:bg-paper-2 focus-visible:bg-paper-2"
              >
                <td className="px-4 py-3">
                  <span className="block text-step--1 text-ink-950">{s.account?.name ?? "Unknown account"}</span>
                  <span className="block font-mono text-[0.7rem] text-ink-500">{s.account?.email ?? s.accountId}</span>
                </td>
                <td className="px-4 py-3 text-step--1 text-ink-600">{s.accountType}</td>
                <td className="px-4 py-3 text-step--1 text-ink-900">{s.planName}</td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3 text-step--1 text-ink-600">
                  {fmtDate(s.currentPeriodEnd)}
                  {s.status === "trialing" && s.trialEndsAt && (
                    <span className="ml-2 text-[0.72rem] text-ink-400">trial</span>
                  )}
                </td>
                <td className="px-4 py-3 text-step--1 text-ink-500">{fmtDate(s.updatedAt)}</td>
                <td className="px-4 py-3 text-right text-ink-400"><CaretRight size={15} weight="bold" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
