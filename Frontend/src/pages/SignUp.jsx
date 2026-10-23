import { useState } from "react"
import { Link } from "react-router-dom"
import { CircleNotch, Warning } from "@phosphor-icons/react"
import AuthShell from "../components/AuthShell"
import { useAuth } from "../lib/auth"

const EMPTY = { name: "", email: "", password: "", confirm: "" }

export default function SignUp() {
  const { signUp } = useAuth()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const update = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((x) => ({ ...x, [k]: undefined }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = "Tell us your name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address."
    if (form.password.length < 8) next.password = "Use at least 8 characters."
    if (form.confirm !== form.password) next.confirm = "Passwords do not match."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setBusy(true)
    setError("")
    try {
      await signUp({ ...form, name: form.name.trim(), email: form.email.trim() })
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <AuthShell
        title="Check your email"
        subtitle={`We sent an activation link to ${form.email}. Open it to activate your account.`}
      >
        <p className="text-step--1 leading-relaxed text-ink-600">
          The link expires in 15 minutes. Once activated, you can sign in.
        </p>
        <Link to="/signin" className="btn btn-primary mt-7 w-full">
          Go to sign in
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Brief the swarm once, then build anything."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/signin" className="link-underline font-medium">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <div>
          <label htmlFor="name" className="mb-2 block text-step--1 font-medium text-ink-700">
            Name
          </label>
          <input id="name" autoComplete="name" value={form.name} onChange={update("name")}
            aria-invalid={Boolean(errors.name)} className="field" />
          {errors.name && <p className="mt-2 text-step--1 text-red-700">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-step--1 font-medium text-ink-700">
            Email
          </label>
          <input id="email" type="email" autoComplete="email" value={form.email} onChange={update("email")}
            aria-invalid={Boolean(errors.email)} className="field" />
          {errors.email && <p className="mt-2 text-step--1 text-red-700">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-step--1 font-medium text-ink-700">
            Password
          </label>
          <input id="password" type="password" autoComplete="new-password" value={form.password}
            onChange={update("password")} aria-invalid={Boolean(errors.password)}
            aria-describedby="pw-hint" className="field" />
          <p id="pw-hint" className="mt-2 text-step--1 text-ink-500">At least 8 characters.</p>
          {errors.password && <p className="mt-1 text-step--1 text-red-700">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirm" className="mb-2 block text-step--1 font-medium text-ink-700">
            Confirm password
          </label>
          <input id="confirm" type="password" autoComplete="new-password" value={form.confirm}
            onChange={update("confirm")} aria-invalid={Boolean(errors.confirm)} className="field" />
          {errors.confirm && <p className="mt-2 text-step--1 text-red-700">{errors.confirm}</p>}
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
              Creating account
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>
    </AuthShell>
  )
}
