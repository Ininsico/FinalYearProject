import { useEffect } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../lib/auth"
import LoadingScreen from "./LoadingScreen"

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin", { replace: true, state: { from: location.pathname } })
    }
  }, [loading, user, navigate, location.pathname])

  if (loading) return <LoadingScreen label="Checking your session" />
  if (!user) return null
  return children ?? <Outlet />
}
