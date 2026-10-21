const DOMAINS = [
  {
    n: "01",
    title: "Education",
    body: "Adaptive, bilingual courses that teach, quiz, and tutor in real time.",
  },
  {
    n: "02",
    title: "Media & entertainment",
    body: "Comedy, commentary, and branded content that research, write, and publish themselves.",
  },
  {
    n: "03",
    title: "News & information",
    body: "Always-on reporting and summaries, tuned to any audience, region, or tone.",
  },
  {
    n: "04",
    title: "Enterprise",
    body: "Internal tools, automations, and customer systems composed on demand.",
  },
]

export default function Domains() {
  return (
    <section className="bg-paper px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
            One foundation, every surface
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
            The same swarm, across every domain.
          </h2>
        </div>

        <div className="mt-14 grid gap-x-14 gap-y-2 sm:grid-cols-2">
          {DOMAINS.map((d) => (
            <div key={d.n} className="flex gap-5 border-t border-ink-200 py-7">
              <span className="text-sm font-semibold tabular-nums text-ink-400">{d.n}</span>
              <div>
                <h3 className="text-lg font-bold text-ink-950">{d.title}</h3>
                <p className="mt-1.5 leading-relaxed text-ink-600">{d.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
