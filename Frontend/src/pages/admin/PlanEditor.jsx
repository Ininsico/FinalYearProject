import { useCallback, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, CircleNotch, Warning, CheckCircle } from "@phosphor-icons/react"
import { fetchPlans, updatePlan } from "../../lib/admin"

const buildPayload = (form) => ({
  name: form.name.trim(),
  amountUsdt: Number(form.amountUsdt),
  period: form.period.trim(),
  summary: form.summary.trim(),
  seats: Number(form.seats),
  features: [...form.features].sort(),
  highlights: form.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
})

export default function AdminPlanEditor() {
  const { planId } = useParams()
  const [catalog, setCatalog] = useState(null)
  const [form, setForm] = useState(null)
  const [original, setOriginal] = useState(null)
  const [error, setError] = useState("")
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      const data = await fetchPlans()
      const plan = data.plans.find((p) => p.id === planId)
      if (!plan) throw new Error("Plan not found")
      const next = {
        name: plan.name,
        audience: plan.audience,
        amountUsdt: String(plan.amountUsdt),
        period: plan.period,
        summary: plan.summary ?? "",
        seats: String(plan.entitlements.seats),
        features: [...plan.entitlements.features],
        highlights: (plan.features ?? []).join("\n"),
      }
      setCatalog(data)
      setForm(next)
      setOriginal(buildPayload(next))
      setError("")
    } catch (err) {
      setError(err.message)
    }
  }, [planId])

  useEffect(() => { load() }, [load])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const toggleFeature = (key) =>
    setForm((f) => ({
      ...f,
      features: f.features.includes(key) ? f.features.filter((x) => x !== key) : [...f.features, key],
    }))

  const dirty = Boolean(form && original && JSON.stringify(buildPayload(form)) !== JSON.stringify(original))

  async function save() {
    setBusy(true)
    setError("")
    setNote("")
    try {
      await updatePlan(planId, buildPayload(form))
      setNote("Plan updated — pricing, checkout and entitlements now use these values.")
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (!form) {
    return (
      <>
        <Link to="/admin/subscriptions/plans" className="flex items-center gap-1.5 text-step--1 text-ink-600">
          <ArrowLeft size={14} weight="bold" aria-hidden="true" /> All plans
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

  return (
    <>
      <Link
        to="/admin/subscriptions/plans"
        className="flex items-center gap-1.5 text-step--1 text-ink-600 transition-colors hover:text-ink-950"
      >
        <ArrowLeft size={14} weight="bold" aria-hidden="true" /> All plans
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <h1 className="display text-step-3 text-ink-950">{form.name}</h1>
        <span className="border border-line-2 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-500">
          {form.audience}
        </span>
        <span className="font-mono text-[0.74rem] text-ink-500">{planId}</span>
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
        <section className="border border-line bg-paper">
          <header className="border-b border-line px-5 py-3">
            <h2 className="display text-step-1 text-ink-950">Plan settings</h2>
          </header>

          <div className="p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="block">
                <span className="mb-2 block text-step--1 font-medium text-ink-700">Name</span>
                <input value={form.name} onChange={set("name")} disabled={busy} className="field" />
              </label>
              <label className="block">
                <span className="mb-2 block text-step--1 font-medium text-ink-700">Price (USDT)</span>
                <input type="number" min={0} step="0.01" value={form.amountUsdt} onChange={set("amountUsdt")} disabled={busy} className="field tabular" />
              </label>
              <label className="block">
                <span className="mb-2 block text-step--1 font-medium text-ink-700">Period</span>
                <input value={form.period} onChange={set("period")} disabled={busy} className="field" />
              </label>
              <label className="block">
                <span className="mb-2 block text-step--1 font-medium text-ink-700">Seats</span>
                <input type="number" min={0} max={10000} value={form.seats} onChange={set("seats")} disabled={busy} className="field tabular" />
              </label>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-step--1 font-medium text-ink-700">Summary</span>
              <textarea rows={2} value={form.summary} onChange={set("summary")} disabled={busy} className="field" />
            </label>

            <fieldset className="mt-6">
              <legend className="text-step--1 font-medium text-ink-700">Unlocks (premium features)</legend>
              <div className="mt-3 flex flex-wrap gap-3">
                {(catalog?.features ?? []).map((feature) => (
                  <label
                    key={feature}
                    className={`flex cursor-pointer items-center gap-3 border px-4 py-3 transition-colors ${
                      form.features.includes(feature) ? "border-accent-ink bg-accent-soft" : "border-line-2 bg-paper"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.features.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                      disabled={busy}
                      className="h-4 w-4 accent-[var(--color-accent-ink)]"
                    />
                    <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-900">{feature}</span>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-[0.74rem] text-ink-500">
                These keys gate premium endpoints for every subscription on this plan.
              </p>
            </fieldset>

            <label className="mt-6 block">
              <span className="mb-2 block text-step--1 font-medium text-ink-700">
                Marketing highlights (one per line)
              </span>
              <textarea rows={6} value={form.highlights} onChange={set("highlights")} disabled={busy} className="field" />
            </label>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button onClick={save} disabled={busy || !dirty} className="btn btn-primary h-10">
                {busy ? <CircleNotch size={15} weight="bold" className="animate-spin" aria-hidden="true" /> : "Save plan"}
              </button>
              <span className="text-[0.74rem] text-ink-500">
                {dirty ? "Unsaved changes." : "No pending changes."}
              </span>
            </div>
          </div>
        </section>

        <section className="border border-line bg-paper">
          <header className="border-b border-line px-5 py-3">
            <h2 className="display text-step-1 text-ink-950">What this plan grants</h2>
          </header>
          <dl className="divide-y divide-line">
            <div className="flex items-baseline justify-between gap-4 px-5 py-3">
              <dt className="eyebrow">Seats</dt>
              <dd className="text-step--1 tabular text-ink-900">{form.seats}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 px-5 py-3">
              <dt className="eyebrow">Premium features</dt>
              <dd className="text-step--1 text-ink-900">
                {form.features.length ? form.features.join(", ") : "None"}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 px-5 py-3">
              <dt className="eyebrow">Highlights</dt>
              <dd className="text-step--1 tabular text-ink-900">
                {buildPayload(form).highlights.length}
              </dd>
            </div>
          </dl>
          <p className="border-t border-line px-5 py-4 text-[0.74rem] leading-relaxed text-ink-500">
            Changes apply immediately to checkout, payment matching and every entitlement check —
            no deploy needed. Edits are recorded in the audit trail.
          </p>
        </section>
      </div>
    </>
  )
}
