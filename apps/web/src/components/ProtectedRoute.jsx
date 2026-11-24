import { useEffect } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../lib/auth"

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin", { replace: true, state: { from: location.pathname } })
    }
  }, [loading, user, navigate, location.pathname])

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mx-auto grid min-h-[100dvh] max-w-[1400px] place-items-center px-6 text-step--1 text-ink-500"
      >
        Checking your session
      </div>
    )
  }
  if (!user) return null
  return children ?? <Outlet />
}
