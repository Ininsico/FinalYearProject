import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  CircleNotch,
  Plus,
  Trash,
  Warning,
  CheckCircle,
} from "@phosphor-icons/react"

export default function SectionEditorPage({ courses, structure, basePath, backLabel = "Course" }) {
  const { courseId, sectionIndex } = useParams()
  const si = Number(sectionIndex)
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [form, setForm] = useState({ title: "", summary: "" })
  const [busy, setBusy] = useState(false)
  const [structBusy, setStructBusy] = useState("")
  const [error, setError] = useState("")
  const [note, setNote] = useState("")

  async function load() {
    try {
      const data = await courses.get(courseId)
      const loaded = data.course ?? data
      setCourse(loaded)
      const section = loaded.curriculum?.[si]
      if (section) setForm({ title: section.title ?? "", summary: section.summary ?? "" })
      setError("")
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, sectionIndex])

  const section = course?.curriculum?.[si]

  async function saveSection(e) {
    e.preventDefault()
    setBusy(true)
    setError("")
    setNote("")
    try {
      await structure.updateSection(courseId, si, {
        title: form.title.trim(),
        summary: form.summary.trim(),
      })
      await load()
      setNote("Section saved.")
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function addLesson() {
    setStructBusy("add-lesson")
    setError("")
    try {
      await structure.addLesson(courseId, si, { title: `Lesson ${(section?.lessons.length ?? 0) + 1}` })
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setStructBusy("")
    }
  }

  async function removeLesson(li) {
    if (!window.confirm(`Delete lesson ${li + 1}? This cannot be undone.`)) return
    setStructBusy(`lesson-${li}`)
    setError("")
    try {
      await structure.deleteLesson(courseId, si, li)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setStructBusy("")
    }
  }

  async function removeSection() {
    if (!window.confirm("Delete this section and every lesson inside it?")) return
    setStructBusy("delete-section")
    setError("")
    try {
      await structure.deleteSection(courseId, si)
      navigate(`${basePath}/${courseId}`)
    } catch (err) {
      setError(err.message)
      setStructBusy("")
    }
  }

  if (!course && !error) {
    return (
      <p className="mt-8 flex items-center gap-2 text-step--1 text-ink-500">
        <CircleNotch size={15} weight="bold" className="animate-spin" aria-hidden="true" />
        Loading section…
      </p>
    )
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`${basePath}/${courseId}`}
          className="inline-flex items-center gap-2 text-step--1 text-ink-600 transition-colors hover:text-ink-950"
        >
          <ArrowLeft size={14} weight="bold" aria-hidden="true" /> Back to {backLabel.toLowerCase()}
        </Link>
        <span className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-ink-500">
          {backLabel} / Section {si + 1}
        </span>
      </div>

      {error && (
        <p role="alert" className="mt-4 flex items-start gap-2 text-step--1 text-red-700">
          <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {course && !section && (
        <p className="mt-6 text-step--1 text-ink-600">
          This section no longer exists — it may have been deleted.
        </p>
      )}

      {section && (
        <>
          <h1 className="display mt-5 text-step-3 text-ink-950">{section.title}</h1>
          <p className="mt-2 text-step--1 text-ink-600">{course.title}</p>

          <form onSubmit={saveSection} className="mt-8 border border-line bg-paper">
            <header className="border-b border-line px-5 py-3">
              <h2 className="display text-step-1 text-ink-950">Section details</h2>
            </header>
            <div className="space-y-4 p-5">
              <label className="block">
                <span className="mb-2 block text-step--1 font-medium text-ink-700">Section title</span>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="field"
                  placeholder="e.g. Foundations"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-step--1 font-medium text-ink-700">Summary</span>
                <input
                  value={form.summary}
                  onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                  className="field"
                  placeholder="What this section covers (optional)"
                />
              </label>

              {note && (
                <p role="status" className="flex items-start gap-2 text-step--1 text-emerald-800">
                  <CheckCircle size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
                  {note}
                </p>
              )}

              <button type="submit" disabled={busy} className="btn btn-primary h-10">
                {busy ? (
                  <CircleNotch size={15} weight="bold" className="animate-spin" aria-hidden="true" />
                ) : (
                  "Save section"
                )}
              </button>
            </div>
          </form>

          <section className="mt-6 border border-line bg-paper">
            <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
              <h2 className="display text-step-1 text-ink-950">Lessons</h2>
              <span className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-ink-500">
                {section.lessons.length} item{section.lessons.length === 1 ? "" : "s"}
              </span>
            </header>

            <div className="space-y-3 p-5">
              {section.lessons.length === 0 && (
                <p className="border border-dashed border-line-2 px-4 py-6 text-center text-step--1 text-ink-500">
                  No lessons yet.
                </p>
              )}

              {section.lessons.map((lesson, li) => (
                <div
                  key={lesson.id ?? li}
                  className="flex items-center justify-between gap-3 border border-line px-4 py-3 transition-colors hover:border-line-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-step--1 font-medium text-ink-900">
                      {li + 1}. {lesson.title}
                    </p>
                    <p className="mt-0.5 flex items-center gap-2 text-[0.72rem] text-ink-500">
                      <span className="border border-line-2 bg-paper-3 px-1.5 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.1em]">
                        {lesson.type}
                      </span>
                      {Number(lesson.durationMinutes) > 0 && (
                        <span className="tabular">{lesson.durationMinutes} min</span>
                      )}
                      {lesson.type === "quiz" && (
                        <span className="tabular">{lesson.quiz?.length ?? 0} questions</span>
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      to={`${basePath}/${courseId}/sections/${si}/lessons/${li}`}
                      className="btn btn-ghost h-9 px-3 text-[0.72rem]"
                    >
                      Open <ArrowRight size={12} weight="bold" aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeLesson(li)}
                      disabled={structBusy === `lesson-${li}`}
                      className="btn btn-ghost h-9 px-2 text-[0.72rem]"
                      aria-label={`Delete lesson ${li + 1}`}
                    >
                      {structBusy === `lesson-${li}` ? (
                        <CircleNotch size={13} weight="bold" className="animate-spin" aria-hidden="true" />
                      ) : (
                        <Trash size={13} weight="regular" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addLesson}
                disabled={structBusy === "add-lesson"}
                className="btn btn-ghost h-10"
              >
                {structBusy === "add-lesson" ? (
                  <CircleNotch size={14} weight="bold" className="animate-spin" aria-hidden="true" />
                ) : (
                  <Plus size={14} weight="bold" aria-hidden="true" />
                )}
                Add lesson
              </button>
            </div>
          </section>

          <section className="mt-6 border border-red-200 bg-paper">
            <header className="border-b border-red-200 px-5 py-3">
              <h2 className="display text-step-1 text-red-800">Danger zone</h2>
            </header>
            <div className="flex flex-wrap items-center justify-between gap-3 p-5">
              <p className="text-step--1 text-ink-600">
                Deleting the section removes all {section.lessons.length} lesson
                {section.lessons.length === 1 ? "" : "s"} inside it.
              </p>
              <button
                type="button"
                onClick={removeSection}
                disabled={structBusy === "delete-section"}
                className="btn h-10 border border-red-300 px-4 text-step--1 text-red-800 transition-colors hover:bg-red-50"
              >
                {structBusy === "delete-section" ? (
                  <CircleNotch size={14} weight="bold" className="animate-spin" aria-hidden="true" />
                ) : (
                  <Trash size={14} weight="regular" aria-hidden="true" />
                )}
                Delete section
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
