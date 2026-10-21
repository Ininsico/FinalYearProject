const STEPS = [
  {
    n: "01",
    title: "Brief",
    body: "Describe the outcome you want in plain language. No specs, no diagrams, no tickets.",
  },
  {
    n: "02",
    title: "Plan",
    body: "The orchestrator breaks the goal into work and assigns the specialists it needs.",
  },
  {
    n: "03",
    title: "Execute",
    body: "Agents build in parallel and ship assets, content, and systems, with oversight.",
  },
  {
    n: "04",
    title: "Operate",
    body: "Fablet monitors, improves, and sustains what it built, run after run.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="border-y border-ink-100 bg-white px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
            From one sentence to a running system.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-600">
            You bring the intent. The swarm handles architecture, wiring, and delivery
            behind the scenes.
          </p>
        </div>

        <ol className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="border-t border-ink-200 pt-6">
              <span className="text-sm font-semibold tabular-nums text-brand-600">{s.n}</span>
              <h3 className="mt-3 text-xl font-bold text-ink-950">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-600">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
