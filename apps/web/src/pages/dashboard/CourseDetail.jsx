import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  BookOpen,
  Broadcast,
  CheckSquare,
  CircleNotch,
  Clock,
  Exam,
  FolderOpen,
  Lock,
  LockOpen,
  PencilSimple,
  PlayCircle,
  Warning,
} from "@phosphor-icons/react"
import { fetchCourseDetail } from "../../lib/dictionary"
import { fetchBilling } from "../../lib/billing"
import { fetchMyProgress, setLessonComplete, recordQuizAttempt } from "../../lib/progress"
import Markdown from "../../components/Markdown"

const TYPE_ICONS = {
  video: PlayCircle,
  reading: BookOpen,
  exercise: PencilSimple,
  quiz: CheckSquare,
  assignment: Exam,
  project: FolderOpen,
  live: Broadcast,
}

const LETTERS = "ABCDEFGH"

const levelLabel = (level) => level.charAt(0).toUpperCase() + level.slice(1)

function QuizBlock({ lesson, courseId, initialAttempt, onCompleted }) {
  const scoreable = lesson.quiz.filter(
    (q) => (q.type === "mcq" || q.type === "truefalse") && q.options?.length > 0
  )
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(initialAttempt ?? null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function submit() {
    const score = scoreable.reduce(
      (n, q) => n + (answers[lesson.quiz.indexOf(q)] === q.answerIndex ? 1 : 0),
      0
    )
    const total = scoreable.length
    setBusy(true)
    setError("")
    try {
      await recordQuizAttempt(courseId, lesson.id, score, total)
      await setLessonComplete(courseId, lesson.id, true)
      setResult({ score, total })
      onCompleted?.(lesson.id)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="w-full pl-7">
      <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink-500">
        {lesson.quiz.length} practice question{lesson.quiz.length === 1 ? "" : "s"}
        {result ? ` · scored ${result.score} / ${result.total}` : ""}
      </p>

      <ol className="mt-2 space-y-2">
        {lesson.quiz.map((question, qi) => {
          const selectable =
            (question.type === "mcq" || question.type === "truefalse") && question.options?.length > 0
          return (
            <li key={qi} className="border border-line bg-paper-2 p-3">
              <p className="text-[0.82rem] text-ink-900">
                {qi + 1}. {question.prompt}
              </p>

              {selectable ? (
                <ul className="mt-2 space-y-1">
                  {question.options.map((option, oi) => {
                    const selected = answers[qi] === oi
                    return (
                      <li key={oi}>
                        <button
                          type="button"
                          onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                          aria-pressed={selected}
                          className={`flex w-full items-center gap-2 rounded-[8px] border px-2.5 py-1.5 text-left text-[0.78rem] transition-colors duration-200 ${
                            selected
                              ? "border-accent bg-accent-soft text-accent-ink"
                              : "border-line bg-paper text-ink-600 hover:border-ink-400"
                          }`}
                        >
                          <span className="font-mono text-[0.62rem] uppercase">
                            {LETTERS[oi] ?? oi + 1}
                          </span>
                          {option}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : question.type === "fillblank" ? (
                <p className="mt-1 text-[0.72rem] text-ink-500">Fill in the blank.</p>
              ) : question.pairs?.length > 0 ? (
                <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                  {question.pairs.map((pair, pi) => (
                    <li key={pi} className="text-[0.78rem] text-ink-600">
                      {pair.left} <span className="text-ink-400">→</span> {pair.right}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          )
        })}
      </ol>

      {scoreable.length > 0 && (
        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className="btn btn-ghost mt-3 h-8 px-3 text-[0.76rem]"
        >
          {busy && <CircleNotch size={12} weight="bold" className="animate-spin" aria-hidden="true" />}
          {result ? "Retake quiz" : "Submit quiz"}
        </button>
      )}
      {error && <p className="mt-2 text-[0.78rem] text-red-700">{error}</p>}
      {result && (
        <p className="mt-2 text-[0.78rem] text-ink-700">
          Scored {result.score} of {result.total}. Lesson marked complete.
        </p>
      )}
    </div>
  )
}

export default function CourseDetail() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [billing, setBilling] = useState(null)
  const [completed, setCompleted] = useState(() => new Set())
  const [attempts, setAttempts] = useState({})
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([
      fetchCourseDetail(courseId),
      fetchBilling(),
      fetchMyProgress().catch(() => null),
    ])
      .then(([detail, bill, progress]) => {
        setCourse(detail.course)
        setBilling(bill)
        const item = progress?.items?.find((i) => i.courseId === String(courseId))
        if (item) {
          setCompleted(new Set(item.completedLessons ?? []))
          const latest = {}
          for (const attempt of item.attempts ?? []) {
            latest[attempt.lessonId] = { score: attempt.score, total: attempt.total }
          }
          setAttempts(latest)
        }
      })
      .catch((err) => setError(err.message))
  }, [courseId])

  function markCompletedLocally(lessonId) {
    setCompleted((prev) => new Set(prev).add(lessonId))
  }

  async function toggleLesson(lessonId) {
    const isDone = completed.has(lessonId)
    setCompleted((prev) => {
      const next = new Set(prev)
      if (isDone) next.delete(lessonId)
      else next.add(lessonId)
      return next
    })
    try {
      await setLessonComplete(courseId, lessonId, !isDone)
    } catch {
      setCompleted((prev) => {
        const next = new Set(prev)
        if (isDone) next.add(lessonId)
        else next.delete(lessonId)
        return next
      })
    }
  }

  const paidPlan = Boolean(billing?.live && (billing?.subscription?.amountUsdt ?? 0) > 0)
  const locked = Boolean(course?.premium && !paidPlan)

  if (!course) {
    return (
      <>
        <Link to="/dashboard/courses" className="flex items-center gap-1.5 text-step--1 text-ink-600">
          <ArrowLeft size={14} weight="bold" aria-hidden="true" /> All courses
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

  const totalLessons = course.curriculumLessons ?? 0
  const doneCount = completed.size
  const percent = totalLessons > 0 ? Math.round((doneCount / totalLessons) * 100) : 0

  return (
    <>
      <Link
        to="/dashboard/courses"
        className="flex items-center gap-1.5 text-step--1 text-ink-600 transition-colors hover:text-ink-950"
      >
        <ArrowLeft size={14} weight="bold" aria-hidden="true" /> All courses
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow">{course.subject}</p>
            {course.sponsored && (
              <span className="rounded-full border border-amber-600/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-amber-800">
                sponsored
              </span>
            )}
            {course.premium ? (
              locked ? (
                <span className="flex items-center gap-1 rounded-full border border-line-2 bg-paper-3 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-600">
                  <Lock size={11} weight="bold" aria-hidden="true" /> locked
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full border border-emerald-700/25 bg-emerald-700/10 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-emerald-800">
                  <LockOpen size={11} weight="bold" aria-hidden="true" /> unlocked
                </span>
              )
            ) : (
              <span className="rounded-full border border-accent/40 bg-accent-soft px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-accent-ink">
                free
              </span>
            )}
          </div>
          <h1 className="display mt-3 text-step-3 text-ink-950">{course.title}</h1>
          <p className="mt-2 text-step--1 text-ink-500">
            {course.institution?.name ?? "Fablet official"} · {levelLabel(course.level)} ·{" "}
            {course.sections} sections · {course.curriculumLessons} lessons · {course.minutes} min
          </p>

          <div className="mt-4 max-w-[320px]">
            <div className="flex items-baseline justify-between font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-500">
              <span>Your progress</span>
              <span className="tabular-nums">
                {doneCount} / {totalLessons} lessons · {percent}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper-3">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {course.description && (
        <Markdown text={course.description} className="mt-6 max-w-[80ch]" />
      )}

      {locked && (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[12px] border border-accent/30 bg-accent-soft px-4 py-3 text-step--1 text-accent-ink">
          <Lock size={16} weight="bold" aria-hidden="true" />
          <span>This is a premium course — lesson content unlocks with an active plan.</span>
          <Link to="/dashboard/premium" className="link-underline font-medium">Unlock with a plan</Link>
        </div>
      )}

      {course.outcomes?.length > 0 && (
        <section className="mt-8 overflow-hidden rounded-[15px] border border-line bg-paper">
          <header className="border-b border-line px-5 py-3">
            <h2 className="display text-step-1 text-ink-950">What you'll learn</h2>
          </header>
          <ul className="grid gap-3 p-5 sm:grid-cols-2">
            {course.outcomes.map((outcome) => (
              <li key={outcome} className="flex items-start gap-3 text-step--1 leading-relaxed text-ink-700">
                <CheckSquare size={15} weight="bold" className="mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
                {outcome}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6 overflow-hidden rounded-[15px] border border-line bg-paper">
        <header className="border-b border-line px-5 py-3">
          <h2 className="display text-step-1 text-ink-950">Curriculum</h2>
        </header>

        {course.curriculum?.length === 0 && (
          <p className="px-5 py-6 text-step--1 text-ink-500">The curriculum is being prepared.</p>
        )}

        <div className="divide-y divide-line">
          {course.curriculum?.map((section, si) => (
            <div key={section.id} className="p-5">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-[0.7rem] tabular text-accent-ink">0{si + 1}</span>
                <h3 className="display text-step-1 text-ink-950">{section.title}</h3>
                {section.summary && (
                  <span className="text-step--1 text-ink-500">{section.summary}</span>
                )}
              </div>

              <ul className="mt-4 divide-y divide-line">
                {section.lessons.map((lesson) => {
                  const Icon = TYPE_ICONS[lesson.type] ?? BookOpen
                  const isDone = completed.has(lesson.id)
                  const attempt = attempts[lesson.id]
                  return (
                    <li key={lesson.id} className="flex flex-wrap items-center justify-between gap-3 py-1.5">
                      <span className="flex min-w-0 items-center gap-3">
                        <Icon size={16} weight="regular" className="shrink-0 text-ink-500" aria-hidden="true" />
                        <span className="truncate text-step--1 text-ink-900">{lesson.title}</span>
                        <span className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-ink-500">
                          {lesson.type}
                        </span>
                      </span>
                      <span className="flex items-center gap-3 text-[0.74rem] text-ink-500">
                        {attempt && (
                          <span className="rounded-full border border-emerald-700/25 bg-emerald-700/10 px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.08em] text-emerald-800">
                            quiz {attempt.score}/{attempt.total}
                          </span>
                        )}
                        {lesson.durationMinutes > 0 && (
                          <span className="flex items-center gap-1 tabular">
                            <Clock size={12} weight="regular" aria-hidden="true" />
                            {lesson.durationMinutes} min
                          </span>
                        )}
                        {!locked && (
                          <button
                            type="button"
                            onClick={() => toggleLesson(lesson.id)}
                            className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 font-mono text-[0.58rem] uppercase tracking-[0.08em] transition-colors duration-300 ${
                              isDone
                                ? "border-emerald-700/30 bg-emerald-700/10 text-emerald-800"
                                : "border-line-2 text-ink-600 hover:border-ink-950 hover:text-ink-950"
                            }`}
                          >
                            {isDone && <CheckSquare size={11} weight="bold" aria-hidden="true" />}
                            {isDone ? "Completed" : "Mark complete"}
                          </button>
                        )}
                        {locked ? (
                          <Lock size={13} weight="bold" className="text-ink-400" aria-label="locked" />
                        ) : (
                          lesson.videoUrl && (
                            <a
                              href={lesson.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="link-underline flex items-center gap-1"
                            >
                              <PlayCircle size={13} weight="bold" aria-hidden="true" />
                              Watch
                            </a>
                          )
                        )}
                      </span>
                      {!locked && lesson.content && (
                        <Markdown
                          text={lesson.content}
                          className="w-full pl-7 text-[0.8rem]"
                        />
                      )}
                      {!locked && lesson.quiz?.length > 0 && (
                        <QuizBlock
                          lesson={lesson}
                          courseId={courseId}
                          initialAttempt={attempt}
                          onCompleted={markCompletedLocally}
                        />
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
