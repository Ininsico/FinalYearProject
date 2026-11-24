import { Link } from "react-router-dom"
import { ArrowLeft } from "@phosphor-icons/react"
import Wordmark from "./Wordmark"
import { Cross } from "./home/ui"

/**
 * Full-bleed frame for the auth pages, in the site's own language: the ink
 * canvas with the blueprint grid and an accent glow, the wordmark in the chrome
 * row, and the form on a paper plate with corner crosses. Pinned to one
 * viewport height with no scroll.
 */
export default function AuthSplit({ children }) {
  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-ink-950">
      <div className="grid-backdrop pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(60% 42% at 50% 0%, color-mix(in oklab, var(--color-accent) 26%, transparent), transparent 72%)",
        }}
      />

      <header className="relative flex items-center justify-between px-5 pt-5 sm:px-8">
        <Link to="/" aria-label="Fablet home" className="text-paper">
          <Wordmark tone="light" />
        </Link>
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-full border border-paper/25 px-4 py-2 text-[0.78rem] text-paper/80 transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-ink-950"
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
        <div className="w-full max-w-[440px]">
          <div className="auth-plate relative rounded-[15px] border border-line bg-paper-2 p-6 sm:p-8">
            <Cross className="absolute -left-2.5 -top-2.5 hidden text-paper/40 sm:block" />
            <Cross className="absolute -bottom-2.5 -right-2.5 hidden text-paper/40 sm:block" />
            {children}
          </div>
          <p className="mt-4 text-center font-mono text-[0.62rem] uppercase tracking-[0.08em] text-paper/40">
            Built by Artdevelopers
          </p>
        </div>
      </main>
    </div>
  )
}
