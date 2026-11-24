import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { CircleNotch, Warning, ArrowRight, Buildings, User } from "@phosphor-icons/react"
import { Container } from "../components/layout"
import SplitHeading from "../components/SplitHeading"
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
    if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) next.contactEmail = "Enter a valid email."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function validateStep2() {
    const next = {}
    if (!form.name.trim()) next.name = "Enter your name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address."
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
    <>
      <header className="pb-10 pt-36 sm:pt-44">
        <Container>
          <p className="eyebrow">For institutions</p>
          <SplitHeading as="h1" immediate delay={0.05} className="mt-6 max-w-[16ch] text-step-5 text-ink-950 display">
            Register your institution.
          </SplitHeading>
          <p className="mt-7 max-w-[54ch] text-step-1 leading-[1.5] text-ink-600">
            A separate module from the student signup. Create the organisation, then choose a
            plan and pay in USDT to unlock orchestration and the video agent for your whole team.
          </p>
        </Container>
      </header>

      <section className="border-t border-line py-16">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
            <div>
              <ol className="space-y-6">
                {[
                  { n: 1, t: "Organisation", d: "Who you are" },
                  { n: 2, t: "Owner account", d: "Who signs in" },
                  { n: 3, t: "Plan & payment", d: "Crypto, in USDT" },
                ].map((s) => (
                  <li key={s.n} className="flex gap-4 border-t border-line pt-5">
                    <span className={`font-mono text-[0.72rem] ${step >= s.n ? "text-accent-ink" : "text-ink-400"}`}>
                      0{s.n}
                    </span>
                    <span>
                      <span className={`display block text-step-2 ${step >= s.n ? "text-ink-950" : "text-ink-400"}`}>{s.t}</span>
                      <span className="mt-1 block text-step--1 text-ink-500">{s.d}</span>
                    </span>
                  </li>
                ))}
              </ol>

              <p className="mt-10 text-step--1 leading-relaxed text-ink-500">
                Already have an account? <Link to="/signin" className="link-underline">Sign in</Link>
              </p>
            </div>

            <form onSubmit={onSubmit} noValidate>
              {step === 1 ? (
                <div>
                  <p className="flex items-center gap-2 eyebrow"><Buildings size={14} aria-hidden="true" /> Step 1 — Organisation</p>

                  <div className="mt-6">
                    <label htmlFor="i-name" className="mb-2 block text-step--1 font-medium text-ink-700">Institution name</label>
                    <input id="i-name" value={form.institutionName} onChange={update("institutionName")} className="field" />
                    {errors.institutionName && <p className="mt-2 text-step--1 text-red-700">{errors.institutionName}</p>}
                  </div>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="i-domain" className="mb-2 block text-step--1 font-medium text-ink-700">Domain (optional)</label>
                      <input id="i-domain" value={form.domain} onChange={update("domain")} placeholder="university.edu" className="field" />
                    </div>
                    <div>
                      <label htmlFor="i-contact" className="mb-2 block text-step--1 font-medium text-ink-700">Contact email (optional)</label>
                      <input id="i-contact" type="email" value={form.contactEmail} onChange={update("contactEmail")} className="field" />
                      {errors.contactEmail && <p className="mt-2 text-step--1 text-red-700">{errors.contactEmail}</p>}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => validateStep1() && setStep(2)}
                    className="btn btn-primary mt-8"
                  >
                    Continue
                    <ArrowRight size={15} weight="bold" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <div>
                  <p className="flex items-center gap-2 eyebrow"><User size={14} aria-hidden="true" /> Step 2 — Owner account</p>

                  <div className="mt-6">
                    <label htmlFor="o-name" className="mb-2 block text-step--1 font-medium text-ink-700">Your name</label>
                    <input id="o-name" value={form.name} onChange={update("name")} className="field" />
                    {errors.name && <p className="mt-2 text-step--1 text-red-700">{errors.name}</p>}
                  </div>

                  <div className="mt-5">
                    <label htmlFor="o-email" className="mb-2 block text-step--1 font-medium text-ink-700">Work email</label>
                    <input id="o-email" type="email" autoComplete="email" value={form.email} onChange={update("email")} className="field" />
                    {errors.email && <p className="mt-2 text-step--1 text-red-700">{errors.email}</p>}
                  </div>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="o-pass" className="mb-2 block text-step--1 font-medium text-ink-700">Password</label>
                      <input id="o-pass" type="password" autoComplete="new-password" value={form.password} onChange={update("password")} className="field" />
                      {errors.password && <p className="mt-2 text-step--1 text-red-700">{errors.password}</p>}
                    </div>
                    <div>
                      <label htmlFor="o-conf" className="mb-2 block text-step--1 font-medium text-ink-700">Confirm password</label>
                      <input id="o-conf" type="password" autoComplete="new-password" value={form.confirm} onChange={update("confirm")} className="field" />
                      {errors.confirm && <p className="mt-2 text-step--1 text-red-700">{errors.confirm}</p>}
                    </div>
                  </div>

                  {error && (
                    <p role="alert" className="mt-6 flex items-start gap-2 text-step--1 text-red-700">
                      <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
                      {error}
                    </p>
                  )}

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button type="submit" disabled={busy} className="btn btn-accent">
                      {busy ? <><CircleNotch size={15} weight="bold" className="animate-spin" /> Creating</> : "Create institution"}
                    </button>
                    <button type="button" onClick={() => setStep(1)} className="btn btn-quiet">Back</button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </Container>
      </section>
    </>
  )
}
