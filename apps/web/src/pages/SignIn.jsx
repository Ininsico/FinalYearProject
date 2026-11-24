import { useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { CircleNotch, Warning } from "@phosphor-icons/react"
import AuthSplit from "../components/AuthSplit"
import { ArrowIcon } from "../components/home/ui"
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
    <AuthSplit formSide="right" watermark="fablet">
      <h1 className="display auth-title text-ink-950">Sign in</h1>
      <p className="auth-subtitle mt-2 text-step--1 leading-relaxed text-ink-600">
        Students, institutions and operators all sign in here.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
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

        <button type="submit" disabled={busy} className="btn btn-primary h-11 w-full">
          {busy ? (
            <>
              <CircleNotch size={16} weight="bold" className="animate-spin" aria-hidden="true" />
              Signing in
            </>
          ) : (
            <>
              Sign in
              <ArrowIcon />
            </>
          )}
        </button>
      </form>

      {demos.length > 0 && (
        <div className="auth-demo mt-5 border-t border-line pt-5">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-500">
            Or try a demo account
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {demos.map((identity) => (
              <button
                key={identity.role}
                type="button"
                onClick={() => demoLogin(identity)}
                disabled={Boolean(demoBusy)}
                title={identity.summary}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-line-2 px-4 font-mono text-[0.64rem] uppercase tracking-[0.08em] text-ink-700 transition-colors duration-300 hover:border-ink-950 hover:bg-ink-950 hover:text-paper disabled:opacity-60"
              >
                {demoBusy === identity.role && (
                  <CircleNotch size={12} weight="bold" className="animate-spin" aria-hidden="true" />
                )}
                {identity.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 border-t border-line pt-4">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-500">
          New to Fablet?
        </p>
        <div className="mt-1">
          <Link
            to="/signup"
            className="group flex items-center justify-between border-b border-line py-2.5 text-step--1 font-medium text-ink-800 transition-colors duration-300 hover:text-ink-950"
          >
            Create a student account
            <ArrowIcon />
          </Link>
          <Link
            to="/institutions/register"
            className="group flex items-center justify-between py-2.5 text-step--1 font-medium text-ink-800 transition-colors duration-300 hover:text-ink-950"
          >
            Register an institution
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </AuthSplit>
  )
}
