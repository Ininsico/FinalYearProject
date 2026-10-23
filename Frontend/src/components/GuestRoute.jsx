import { Navigate } from "react-router-dom"
import { useAuth } from "../lib/auth"

/** Where each role belongs, used to bounce signed-in users off the auth pages. */
const HOME = {
  student: "/dashboard",
  institution: "/institution",
  admin: "/admin",
}

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to={HOME[user.role] ?? "/"} replace />
  return children
}
