import { useState } from "react"
import { Link } from "react-router-dom"
import { CircleNotch, Warning } from "@phosphor-icons/react"
import AuthSplit from "../components/AuthSplit"
import AuthPathSwitch from "../components/AuthPathSwitch"
import { ArrowIcon } from "../components/home/ui"
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
      <AuthSplit formSide="left" watermark="academy" backdrop="/signup.svg">
        <h1 className="display auth-title text-ink-950">Check your email</h1>
        <p className="mt-3 text-step--1 leading-relaxed text-ink-600">
          We sent an activation link to {form.email}. Open it to activate your account.
        </p>
        <p className="mt-6 text-step--1 leading-relaxed text-ink-600">
          The link expires in 15 minutes. Once activated, you can sign in.
        </p>
        <Link to="/signin" className="btn btn-primary mt-8 w-full">
          Go to sign in
        </Link>
      </AuthSplit>
    )
  }

  return (
    <AuthSplit formSide="left" watermark="academy" backdrop="/signup.svg">
      <AuthPathSwitch active="student" />
      <h1 className="display auth-title mt-4 text-ink-950">Create your account</h1>
      <p className="auth-subtitle mt-1.5 text-[0.82rem] leading-relaxed text-ink-600">
        A free account for one learner — the whole catalogue opens immediately.
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-[0.8rem] font-medium text-ink-700">
              Name
            </label>
            <input
              id="name"
              autoComplete="name"
              value={form.name}
              onChange={update("name")}
              aria-invalid={Boolean(errors.name)}
              className="field"
            />
            {errors.name && <p className="mt-1.5 text-[0.78rem] text-red-700">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-[0.8rem] font-medium text-ink-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={update("email")}
              aria-invalid={Boolean(errors.email)}
              className="field"
            />
            {errors.email && <p className="mt-1.5 text-[0.78rem] text-red-700">{errors.email}</p>}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="mb-2 block text-[0.8rem] font-medium text-ink-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={update("password")}
              aria-invalid={Boolean(errors.password)}
              aria-describedby="pw-hint"
              className="field"
            />
            <p id="pw-hint" className="mt-1.5 text-[0.74rem] text-ink-500">
              At least 8 characters.
            </p>
            {errors.password && (
              <p className="mt-1 text-[0.78rem] text-red-700">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirm" className="mb-2 block text-[0.8rem] font-medium text-ink-700">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={form.confirm}
              onChange={update("confirm")}
              aria-invalid={Boolean(errors.confirm)}
              className="field"
            />
            {errors.confirm && <p className="mt-1.5 text-[0.78rem] text-red-700">{errors.confirm}</p>}
          </div>
        </div>

        {error && (
          <p role="alert" className="flex items-start gap-2 text-[0.82rem] text-red-700">
            <Warning size={15} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        <button type="submit" disabled={busy} className="btn btn-primary h-11 w-full">
          {busy ? (
            <>
              <CircleNotch size={16} weight="bold" className="animate-spin" aria-hidden="true" />
              Creating account
            </>
          ) : (
            <>
              Create account
              <ArrowIcon />
            </>
          )}
        </button>
      </form>

      <div className="mt-4 border-t border-line pt-3">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-ink-500">
          Already have an account?
        </p>
        <div>
          <Link
            to="/signin"
            className="group flex items-center justify-between border-b border-line py-2 text-[0.82rem] font-medium text-ink-800 transition-colors duration-300 hover:text-ink-950"
          >
            Sign in
            <ArrowIcon />
          </Link>
          <Link
            to="/institutions/register"
            className="group flex items-center justify-between py-2 text-[0.82rem] font-medium text-ink-800 transition-colors duration-300 hover:text-ink-950"
          >
            Register an institution instead
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </AuthSplit>
  )
}
