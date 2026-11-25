import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  BookOpen,
  CircleNotch,
  Lock,
  LockOpen,
  MagnifyingGlass,
  Warning,
  CheckCircle,
} from "@phosphor-icons/react"
import { fetchDictionary } from "../../lib/dictionary"
import { fetchBilling } from "../../lib/billing"

const levelLabel = (level) => level.charAt(0).toUpperCase() + level.slice(1)

export default function Courses() {
  const [data, setData] = useState(null)
  const [billing, setBilling] = useState(null)
  const [query, setQuery] = useState("")
  const [subject, setSubject] = useState("")
  const [institutionId, setInstitutionId] = useState("")
  const [source, setSource] = useState("institution")
  const [page, setPage] = useState(1)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchBilling().then(setBilling).catch(() => setBilling(null))
  }, [])

  const load = useCallback(async () => {
    try {
      setData(
        await fetchDictionary({
          q: query,
          subject,
          source,
          page,
          limit: 6,
          institutionId: source === "institution" ? institutionId : "",
        })
      )
    } catch (err) {
      setError(err.message)
    }
  }, [query, subject, institutionId, source, page])

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [load])

  const paidPlan = Boolean(billing?.live && (billing?.subscription?.amountUsdt ?? 0) > 0)
  const premiumUnlocked = paidPlan
  const lockedCount = (data?.modules ?? []).filter((m) => m.premium && !premiumUnlocked).length

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="display text-step-1 text-ink-950">Course modules</h1>
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-ink-400">
          Fablet and partner institutions
        </p>
      </div>

      {billing && (
        <div
          className={`mt-4 flex flex-wrap items-center gap-3 rounded-[12px] border px-4 py-3 text-[0.82rem] ${
            premiumUnlocked
              ? "border-emerald-700/25 bg-emerald-700/10 text-emerald-800"
              : "border-line-2 bg-paper-2 text-ink-700"
          }`}
        >
          {premiumUnlocked ? (
            <CheckCircle size={16} weight="bold" aria-hidden="true" />
          ) : (
            <Lock size={16} weight="bold" aria-hidden="true" />
          )}
          <span>
            {premiumUnlocked
              ? "Your plan is active — every premium module is unlocked."
              : `${lockedCount} premium module${lockedCount === 1 ? " is" : "s are"} locked on the free plan.`}
          </span>
          {!premiumUnlocked && (
            <Link to="/dashboard/premium" className="link-underline font-medium">
              Unlock with a plan
            </Link>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-1 border-b border-line">
        {[
          { key: "institution", label: "Institution-led courses", count: data?.counts?.institution },
          { key: "fablet", label: "Fablet courses", count: data?.counts?.fablet },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setSource(tab.key)
              setPage(1)
            }}
            aria-pressed={source === tab.key}
            className={`-mb-px border-b-2 px-4 py-2.5 text-step--1 transition-colors ${
              source === tab.key
                ? "border-accent-ink text-ink-950"
                : "border-transparent text-ink-600 hover:text-ink-950"
            }`}
          >
            {tab.label}
            {typeof tab.count === "number" && (
              <span className="ml-2 font-mono text-[0.68rem] text-ink-500">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <label className="relative min-w-[240px] flex-1">
          <span className="sr-only">Search modules</span>
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Search title, subject or topic"
            className="field pl-9"
          />
        </label>
        <label className="flex items-center gap-2 text-step--1 text-ink-600">
          Subject
          <select
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value)
              setPage(1)
            }}
            className="field w-[180px] py-2"
          >
            <option value="">All</option>
            {(data?.subjects ?? []).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        {source === "institution" && (
          <label className="flex items-center gap-2 text-step--1 text-ink-600">
            Institution
            <select
              value={institutionId}
              onChange={(e) => {
                setInstitutionId(e.target.value)
                setPage(1)
              }}
              className="field w-[200px] py-2"
            >
              <option value="">All</option>
              {(data?.institutions ?? []).map((i) => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-5 flex items-start gap-2 text-step--1 text-red-700">
          <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {!data && !error && (
        <p className="mt-6 text-step--1 text-ink-500">
          <CircleNotch size={16} weight="bold" className="inline animate-spin" aria-hidden="true" /> Loading
        </p>
      )}

      {data?.modules?.length === 0 && (
        <p className="mt-10 border border-dashed border-line-2 px-6 py-12 text-center text-step--1 text-ink-500">
          No modules match that search.
        </p>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data?.modules?.map((m) => {
          const locked = m.premium && !premiumUnlocked
          const isFablet = !m.institution
          return (
            <Link
              key={m.id}
              to={`/dashboard/courses/${m.id}`}
              className={`flex flex-col rounded-[15px] border p-3.5 transition-colors duration-300 ${
                isFablet
                  ? "border-accent/30 bg-accent-soft hover:border-accent"
                  : "border-line bg-paper hover:border-accent/60"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-mono text-[0.56rem] uppercase tracking-[0.08em] text-ink-500">
                  {m.subject}
                </p>
                <span className="flex shrink-0 items-center gap-1.5">
                  {m.sponsored && (
                    <span className="rounded-full border border-amber-600/30 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[0.52rem] uppercase tracking-[0.08em] text-amber-800">
                      sponsored
                    </span>
                  )}
                  {m.premium ? (
                    locked ? (
                      <span className="flex items-center gap-1 rounded-full border border-line-2 bg-paper-3 px-1.5 py-0.5 font-mono text-[0.52rem] uppercase tracking-[0.08em] text-ink-600">
                        <Lock size={9} weight="bold" aria-hidden="true" /> locked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full border border-emerald-700/25 bg-emerald-700/10 px-1.5 py-0.5 font-mono text-[0.52rem] uppercase tracking-[0.08em] text-emerald-800">
                        <LockOpen size={9} weight="bold" aria-hidden="true" /> unlocked
                      </span>
                    )
                  ) : (
                    <span className="rounded-full border border-accent-ink/25 bg-paper px-1.5 py-0.5 font-mono text-[0.52rem] uppercase tracking-[0.08em] text-accent-ink">
                      free
                    </span>
                  )}
                </span>
              </div>

              <h2 className="display mt-2 text-[1.02rem] leading-snug text-ink-950">{m.title}</h2>
              <p className="mt-1 line-clamp-2 text-[0.76rem] leading-relaxed text-ink-600">{m.summary}</p>

              {m.topics?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {m.topics.slice(0, 3).map((topic) => (
                    <span key={topic} className="rounded-full border border-line px-1.5 py-0.5 font-mono text-[0.54rem] uppercase tracking-[0.08em] text-ink-500">
                      {topic}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2 text-[0.66rem] text-ink-500">
                <span className="truncate">{m.institution?.name ?? "Fablet official"}</span>
                <span className="shrink-0">{levelLabel(m.level)} · {m.lessons} lesson{m.lessons === 1 ? "" : "s"}</span>
              </div>

              {locked && (
                <span className="mt-2 flex items-center gap-1.5 text-[0.74rem] font-medium text-accent-ink">
                  Preview the curriculum{" "}
                  <BookOpen size={12} weight="bold" aria-hidden="true" />
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {data && data.pages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-line pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="btn btn-ghost h-9 px-4 text-step--1"
          >
            Previous
          </button>
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-500">
            Page {data.page} of {data.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
            disabled={page >= data.pages}
            className="btn btn-ghost h-9 px-4 text-step--1"
          >
            Next
          </button>
        </div>
      )}
    </>
  )
}
