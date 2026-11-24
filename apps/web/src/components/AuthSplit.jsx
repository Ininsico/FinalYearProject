import { Link } from "react-router-dom"
import { ArrowLeft } from "@phosphor-icons/react"
import Wordmark from "./Wordmark"

/**
 * Full-bleed frame for the auth pages: a paper canvas carrying the blueprint
 * grid and an accent glow, the wordmark in the chrome row, and the form in a
 * raised card centred in the viewport. Pinned to one viewport height, no scroll.
 */
export default function AuthSplit({ children }) {
  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-paper">
      <div className="grid-backdrop-light pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(60% 42% at 50% 0%, color-mix(in oklab, var(--color-accent) 12%, transparent), transparent 72%)",
        }}
      />

      <header className="relative flex items-center justify-between px-5 pt-5 sm:px-8">
        <Link to="/" aria-label="Fablet home">
          <Wordmark />
        </Link>
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-full border border-line-2 px-4 py-2 text-[0.78rem] text-ink-700 transition-colors duration-300 hover:border-ink-950 hover:bg-ink-950 hover:text-paper"
        >
          <ArrowLeft
            size={13}
            weight="bold"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          Back to home
        </Link>
      </header>

      <main className="relative flex min-h-0 flex-1 items-center justify-center px-5 py-6">
        <div className="w-full max-w-[420px]">
          <div className="auth-plate rounded-[20px] border border-line bg-paper p-6 shadow-[0_30px_80px_-45px_rgba(20,18,30,0.5)] sm:p-8">
            {children}
          </div>
          <p className="mt-4 text-center font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-400">
            Built by Artdevelopers
          </p>
        </div>
      </main>
    </div>
  )
}
