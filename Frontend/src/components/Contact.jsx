import { useState } from "react"
import { Loader2, Check, Mail } from "lucide-react"

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState("idle")
  const [error, setError] = useState("")

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    setStatus("sending")
    setError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Could not send your message")
      setStatus("sent")
      setForm({ name: "", email: "", message: "" })
    } catch (err) {
      setStatus("error")
      setError(err.message)
    }
  }

  const field =
    "w-full rounded-lg border border-ink-200 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-400 outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"

  return (
    <section className="px-6 pb-28 pt-32 sm:pt-40">
      <div className="mx-auto max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
          Request access
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink-950 sm:text-5xl">
          Let us build something.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-600">
          Tell us what you want to create with the Fablet swarm, or just say hello.
        </p>

        <form onSubmit={onSubmit} className="mt-10 rounded-2xl border border-ink-200 bg-white p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink-700">Name</label>
              <input id="name" type="text" required value={form.name} onChange={update("name")} placeholder="Ada Lovelace" className={field} />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink-700">Email</label>
              <input id="email" type="email" required value={form.email} onChange={update("email")} placeholder="you@company.com" className={field} />
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-ink-700">Message</label>
            <textarea id="message" required rows={5} value={form.message} onChange={update("message")} placeholder="I want to build a..." className={`${field} resize-none`} />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-ink-950 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-ink-800 disabled:opacity-60"
          >
            {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
            {status === "sending" ? "Sending" : "Send message"}
          </button>

          {status === "sent" && (
            <p className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald-600">
              <Check className="h-4 w-4" /> Thanks, we will get back to you shortly.
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="mt-5 text-sm font-medium text-red-600">
              {error || "Could not send your message. Please try again."}
            </p>
          )}
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-ink-500">
          <Mail className="h-4 w-4" />
          <a href="mailto:fablet@artdevelopers.site" className="hover:text-ink-800">
            fablet@artdevelopers.site
          </a>
        </div>
      </div>
    </section>
  )
}
