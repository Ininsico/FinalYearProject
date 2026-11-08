import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  CircleNotch,
  Plus,
  Sparkle,
  Trash,
  Warning,
  CheckCircle,
} from "@phosphor-icons/react"

import { LESSON_TYPES } from "./CourseEditor.jsx"
import AutoTextarea from "../AutoTextarea"
import Markdown from "../Markdown"

const QUIZ_TYPES = [
  { value: "mcq", label: "Multiple choice" },
  { value: "truefalse", label: "True / false" },
  { value: "fillblank", label: "Fill in the blank" },
  { value: "match", label: "Match the column" },
]

const EMPTY_QUESTION = () => ({
  type: "mcq",
  prompt: "",
  options: ["", ""],
  answerIndex: 0,
  answer: "",
  pairs: [],
})

const normalizeQuestion = (question) => ({
  type: question?.type ?? "mcq",
  prompt: question?.prompt ?? "",
  options: Array.isArray(question?.options) ? question.options : [],
  answerIndex: Number(question?.answerIndex) || 0,
  answer: question?.answer ?? "",
  pairs: Array.isArray(question?.pairs) ? question.pairs : [],
})

const normalizeQuiz = (questions) =>
  (Array.isArray(questions) ? questions : []).map(normalizeQuestion)

export default function LessonEditorPage({ courses, structure, ai, basePath, backLabel = "Course" }) {
  const { courseId, sectionIndex, lessonIndex } = useParams()
  const si = Number(sectionIndex)
  const li = Number(lessonIndex)
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [form, setForm] = useState({
    title: "",
    type: "reading",
    durationMinutes: 0,
    videoUrl: "",
    content: "",
    quiz: [],
  })
  const [genTypes, setGenTypes] = useState({ mcq: true, truefalse: true, fillblank: true, match: true })
  const [preview, setPreview] = useState(false)
  const [busy, setBusy] = useState(false)
  const [aiBusy, setAiBusy] = useState("")
  const [error, setError] = useState("")
  const [aiError, setAiError] = useState("")
  const [note, setNote] = useState("")

  async function load() {
    try {
      const data = await courses.get(courseId)
      const loaded = data.course ?? data
      setCourse(loaded)
      const lesson = loaded.curriculum?.[si]?.lessons?.[li]
      if (lesson) {
        setForm({
          title: lesson.title ?? "",
          type: lesson.type ?? "reading",
          durationMinutes: lesson.durationMinutes ?? 0,
          videoUrl: lesson.videoUrl ?? "",
          content: lesson.content ?? "",
          quiz: normalizeQuiz(lesson.quiz),
        })
      }
      setError("")
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, sectionIndex, lessonIndex])

  const section = course?.curriculum?.[si]
  const lesson = section?.lessons?.[li]
  const canUseAi = Boolean(ai && courseId && lesson)

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const setQuestion = (qi, key, value) =>
    setForm((f) => {
      const quiz = [...f.quiz]
      quiz[qi] = { ...quiz[qi], [key]: value }
      return { ...f, quiz }
    })

  const setQuestionType = (qi, type) =>
    setForm((f) => {
      const quiz = [...f.quiz]
      const current = quiz[qi]
      const base = { ...current, type, answerIndex: 0, answer: "" }
      if (type === "truefalse") base.options = ["True", "False"]
      if (type === "mcq") base.options = current.options?.length ? current.options : ["", ""]
      if (type === "fillblank") base.options = []
      if (type === "match")
        base.pairs = current.pairs?.length
          ? current.pairs
          : [
              { left: "", right: "" },
              { left: "", right: "" },
            ]
      quiz[qi] = base
      return { ...f, quiz }
    })

  const setOption = (qi, oi, value) =>
    setForm((f) => {
      const quiz = [...f.quiz]
      const options = [...quiz[qi].options]
      options[oi] = value
      quiz[qi] = { ...quiz[qi], options }
      return { ...f, quiz }
    })

  const addOption = (qi) =>
    setForm((f) => {
      const quiz = [...f.quiz]
      quiz[qi] = { ...quiz[qi], options: [...quiz[qi].options, ""] }
      return { ...f, quiz }
    })

  const removeOption = (qi, oi) =>
    setForm((f) => {
      const quiz = [...f.quiz]
      const options = quiz[qi].options.filter((_, i) => i !== oi)
      quiz[qi] = {
        ...quiz[qi],
        options,
        answerIndex: Math.min(quiz[qi].answerIndex ?? 0, Math.max(options.length - 1, 0)),
      }
      return { ...f, quiz }
    })

  const setPair = (qi, pi, key, value) =>
    setForm((f) => {
      const quiz = [...f.quiz]
      const pairs = [...quiz[qi].pairs]
      pairs[pi] = { ...pairs[pi], [key]: value }
      quiz[qi] = { ...quiz[qi], pairs }
      return { ...f, quiz }
    })

  const addPair = (qi) =>
    setForm((f) => {
      const quiz = [...f.quiz]
      quiz[qi] = { ...quiz[qi], pairs: [...quiz[qi].pairs, { left: "", right: "" }] }
      return { ...f, quiz }
    })

  const removePair = (qi, pi) =>
    setForm((f) => {
      const quiz = [...f.quiz]
      quiz[qi] = { ...quiz[qi], pairs: quiz[qi].pairs.filter((_, i) => i !== pi) }
      return { ...f, quiz }
    })

  const addQuestion = () => setForm((f) => ({ ...f, quiz: [...f.quiz, EMPTY_QUESTION()] }))

  const removeQuestion = (qi) =>
    setForm((f) => ({ ...f, quiz: f.quiz.filter((_, i) => i !== qi) }))

  function cleanQuiz() {
    return form.quiz.map((question) => {
      const base = { type: question.type, prompt: question.prompt.trim() }
      if (question.type === "mcq") {
        const options = question.options.map((option) => option.trim()).filter(Boolean)
        return {
          ...base,
          options,
          answerIndex: Math.min(Number(question.answerIndex) || 0, Math.max(options.length - 1, 0)),
        }
      }
      if (question.type === "truefalse") {
        return { ...base, options: ["True", "False"], answerIndex: question.answerIndex === 1 ? 1 : 0 }
      }
      if (question.type === "fillblank") {
        return { ...base, answer: question.answer.trim() }
      }
      return {
        ...base,
        pairs: question.pairs
          .map((pair) => ({ left: pair.left.trim(), right: pair.right.trim() }))
          .filter((pair) => pair.left && pair.right),
      }
    })
  }

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

  const aiContent = () =>
    runAi("content", async () => {
      const result = await ai.lesson(courseId, { sectionIndex: si, lessonIndex: li })
      setForm((f) => ({ ...f, content: result.content || f.content }))
    })

  const aiQuiz = () =>
    runAi("quiz", async () => {
      const types = QUIZ_TYPES.map((t) => t.value).filter((type) => genTypes[type])
      const result = await ai.quiz(courseId, { sectionIndex: si, lessonIndex: li, types })
      setForm((f) => ({ ...f, quiz: normalizeQuiz(result.quiz) }))
    })

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError("")
    setNote("")
    try {
      const payload = {
        title: form.title.trim(),
        type: form.type,
        durationMinutes: Number(form.durationMinutes) || 0,
        videoUrl: form.videoUrl.trim(),
        content: form.content,
        quiz: [],
      }

      if (form.type === "quiz") {
        const quiz = cleanQuiz()
        if (!quiz.length) throw new Error("Add at least one quiz question.")
        if (quiz.some((question) => !question.prompt))
          throw new Error("Every quiz question needs a statement.")
        if (quiz.some((question) => question.type === "mcq" && question.options.length < 2))
          throw new Error("Multiple-choice questions need at least two options.")
        if (quiz.some((question) => question.type === "fillblank" && !question.answer))
          throw new Error("Fill-in-the-blank questions need an answer.")
        if (quiz.some((question) => question.type === "match" && question.pairs.length < 2))
          throw new Error("Match-the-column questions need at least two pairs.")
        payload.quiz = quiz
      }

      await structure.updateLesson(courseId, si, li, payload)
      await load()
      setNote("Lesson saved.")
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function removeLesson() {
    if (!window.confirm("Delete this lesson? This cannot be undone.")) return
    setBusy(true)
    setError("")
    try {
      await structure.deleteLesson(courseId, si, li)
      navigate(`${basePath}/${courseId}/sections/${si}`)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  if (!course && !error) {
    return (
      <p className="mt-8 flex items-center gap-2 text-step--1 text-ink-500">
        <CircleNotch size={15} weight="bold" className="animate-spin" aria-hidden="true" />
        Loading lesson…
      </p>
    )
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`${basePath}/${courseId}/sections/${si}`}
          className="inline-flex items-center gap-2 text-step--1 text-ink-600 transition-colors hover:text-ink-950"
        >
          <ArrowLeft size={14} weight="bold" aria-hidden="true" /> Back to section
        </Link>
        <span className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-ink-500">
          {backLabel} / Section {si + 1} / Lesson {li + 1}
        </span>
      </div>

      {error && (
        <p role="alert" className="mt-4 flex items-start gap-2 text-step--1 text-red-700">
          <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {aiError && (
        <p role="alert" className="mt-4 flex items-start gap-2 text-step--1 text-red-700">
          <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {aiError}
        </p>
      )}

      {course && !lesson && (
        <p className="mt-6 text-step--1 text-ink-600">
          This lesson no longer exists — it may have been deleted.
        </p>
      )}

      {lesson && (
        <>
          <h1 className="display mt-5 text-step-3 text-ink-950">{lesson.title}</h1>
          <p className="mt-2 text-step--1 text-ink-600">
            {course.title} · {section?.title}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-6">
            <section className="border border-line bg-paper">
              <header className="border-b border-line px-5 py-3">
                <h2 className="display text-step-1 text-ink-950">Lesson details</h2>
              </header>
              <div className="space-y-4 p-5">
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_170px_120px]">
                  <label className="block">
                    <span className="mb-2 block text-step--1 font-medium text-ink-700">Title</span>
                    <input
                      required
                      value={form.title}
                      onChange={set("title")}
                      className="field"
                      placeholder="Lesson title"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-step--1 font-medium text-ink-700">Type</span>
                    <select value={form.type} onChange={set("type")} className="field">
                      {LESSON_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-step--1 font-medium text-ink-700">Minutes</span>
                    <input
                      type="number"
                      min={0}
                      value={form.durationMinutes}
                      onChange={set("durationMinutes")}
                      className="field tabular"
                    />
                  </label>
                </div>

                {form.type === "video" || form.type === "live" ? (
                  <label className="block">
                    <span className="mb-2 block text-step--1 font-medium text-ink-700">
                      {form.type === "live" ? "Stream URL" : "Video URL"}
                    </span>
                    <input
                      value={form.videoUrl}
                      onChange={set("videoUrl")}
                      className="field font-mono text-[0.82rem]"
                      placeholder="https://…"
                    />
                  </label>
                ) : form.type === "quiz" ? (
                  <p className="text-step--1 text-ink-500">
                    Quiz lessons are built from questions below. Save with the “Save lesson” button.
                  </p>
                ) : (
                  <div>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                      <span className="block text-step--1 font-medium text-ink-700">
                        Lesson content
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreview((value) => !value)}
                          className="btn btn-ghost h-8 px-3 text-[0.72rem]"
                        >
                          {preview ? "Edit" : "Preview"}
                        </button>
                        {canUseAi && (
                          <button
                            type="button"
                            onClick={aiContent}
                            disabled={Boolean(aiBusy)}
                            className="btn btn-ghost h-8 px-3 text-[0.72rem]"
                          >
                            {aiBusy === "content" ? (
                              <CircleNotch size={13} weight="bold" className="animate-spin" aria-hidden="true" />
                            ) : (
                              <>
                                <Sparkle size={13} weight="fill" aria-hidden="true" /> Generate content (RAG)
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    {preview ? (
                      <div className="min-h-[8rem] border border-line bg-paper-2 p-4 text-[0.85rem]">
                        {form.content.trim() ? (
                          <Markdown text={form.content} />
                        ) : (
                          <p className="text-step--1 text-ink-500">Nothing to preview yet.</p>
                        )}
                      </div>
                    ) : (
                      <AutoTextarea
                        minRows={6}
                        value={form.content}
                        onChange={set("content")}
                        placeholder="Lesson notes, exercise brief or assessment description"
                      />
                    )}
                  </div>
                )}
              </div>
            </section>

            {form.type === "quiz" && (
              <section className="border border-line bg-paper">
                <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
                  <h2 className="display text-step-1 text-ink-950">Quiz questions</h2>
                  <span className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-ink-500">
                    {form.quiz.length} question{form.quiz.length === 1 ? "" : "s"}
                  </span>
                </header>

                <div className="space-y-4 p-5">
                  {canUseAi && (
                    <div className="border border-line bg-paper-2 p-3">
                      <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-500">
                        Generate with AI
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-4">
                        {QUIZ_TYPES.map(({ value, label }) => (
                          <label
                            key={value}
                            className="flex items-center gap-2 text-[0.78rem] text-ink-700"
                          >
                            <input
                              type="checkbox"
                              checked={Boolean(genTypes[value])}
                              onChange={() =>
                                setGenTypes((types) => ({ ...types, [value]: !types[value] }))
                              }
                              className="h-3.5 w-3.5 accent-[var(--color-accent-ink)]"
                            />
                            {label}
                          </label>
                        ))}
                        <button
                          type="button"
                          onClick={aiQuiz}
                          disabled={Boolean(aiBusy) || !Object.values(genTypes).some(Boolean)}
                          className="btn btn-ghost h-8 px-3 text-[0.72rem]"
                        >
                          {aiBusy === "quiz" ? (
                            <CircleNotch size={13} weight="bold" className="animate-spin" aria-hidden="true" />
                          ) : (
                            <>
                              <Sparkle size={13} weight="fill" aria-hidden="true" /> Generate quiz (RAG)
                            </>
                          )}
                        </button>
                      </div>
                      <p className="mt-2 text-[0.7rem] text-ink-500">
                        Generating replaces the questions below. It is grounded in the course
                        knowledge base.
                      </p>
                    </div>
                  )}

                  {form.quiz.length === 0 && (
                    <p className="border border-dashed border-line-2 px-4 py-6 text-center text-step--1 text-ink-500">
                      No questions yet — generate them with AI or add one below.
                    </p>
                  )}

                  {form.quiz.map((question, qi) => (
                    <div key={qi} className="border border-line bg-paper p-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-500">
                          Q{qi + 1}
                        </span>
                        <select
                          value={question.type}
                          onChange={(e) => setQuestionType(qi, e.target.value)}
                          className="field h-9 w-auto py-0 text-[0.78rem]"
                          aria-label={`Question ${qi + 1} type`}
                        >
                          {QUIZ_TYPES.map(({ value, label }) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeQuestion(qi)}
                          className="btn btn-ghost h-8 px-2 text-[0.72rem]"
                          aria-label={`Remove question ${qi + 1}`}
                        >
                          <Trash size={13} weight="regular" aria-hidden="true" />
                        </button>
                      </div>

                      <input
                        value={question.prompt}
                        onChange={(e) => setQuestion(qi, "prompt", e.target.value)}
                        className="field mt-3"
                        placeholder={
                          question.type === "fillblank"
                            ? "Statement with ___ where the blank goes"
                            : "Question statement"
                        }
                        aria-label={`Question ${qi + 1} statement`}
                      />

                      {question.type === "mcq" && (
                        <div className="mt-3 space-y-2">
                          {question.options.map((option, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`answer-${qi}`}
                                checked={question.answerIndex === oi}
                                onChange={() => setQuestion(qi, "answerIndex", oi)}
                                className="h-4 w-4 shrink-0 accent-[var(--color-accent-ink)]"
                                aria-label={`Mark option ${oi + 1} as correct`}
                              />
                              <input
                                value={option}
                                onChange={(e) => setOption(qi, oi, e.target.value)}
                                className="field py-2"
                                placeholder={`Option ${oi + 1}`}
                                aria-label={`Question ${qi + 1} option ${oi + 1}`}
                              />
                              {question.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => removeOption(qi, oi)}
                                  className="btn btn-ghost h-9 px-2 text-[0.7rem]"
                                  aria-label={`Remove option ${oi + 1}`}
                                >
                                  <Trash size={12} weight="regular" aria-hidden="true" />
                                </button>
                              )}
                            </div>
                          ))}
                          {question.options.length < 8 && (
                            <button
                              type="button"
                              onClick={() => addOption(qi)}
                              className="btn btn-ghost h-8 px-3 text-[0.7rem]"
                            >
                              <Plus size={12} weight="bold" aria-hidden="true" /> Option
                            </button>
                          )}
                          <p className="text-[0.7rem] text-ink-500">
                            Select the radio next to the correct option.
                          </p>
                        </div>
                      )}

                      {question.type === "truefalse" && (
                        <div className="mt-3">
                          <div className="flex items-center gap-5">
                            {["True", "False"].map((label, oi) => (
                              <label
                                key={label}
                                className="flex items-center gap-2 text-step--1 text-ink-700"
                              >
                                <input
                                  type="radio"
                                  name={`answer-${qi}`}
                                  checked={question.answerIndex === oi}
                                  onChange={() => setQuestion(qi, "answerIndex", oi)}
                                  className="h-4 w-4 accent-[var(--color-accent-ink)]"
                                />
                                {label}
                              </label>
                            ))}
                          </div>
                          <p className="mt-2 text-[0.7rem] text-ink-500">
                            Select the correct answer for this statement.
                          </p>
                        </div>
                      )}

                      {question.type === "fillblank" && (
                        <div className="mt-3">
                          <input
                            value={question.answer}
                            onChange={(e) => setQuestion(qi, "answer", e.target.value)}
                            className="field py-2"
                            placeholder="Correct answer for the blank"
                            aria-label={`Question ${qi + 1} answer`}
                          />
                        </div>
                      )}

                      {question.type === "match" && (
                        <div className="mt-3 space-y-2">
                          {question.pairs.map((pair, pi) => (
                            <div key={pi} className="flex items-center gap-2">
                              <input
                                value={pair.left}
                                onChange={(e) => setPair(qi, pi, "left", e.target.value)}
                                className="field py-2"
                                placeholder="Column A"
                                aria-label={`Question ${qi + 1} pair ${pi + 1} column A`}
                              />
                              <span className="shrink-0 text-ink-400" aria-hidden="true">
                                →
                              </span>
                              <input
                                value={pair.right}
                                onChange={(e) => setPair(qi, pi, "right", e.target.value)}
                                className="field py-2"
                                placeholder="Column B"
                                aria-label={`Question ${qi + 1} pair ${pi + 1} column B`}
                              />
                              {question.pairs.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => removePair(qi, pi)}
                                  className="btn btn-ghost h-9 px-2 text-[0.7rem]"
                                  aria-label={`Remove pair ${pi + 1}`}
                                >
                                  <Trash size={12} weight="regular" aria-hidden="true" />
                                </button>
                              )}
                            </div>
                          ))}
                          {question.pairs.length < 10 && (
                            <button
                              type="button"
                              onClick={() => addPair(qi)}
                              className="btn btn-ghost h-8 px-3 text-[0.7rem]"
                            >
                              <Plus size={12} weight="bold" aria-hidden="true" /> Pair
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  <button type="button" onClick={addQuestion} className="btn btn-ghost h-10">
                    <Plus size={14} weight="bold" aria-hidden="true" /> Add question
                  </button>
                </div>
              </section>
            )}

            {note && (
              <p role="status" className="flex items-start gap-2 text-step--1 text-emerald-800">
                <CheckCircle size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
                {note}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" disabled={busy} className="btn btn-primary h-11">
                {busy ? (
                  <CircleNotch size={16} weight="bold" className="animate-spin" aria-hidden="true" />
                ) : (
                  "Save lesson"
                )}
              </button>
              <button
                type="button"
                onClick={removeLesson}
                disabled={busy}
                className="btn h-11 border border-red-300 px-4 text-step--1 text-red-800 transition-colors hover:bg-red-50"
              >
                <Trash size={14} weight="regular" aria-hidden="true" /> Delete lesson
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
