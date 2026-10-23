import { Navigate } from "react-router-dom"
import { useAuth } from "../lib/auth"

/** Where each role's home is, so a wrong-role visit lands somewhere sensible. */
const HOME = {
  student: "/dashboard",
  institution: "/institution",
  admin: "/admin",
}

export default function RequireRole({ roles, children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="grid min-h-[100dvh] place-items-center px-6 text-step--1 text-ink-500"
      >
        Checking your session
      </div>
    )
  }

  if (!user) return <Navigate to="/signin" replace />
  if (!roles.includes(user.role)) return <Navigate to={HOME[user.role] ?? "/"} replace />

  return children
}
