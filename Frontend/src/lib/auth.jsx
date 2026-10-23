import { createContext, useCallback, useContext, useEffect, useState } from "react"

const AuthContext = createContext(null)

export async function api(path, options = {}) {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  })
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
