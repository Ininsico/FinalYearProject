import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { CaretDown, CircleNotch, Lightning, Warning } from "@phosphor-icons/react"
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
  const [demoOpen, setDemoOpen] = useState(false)
  const demoRef = useRef(null)

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    api("/api/auth/demo-identities")
      .then(setDemo)
      .catch(() => setDemo({ enabled: false, identities: [] }))
  }, [])

  useEffect(() => {
    if (!demoOpen) return
    const onPointerDown = (e) => {
      if (!demoRef.current?.contains(e.target)) setDemoOpen(false)
    }
    const onKey = (e) => e.key === "Escape" && setDemoOpen(false)
    document.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("keydown", onKey)
    }
  }, [demoOpen])

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
    setDemoOpen(false)
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
    <AuthSplit formSide="right" watermark="fablet" backdrop="/signin.svg">
      {demos.length > 0 && (
        <div className="relative flex justify-end" ref={demoRef}>
          <button
            type="button"
            onClick={() => setDemoOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={demoOpen}
            disabled={Boolean(demoBusy)}
            className="inline-flex h-7 items-center gap-1.5 rounded-full border border-line-2 px-3 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-ink-600 transition-colors duration-300 hover:border-ink-950 hover:text-ink-950"
          >
            {demoBusy ? (
              <CircleNotch size={11} weight="bold" className="animate-spin" aria-hidden="true" />
            ) : (
              <Lightning size={11} weight="fill" className="text-accent-ink" aria-hidden="true" />
            )}
            Demo
            <CaretDown
              size={11}
              weight="bold"
              aria-hidden="true"
              className={`transition-transform duration-200 ${demoOpen ? "rotate-180" : ""}`}
            />
          </button>

          {demoOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+6px)] z-20 w-44 overflow-hidden rounded-[10px] border border-line-2 bg-paper shadow-[0_14px_30px_-16px_rgba(20,18,30,0.35)]"
            >
              {demos.map((identity) => (
                <button
                  key={identity.role}
                  role="menuitem"
                  type="button"
                  onClick={() => demoLogin(identity)}
                  disabled={Boolean(demoBusy)}
                  className="flex w-full items-center justify-between gap-3 border-b border-line px-3 py-2 text-left transition-colors hover:bg-paper-2 last:border-b-0"
                >
                  <span className="text-[0.72rem] text-ink-800">{identity.label}</span>
                  <span className="font-mono text-[0.58rem] uppercase tracking-[0.08em] text-ink-400">
                    enter
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <h1 className={`display auth-title text-ink-950 ${demos.length > 0 ? "mt-4" : ""}`}>
        Sign in
      </h1>
      <p className="auth-subtitle mt-1.5 text-[0.82rem] leading-relaxed text-ink-600">
        Students, institutions and operators all sign in here.
      </p>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <div>
          <label htmlFor="email" className="mb-2 block text-[0.8rem] font-medium text-ink-700">
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
            <label htmlFor="password" className="block text-[0.8rem] font-medium text-ink-700">
              Password
            </label>
            <Link to="/forgot-password" className="link-underline text-[0.74rem]">
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
          <p role="alert" className="flex items-start gap-2 text-[0.82rem] text-red-700">
            <Warning size={15} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        {needsVerify && !resent && (
          <button type="button" onClick={resend} className="link-underline text-[0.82rem]">
            Resend activation email
          </button>
        )}
        {resent && (
          <p className="text-[0.82rem] text-ink-600">Activation email sent. Check your inbox.</p>
        )}

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

      <div className="mt-4 border-t border-line pt-3">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-ink-500">
          New to Fablet?
        </p>
        <div>
          <Link
            to="/signup"
            className="group flex items-center justify-between border-b border-line py-2 text-[0.82rem] font-medium text-ink-800 transition-colors duration-300 hover:text-ink-950"
          >
            Create a student account
            <ArrowIcon />
          </Link>
          <Link
            to="/institutions/register"
            className="group flex items-center justify-between py-2 text-[0.82rem] font-medium text-ink-800 transition-colors duration-300 hover:text-ink-950"
          >
            Register an institution
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </AuthSplit>
  )
}
