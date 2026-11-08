import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  BookOpen,
  CircleNotch,
  Lock,
  LockOpen,
  Sparkle,
  Warning,
} from "@phosphor-icons/react"
import { fetchDictionary } from "../../lib/dictionary"
import { fetchBilling } from "../../lib/billing"
import { useAuth } from "../../lib/auth"

const levelLabel = (level) => level.charAt(0).toUpperCase() + level.slice(1)

export default function Overview() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [dictionary, setDictionary] = useState(null)
  const [billing, setBilling] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([fetchDictionary({}), fetchBilling()])
      .then(([dict, bill]) => {
        setDictionary(dict)
        setBilling(bill)
      })
      .catch((err) => setError(err.message))
  }, [])

  const first = user?.name?.split(" ")[0]
  const paidPlan = Boolean(billing?.live && (billing?.subscription?.amountUsdt ?? 0) > 0)
  const totalModules = (dictionary?.counts?.institution ?? 0) + (dictionary?.counts?.fablet ?? 0)
  const planName = billing?.subscription?.planName ?? user?.planId ?? "—"
  const latest = (dictionary?.modules ?? []).slice(0, 4)

  const tiles = [
    { label: "Your plan", value: planName, hint: paidPlan ? "premium access active" : "free access" },
    { label: "Course modules", value: String(totalModules), hint: "in the courses catalogue" },
    {
      label: "Premium modules",
      value: paidPlan ? "Unlocked" : "Locked",
      hint: paidPlan ? "included in your plan" : "upgrade to unlock",
    },
  ]

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="display mt-3 text-step-3 text-ink-950">
            {first ? `Welcome back, ${first}.` : "Welcome back."}
          </h1>
        </div>
        <button onClick={() => navigate("/dashboard/courses")} className="btn btn-primary h-10">
          <BookOpen size={15} weight="bold" aria-hidden="true" />
          Browse courses
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-5 flex items-start gap-2 text-step--1 text-red-700">
          <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <dl className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
        {tiles.map(({ label, value, hint }) => (
          <div key={label} className="bg-paper p-6">
            <dt className="eyebrow">{label}</dt>
            <dd className="display mt-4 truncate text-step-2 text-ink-950">{value}</dd>
            <p className="mt-1 text-step--1 text-ink-500">{hint}</p>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="border border-line bg-paper">
          <header className="flex items-center justify-between border-b border-line px-5 py-3">
            <h2 className="display text-step-1 text-ink-950">Fresh courses</h2>
            <button onClick={() => navigate("/dashboard/courses")} className="link-underline text-step--1 text-ink-600">
              View all
            </button>
          </header>

          {!dictionary && !error && (
            <p className="px-5 py-8 text-step--1 text-ink-500">
              <CircleNotch size={15} weight="bold" className="inline animate-spin" aria-hidden="true" /> Loading
            </p>
          )}

          {dictionary?.modules?.length === 0 && (
            <p className="px-5 py-8 text-step--1 text-ink-500">No modules published yet.</p>
          )}

          <ul className="divide-y divide-line">
            {latest.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <p className="text-step--1 text-ink-950">{m.title}</p>
                  <p className="mt-0.5 text-[0.74rem] text-ink-500">
                    {m.institution?.name ?? "Fablet official"} · {levelLabel(m.level)} · {m.lessons} lesson{m.lessons === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {m.sponsored && (
                    <span className="border border-amber-600/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-amber-800">
                      sponsored
                    </span>
                  )}
                  {m.premium && (
                    paidPlan ? (
                      <LockOpen size={14} weight="bold" className="text-emerald-700" aria-label="unlocked" />
                    ) : (
                      <Lock size={14} weight="bold" className="text-ink-400" aria-label="locked" />
                    )
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="border border-line p-6">
          <h2 className="eyebrow">Your access</h2>
          <ul className="mt-5 space-y-4">
            <li className="flex items-start gap-3 border-t border-line pt-4 text-step--1 leading-relaxed text-ink-700">
              <BookOpen size={16} className="mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
              Full access to every free course module in the catalogue.
            </li>
            <li className="flex items-start gap-3 border-t border-line pt-4 text-step--1 leading-relaxed text-ink-700">
              {paidPlan ? (
                <LockOpen size={16} className="mt-0.5 shrink-0 text-emerald-700" aria-hidden="true" />
              ) : (
                <Lock size={16} className="mt-0.5 shrink-0 text-ink-400" aria-hidden="true" />
              )}
              {paidPlan
                ? "Premium modules are unlocked by your plan."
                : "Premium modules unlock with a paid plan."}
            </li>
            <li className="flex items-start gap-3 border-t border-line pt-4 text-step--1 leading-relaxed text-ink-700">
              <Sparkle size={16} className="mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
              Content generation runs on the institution and platform sides — your account consumes.
            </li>
          </ul>
          {!paidPlan && (
            <Link to="/dashboard/premium" className="btn btn-ghost mt-6 h-10 w-full">
              Upgrade
            </Link>
          )}
        </section>
      </div>
    </>
  )
}
