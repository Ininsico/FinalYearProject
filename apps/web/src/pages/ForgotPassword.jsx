import { useState } from "react"
import { Link } from "react-router-dom"
import { CircleNotch, Warning } from "@phosphor-icons/react"
import AuthShell from "../components/AuthShell"
import { api } from "../lib/auth"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError("")
    try {
      await api("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      })
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we will send a secure reset link."
      footer={
        <Link to="/signin" className="link-underline font-medium">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <p role="status" className="text-step--1 leading-relaxed text-ink-600">
          If an account exists for {email}, a reset link is on its way. It expires in 15 minutes.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-step--1 font-medium text-ink-700">
              Email
            </label>
            <input id="email" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)} className="field" />
          </div>

          {error && (
            <p role="alert" className="flex items-start gap-2 text-step--1 text-red-700">
              <Warning size={16} weight="bold" className="mt-0.5 shrink-0" />
              {error}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn btn-primary w-full">
            {busy ? (
              <>
                <CircleNotch size={16} weight="bold" className="animate-spin" aria-hidden="true" />
                Sending
              </>
            ) : (
              "Send reset link"
            )}
          </button>
        </form>
      )}
    </AuthShell>
  )
}
