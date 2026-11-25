import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BookOpen, CircleNotch, Lock, LockOpen, Warning } from "@phosphor-icons/react"
import { fetchDictionary } from "../../lib/dictionary"
import { fetchBilling } from "../../lib/billing"
import { useAuth } from "../../lib/auth"

const levelLabel = (level) => level.charAt(0).toUpperCase() + level.slice(1)

const TYPE_LABELS = {
  video: "Video",
  reading: "Reading",
  exercise: "Exercise",
  quiz: "Quiz",
  assignment: "Assignment",
  project: "Project",
  live: "Live",
}

const ROLE_LABELS = {
  student: "Student",
  institution: "Institution owner",
  admin: "Operator",
}

function Bars({ title, unit, items }) {
  const max = Math.max(1, ...items.map((i) => i.value))
  return (
    <section className="rounded-[15px] border border-line bg-paper p-4">
      <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-500">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-[0.78rem] text-ink-500">Nothing published yet.</p>
      ) : (
        <ul className="mt-3.5 space-y-2.5">
          {items.map((i) => (
            <li key={i.label} className="grid grid-cols-[88px_minmax(0,1fr)_54px] items-center gap-3">
              <span className="truncate text-[0.76rem] text-ink-700" title={i.label}>
                {i.label}
              </span>
              <span className="h-1.5 overflow-hidden rounded-full bg-paper-3">
                <span
                  className="block h-full rounded-full bg-accent transition-[width] duration-700"
                  style={{ width: `${(i.value / max) * 100}%` }}
                />
              </span>
              <span className="text-right font-mono text-[0.68rem] tabular-nums text-ink-600">
                {i.value}
                {unit ?? ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function SourceDonut({ fablet, institution, sponsored }) {
  const total = fablet + institution || 1
  const C = 2 * Math.PI * 34
  const instLen = (institution / total) * C
  const fabLen = (fablet / total) * C

  return (
    <section className="rounded-[15px] border border-line bg-paper p-4">
      <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-500">
        Catalogue source
      </h2>
      <div className="mt-3.5 flex items-center gap-5">
        <svg viewBox="0 0 80 80" className="h-[88px] w-[88px] shrink-0 -rotate-90" aria-hidden="true">
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--color-paper-3)" strokeWidth="10" />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="var(--color-ink-950)"
            strokeWidth="10"
            strokeDasharray={`${instLen} ${C}`}
          />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="10"
            strokeDasharray={`${fabLen} ${C}`}
            strokeDashoffset={-instLen}
          />
        </svg>
        <ul className="min-w-0 space-y-2 text-[0.78rem] text-ink-700">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" aria-hidden="true" />
            Fablet official — {fablet}
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-ink-950" aria-hidden="true" />
            Institutions — {institution}
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rotate-45 border border-line-2 bg-paper-3" aria-hidden="true" />
            Sponsored — {sponsored}
          </li>
        </ul>
      </div>
    </section>
  )
}

export default function Overview() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [dictionary, setDictionary] = useState(null)
  const [billing, setBilling] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([fetchDictionary({ limit: 48 }), fetchBilling()])
      .then(([dict, bill]) => {
        setDictionary(dict)
        setBilling(bill)
      })
      .catch((err) => setError(err.message))
  }, [])

  const first = user?.name?.split(" ")[0]
  const paidPlan = Boolean(billing?.live && (billing?.subscription?.amountUsdt ?? 0) > 0)
  const planName = billing?.subscription?.planName ?? user?.planId ?? "Free"

  const stats = useMemo(() => {
    const modules = dictionary?.modules ?? []
    const subjectMinutes = new Map()
    const typeCounts = new Map()
    let lessons = 0
    let minutes = 0
    let questions = 0

    for (const m of modules) {
      for (const s of m.curriculum ?? []) {
        for (const l of s.lessons ?? []) {
          lessons += 1
          minutes += l.durationMinutes || 0
          questions += (l.quiz ?? []).length
          const type = TYPE_LABELS[l.type] ?? "Reading"
          typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1)
          subjectMinutes.set(m.subject, (subjectMinutes.get(m.subject) ?? 0) + (l.durationMinutes || 0))
        }
      }
    }

    return {
      lessons,
      minutes,
      questions,
      subjects: subjectMinutes.size,
      subjectBars: [...subjectMinutes.entries()]
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6),
      typeBars: [...typeCounts.entries()]
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value),
    }
  }, [dictionary])

  const latest = (dictionary?.modules ?? []).slice(0, 5)

  const tiles = [
    {
      label: "Modules in catalogue",
      value: String(dictionary?.total ?? stats.subjectBars.length),
      hint: paidPlan ? "premium unlocked" : "free courses included",
    },
    {
      label: "Subjects covered",
      value: String(stats.subjects),
      hint: "across the published catalogue",
    },
    {
      label: "Lessons",
      value: String(stats.lessons),
      hint: `${Math.round(stats.minutes / 60)}h of content`,
    },
    {
      label: "Test questions",
      value: String(stats.questions),
      hint: "across module quizzes",
    },
  ]

  const detailRows = [
    ["Name", user?.name],
    ["Email", user?.email],
    ["Role", ROLE_LABELS[user?.role] ?? user?.role],
    ["Plan", planName],
    ["Plan status", paidPlan ? "Premium active" : "Free access"],
  ].filter(([, value]) => value)

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-500">Overview</p>
          <h1 className="display mt-2 text-step-2 text-ink-950">
            {first ? `Welcome back, ${first}.` : "Welcome back."}
          </h1>
        </div>
        <button onClick={() => navigate("/dashboard/courses")} className="btn btn-primary h-9 px-4 text-[0.8rem]">
          <BookOpen size={14} weight="bold" aria-hidden="true" />
          Browse courses
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 flex items-start gap-2 text-[0.82rem] text-red-700">
          <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {!dictionary && !error && (
        <p className="mt-6 text-[0.82rem] text-ink-500">
          <CircleNotch size={14} weight="bold" className="inline animate-spin" aria-hidden="true" /> Loading your dashboard
        </p>
      )}

      <dl className="mt-6 grid gap-px overflow-hidden rounded-[15px] border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(({ label, value, hint }) => (
          <div key={label} className="bg-paper p-5">
            <dt className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-500">{label}</dt>
            <dd className="display mt-3 text-step-1 tabular-nums text-ink-950">{value}</dd>
            <p className="mt-1 text-[0.76rem] text-ink-500">{hint}</p>
          </div>
        ))}
      </dl>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Bars title="Content minutes by subject" unit="m" items={stats.subjectBars} />
        <Bars title="Lesson formats" items={stats.typeBars} />
        <SourceDonut
          fablet={dictionary?.counts?.fablet ?? 0}
          institution={dictionary?.counts?.institution ?? 0}
          sponsored={dictionary?.counts?.sponsored ?? 0}
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="overflow-hidden rounded-[15px] border border-line bg-paper">
          <header className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <h2 className="display text-[0.95rem] text-ink-950">Fresh courses</h2>
            <button onClick={() => navigate("/dashboard/courses")} className="link-underline text-[0.78rem] text-ink-600">
              View all
            </button>
          </header>

          {dictionary?.modules?.length === 0 && (
            <p className="px-4 py-6 text-[0.82rem] text-ink-500">No modules published yet.</p>
          )}

          <ul className="divide-y divide-line">
            {latest.map((m) => (
              <li
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition-colors duration-300 hover:bg-paper-2"
              >
                <div className="min-w-0">
                  <p className="text-[0.84rem] text-ink-950">{m.title}</p>
                  <p className="mt-0.5 text-[0.72rem] text-ink-500">
                    {m.institution?.name ?? "Fablet official"} · {m.subject} · {levelLabel(m.level)} ·{" "}
                    {m.curriculumLessons ?? m.lessons} lesson{(m.curriculumLessons ?? m.lessons) === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {m.sponsored && (
                    <span className="rounded-full border border-amber-600/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.08em] text-amber-800">
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

        <section className="rounded-[15px] border border-line p-5">
          <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-500">
            Account details
          </h2>
          <dl className="mt-4">
            {detailRows.map(([label, value]) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-4 border-t border-line py-2.5"
              >
                <dt className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-ink-500">
                  {label}
                </dt>
                <dd className="truncate text-[0.82rem] text-ink-900">{value}</dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-4 border-t border-line py-2.5">
              <dt className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-ink-500">
                Premium
              </dt>
              <dd className="flex items-center gap-1.5 text-[0.82rem] text-ink-900">
                {paidPlan ? (
                  <>
                    <LockOpen size={13} weight="bold" className="text-emerald-700" aria-hidden="true" />
                    Unlocked
                  </>
                ) : (
                  <>
                    <Lock size={13} weight="bold" className="text-ink-400" aria-hidden="true" />
                    Locked
                  </>
                )}
              </dd>
            </div>
          </dl>
          {!paidPlan && (
            <Link to="/dashboard/premium" className="btn btn-ghost mt-5 h-9 w-full text-[0.8rem]">
              Upgrade
            </Link>
          )}
        </section>
      </div>
    </>
  )
}
