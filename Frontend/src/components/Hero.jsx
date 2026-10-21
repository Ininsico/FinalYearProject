import { useNavigate } from "react-router-dom"

const AGENTS = ["Research", "Strategy", "Writing", "Design", "Build", "QA", "Operate"]

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-220px] h-[540px] w-[860px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(126,59,255,0.24), transparent 72%)" }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-600">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          Agentic AI orchestration
        </span>

        <h1
          className="animate-fade-up mt-8 text-[2.7rem] font-extrabold leading-[1.03] tracking-tight text-ink-950 sm:text-6xl lg:text-[4.5rem]"
          style={{ animationDelay: "0.05s" }}
        >
          Your idea.
          <br />
          Built by a swarm of AIs.
        </h1>

        <p
          className="animate-fade-up mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-ink-600"
          style={{ animationDelay: "0.1s" }}
        >
          Brief Fablet in plain language. A coordinated network of AI agents plans,
          builds, runs, and refines the result, so you ship without an engineering team.
        </p>

        <div
          className="animate-fade-up mt-10 flex flex-wrap justify-center gap-3"
          style={{ animationDelay: "0.15s" }}
        >
          <button
            onClick={() => navigate("/contact")}
            className="rounded-xl bg-ink-950 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
          >
            Request access
          </button>
          <a
            href="#how"
            className="rounded-xl border border-ink-200 bg-white px-7 py-3.5 text-sm font-semibold text-ink-800 transition-colors hover:border-ink-300"
          >
            See how it works
          </a>
        </div>

        <div className="animate-fade-up mt-16" style={{ animationDelay: "0.2s" }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-400">The swarm</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2.5">
            {AGENTS.map((a) => (
              <li
                key={a}
                className="rounded-full border border-ink-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-ink-700"
              >
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
