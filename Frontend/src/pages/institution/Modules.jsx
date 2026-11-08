import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CircleNotch, Warning, Plus, CaretRight } from "@phosphor-icons/react"
import { fetchInstitutionModules } from "../../lib/dictionary"
import StatusBadge from "../../components/admin/StatusBadge"

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—"

export default function InstitutionModules() {
  const navigate = useNavigate()
  const [modules, setModules] = useState(null)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 })
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    try {
      const data = await fetchInstitutionModules({ page, limit: 20 })
      setModules(data.modules)
      setMeta({ page: data.page ?? 1, pages: data.pages ?? 1, total: data.total ?? 0 })
      setError("")
    } catch (err) {
      setError(err.message)
    }
  }, [page])

  useEffect(() => { load() }, [load])

  const open = (id) => navigate(`/institution/modules/${id}`)

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Course modules</p>
          <h1 className="display mt-3 text-step-3 text-ink-950">Publish modules</h1>
        </div>
        <button onClick={() => navigate("/institution/modules/new")} className="btn btn-primary h-10">
          <Plus size={15} weight="bold" aria-hidden="true" />
          New course
        </button>
      </div>
      <p className="mt-4 max-w-[72ch] leading-relaxed text-ink-600">
        Offer your institution's courses through the public catalogue. Build each course as
        sections of video, reading, exercise and assessment lessons, then publish it when ready.
      </p>

      {error && (
        <p role="alert" className="mt-5 flex items-start gap-2 text-step--1 text-red-700">
          <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <div className="mt-6 overflow-hidden border border-line">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              {["Course", "Subject", "Content", "Access", "Status", "Updated", ""].map((h, i) => (
                <th key={i} scope="col" className="px-4 py-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!modules && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-step--1 text-ink-500">
                  <CircleNotch size={16} weight="bold" className="inline animate-spin" aria-hidden="true" /> Loading
                </td>
              </tr>
            )}
            {modules?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-step--1 text-ink-500">
                  No courses yet — create your first one.
                </td>
              </tr>
            )}
            {modules?.map((course) => (
              <tr
                key={course.id}
                onClick={() => open(course.id)}
                onKeyDown={(e) => { if (e.key === "Enter") open(course.id) }}
                tabIndex={0}
                className="cursor-pointer border-b border-line transition-colors last:border-0 hover:bg-paper-2 focus-visible:bg-paper-2"
              >
                <td className="px-4 py-3">
                  <span className="block text-step--1 text-ink-950">{course.title}</span>
                  <span className="block max-w-[60ch] text-[0.74rem] text-ink-500">{course.summary}</span>
                </td>
                <td className="px-4 py-3 text-step--1 text-ink-600">{course.subject}</td>
                <td className="px-4 py-3 text-step--1 tabular text-ink-600">
                  {course.sections} sections · {course.curriculumLessons} lessons · {course.minutes} min
                </td>
                <td className="px-4 py-3">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="border border-line-2 bg-paper-3 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-600">
                      {course.premium ? "premium" : "free"}
                    </span>
                    {course.sponsored && (
                      <span className="border border-amber-600/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-amber-800">
                        sponsored
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={course.status} /></td>
                <td className="px-4 py-3 text-step--1 text-ink-500">{fmtDate(course.updatedAt)}</td>
                <td className="px-4 py-3 text-right text-ink-400"><CaretRight size={15} weight="bold" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta.pages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="btn btn-ghost h-9 px-4 text-step--1"
          >
            Previous
          </button>
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-500">
            Page {meta.page} of {meta.pages} · {meta.total} courses
          </span>
          <button
            onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
            disabled={page >= meta.pages}
            className="btn btn-ghost h-9 px-4 text-step--1"
          >
            Next
          </button>
        </div>
      )}
    </>
  )
}
