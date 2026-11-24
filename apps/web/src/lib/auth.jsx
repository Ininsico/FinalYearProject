import { createContext, useCallback, useContext, useEffect, useState } from "react"

const AuthContext = createContext(null)

/** Auth calls that must never trigger the silent-refresh retry. */
const NO_RETRY = [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/refresh",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/resend-verification",
]

let refreshInFlight = null

/** Rotate the session once, deduplicated across concurrent callers. */
function refreshSession() {
  if (!refreshInFlight) {
    refreshInFlight = fetch("/api/auth/refresh", { method: "POST", credentials: "include" })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null
      })
  }
  return refreshInFlight
}

export async function api(path, options = {}) {
  const { __retried, ...init } = options
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  })

  // Expired 15-minute access token: rotate the session, then replay the call.
  // This never fires for credential submissions (login/signup/reset), so a
  // wrong password cannot be retried or masked.
  if (res.status === 401 && !__retried && !NO_RETRY.some((p) => path.includes(p))) {
    if (await refreshSession()) {
      return api(path, { ...init, __retried: true })
    }
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || "Request failed")
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const data = await api("/api/auth/me")
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  // Keep the session warm: rotate ahead of the 15-minute access-token expiry
  // while the tab is visible, and again whenever it regains focus.
  useEffect(() => {
    if (!user) return
    const tick = () => {
      if (!document.hidden) refreshSession()
    }
    const id = setInterval(tick, 10 * 60 * 1000)
    window.addEventListener("focus", tick)
    document.addEventListener("visibilitychange", tick)
    return () => {
      clearInterval(id)
      window.removeEventListener("focus", tick)
      document.removeEventListener("visibilitychange", tick)
    }
  }, [user])

  const signIn = useCallback(async (email, password) => {
    const data = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    setUser(data.user)
    return data.user
  }, [])

  const signUp = useCallback(
    (payload) => api("/api/auth/signup", { method: "POST", body: JSON.stringify(payload) }),
    []
  )

  const signOut = useCallback(async () => {
    try { await api("/api/auth/logout", { method: "POST" }) } catch { /* ignore */ }
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}

/** Where each role belongs, so routing never sends anyone to the wrong area. */
export const HOME_FOR_ROLE = {
  student: "/dashboard",
  institution: "/institution",
  admin: "/admin",
}

export function homeForRole(role) {
  return HOME_FOR_ROLE[role] ?? "/"
}
