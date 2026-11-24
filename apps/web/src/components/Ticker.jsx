// Continuous, seamless infinite ticker. The track holds two identical halves and
// animates to -50% with a linear CSS keyframe, so the loop has no visible seam
// and no JS measurement. Decorative: hidden from assistive tech.
export default function Ticker({
  items,
  duration = 32,
  reverse = false,
  className = "",
  itemClassName = "",
}) {
  const half = (
    <div className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <span key={`${it}-${i}`} className={`inline-flex items-center whitespace-nowrap ${itemClassName}`}>
          {it}
          <span aria-hidden="true" className="mx-6 text-accent">
            ·
          </span>
        </span>
      ))}
    </div>
  )

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="ticker-track flex w-max"
        style={{
          "--ticker-duration": `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {half}
        {half}
      </div>
    </div>
  )
}
