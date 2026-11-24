import { useCallback, useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, CircleNotch, Warning, CheckCircle } from "@phosphor-icons/react"
import {
  fetchSubscription,
  fetchPlans,
  updateSubscription,
  adminActivateSubscription,
  cancelSubscription,
  resumeSubscription,
} from "../../lib/admin"
import StatusBadge from "../../components/admin/StatusBadge"
import SubscriptionsNav from "../../components/admin/SubscriptionsNav"

const STATUSES = ["trialing", "active", "canceled", "expired"]

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—"
const fmtDateTime = (iso) => (iso ? new Date(iso).toLocaleString() : "—")
const toInput = (iso) => {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}

export default function AdminSubscriptionDetail() {
  const { accountId } = useParams()
  const [data, setData] = useState(null)
  const [plans, setPlans] = useState([])
  const [form, setForm] = useState(null)
  const [error, setError] = useState("")
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState("")

  const load = useCallback(async () => {
    try {
      const [detail, planData] = await Promise.all([fetchSubscription(accountId), fetchPlans()])
      setData(detail)
      setPlans(planData.plans)
      setForm({
        planId: detail.subscription.planId,
        status: detail.subscription.status,
        seats: detail.subscription.seats,
        currentPeriodStart: toInput(detail.subscription.currentPeriodStart),
        currentPeriodEnd: toInput(detail.subscription.currentPeriodEnd),
      })
      setError("")
    } catch (err) {
      setError(err.message)
    }
  }, [accountId])

  useEffect(() => { load() }, [load])

  const sub = data?.subscription

  const dirty = useMemo(() => {
    if (!sub || !form) return {}
    const patch = {}
    if (form.planId !== sub.planId) patch.planId = form.planId
    if (form.status !== sub.status) patch.status = form.status
    if (Number(form.seats) !== sub.seats) patch.seats = Number(form.seats)
    if (form.currentPeriodStart && form.currentPeriodStart !== toInput(sub.currentPeriodStart)) {
      patch.currentPeriodStart = new Date(form.currentPeriodStart).toISOString()
    }
    if (form.currentPeriodEnd && form.currentPeriodEnd !== toInput(sub.currentPeriodEnd)) {
      patch.currentPeriodEnd = new Date(form.currentPeriodEnd).toISOString()
    }
    return patch
  }, [sub, form])

  const planName = (id) => plans.find((p) => p.id === id)?.name ?? id
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function run(kind, fn, done) {
    setBusy(kind)
    setError("")
    setNote("")
    try {
      await fn()
      setNote(done)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy("")
    }
  }

  const save = () =>
    Object.keys(dirty).length
      ? run("save", () => updateSubscription(accountId, dirty), "Changes saved.")
      : setNote("Nothing to save.")

  const activate = () =>
    window.confirm(`Grant a full paid period of "${planName(form.planId)}" now?`) &&
    run("activate", () => adminActivateSubscription(accountId, form.planId), "Subscription activated — a full period was granted.")

  const cancel = () =>
    window.confirm("Cancel this subscription? Access continues until the period ends.") &&
    run("cancel", () => cancelSubscription(accountId), "Subscription canceled.")

  const resume = () =>
    window.confirm("Resume this subscription?") &&
    run("resume", () => resumeSubscription(accountId), "Subscription resumed.")

  if (!data) {
    return (
      <>
        <Link to="/admin/subscriptions/accounts" className="flex items-center gap-1.5 text-step--1 text-ink-600">
          <ArrowLeft size={14} weight="bold" aria-hidden="true" /> All accounts
        </Link>
        {error ? (
          <p role="alert" className="mt-6 flex items-start gap-2 text-step--1 text-red-700">
            <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        ) : (
          <p className="mt-6 text-step--1 text-ink-500">
            <CircleNotch size={16} weight="bold" className="inline animate-spin" aria-hidden="true" /> Loading
          </p>
        )}
      </>
    )
  }

  const working = Boolean(busy)

  return (
    <>
      <Link to="/admin/subscriptions/accounts" className="flex items-center gap-1.5 text-step--1 text-ink-600 transition-colors hover:text-ink-950">
        <ArrowLeft size={14} weight="bold" aria-hidden="true" /> All accounts
      </Link>

      <SubscriptionsNav />

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="display text-step-3 text-ink-950">{data.account?.name ?? "Unknown account"}</h1>
            <StatusBadge status={sub.status} />
            <span className="border border-line-2 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-500">
              {sub.accountType}
            </span>
          </div>
          <p className="mt-2 font-mono text-[0.74rem] text-ink-500">{sub.accountId}</p>
        </div>
        <p className="text-step--1 text-ink-500">Updated {fmtDateTime(sub.updatedAt)}</p>
      </div>

      {error && (
        <p role="alert" className="mt-5 flex items-start gap-2 text-step--1 text-red-700">
          <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
      {note && (
        <p role="status" className="mt-5 flex items-start gap-2 text-step--1 text-emerald-800">
          <CheckCircle size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {note}
        </p>
      )}

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <section className="border border-line bg-paper">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
              <h2 className="display text-step-1 text-ink-950">Edit subscription</h2>
              {working && <CircleNotch size={15} weight="bold" className="animate-spin text-ink-500" aria-hidden="true" />}
            </header>

            <div className="p-5">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-step--1 font-medium text-ink-700">Plan</span>
                  <select value={form.planId} onChange={set("planId")} disabled={working} className="field">
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} · {p.amountUsdt === 0 ? "Free" : `${p.amountUsdt} USDT`}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-step--1 font-medium text-ink-700">Status</span>
                  <select value={form.status} onChange={set("status")} disabled={working} className="field">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-step--1 font-medium text-ink-700">Seats</span>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={form.seats}
                    onChange={set("seats")}
                    disabled={working}
                    className="field tabular"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-step--1 font-medium text-ink-700">Period start</span>
                  <input type="datetime-local" value={form.currentPeriodStart} onChange={set("currentPeriodStart")} disabled={working} className="field" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-step--1 font-medium text-ink-700">Period end</span>
                  <input type="datetime-local" value={form.currentPeriodEnd} onChange={set("currentPeriodEnd")} disabled={working} className="field" />
                </label>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button onClick={save} disabled={working} className="btn btn-primary h-10">
                  {busy === "save" ? <CircleNotch size={15} weight="bold" className="animate-spin" aria-hidden="true" /> : "Save changes"}
                </button>
                <button onClick={activate} disabled={working} className="btn btn-accent h-10">
                  {busy === "activate" ? <CircleNotch size={15} weight="bold" className="animate-spin" aria-hidden="true" /> : "Activate / renew period"}
                </button>
                {sub.status === "canceled" ? (
                  <button onClick={resume} disabled={working} className="btn btn-ghost h-10">
                    {busy === "resume" ? <CircleNotch size={15} weight="bold" className="animate-spin" aria-hidden="true" /> : "Resume"}
                  </button>
                ) : (
                  <button
                    onClick={cancel}
                    disabled={working}
                    className="btn btn-ghost h-10 border-red-700/40 text-red-700 hover:border-red-700"
                  >
                    {busy === "cancel" ? <CircleNotch size={15} weight="bold" className="animate-spin" aria-hidden="true" /> : "Cancel subscription"}
                  </button>
                )}
              </div>
              <p className="mt-3 text-[0.74rem] text-ink-500">
                Plan changes adopt the plan's seats. Activating grants a full paid period without a payment
                (useful for demos and support). Every change is recorded with the acting admin.
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-4">
              {[
                ["Period", `${fmtDate(sub.currentPeriodStart)} → ${fmtDate(sub.currentPeriodEnd)}`],
                ["Trial ends", fmtDate(sub.trialEndsAt)],
                ["Activated", fmtDate(sub.activatedAt)],
                ["Canceled", fmtDate(sub.canceledAt)],
                ["Provider", sub.provider ?? "—"],
                ["Last payment ref", sub.lastPaymentReference ?? "—"],
                ["Amount", sub.amountUsdt === 0 ? "Free" : `${sub.amountUsdt} USDT`],
                ["Created", fmtDate(sub.createdAt)],
              ].map(([label, value]) => (
                <div key={label} className="bg-paper p-4">
                  <dt className="eyebrow">{label}</dt>
                  <dd className="mt-1 truncate text-step--1 text-ink-900" title={String(value)}>{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="border border-line bg-paper">
            <header className="border-b border-line px-5 py-3">
              <h2 className="display text-step-1 text-ink-950">History</h2>
            </header>
            {sub.history?.length ? (
              <ul className="divide-y divide-line">
                {sub.history.map((h, i) => (
                  <li key={i} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-3">
                    <span className="font-mono text-[0.7rem] text-ink-500">{fmtDateTime(h.at)}</span>
                    <span className="text-step--1 font-medium text-ink-900">{h.action}</span>
                    {h.detail && <span className="text-step--1 text-ink-600">{h.detail}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-6 text-step--1 text-ink-500">No history recorded yet.</p>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="border border-line bg-paper">
            <header className="border-b border-line px-5 py-3">
              <h2 className="display text-step-1 text-ink-950">Account</h2>
            </header>
            {data.account ? (
              <dl className="divide-y divide-line">
                {data.account.type === "institution"
                  ? [
                      ["Name", data.account.name],
                      ["Domain", data.account.domain ?? "—"],
                      ["Contact email", data.account.contactEmail ?? "—"],
                      ["Status", data.account.status ?? "—"],
                      ["Members", String(data.account.members ?? 0)],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-4 px-5 py-3">
                        <dt className="eyebrow">{k}</dt>
                        <dd className="text-step--1 text-ink-900">{v}</dd>
                      </div>
                    ))
                  : [
                      ["Name", data.account.name],
                      ["Email", data.account.email],
                      ["Role", data.account.role],
                      ["Verified", data.account.isVerified ? "yes" : "no"],
                      ["Joined", fmtDate(data.account.createdAt)],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-4 px-5 py-3">
                        <dt className="eyebrow">{k}</dt>
                        <dd className="text-step--1 text-ink-900">{v}</dd>
                      </div>
                    ))}
              </dl>
            ) : (
              <p className="px-5 py-6 text-step--1 text-ink-500">No account record found for this id.</p>
            )}
          </section>

          <section className="border border-line bg-paper">
            <header className="border-b border-line px-5 py-3">
              <h2 className="display text-step-1 text-ink-950">Payment intents</h2>
            </header>
            {data.payments?.length ? (
              <ul className="divide-y divide-line">
                {data.payments.map((p) => (
                  <li key={p.id} className="px-5 py-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-mono text-[0.72rem] text-ink-800">{p.reference}</span>
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-500">{p.status}</span>
                    </div>
                    <p className="mt-1 text-[0.74rem] text-ink-500">
                      {p.planName ?? p.planId} · {p.expectedAmount ?? p.matchedTotal ?? "—"} {p.asset ?? ""} · {fmtDate(p.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-6 text-step--1 text-ink-500">No payment intents for this account.</p>
            )}
          </section>

          <section className="border border-line bg-paper">
            <header className="border-b border-line px-5 py-3">
              <h2 className="display text-step-1 text-ink-950">Audit trail</h2>
            </header>
            {data.audit?.length ? (
              <ul className="divide-y divide-line">
                {data.audit.map((e) => (
                  <li key={e._id} className="px-5 py-3">
                    <p className="text-step--1 text-ink-900">{e.action}</p>
                    <p className="mt-1 font-mono text-[0.7rem] text-ink-500">
                      {e.actorEmail ?? "admin"} · {fmtDateTime(e.at)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-6 text-step--1 text-ink-500">No audit events for this subscription yet.</p>
            )}
          </section>
        </div>
      </div>
    </>
  )
}
