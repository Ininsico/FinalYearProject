import { Navigate } from "react-router-dom"
import { useAuth } from "../lib/auth"
import LoadingScreen from "./LoadingScreen"

/** Where each role's home is, so a wrong-role visit lands somewhere sensible. */
const HOME = {
  student: "/dashboard",
  institution: "/institution",
  admin: "/admin",
}

export default function RequireRole({ roles, children }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen label="Checking your session" />

  if (!user) return <Navigate to="/signin" replace />
  if (!roles.includes(user.role)) return <Navigate to={HOME[user.role] ?? "/"} replace />

  return children
}
