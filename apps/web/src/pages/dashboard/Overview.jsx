import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BookOpen, CircleNotch, Lock, LockOpen, Warning } from "@phosphor-icons/react"
import { fetchDictionary } from "../../lib/dictionary"
import { fetchBilling } from "../../lib/billing"
import { fetchMyProgress } from "../../lib/progress"
import { useAuth } from "../../lib/auth"

const levelLabel = (level) => level.charAt(0).toUpperCase() + level.slice(1)

function Bars({ title, suffix, items }) {
  const max = Math.max(1, ...items.map((i) => i.value))
  return (
    <section className="rounded-[15px] border border-line bg-paper p-3.5">
      <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-500">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-[0.8rem] leading-relaxed text-ink-500">
          Nothing here yet — complete a lesson and it shows up.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((i) => (
            <li key={i.key ?? i.label} className="grid grid-cols-[92px_minmax(0,1fr)_50px] items-center gap-3">
              <span className="truncate text-[0.76rem] text-ink-700" title={i.hint ?? i.label}>
                {i.label}
              </span>
              <span className="h-1.5 overflow-hidden rounded-full bg-paper-3">
                <span
                  className="block h-full rounded-full bg-accent transition-[width] duration-700"
                  style={{ width: `${Math.min(100, (i.value / max) * 100)}%` }}
                />
              </span>
              <span className="text-right font-mono text-[0.68rem] tabular-nums text-ink-600">
                {i.value}
                {suffix ?? ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default function Overview() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [dictionary, setDictionary] = useState(null)
  const [billing, setBilling] = useState(null)
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([
      fetchDictionary({ limit: 48 }),
      fetchBilling(),
      fetchMyProgress().catch(() => null),
    ])
      .then(([dict, bill, prog]) => {
        setDictionary(dict)
        setBilling(bill)
        setProgress(prog)
      })
      .catch((err) => setError(err.message))
  }, [])

  const first = user?.name?.split(" ")[0]
  const paidPlan = Boolean(billing?.live && (billing?.subscription?.amountUsdt ?? 0) > 0)

  const summary = progress?.summary ?? {
    coursesStarted: 0,
    coursesCompleted: 0,
    lessonsCompleted: 0,
    minutesStudied: 0,
    quizzesTaken: 0,
    averageScore: null,
  }

  const moduleBars = useMemo(
    () =>
      (progress?.items ?? [])
        .slice()
        .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity))
        .slice(0, 6)
        .map((i) => ({
          key: i.courseId,
          label: i.title,
          value: i.percent,
          hint: `${i.lessonsComplete} of ${i.lessonsTotal} lessons`,
        })),
    [progress]
  )

  const scoreBars = useMemo(
    () =>
      (progress?.recentAttempts ?? []).map((a, i) => ({
        key: `${a.courseId}-${i}`,
        label: a.courseTitle,
        value: a.percent,
        hint: `scored ${a.score} of ${a.total}`,
      })),
    [progress]
  )

  const latest = (dictionary?.modules ?? []).slice(0, 5)

  const tiles = [
    {
      label: "Lessons completed",
      value: String(summary.lessonsCompleted),
      hint: summary.coursesStarted
        ? `across ${summary.coursesStarted} module${summary.coursesStarted === 1 ? "" : "s"}`
        : "start with any course",
    },
    {
      label: "Modules completed",
      value: String(summary.coursesCompleted),
      hint: summary.coursesStarted
        ? `of ${summary.coursesStarted} started`
        : "no modules started yet",
    },
    {
      label: "Quizzes taken",
      value: String(summary.quizzesTaken),
      hint:
        summary.averageScore == null ? "no attempts yet" : `average ${summary.averageScore}%`,
    },
    {
      label: "Time studied",
      value: `${summary.minutesStudied}m`,
      hint: "time on completed lessons",
    },
  ]

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

      {!progress && !error && (
        <p className="mt-6 text-[0.82rem] text-ink-500">
          <CircleNotch size={14} weight="bold" className="inline animate-spin" aria-hidden="true" /> Loading your progress
        </p>
      )}

      <dl className="mt-6 grid gap-px overflow-hidden rounded-[15px] border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(({ label, value, hint }) => (
          <div key={label} className="bg-paper p-4">
            <dt className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-500">{label}</dt>
            <dd className="display mt-2.5 text-[1.15rem] tabular-nums text-ink-950">{value}</dd>
            <p className="mt-0.5 text-[0.72rem] text-ink-500">{hint}</p>
          </div>
        ))}
      </dl>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Bars title="Progress by module" suffix="%" items={moduleBars} />
        <Bars title="Recent quiz scores" suffix="%" items={scoreBars} />
      </div>

      {progress && progress.items.length === 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-[15px] border border-dashed border-line-2 bg-paper-2 px-4 py-3">
          <p className="text-[0.82rem] text-ink-700">
            No progress yet. Open any module and mark your first lesson complete — the charts fill in
            from there.
          </p>
          <button onClick={() => navigate("/dashboard/courses")} className="btn btn-primary h-8 px-3.5 text-[0.76rem]">
            Start a module
          </button>
        </div>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
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
            {latest.map((m) => {
              const isFablet = !m.institution
              return (
                <li
                  key={m.id}
                  className={`flex flex-wrap items-center justify-between gap-3 px-3.5 py-2.5 transition-colors duration-300 ${
                    isFablet ? "bg-accent-soft hover:bg-accent-soft/70" : "hover:bg-paper-2"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-[0.82rem] text-ink-950">{m.title}</p>
                    <p className="mt-0.5 text-[0.7rem] text-ink-500">
                      {m.institution?.name ?? "Fablet official"} · {m.subject} · {levelLabel(m.level)} ·{" "}
                      {m.curriculumLessons ?? m.lessons} lesson{(m.curriculumLessons ?? m.lessons) === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isFablet && (
                      <span className="rounded-full bg-paper px-2 py-0.5 font-mono text-[0.56rem] uppercase tracking-[0.08em] text-accent-ink">
                        Fablet
                      </span>
                    )}
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
              )
            })}
          </ul>
        </section>

        <section className="rounded-[15px] border border-line p-4">
          <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-500">
            Keep going
          </h2>
          {moduleBars.length > 0 ? (
            <ul className="mt-4">
              {moduleBars.slice(0, 3).map((m) => (
                <li key={m.key} className="border-t border-line py-3 first:border-t-0 first:pt-0">
                  <p className="truncate text-[0.82rem] text-ink-950">{m.label}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="h-1 flex-1 overflow-hidden rounded-full bg-paper-3">
                      <span className="block h-full rounded-full bg-accent" style={{ width: `${m.value}%` }} />
                    </span>
                    <span className="font-mono text-[0.62rem] tabular-nums text-ink-500">{m.value}%</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[0.8rem] leading-relaxed text-ink-500">
              Your started modules will appear here with their progress.
            </p>
          )}
          <Link to="/dashboard/courses" className="btn btn-ghost mt-5 h-9 w-full text-[0.8rem]">
            Continue learning
          </Link>
        </section>
      </div>
    </>
  )
}
