import { useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { CircleNotch, Warning, Lightning } from "@phosphor-icons/react"
import AuthShell from "../components/AuthShell"
import { useAuth, api, homeForRole } from "../lib/auth"

export default function SignIn() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [needsVerify, setNeedsVerify] = useState(false)
  const [resent, setResent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [demo, setDemo] = useState(null)
  const [demoBusy, setDemoBusy] = useState("")

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    api("/api/auth/demo-identities")
      .then(setDemo)
      .catch(() => setDemo({ enabled: false, identities: [] }))
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError("")
    setNeedsVerify(false)
    try {
      const user = await signIn(form.email.trim(), form.password)
      navigate(location.state?.from || homeForRole(user.role), { replace: true })
    } catch (err) {
      setError(err.message)
      if (err.data?.needsVerification) setNeedsVerify(true)
    } finally {
      setBusy(false)
    }
  }

  async function demoLogin(identity) {
    setDemoBusy(identity.role)
    setError("")
    try {
      const user = await signIn(identity.email, identity.password)
      navigate(homeForRole(user.role), { replace: true })
    } catch (err) {
      setError(err.message)
      setDemoBusy("")
    }
  }

  async function resend() {
    try {
      await api("/api/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email: form.email.trim() }),
      })
    } catch {
      /* generic response either way */
    }
    setResent(true)
  }

  const demos = demo?.enabled ? demo.identities : []

  return (
    <AuthShell
      title="Sign in"
      subtitle="Students, institutions and operators all sign in here."
      footer={
        <>
          New to Fablet?{" "}
          <Link to="/signup" className="link-underline font-medium">
            Create a student account
          </Link>
          {" · "}
          <Link to="/institutions/register" className="link-underline font-medium">
            Register an institution
          </Link>
        </>
      }
    >
      {demos.length > 0 && (
        <div className="mb-8">
          <p className="eyebrow">Instant demo access</p>
          <div className="mt-4 grid gap-2">
            {demos.map((identity) => (
              <button
                key={identity.role}
                type="button"
                onClick={() => demoLogin(identity)}
                disabled={Boolean(demoBusy)}
                className="flex w-full items-center justify-between gap-4 border border-line bg-paper-2 px-4 py-3 text-left transition-colors hover:border-accent-ink"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent-ink" aria-hidden="true">
                    {demoBusy === identity.role
                      ? <CircleNotch size={15} weight="bold" className="animate-spin" />
                      : <Lightning size={15} weight="fill" />}
                  </span>
                  <span>
                    <span className="block text-step--1 text-ink-950">{identity.label}</span>
                    <span className="block text-[0.74rem] text-ink-500">{identity.summary}</span>
                  </span>
                </span>
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-500">
                  {demoBusy === identity.role ? "entering" : "enter"}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-7 flex items-center gap-4" aria-hidden="true">
            <span className="h-px flex-1 bg-line" />
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink-500">or sign in</span>
            <span className="h-px flex-1 bg-line" />
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="mb-2 block text-step--1 font-medium text-ink-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
            className="field"
          />
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label htmlFor="password" className="block text-step--1 font-medium text-ink-700">
              Password
            </label>
            <Link to="/forgot-password" className="link-underline text-[0.78rem]">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={update("password")}
            className="field"
          />
        </div>

        {error && (
          <p role="alert" className="flex items-start gap-2 text-step--1 text-red-700">
            <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        {needsVerify && !resent && (
          <button type="button" onClick={resend} className="link-underline text-step--1">
            Resend activation email
          </button>
        )}
        {resent && <p className="text-step--1 text-ink-600">Activation email sent. Check your inbox.</p>}

        <button type="submit" disabled={busy} className="btn btn-primary w-full">
          {busy ? (
            <>
              <CircleNotch size={16} weight="bold" className="animate-spin" aria-hidden="true" />
              Signing in
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
    </AuthShell>
  )
}
