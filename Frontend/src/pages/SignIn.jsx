import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { CircleNotch, Warning, Lightning, CaretDown } from "@phosphor-icons/react"
import AuthSplit from "../components/AuthSplit"
import { useAuth, api, homeForRole } from "../lib/auth"

const PANEL = {
  formSide: "right",
  eyebrow: "The idea",
  quote:
    "A brief is not a prompt. It is an outcome, and the swarm is the machine that turns one into the other.",
  source: "Fablet — the architecture",
  points: [
    "24 specialist agent roles, one orchestrated network",
    "Four content domains on a single foundation",
    "Model-agnostic by design",
  ],
  watermark: "swarm",
}

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
    <AuthSplit {...PANEL}>
      <h1 className="text-step-3 font-semibold text-ink-950">Sign in</h1>
      <p className="mt-3 text-step--1 leading-relaxed text-ink-600">
        Students, institutions and operators all sign in here.
      </p>

      {demos.length > 0 && (
        <div className="relative mt-8" ref={demoRef}>
          <button
            type="button"
            onClick={() => setDemoOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={demoOpen}
            disabled={Boolean(demoBusy)}
            className="flex w-full items-center justify-between gap-4 border border-line-2 bg-paper-2 px-4 py-3 text-left transition-colors hover:border-accent-ink"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent-ink" aria-hidden="true">
                {demoBusy
                  ? <CircleNotch size={15} weight="bold" className="animate-spin" />
                  : <Lightning size={15} weight="fill" />}
              </span>
              <span>
                <span className="block text-step--1 text-ink-950">
                  {demoBusy ? "Entering demo…" : "Instant demo access"}
                </span>
                <span className="block text-[0.74rem] text-ink-500">
                  One-click sign in for Student, Institution or Admin
                </span>
              </span>
            </span>
            <CaretDown
              size={14}
              weight="bold"
              aria-hidden="true"
              className={`shrink-0 text-ink-500 transition-transform duration-200 ${demoOpen ? "rotate-180" : ""}`}
            />
          </button>

          {demoOpen && (
            <div
              role="menu"
              className="absolute inset-x-0 top-[calc(100%+6px)] z-10 border border-line-2 bg-paper shadow-[0_18px_40px_-20px_rgba(20,18,30,0.35)]"
            >
              {demos.map((identity) => (
                <button
                  key={identity.role}
                  role="menuitem"
                  type="button"
                  onClick={() => demoLogin(identity)}
                  disabled={Boolean(demoBusy)}
                  className="flex w-full items-center justify-between gap-4 border-b border-line px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-paper-2"
                >
                  <span>
                    <span className="block text-step--1 text-ink-950">{identity.label}</span>
                    <span className="block text-[0.74rem] text-ink-500">{identity.summary}</span>
                  </span>
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-500">enter</span>
                </button>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center gap-4" aria-hidden="true">
            <span className="h-px flex-1 bg-line" />
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink-500">or sign in</span>
            <span className="h-px flex-1 bg-line" />
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
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

      <div className="mt-8 border-t border-line pt-6 text-step--1 text-ink-600">
        New to Fablet?{" "}
        <Link to="/signup" className="link-underline font-medium">
          Create a student account
        </Link>
        {" · "}
        <Link to="/institutions/register" className="link-underline font-medium">
          Register an institution
        </Link>
      </div>
    </AuthSplit>
  )
}
