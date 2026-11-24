import { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { CircleNotch, Check, Warning } from "@phosphor-icons/react"
import AuthShell from "../components/AuthShell"
import { api } from "../lib/auth"

const COPY = {
  verifying: { title: "Activating your account", subtitle: "Hold on while we verify your activation link." },
  success: { title: "Account activated", subtitle: "Your email is verified. You can sign in now." },
  invalid: { title: "Link expired", subtitle: "This activation link is no longer valid. Sign in to request a new one." },
}

export default function VerifyEmail() {
  const [params] = useSearchParams()
  const token = params.get("token") || ""
  const [state, setState] = useState("verifying")
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    if (!token) {
      setState("invalid")
      return
    }
    api("/api/auth/verify-email", { method: "POST", body: JSON.stringify({ token }) })
      .then(() => setState("success"))
      .catch(() => setState("invalid"))
  }, [token])

  const { title, subtitle } = COPY[state]

  return (
    <AuthShell title={title} subtitle={subtitle}>
      <div role="status" aria-live="polite" className="space-y-6">
        {state === "verifying" && (
          <p className="flex items-center gap-2 text-step--1 text-ink-600">
            <CircleNotch size={16} weight="bold" className="animate-spin" aria-hidden="true" />
            Verifying
          </p>
        )}
        {state === "success" && (
          <p className="flex items-center gap-2 text-step--1 text-ink-700">
            <Check size={16} weight="bold" className="text-accent-ink" aria-hidden="true" />
            Verified
          </p>
        )}
        {state === "invalid" && (
          <p className="flex items-center gap-2 text-step--1 text-ink-700">
            <Warning size={16} weight="bold" className="text-red-700" aria-hidden="true" />
            Not verified
          </p>
        )}
        {state !== "verifying" && (
          <Link to="/signin" className="btn btn-primary w-full">Go to sign in</Link>
        )}
      </div>
    </AuthShell>
  )
}
