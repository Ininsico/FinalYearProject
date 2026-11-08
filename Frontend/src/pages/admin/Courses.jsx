import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CircleNotch, Warning, MagnifyingGlass, Plus, CaretRight } from "@phosphor-icons/react"
import { fetchAdminCourses } from "../../lib/dictionary"
import StatusBadge from "../../components/admin/StatusBadge"

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—"

export default function AdminCourses() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    try {
      setData(await fetchAdminCourses({ q: query, status, page, limit: 20 }))
      setError("")
    } catch (err) {
      setError(err.message)
    }
  }, [query, status, page])

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [query, status])

  const open = (id) => navigate(`/admin/courses/${id}`)

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Courses</p>
          <h1 className="display mt-3 text-step-3 text-ink-950">Course management</h1>
        </div>
        <button onClick={() => navigate("/admin/courses/new")} className="btn btn-primary h-10">
          <Plus size={15} weight="bold" aria-hidden="true" />
          New course
        </button>
      </div>
      <p className="mt-4 max-w-[72ch] leading-relaxed text-ink-600">
        Every course on the platform — Fablet's own and those offered by institutions. Open a
        course to edit its details and build the curriculum section by section.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <label className="relative min-w-[240px] flex-1">
          <span className="sr-only">Search courses</span>
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, subject or summary"
            className="field pl-9"
          />
        </label>
        <label className="flex items-center gap-2 text-step--1 text-ink-600">
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="field w-[160px] py-2">
            <option value="">All</option>
            <option value="published">published</option>
            <option value="draft">draft</option>
          </select>
        </label>
      </div>

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
              {["Course", "Offered by", "Content", "Access", "Status", "Updated", ""].map((h, i) => (
                <th key={i} scope="col" className="px-4 py-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!data && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-step--1 text-ink-500">
                  <CircleNotch size={16} weight="bold" className="inline animate-spin" aria-hidden="true" /> Loading
                </td>
              </tr>
            )}
            {data?.courses?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-step--1 text-ink-500">
                  No courses match.
                </td>
              </tr>
            )}
            {data?.courses?.map((course) => (
              <tr
                key={course.id}
                onClick={() => open(course.id)}
                onKeyDown={(e) => { if (e.key === "Enter") open(course.id) }}
                tabIndex={0}
                className="cursor-pointer border-b border-line transition-colors last:border-0 hover:bg-paper-2 focus-visible:bg-paper-2"
              >
                <td className="px-4 py-3">
                  <span className="block text-step--1 text-ink-950">{course.title}</span>
                  <span className="block text-[0.74rem] text-ink-500">{course.subject}</span>
                </td>
                <td className="px-4 py-3 text-step--1 text-ink-600">
                  {course.institutionName ?? "Fablet official"}
                </td>
                <td className="px-4 py-3 text-step--1 tabular text-ink-600">
                  {course.sections} sections · {course.curriculumLessons} lessons · {course.minutes} min
                </td>
                <td className="px-4 py-3">
                  <span className="flex flex-wrap items-center gap-1.5">
                    {course.premium ? (
                      <span className="border border-accent/40 bg-accent-soft px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-accent-ink">premium</span>
                    ) : (
                      <span className="border border-line-2 bg-paper-3 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-600">free</span>
                    )}
                    {course.sponsored && (
                      <span className="border border-amber-600/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-amber-800">sponsored</span>
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

      {data && data.pages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="btn btn-ghost h-9 px-4 text-step--1"
          >
            Previous
          </button>
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-500">
            Page {data.page} of {data.pages} · {data.total} courses
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
