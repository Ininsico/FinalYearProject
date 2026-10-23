export default function Wordmark({ className = "" }) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className="display text-[1.55rem] leading-none text-ink-950">Fablet</span>
      <span aria-hidden="true" className="mb-[2px] block h-[6px] w-[6px] rounded-full bg-accent" />
    </span>
  )
}
