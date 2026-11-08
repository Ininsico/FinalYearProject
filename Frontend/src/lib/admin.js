import { api } from "./auth"

const qs = (params) => {
  const clean = Object.fromEntries(Object.entries(params ?? {}).filter(([, v]) => v !== "" && v != null))
  const s = new URLSearchParams(clean).toString()
  return s ? `?${s}` : ""
}

export const fetchAdminStats = () => api("/api/admin/stats")
export const fetchPlans = () => api("/api/admin/plans")
export const updatePlan = (planId, patch) =>
  api(`/api/admin/plans/${encodeURIComponent(planId)}`, { method: "PATCH", body: JSON.stringify(patch) })

export const fetchUsers = (params) => api(`/api/admin/users${qs(params)}`)
export const updateUser = (id, patch) =>
  api(`/api/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(patch) })
export const deleteUser = (id) => api(`/api/admin/users/${id}`, { method: "DELETE" })

export const fetchInstitutions = () => api("/api/admin/institutions")
export const updateInstitution = (id, patch) =>
  api(`/api/admin/institutions/${id}`, { method: "PATCH", body: JSON.stringify(patch) })

export const fetchSubscriptions = (params) => api(`/api/admin/subscriptions${qs(params)}`)
export const fetchSubscriptionAnalytics = () => api("/api/admin/subscriptions/analytics")
export const fetchSubscription = (accountId) =>
  api(`/api/admin/subscriptions/${encodeURIComponent(accountId)}`)
export const updateSubscription = (accountId, patch) =>
  api(`/api/admin/subscriptions/${encodeURIComponent(accountId)}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  })
export const cancelSubscription = (accountId) =>
  api(`/api/admin/subscriptions/${encodeURIComponent(accountId)}/cancel`, { method: "POST" })
export const resumeSubscription = (accountId) =>
  api(`/api/admin/subscriptions/${encodeURIComponent(accountId)}/resume`, { method: "POST" })
export const adminActivateSubscription = (accountId, planId) =>
  api(`/api/admin/subscriptions/${encodeURIComponent(accountId)}/activate`, {
    method: "POST",
    body: JSON.stringify({ planId }),
  })

export const fetchPayments = () => api("/api/admin/payments")
export const settlePayment = (id) => api(`/api/admin/payments/${id}/settle`, { method: "POST" })

export const fetchAudit = (action) => api(`/api/admin/audit${qs({ action })}`)
