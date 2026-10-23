import { api } from "./auth"

/** The whole billing state of the signed-in account. */
export function fetchBilling() {
  return api("/api/subscriptions")
}

/** The plan catalogue (public — marketing pages use it too). */
export function fetchPlans(audience) {
  return api(`/api/subscriptions/plans${audience ? `?audience=${audience}` : ""}`)
}

/** Open a crypto payment intent; returns the deposit address and window. */
export function startCheckout(planId) {
  return api("/api/subscriptions/checkout", {
    method: "POST",
    body: JSON.stringify({ planId, provider: "crypto" }),
  })
}

/** Ask the server to check the chain for the deposit. */
export function confirmPayment(intentId) {
  return api("/api/subscriptions/confirm", {
    method: "POST",
    body: JSON.stringify(intentId ? { intentId } : {}),
  })
}

export function cancelSubscription() {
  return api("/api/subscriptions/cancel", { method: "POST" })
}

export function resumeSubscription() {
  return api("/api/subscriptions/resume", { method: "POST" })
}

export function fetchPremiumStatus() {
  return api("/api/premium/status")
}

export function registerInstitution(payload) {
  return api("/api/institutions/register", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function fetchInstitution() {
  return api("/api/institutions/me")
}

export function inviteMember(payload) {
  return api("/api/institutions/members", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
