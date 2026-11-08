import { api } from "./auth"

const qs = (params) => {
  const clean = Object.fromEntries(Object.entries(params ?? {}).filter(([, v]) => v !== "" && v != null))
  const s = new URLSearchParams(clean).toString()
  return s ? `?${s}` : ""
}

/** Public dictionary: every published course module. */
export const fetchDictionary = (params) => api(`/api/dictionary${qs(params)}`)
export const fetchCourseDetail = (id) => api(`/api/dictionary/${encodeURIComponent(id)}`)

/** Admin course management. */
export const fetchAdminCourses = (params) => api(`/api/admin/courses${qs(params)}`)
export const fetchAdminCourse = (id) => api(`/api/admin/courses/${encodeURIComponent(id)}`)
export const createAdminCourse = (payload) =>
  api("/api/admin/courses", { method: "POST", body: JSON.stringify(payload) })
export const updateAdminCourse = (id, patch) =>
  api(`/api/admin/courses/${id}`, { method: "PATCH", body: JSON.stringify(patch) })
export const deleteAdminCourse = (id) => api(`/api/admin/courses/${id}`, { method: "DELETE" })

/** AI generation helpers, bound to a course base path (admin or institution). */
export const courseAi = (base) => ({
  describe: (id) => api(`${base}/${encodeURIComponent(id)}/ai/describe`, { method: "POST" }),
  lesson: (id, payload) =>
    api(`${base}/${encodeURIComponent(id)}/ai/lesson`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  quiz: (id, payload) =>
    api(`${base}/${encodeURIComponent(id)}/ai/quiz`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  graph: (id) => api(`${base}/${encodeURIComponent(id)}/ai/graph`, { method: "POST" }),
})

/** Section & lesson CRUD bound to a course base path (admin or institution). */
export const courseStructure = (base) => ({
  addSection: (id, payload = {}) =>
    api(`${base}/${encodeURIComponent(id)}/sections`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateSection: (id, si, patch) =>
    api(`${base}/${encodeURIComponent(id)}/sections/${si}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),
  deleteSection: (id, si) =>
    api(`${base}/${encodeURIComponent(id)}/sections/${si}`, { method: "DELETE" }),
  addLesson: (id, si, payload = {}) =>
    api(`${base}/${encodeURIComponent(id)}/sections/${si}/lessons`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateLesson: (id, si, li, patch) =>
    api(`${base}/${encodeURIComponent(id)}/sections/${si}/lessons/${li}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),
  deleteLesson: (id, si, li) =>
    api(`${base}/${encodeURIComponent(id)}/sections/${si}/lessons/${li}`, { method: "DELETE" }),
})

export const fetchInstitutionModules = (params) =>
  api(`/api/institutions/modules${qs(params)}`)
export const fetchInstitutionModule = (id) =>
  api(`/api/institutions/modules/${encodeURIComponent(id)}`)
export const createCourseModule = (payload) =>
  api("/api/institutions/modules", { method: "POST", body: JSON.stringify(payload) })
export const updateCourseModule = (id, patch) =>
  api(`/api/institutions/modules/${id}`, { method: "PATCH", body: JSON.stringify(patch) })
export const deleteCourseModule = (id) =>
  api(`/api/institutions/modules/${id}`, { method: "DELETE" })

/** Upload a PDF/image/notes file; the AI service extracts its text. */
const uploadFile = (path, file) => {
  const form = new FormData()
  form.append("file", file)
  return api(path, { method: "POST", body: form, headers: {} })
}

export const adminExtractFile = (file) => uploadFile("/api/admin/ai/extract", file)
export const institutionExtractFile = (file) =>
  uploadFile("/api/institutions/ai/extract", file)
