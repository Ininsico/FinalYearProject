import { Link } from "react-router-dom"
import { ArrowLeft } from "@phosphor-icons/react"
import Wordmark from "./Wordmark"
import { Cross } from "./home/ui"

/**
 * Split-screen frame for the auth pages: one half is the form card, the other
 * half is the brand panel. `formSide` mirrors the pages — sign in carries the
 * form on the right, sign up and institution registration on the left — without
 * changing the DOM order.
 */
export default function AuthSplit({ formSide = "right", watermark, children }) {
  const quoteOnLeft = formSide === "right"

  return (
    <div className="h-[100dvh] overflow-hidden lg:grid lg:grid-cols-2">
      <aside
        className={`relative hidden overflow-hidden bg-ink-950 lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-14 ${
          quoteOnLeft ? "lg:order-1" : "lg:order-2"
        }`}
      >
        <div className="grid-backdrop pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(70% 55% at 82% 12%, color-mix(in oklab, var(--color-accent) 30%, transparent), transparent 68%)",
          }}
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 -left-4 select-none whitespace-nowrap font-sans text-[9rem] font-bold italic leading-none tracking-[-0.04em] text-transparent opacity-15 [-webkit-text-stroke:1.5px_var(--color-paper)] xl:text-[12rem]"
        >
          {watermark}
        </span>

        <div className="relative flex items-center justify-between text-paper">
          <Link to="/" aria-label="Fablet home">
            <Wordmark tone="light" />
          </Link>
          <Cross className="text-paper/40" />
        </div>

        <span className="relative" aria-hidden="true" />

        <p className="relative font-mono text-[0.68rem] uppercase tracking-[0.08em] text-paper/30">
          Built by Artdevelopers
        </p>
      </aside>

      <main
        className={`flex h-full min-h-0 flex-col bg-paper ${
          quoteOnLeft ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-5 sm:px-10">
          <Link to="/" aria-label="Fablet home" className="lg:hidden">
            <Wordmark />
          </Link>
          <span className="hidden lg:block" aria-hidden="true" />
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
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center px-5 py-6 sm:px-10">
          <div className="w-full max-w-[400px]">
            <div className="auth-plate rounded-[15px] border border-line bg-paper-2 p-5 sm:p-6">{children}</div>
          </div>
        </div>
      </main>
    </div>
  )
}
