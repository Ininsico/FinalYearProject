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

const levelLabel = (level) => level.charAt(0).toUpperCase() + level.slice(1)

export default function CourseDetail() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [billing, setBilling] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([fetchCourseDetail(courseId), fetchBilling()])
      .then(([detail, bill]) => {
        setCourse(detail.course)
        setBilling(bill)
      })
      .catch((err) => setError(err.message))
  }, [courseId])

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
              <span className="border border-amber-600/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-amber-800">
                sponsored
              </span>
            )}
            {course.premium ? (
              locked ? (
                <span className="flex items-center gap-1 border border-line-2 bg-paper-3 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-600">
                  <Lock size={11} weight="bold" aria-hidden="true" /> locked
                </span>
              ) : (
                <span className="flex items-center gap-1 border border-emerald-700/25 bg-emerald-700/10 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-emerald-800">
                  <LockOpen size={11} weight="bold" aria-hidden="true" /> unlocked
                </span>
              )
            ) : (
              <span className="border border-accent/40 bg-accent-soft px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-accent-ink">
                free
              </span>
            )}
          </div>
          <h1 className="display mt-3 text-step-3 text-ink-950">{course.title}</h1>
          <p className="mt-2 text-step--1 text-ink-500">
            {course.institution?.name ?? "Fablet official"} · {levelLabel(course.level)} ·{" "}
            {course.sections} sections · {course.curriculumLessons} lessons · {course.minutes} min
          </p>
        </div>
      </div>

      {course.description && (
        <Markdown text={course.description} className="mt-6 max-w-[80ch]" />
      )}

      {locked && (
        <div className="mt-6 flex flex-wrap items-center gap-3 border border-accent/30 bg-accent-soft px-4 py-3 text-step--1 text-accent-ink">
          <Lock size={16} weight="bold" aria-hidden="true" />
          <span>This is a premium course — lesson content unlocks with an active plan.</span>
          <Link to="/dashboard/premium" className="link-underline font-medium">Unlock with a plan</Link>
        </div>
      )}

      {course.outcomes?.length > 0 && (
        <section className="mt-8 border border-line bg-paper">
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

      <section className="mt-6 border border-line bg-paper">
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
                  return (
                    <li key={lesson.id} className="flex flex-wrap items-center justify-between gap-3 py-1.5">
                      <span className="flex min-w-0 items-center gap-3">
                        <Icon size={16} weight="regular" className="shrink-0 text-ink-500" aria-hidden="true" />
                        <span className="truncate text-step--1 text-ink-900">{lesson.title}</span>
                        <span className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-500">
                          {lesson.type}
                        </span>
                      </span>
                      <span className="flex items-center gap-4 text-[0.74rem] text-ink-500">
                        {lesson.durationMinutes > 0 && (
                          <span className="flex items-center gap-1 tabular">
                            <Clock size={12} weight="regular" aria-hidden="true" />
                            {lesson.durationMinutes} min
                          </span>
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
                        <div className="w-full pl-7">
                          <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink-500">
                            {lesson.quiz.length} practice question{lesson.quiz.length === 1 ? "" : "s"}
                          </p>
                          <ol className="mt-2 space-y-2">
                            {lesson.quiz.map((question, qi) => (
                              <li key={qi} className="border border-line bg-paper-2 p-3">
                                <p className="text-[0.82rem] text-ink-900">
                                  {qi + 1}. {question.prompt}
                                </p>
                                {(question.type === "mcq" || question.type === "truefalse") &&
                                  question.options?.length > 0 && (
                                    <ul className="mt-2 space-y-1">
                                      {question.options.map((option, oi) => (
                                        <li
                                          key={oi}
                                          className="flex items-center gap-2 text-[0.78rem] text-ink-600"
                                        >
                                          <span className="font-mono text-[0.62rem] uppercase text-ink-400">
                                            {"ABCDEFGH"[oi] ?? oi + 1}
                                          </span>
                                          {option}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                {question.type === "fillblank" && (
                                  <p className="mt-1 text-[0.72rem] text-ink-500">
                                    Fill in the blank.
                                  </p>
                                )}
                                {question.type === "match" && question.pairs?.length > 0 && (
                                  <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                                    {question.pairs.map((pair, pi) => (
                                      <li key={pi} className="text-[0.78rem] text-ink-600">
                                        {pair.left} <span className="text-ink-400">→</span> {pair.right}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ol>
                        </div>
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
