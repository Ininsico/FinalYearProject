// Lusion-pattern primitives for the marketing surface: uppercase mono micro
// labels with a dot, pill controls with a left-to-right sweep, cross
// decorations and arrow links.

export function Micro({ children, className = "", dot = true }) {
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.08em] ${className}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  )
}

export function Cross({ className = "" }) {
  return (
    <span aria-hidden="true" className={`relative block h-3 w-3 shrink-0 ${className}`}>
      <span className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 bg-current" />
      <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current" />
    </span>
  )
}

export function ArrowIcon({ className = "" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`transition-transform duration-300 group-hover:translate-x-0.5 ${className}`}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M2.343 8h11.314m0 0L8.673 3.016M13.657 8l-4.984 4.984"
      />
    </svg>
  )
}

const TONES = {
  dark: "bg-ink-950 text-paper [--sweep-color:var(--color-accent-ink)]",
  accent: "bg-accent text-paper [--sweep-color:var(--color-ink-950)]",
  light: "bg-paper text-ink-950 hover:text-paper [--sweep-color:var(--color-ink-950)]",
  outline:
    "border border-line-2 text-ink-900 hover:border-ink-950 hover:text-paper [--sweep-color:var(--color-ink-950)]",
  outlineLight:
    "border border-paper/30 text-paper hover:border-paper hover:text-ink-950 [--sweep-color:var(--color-paper)]",
}

export function Pill({ children, onClick, tone = "dark", className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`group sweep inline-flex h-12 items-center justify-center gap-2.5 rounded-full px-7 font-mono text-[0.68rem] uppercase tracking-[0.08em] transition-colors duration-300 ${TONES[tone]} ${className}`}
    >
      {children}
    </button>
  )
}

export function ArrowButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.08em] underline decoration-current/30 underline-offset-[6px] transition-colors duration-300 hover:decoration-current ${className}`}
    >
      {children}
      <ArrowIcon />
    </button>
  )
}
