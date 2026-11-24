import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { CircleNotch, Warning } from "@phosphor-icons/react"
import AuthShell from "../components/AuthShell"
import { api } from "../lib/auth"

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get("token") || ""
  const [form, setForm] = useState({ password: "", confirm: "" })
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError("Passwords do not match.")
      return
    }
    setBusy(true)
    setError("")
    try {
      await api("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password: form.password, confirm: form.confirm }),
      })
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (!token) {
    return (
      <AuthShell title="Invalid reset link" subtitle="This password reset link is missing its token.">
        <Link to="/forgot-password" className="btn btn-primary w-full">Request a new link</Link>
      </AuthShell>
    )
  }

  if (done) {
    return (
      <AuthShell
        title="Password updated"
        subtitle="Your password has changed and every other session was signed out."
      >
        <Link to="/signin" className="btn btn-primary w-full">Sign in</Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Choose a new password" subtitle="This link expires 15 minutes after it was sent.">
      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <div>
          <label htmlFor="password" className="mb-2 block text-step--1 font-medium text-ink-700">
            New password
          </label>
          <input id="password" type="password" required minLength={8} autoComplete="new-password"
            value={form.password} onChange={update("password")} className="field" />
        </div>
        <div>
          <label htmlFor="confirm" className="mb-2 block text-step--1 font-medium text-ink-700">
            Confirm password
          </label>
          <input id="confirm" type="password" required minLength={8} autoComplete="new-password"
            value={form.confirm} onChange={update("confirm")} className="field" />
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
              Updating
            </>
          ) : (
            "Update password"
          )}
        </button>
      </form>
    </AuthShell>
  )
}
