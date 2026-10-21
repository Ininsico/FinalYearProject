import { useNavigate } from "react-router-dom"

export default function CTA() {
  const navigate = useNavigate()
  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-ink-950 px-8 py-16 sm:px-16 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-70 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(126,59,255,0.55), transparent 70%)" }}
        />
        <div className="relative max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300">
            Request access
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Turn intent into something real.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-200">
            Tell us what you want to build. We will get you into the swarm.
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="mt-9 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-ink-100"
          >
            Request access
          </button>
        </div>
      </div>
    </section>
  )
}
