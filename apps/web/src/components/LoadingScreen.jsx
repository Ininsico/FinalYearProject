import Wordmark from "./Wordmark"

/**
 * Branded boot screen, shown while the session is restored or a guard checks
 * the visitor. Paper canvas with the grid, the wordmark, a sweeping accent bar
 * and a mono status line. CSS-only motion, reduced-motion safe.
 */
export default function LoadingScreen({ label = "Opening the academy" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-paper px-6"
    >
      <div className="grid-backdrop-light pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative flex flex-col items-center">
        <Wordmark />
        <div className="mt-6 h-[3px] w-40 overflow-hidden rounded-full bg-paper-3" aria-hidden="true">
          <div className="loader-bar h-full w-1/3 rounded-full bg-accent" />
        </div>
        <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-400">{label}</p>
      </div>
    </div>
  )
}

/** Compact in-page loading line for panels and lists. */
export function InlineLoader({ label = "Loading" }) {
  return (
    <span
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-2 text-[0.82rem] text-ink-500"
    >
      <span className="inline-flex gap-1" aria-hidden="true">
        <span className="loader-dot h-1 w-1 rounded-full bg-accent" />
        <span className="loader-dot h-1 w-1 rounded-full bg-accent [animation-delay:150ms]" />
        <span className="loader-dot h-1 w-1 rounded-full bg-accent [animation-delay:300ms]" />
      </span>
      {label}
    </span>
  )
}
