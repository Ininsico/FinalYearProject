import { useState } from "react"
import { CircleNotch, Check, Warning } from "@phosphor-icons/react"
import { PageHero, Section } from "../components/layout"

const EMPTY = { name: "", email: "", message: "" }

export default function Contact() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState("idle")
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})

  const update = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setFieldErrors((f) => ({ ...f, [k]: undefined }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = "Tell us your name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address."
    if (form.message.trim().length < 10) next.message = "A little more detail helps."
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setStatus("sending")
    setError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Could not send your message")
      setStatus("sent")
      setForm(EMPTY)
    } catch (err) {
      setStatus("error")
      setError(err.message)
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what you want to build."
        lede="Every request reaches the team directly. We read all of them."
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
          <div>
            <p className="eyebrow">Direct</p>
            <a href="mailto:fablet@artdevelopers.site" className="link-underline mt-4 inline-block text-step-1">
              fablet@artdevelopers.site
            </a>
            <p className="mt-8 max-w-[34ch] text-step--1 leading-relaxed text-ink-600">
              For early access, partnerships, or press, include enough context for us to
              route your message to the right person.
            </p>
          </div>

          <form onSubmit={onSubmit} noValidate className="border-t border-line pt-8">
            {status === "sent" ? (
              <div role="status" className="flex items-start gap-3 bg-accent-soft px-6 py-6">
                <Check size={18} weight="bold" className="mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
                <div>
                  <p className="text-step-1 text-ink-950">Message sent</p>
                  <p className="mt-1 text-step--1 text-ink-600">Thanks, we will get back to you shortly.</p>
                  <button type="button" onClick={() => setStatus("idle")} className="link-underline mt-4 text-step--1">
                    Send another
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className="mb-2 block text-step--1 font-medium text-ink-700">
                      Name
                    </label>
                    <input
                      id="c-name"
                      name="name"
                      autoComplete="name"
                      value={form.name}
                      onChange={update("name")}
                      aria-invalid={Boolean(fieldErrors.name)}
                      aria-describedby={fieldErrors.name ? "c-name-err" : undefined}
                      className="field"
                    />
                    {fieldErrors.name && (
                      <p id="c-name-err" className="mt-2 text-step--1 text-red-700">{fieldErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="c-email" className="mb-2 block text-step--1 font-medium text-ink-700">
                      Email
                    </label>
                    <input
                      id="c-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={update("email")}
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={fieldErrors.email ? "c-email-err" : undefined}
                      className="field"
                    />
                    {fieldErrors.email && (
                      <p id="c-email-err" className="mt-2 text-step--1 text-red-700">{fieldErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="c-message" className="mb-2 block text-step--1 font-medium text-ink-700">
                    Message
                  </label>
                  <textarea
                    id="c-message"
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={update("message")}
                    aria-invalid={Boolean(fieldErrors.message)}
                    aria-describedby={fieldErrors.message ? "c-message-err" : undefined}
                    className="field resize-none"
                  />
                  {fieldErrors.message && (
                    <p id="c-message-err" className="mt-2 text-step--1 text-red-700">{fieldErrors.message}</p>
                  )}
                </div>

                <button type="submit" disabled={status === "sending"} className="btn btn-primary mt-8">
                  {status === "sending" ? (
                    <>
                      <CircleNotch size={16} weight="bold" className="animate-spin" aria-hidden="true" />
                      Sending
                    </>
                  ) : (
                    "Send message"
                  )}
                </button>

                {status === "error" && (
                  <p role="alert" className="mt-4 flex items-start gap-2 text-step--1 text-red-700">
                    <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
                    {error || "Could not send your message. Please try again."}
                  </p>
                )}
              </>
            )}
          </form>
        </div>
      </Section>
    </>
  )
}
