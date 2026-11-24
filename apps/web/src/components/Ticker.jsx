// Continuous, seamless infinite ticker. The track holds two identical halves and
// animates one half width on a linear CSS keyframe, so the loop has no visible
// seam and no JS measurement. Decorative: hidden from assistive tech; callers
// provide an sr-only equivalent when the content matters.
const DEFAULT_SEPARATOR = (
  <span className="mx-6 inline-block h-1.5 w-1.5 rotate-45 bg-accent" aria-hidden="true" />
)

export default function Ticker({
  items,
  duration = 32,
  reverse = false,
  separator = DEFAULT_SEPARATOR,
  className = "",
  itemClassName = "",
}) {
  const half = (
    <div className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <span key={i} className={`inline-flex items-center whitespace-nowrap ${itemClassName}`}>
          {it}
          {separator}
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
