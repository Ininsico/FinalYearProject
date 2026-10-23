import { useCallback, useEffect, useRef, useState } from "react"
import { Check, Copy, CircleNotch, Warning, ArrowClockwise, CurrencyCircleDollar } from "@phosphor-icons/react"
import {
  fetchBilling,
  startCheckout,
  confirmPayment,
  cancelSubscription,
  resumeSubscription,
} from "../../lib/billing"

const statusTone = (status) => {
  if (status === 'active') return 'bg-accent-soft text-accent-ink'
  if (status === 'trialing') return 'bg-amber-100 text-amber-800'
  return 'bg-paper-3 text-ink-600'
}

function Label({ children }) {
  return <p className="eyebrow">{children}</p>
}

/** Shared by students and institutions — the only difference is the plan set. */
export default function BillingPanel({ audience }) {
  const [billing, setBilling] = useState(null)
  const [busy, setBusy] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [now, setNow] = useState(Date.now())
  const pollRef = useRef(null)

  const load = useCallback(async () => {
    try {
      setBilling(await fetchBilling())
      setError("")
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // Tick so the payment-window countdown moves.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(id)
  }, [])

  const openIntent = billing?.openIntent

  // While an intent is open, ask the server to check the chain periodically.
  useEffect(() => {
    if (!openIntent) return
    const check = async () => {
      try {
        const res = await confirmPayment(openIntent.id)
        if (res.settled) await load()
      } catch { /* keep polling */ }
    }
    pollRef.current = setInterval(check, 20000)
    return () => clearInterval(pollRef.current)
  }, [openIntent, load])

  async function choosePlan(planId) {
    setBusy(planId)
    setError("")
    try {
      await startCheckout(planId)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy("")
    }
  }

  async function checkNow() {
    setBusy("check")
    setError("")
    try {
      const res = await confirmPayment(openIntent.id)
      if (res.settled) await load()
      else setBilling((b) => ({ ...b, openIntent: res.intent }))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy("")
    }
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(openIntent.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* clipboard blocked */ }
  }

  async function toggleCancel() {
    setBusy("cancel")
    try {
      if (billing.subscription.status === "canceled") await resumeSubscription()
      else await cancelSubscription()
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy("")
    }
  }

  if (!billing) {
    return (
      <div role="status" className="flex items-center gap-2 text-step--1 text-ink-500">
        <CircleNotch size={16} weight="bold" className="animate-spin" aria-hidden="true" />
        Loading billing
      </div>
    )
  }

  const { subscription, live, plans, invoices } = billing
  const minutesLeft = openIntent
    ? Math.max(0, Math.round((Date.parse(openIntent.expiresAt) - now) / 60000))
    : 0

  return (
    <div className="space-y-8">
      {error && (
        <p role="alert" className="flex items-start gap-2 border border-red-200 bg-red-50 px-4 py-3 text-step--1 text-red-700">
          <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {/* Current plan */}
      <section className="border border-line p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Label>Current plan</Label>
            <p className="display mt-3 text-step-3 text-ink-950">{subscription.planName}</p>
            <p className="mt-2 text-step--1 text-ink-500">
              {subscription.status === "trialing" && subscription.trialEndsAt
                ? `Trial ends ${new Date(subscription.trialEndsAt).toLocaleDateString()}`
                : subscription.currentPeriodEnd
                  ? `Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                  : "Free forever"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-[0.7rem] uppercase tracking-[0.14em] ${statusTone(subscription.status)}`}>
              {subscription.status}
            </span>
            <span className={`rounded-full px-3 py-1 text-[0.7rem] uppercase tracking-[0.14em] ${live ? "bg-accent-soft text-accent-ink" : "bg-paper-3 text-ink-600"}`}>
              {live ? "premium live" : "basic"}
            </span>
          </div>
        </div>

        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-5">
          {(billing.features?.length ? billing.features : []).map((f) => (
            <li key={f} className="flex items-center gap-2 text-step--1 text-ink-700">
              <Check size={14} weight="bold" className="text-accent-ink" aria-hidden="true" /> {f}
            </li>
          ))}
          {!billing.features?.length && (
            <li className="text-step--1 text-ink-500">
              No premium features on this plan. Choose one below to unlock orchestration and the video agent.
            </li>
          )}
        </ul>

        {(subscription.status === "active" || subscription.status === "trialing" || subscription.status === "canceled") && (
          <button onClick={toggleCancel} disabled={busy === "cancel"} className="btn btn-quiet mt-5">
            {subscription.status === "canceled" ? "Resume subscription" : "Cancel subscription"}
          </button>
        )}
      </section>

      {/* Crypto payment in flight */}
      {openIntent && (
        <section className="border border-accent-ink bg-accent-soft/40 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Label>Pay with {openIntent.asset} ({openIntent.network})</Label>
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-500">
              {minutesLeft > 0 ? `${minutesLeft} min left` : "window closed"}
            </span>
          </div>

          <p className="mt-4 max-w-[54ch] text-step--1 leading-relaxed text-ink-700">
            Send exactly <strong className="tabular text-ink-950">{openIntent.expectedAmount} {openIntent.asset}</strong> on
            the <strong>{openIntent.network}</strong> network to the address below. This page confirms itself
            automatically once the deposit arrives.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <code className="min-w-0 flex-1 break-all border border-line bg-paper px-4 py-3 font-mono text-[0.78rem] text-ink-900">
              {openIntent.address}
            </code>
            <button onClick={copyAddress} className="btn btn-ghost h-11 shrink-0">
              {copied ? <Check size={15} weight="bold" /> : <Copy size={15} weight="bold" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button onClick={checkNow} disabled={busy === "check"} className="btn btn-primary h-10">
              {busy === "check"
                ? <><CircleNotch size={15} weight="bold" className="animate-spin" /> Checking</>
                : <><ArrowClockwise size={15} weight="bold" /> I have paid — check now</>}
            </button>
            <p className="text-[0.78rem] text-ink-500">Reference {openIntent.reference}</p>
          </div>
          {openIntent.statusMessage && (
            <p className="mt-4 text-[0.8rem] leading-relaxed text-ink-600">{openIntent.statusMessage}</p>
          )}
        </section>
      )}

      {/* Plans */}
      {!openIntent && (
        <section>
          <Label>Plans</Label>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {plans.map((plan) => {
              const current = plan.id === subscription.planId
              return (
                <article
                  key={plan.id}
                  className={`flex flex-col border p-6 ${plan.highlighted ? "border-ink-950" : "border-line"}`}
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="display text-step-2 text-ink-950">{plan.name}</h3>
                    {current && <span className="eyebrow text-accent-ink">current</span>}
                  </div>
                  <p className="display mt-4 text-step-3 tabular text-ink-950">
                    {plan.amountUsdt === 0 ? "Free" : `${plan.amountUsdt} USDT`}
                  </p>
                  <p className="mt-1 text-step--1 text-ink-500">{plan.period}</p>
                  <p className="mt-4 text-step--1 leading-relaxed text-ink-600">{plan.summary}</p>
                  <ul className="mt-5 flex-1 space-y-2 border-t border-line pt-5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-baseline gap-2 text-step--1 text-ink-700">
                        <Check size={13} weight="bold" className="shrink-0 translate-y-[2px] text-accent-ink" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => choosePlan(plan.id)}
                    disabled={plan.amountUsdt === 0 || current || busy === plan.id}
                    className={`btn mt-6 w-full ${plan.highlighted ? "btn-accent" : "btn-ghost"}`}
                  >
                    {busy === plan.id ? (
                      <><CircleNotch size={15} weight="bold" className="animate-spin" /> Opening</>
                    ) : plan.amountUsdt === 0 ? "Included" : current ? "Active" : (
                      <><CurrencyCircleDollar size={15} weight="bold" /> Pay with crypto</>
                    )}
                  </button>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* Invoices */}
      <section>
        <Label>Invoices</Label>
        <div className="mt-5 overflow-hidden border border-line">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                {["Reference", "Plan", "Amount", "Status", "Created"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-step--1 text-ink-500">
                    No payments yet.
                  </td>
                </tr>
              )}
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-[0.74rem] text-ink-700">{inv.reference}</td>
                  <td className="px-4 py-3 text-step--1 text-ink-900">{inv.planName}</td>
                  <td className="px-4 py-3 text-step--1 tabular text-ink-900">{inv.amount} {inv.asset}</td>
                  <td className="px-4 py-3 text-step--1 text-ink-600">{inv.status}</td>
                  <td className="px-4 py-3 text-step--1 text-ink-500">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
