import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  CircleNotch,
  Plus,
  Trash,
  Warning,
  CheckCircle,
  Sparkle,
  UploadSimple,
} from "@phosphor-icons/react"
import AutoTextarea from "../AutoTextarea"

export const LESSON_TYPES = ["video", "reading", "exercise", "quiz", "assignment", "project", "live"]

const toForm = (course) => ({
  title: course?.title ?? "",
  subject: course?.subject ?? "",
  level: course?.level ?? "beginner",
  premium: Boolean(course?.premium),
  sponsored: Boolean(course?.sponsored),
  summary: course?.summary ?? "",
  description: course?.description ?? "",
  topics: (course?.topics ?? []).join(", "),
  outcomes: (course?.outcomes ?? []).join("\n"),
  knowledge: (course?.knowledge ?? []).map((source) => ({
    title: source.title ?? "Source",
    text: source.text ?? "",
  })),
})

const toPayload = (form) => ({
  title: form.title.trim(),
  subject: form.subject.trim(),
  level: form.level,
  premium: form.premium,
  sponsored: form.sponsored,
  summary: form.summary.trim(),
  description: form.description.trim(),
  topics: form.topics.split(",").map((t) => t.trim()).filter(Boolean),
  outcomes: form.outcomes.split("\n").map((t) => t.trim()).filter(Boolean),
  knowledge: (form.knowledge ?? [])
    .map((source) => ({ title: source.title.trim() || "Source", text: source.text }))
    .filter((source) => source.text.trim()),
})

