const TONES = {
  trialing: "border-accent/40 bg-accent-soft text-accent-ink",
  active: "border-emerald-700/25 bg-emerald-700/10 text-emerald-800",
  canceled: "border-line-2 bg-paper-3 text-ink-600",
  expired: "border-red-700/30 bg-red-700/10 text-red-700",
  published: "border-emerald-700/25 bg-emerald-700/10 text-emerald-800",
  draft: "border-line-2 bg-paper-3 text-ink-600",
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] ${
        TONES[status] ?? TONES.canceled
      }`}
    >
      {status}
    </span>
  )
}
