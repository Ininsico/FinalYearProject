// Continuous, seamless infinite ticker. The track holds two identical halves and
// animates exactly one half width on a linear CSS keyframe, so the loop has no
// visible seam and no JS measurement. Spacing lives on the separators in em units,
// so it scales with the type size and stays identical across the seam.
// Decorative: hidden from assistive tech; callers provide an sr-only equivalent
// when the content matters.
export default function Ticker({
  items,
  duration = 32,
  reverse = false,
  offset = 0,
  separatorClassName = "mx-[0.9em] h-[0.24em] w-[0.24em]",
  className = "",
  itemClassName = "",
}) {
  const sequence = offset ? [...items.slice(offset), ...items.slice(0, offset)] : items

  const half = (
    <div className="flex shrink-0 items-center">
      {sequence.map((it, i) => (
        <span key={i} className={`inline-flex items-center whitespace-nowrap ${itemClassName}`}>
          {it}
          <span
            className={`inline-block shrink-0 rotate-45 bg-accent ${separatorClassName}`}
            aria-hidden="true"
          />
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
