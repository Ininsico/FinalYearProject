import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { CircleNotch, Warning } from "@phosphor-icons/react"
import AuthSplit from "../components/AuthSplit"
import AuthPathSwitch from "../components/AuthPathSwitch"
import { ArrowIcon } from "../components/home/ui"
import { registerInstitution } from "../lib/billing"
import { useAuth } from "../lib/auth"

const EMPTY = {
  institutionName: "",
  domain: "",
  contactEmail: "",
  name: "",
  email: "",
  password: "",
  confirm: "",
}

export default function InstitutionRegister() {
  const navigate = useNavigate()
  const { refresh } = useAuth()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const update = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((x) => ({ ...x, [k]: undefined }))
  }

  function validateStep1() {
    const next = {}
    if (!form.institutionName.trim()) next.institutionName = "Enter the institution name."
    if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail))
      next.contactEmail = "Enter a valid email."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function validateStep2() {
    const next = {}
    if (!form.name.trim()) next.name = "Enter your name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Enter a valid email address."
    if (form.password.length < 8) next.password = "Use at least 8 characters."
    if (form.confirm !== form.password) next.confirm = "Passwords do not match."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (!validateStep2()) return
    setBusy(true)
    setError("")
    try {
      await registerInstitution({
        institutionName: form.institutionName.trim(),
        domain: form.domain.trim(),
        contactEmail: (form.contactEmail || form.email).trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      await refresh()
      // The subscription module is the next step of onboarding.
      navigate("/institution/billing?welcome=1", { replace: true })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <AuthSplit formSide="left" watermark="institution">
      <AuthPathSwitch active="institution" />

      <h1 className="display auth-title mt-5 text-ink-950">
        Register your institution.
      </h1>
      <p className="auth-subtitle mt-2 text-step--1 leading-relaxed text-ink-600 sm:mt-3">
        Seats, a shared catalogue and your own console. The owner account created here
        manages all of it.
      </p>

      <p className="mt-5 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-ink-500">
        Step {step} of 2 — {step === 1 ? "Organisation" : "Owner account"}
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-4 space-y-4">
        {step === 1 ? (
          <>
            <div>
              <label htmlFor="i-name" className="mb-2 block text-step--1 font-medium text-ink-700">
                Institution name
              </label>
              <input
                id="i-name"
                value={form.institutionName}
                onChange={update("institutionName")}
                aria-invalid={Boolean(errors.institutionName)}
                className="field"
              />
              {errors.institutionName && (
                <p className="mt-2 text-step--1 text-red-700">{errors.institutionName}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="i-domain" className="mb-2 block text-step--1 font-medium text-ink-700">
                  Domain (optional)
                </label>
                <input
                  id="i-domain"
                  value={form.domain}
                  onChange={update("domain")}
                  placeholder="university.edu"
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="i-contact" className="mb-2 block text-step--1 font-medium text-ink-700">
                  Contact email (optional)
                </label>
                <input
                  id="i-contact"
                  type="email"
                  value={form.contactEmail}
                  onChange={update("contactEmail")}
                  aria-invalid={Boolean(errors.contactEmail)}
                  className="field"
                />
                {errors.contactEmail && (
                  <p className="mt-2 text-step--1 text-red-700">{errors.contactEmail}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => validateStep1() && setStep(2)}
              className="btn btn-primary w-full"
            >
              Continue
              <ArrowIcon />
            </button>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="o-name" className="mb-2 block text-step--1 font-medium text-ink-700">
                Your name
              </label>
              <input
                id="o-name"
                value={form.name}
                onChange={update("name")}
                aria-invalid={Boolean(errors.name)}
                className="field"
              />
              {errors.name && <p className="mt-2 text-step--1 text-red-700">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="o-email" className="mb-2 block text-step--1 font-medium text-ink-700">
                Work email
              </label>
              <input
                id="o-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={update("email")}
                aria-invalid={Boolean(errors.email)}
                className="field"
              />
              {errors.email && <p className="mt-2 text-step--1 text-red-700">{errors.email}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="o-pass" className="mb-2 block text-step--1 font-medium text-ink-700">
                  Password
                </label>
                <input
                  id="o-pass"
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={update("password")}
                  aria-invalid={Boolean(errors.password)}
                  className="field"
                />
                {errors.password && (
                  <p className="mt-2 text-step--1 text-red-700">{errors.password}</p>
                )}
              </div>
              <div>
                <label htmlFor="o-conf" className="mb-2 block text-step--1 font-medium text-ink-700">
                  Confirm password
                </label>
                <input
                  id="o-conf"
                  type="password"
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={update("confirm")}
                  aria-invalid={Boolean(errors.confirm)}
                  className="field"
                />
                {errors.confirm && (
                  <p className="mt-2 text-step--1 text-red-700">{errors.confirm}</p>
                )}
              </div>
            </div>

            {error && (
              <p role="alert" className="flex items-start gap-2 text-step--1 text-red-700">
                <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
                {error}
              </p>
            )}

            <div className="flex items-center gap-4">
              <button type="submit" disabled={busy} className="btn btn-primary flex-1">
                {busy ? (
                  <>
                    <CircleNotch size={15} weight="bold" className="animate-spin" aria-hidden="true" />
                    Creating
                  </>
                ) : (
                  <>
                    Create institution
                    <ArrowIcon />
                  </>
                )}
              </button>
              <button type="button" onClick={() => setStep(1)} className="btn btn-quiet">
                Back
              </button>
            </div>
          </>
        )}
      </form>

      <div className="mt-6 border-t border-line pt-5 text-step--1 text-ink-600">
        Plan and payment come next, in USDT. Already have an account?{" "}
        <Link to="/signin" className="link-underline font-medium">
          Sign in
        </Link>
      </div>
    </AuthSplit>
  )
}
