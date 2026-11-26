import { api } from "./auth"

/** Published newsletter posts for the signed-in student. */
export const fetchNews = () => api("/api/news")

/** Operator list, drafts included. */
export const fetchAdminNews = () => api("/api/news/admin")

export const createNewsPost = (payload) =>
  api("/api/news/admin", { method: "POST", body: JSON.stringify(payload) })

export const updateNewsPost = (id, patch) =>
  api(`/api/news/admin/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  })

export const deleteNewsPost = (id) =>
  api(`/api/news/admin/${encodeURIComponent(id)}`, { method: "DELETE" })
