import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, CircleNotch, Trash, Warning, CheckCircle } from "@phosphor-icons/react"
import CourseEditor from "./CourseEditor"
import StatusBadge from "../admin/StatusBadge"

/**
 * Generic course editor page: works for the admin console and the institution
 * workspace by swapping the API functions. Handles create/edit, publish,
 * unpublish and delete.
 */
export default function CourseEditorPage({
  courses,
  ai = null,
  extract = null,
  structure = null,
  basePath,
  backLabel = "Courses",
}) {
  const { courseId } = useParams()
  const navigate = useNavigate()
  // The "new" route has no :courseId param at all.
  const isNew = !courseId || courseId === "new"

  const [course, setCourse] = useState(isNew ? null : undefined)
  const [error, setError] = useState("")
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState("")

  const load = useCallback(async () => {
    if (isNew) {
      setCourse(null)
      return
    }
    try {
      const data = await courses.get(courseId)
      const found = data.course ?? data.module
      if (!found) throw new Error("Course not found")
      setCourse(found)
      setError("")
    } catch (err) {
      setError(err.message)
    }
  }, [courseId, isNew, courses])

  useEffect(() => { load() }, [load])

  async function save(payload) {
    if (isNew) {
      const data = await courses.create(payload)
      const id = data.course?.id ?? data.module?.id
      navigate(`${basePath}/${id}`, { replace: true })
      return
    }
    await courses.update(courseId, payload)
    await load()
  }

  async function setStatus(status) {
    setBusy("status")
    setError("")
    setNote("")
    try {
      await courses.update(courseId, { status })
      setNote(
        status === "published"
          ? "Published — the course is live in the public catalogue."
          : "Unpublished — the course is hidden from the catalogue."
      )
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy("")
    }
  }

  async function remove() {
    if (!window.confirm(`Delete "${course?.title}"? This cannot be undone.`)) return
    setBusy("delete")
    setError("")
    try {
      await courses.remove(courseId)
      navigate(basePath, { replace: true })
    } catch (err) {
      setError(err.message)
      setBusy("")
    }
  }

  if (course === undefined) {
    return (
      <>
        <Link to={basePath} className="flex items-center gap-1.5 text-step--1 text-ink-600">
          <ArrowLeft size={14} weight="bold" aria-hidden="true" /> {backLabel}
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
        to={basePath}
        className="flex items-center gap-1.5 text-step--1 text-ink-600 transition-colors hover:text-ink-950"
      >
        <ArrowLeft size={14} weight="bold" aria-hidden="true" /> {backLabel}
      </Link>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="display text-step-3 text-ink-950">
            {isNew ? "New course" : course.title}
          </h1>
          {!isNew && <StatusBadge status={course.status} />}
          {!isNew && course.sponsored && (
            <span className="border border-amber-600/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-amber-800">
              sponsored
            </span>
          )}
        </div>

        {!isNew && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setStatus(course.status === "published" ? "draft" : "published")}
              disabled={Boolean(busy)}
              className="btn btn-ghost h-10"
            >
              {busy === "status" ? (
                <CircleNotch size={15} weight="bold" className="animate-spin" aria-hidden="true" />
              ) : course.status === "published" ? (
                "Unpublish"
              ) : (
                "Publish"
              )}
            </button>
            <button
              onClick={remove}
              disabled={Boolean(busy)}
              className="btn btn-ghost h-10 border-red-700/40 text-red-700 hover:border-red-700"
            >
              {busy === "delete" ? (
                <CircleNotch size={15} weight="bold" className="animate-spin" aria-hidden="true" />
              ) : (
                <>
                  <Trash size={14} weight="regular" aria-hidden="true" />
                  Delete
                </>
              )}
            </button>
          </div>
        )}
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

      <CourseEditor
        initial={course}
        onSave={save}
        savedLabel="Course"
        ai={isNew ? null : ai}
        courseId={isNew ? null : courseId}
        onExtract={extract}
        structure={isNew ? null : structure}
        basePath={basePath}
        onChanged={load}
      />
    </>
  )
}