export default function CourseEditor({
  initial,
  onSave,
  savedLabel = "Course",
  ai = null,
  courseId = null,
  onExtract = null,
  structure = null,
  basePath = null,
  onChanged = null,
}) {
  const [form, setForm] = useState(() => toForm(initial))
  const [busy, setBusy] = useState(false)
  const [structBusy, setStructBusy] = useState(false)
  const [error, setError] = useState("")
  const [note, setNote] = useState("")
  const [aiBusy, setAiBusy] = useState("")
  const [aiError, setAiError] = useState("")
  const [uploading, setUploading] = useState(false)
  const [extractNote, setExtractNote] = useState("")
  const uploadRef = useRef(null)

  const curriculum = initial?.curriculum ?? []
  const canUseAi = Boolean(ai && courseId)
  const canManage = Boolean(structure && basePath && courseId)

  async function runAi(kind, fn) {
    setAiBusy(kind)
    setAiError("")
    try {
      await fn()
    } catch (err) {
      setAiError(err.message)
    } finally {
      setAiBusy("")
    }
  }

  const aiDescribe = () =>
    runAi("describe", async () => {
      const result = await ai.describe(courseId)
      setForm((f) => ({
        ...f,
        description: result.description || f.description,
        outcomes: (result.outcomes ?? []).length ? result.outcomes.join("\n") : f.outcomes,
      }))
    })

  async function addSection() {
    setStructBusy(true)
    setError("")
    try {
      await structure.addSection(courseId, { title: `Section ${curriculum.length + 1}` })
      await onChanged?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setStructBusy(false)
    }
  }

  const addSource = () =>
    setForm((f) => ({ ...f, knowledge: [...(f.knowledge ?? []), { title: "Source", text: "" }] }))

  const removeSource = (index) =>
    setForm((f) => ({ ...f, knowledge: (f.knowledge ?? []).filter((_, i) => i !== index) }))

  const setSource = (index, key, value) =>
    setForm((f) => {
      const next = [...(f.knowledge ?? [])]
      next[index] = { ...next[index], [key]: value }
      return { ...f, knowledge: next }
    })

  async function onUploadFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file || !onExtract) return

    setUploading(true)
    setExtractNote("")
    setAiError("")
    try {
      const result = await onExtract(file)
      setForm((f) => ({
        ...f,
        knowledge: [
          ...(f.knowledge ?? []),
          { title: result.title || file.name, text: result.text || "" },
        ],
      }))
      setExtractNote(
        `Read ${String(result.text || "").length.toLocaleString()} characters from ${file.name}.`
      )
    } catch (err) {
      setAiError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const set = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }))

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError("")
    setNote("")
    try {
      await onSave(toPayload(form))
      setNote(`${savedLabel} saved.`)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-6">
      <section className="border border-line bg-paper">
        <header className="border-b border-line px-5 py-3">
          <h2 className="display text-step-1 text-ink-950">Course details</h2>
        </header>
        <div className="space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-step--1 font-medium text-ink-700">Title</span>
              <input required value={form.title} onChange={set("title")} className="field" placeholder="e.g. Linear Algebra I" />
            </label>
            <label className="block">
              <span className="mb-2 block text-step--1 font-medium text-ink-700">Subject</span>
              <input required value={form.subject} onChange={set("subject")} className="field" placeholder="e.g. Mathematics" />
            </label>
            <label className="block">
              <span className="mb-2 block text-step--1 font-medium text-ink-700">Level</span>
              <select value={form.level} onChange={set("level")} className="field">
                <option value="beginner">beginner</option>
                <option value="intermediate">intermediate</option>
                <option value="advanced">advanced</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-step--1 font-medium text-ink-700">Summary</span>
            <AutoTextarea
              minRows={2}
              value={form.summary}
              onChange={set("summary")}
              placeholder="One or two sentences for the course card."
            />
          </label>

          <div className="block">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <span className="block text-step--1 font-medium text-ink-700">Description</span>
              {canUseAi && (
                <button
                  type="button"
                  onClick={aiDescribe}
                  disabled={Boolean(aiBusy)}
                  className="btn btn-ghost h-8 px-3 text-[0.72rem]"
                >
                  {aiBusy === "describe" ? (
                    <CircleNotch size={13} weight="bold" className="animate-spin" aria-hidden="true" />
                  ) : (
                    <>
                      <Sparkle size={13} weight="fill" aria-hidden="true" /> Generate with AI
                    </>
                  )}
                </button>
              )}
            </div>
            <AutoTextarea
              minRows={4}
              value={form.description}
              onChange={set("description")}
              placeholder="The full course description shown on the course page."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-step--1 font-medium text-ink-700">Topics (comma separated)</span>
              <input value={form.topics} onChange={set("topics")} className="field" placeholder="Vectors, Matrices, Eigenvalues" />
            </label>
            <label className="block">
              <span className="mb-2 block text-step--1 font-medium text-ink-700">Learning outcomes (one per line)</span>
              <AutoTextarea
                minRows={3}
                value={form.outcomes}
                onChange={set("outcomes")}
                placeholder="Explain vectors geometrically…"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-3 text-step--1 text-ink-700">
              <input type="checkbox" checked={form.premium} onChange={set("premium")} className="h-4 w-4 accent-[var(--color-accent-ink)]" />
              Premium course (requires an active paid plan)
            </label>
            <label className="flex items-center gap-3 text-step--1 text-ink-700">
              <input type="checkbox" checked={form.sponsored} onChange={set("sponsored")} className="h-4 w-4 accent-[var(--color-accent-ink)]" />
              Sponsored placement (pinned first in the catalogue)
            </label>
          </div>
        </div>
      </section>

      <section className="border border-line bg-paper">
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <h2 className="display text-step-1 text-ink-950">Curriculum</h2>
          <span className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-ink-500">
            {curriculum.length} section{curriculum.length === 1 ? "" : "s"}
          </span>
        </header>

        <div className="space-y-3 p-5">
          <p className="text-step--1 text-ink-500">
            Sections and lessons open on their own pages — pick a section to edit its lessons.
          </p>

          {curriculum.length === 0 && (
            <p className="border border-dashed border-line-2 px-4 py-6 text-center text-step--1 text-ink-500">
              No sections yet.
            </p>
          )}

          {curriculum.map((section, si) => (
            <div
              key={section.id ?? si}
              className="flex items-center justify-between gap-3 border border-line bg-paper px-4 py-3 transition-colors hover:border-line-2"
            >
              <div className="min-w-0">
                <p className="truncate text-step--1 font-medium text-ink-900">
                  {section.title || `Section ${si + 1}`}
                </p>
                <p className="mt-0.5 truncate text-[0.72rem] text-ink-500">
                  {section.lessons.length} lesson{section.lessons.length === 1 ? "" : "s"}
                  {section.summary ? ` · ${section.summary}` : ""}
                </p>
              </div>
              <Link
                to={`${basePath}/${courseId}/sections/${si}`}
                className="btn btn-ghost h-9 shrink-0 px-3 text-[0.72rem]"
              >
                Open section <ArrowRight size={12} weight="bold" aria-hidden="true" />
              </Link>
            </div>
          ))}

          {canManage ? (
            <button
              type="button"
              onClick={addSection}
              disabled={structBusy}
              className="btn btn-ghost h-10"
            >
              {structBusy ? (
                <CircleNotch size={14} weight="bold" className="animate-spin" aria-hidden="true" />
              ) : (
                <Plus size={14} weight="bold" aria-hidden="true" />
              )}
              Add section
            </button>
          ) : (
            <p className="text-[0.72rem] text-ink-500">
              Save the course once to start adding sections and lessons.
            </p>
          )}
        </div>
      </section>

      <section className="border border-line bg-paper">
        <header className="border-b border-line px-5 py-3">
          <h2 className="display text-step-1 text-ink-950">Knowledge base</h2>
        </header>

        <div className="space-y-3 p-5">
          <p className="text-step--1 text-ink-500">
            Sources the AI grounds generated text in (RAG). Paste lecture notes, references or
            article text — retrieval picks the most relevant passages for each request.
          </p>

          {(form.knowledge ?? []).length === 0 && (
            <p className="border border-dashed border-line-2 px-4 py-6 text-center text-step--1 text-ink-500">
              No sources yet — add one below.
            </p>
          )}

          {(form.knowledge ?? []).map((source, index) => (
            <div key={index} className="border border-line bg-paper p-3">
              <div className="flex items-center gap-2">
                <input
                  value={source.title}
                  onChange={(e) => setSource(index, "title", e.target.value)}
                  className="field py-2"
                  placeholder="Source title (e.g. Lecture 1 notes)"
                  aria-label={`Source ${index + 1} title`}
                />
                <button
                  type="button"
                  onClick={() => removeSource(index)}
                  className="btn btn-ghost h-9 px-3 text-[0.72rem]"
                  aria-label={`Remove source ${index + 1}`}
                >
                  <Trash size={13} weight="regular" aria-hidden="true" />
                </button>
              </div>
              <AutoTextarea
                minRows={4}
                value={source.text}
                onChange={(e) => setSource(index, "text", e.target.value)}
                className="mt-2"
                placeholder="Source text used by retrieval…"
                aria-label={`Source ${index + 1} text`}
              />
            </div>
          ))}

          {(form.knowledge ?? []).length < 20 && (
            <button type="button" onClick={addSource} className="btn btn-ghost h-9 px-3 text-[0.72rem]">
              <Plus size={13} weight="bold" aria-hidden="true" /> Source
            </button>
          )}

          {onExtract && (
            <div className="border-t border-line pt-3">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => uploadRef.current?.click()}
                  disabled={uploading}
                  className="btn btn-ghost h-9 px-3 text-[0.72rem]"
                >
                  {uploading ? (
                    <CircleNotch size={13} weight="bold" className="animate-spin" aria-hidden="true" />
                  ) : (
                    <UploadSimple size={13} weight="bold" aria-hidden="true" />
                  )}
                  Upload PDF, image or notes
                </button>
                <input
                  ref={uploadRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.bmp,.tif,.tiff,.docx,.txt,.md,.csv"
                  onChange={onUploadFile}
                  className="hidden"
                  aria-label="Upload a file to extract text from"
                />
                <span className="text-[0.72rem] text-ink-500">
                  The AI reads the file (OCR for images) and adds its text as a source.
                </span>
              </div>
              {extractNote && <p className="mt-2 text-[0.72rem] text-emerald-800">{extractNote}</p>}
            </div>
          )}

          {!canUseAi && (
            <p className="text-[0.72rem] text-ink-500">
              Save the course once to enable AI generation for it.
            </p>
          )}
        </div>
      </section>

      {aiError && (
        <p role="alert" className="flex items-start gap-2 text-step--1 text-red-700">
          <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {aiError}
        </p>
      )}

      {error && (
        <p role="alert" className="flex items-start gap-2 text-step--1 text-red-700">
          <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
      {note && (
        <p role="status" className="flex items-start gap-2 text-step--1 text-emerald-800">
          <CheckCircle size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {note}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn btn-primary h-11">
        {busy ? (
          <CircleNotch size={16} weight="bold" className="animate-spin" aria-hidden="true" />
        ) : (
          "Save course"
        )}
      </button>
    </form>
  )
}
