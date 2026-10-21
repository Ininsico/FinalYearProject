const TEAM = [
  { name: "Arslan", image: "/arslan.png" },
  { name: "Huzaifa", image: "/huzafia.png" },
  { name: "Mahnoor", image: null },
  { name: "AhmedUllah", image: "/ahmedullah.jpg" },
  { name: "Ayyan", image: "/ayyan.jpg" },
  { name: "Noman", image: "/noman.jpg" },
  { name: "Mudasir", image: "/mudasri.png" },
]

export default function Team() {
  return (
    <section className="border-y border-ink-100 bg-white px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
            The team
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
            Built by people, run by agents.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-600">
            Fablet is the final year project of the COMSATS Abbottabad team behind it.
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {TEAM.map((m) => (
            <li key={m.name} className="flex items-center gap-3">
              {m.image ? (
                <img
                  src={m.image}
                  alt={m.name}
                  loading="lazy"
                  className="h-12 w-12 rounded-full object-cover ring-1 ring-ink-200"
                />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600 ring-1 ring-brand-100">
                  {m.name.slice(0, 1)}
                </span>
              )}
              <span className="font-semibold text-ink-900">{m.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
