import { Link } from "react-router-dom"
import { ArrowLeft } from "@phosphor-icons/react"
import Wordmark from "./Wordmark"
import { Cross, Micro } from "./home/ui"

/**
 * Split-screen frame for the auth pages: one half is the form card, the other
 * half is the brand panel. `formSide` mirrors the two pages — sign in carries
 * the form on the right, sign up on the left — without changing the DOM order.
 */
export default function AuthSplit({
  formSide = "right",
  eyebrow,
  quote,
  source,
  points = [],
  watermark,
  children,
}) {
  const quoteOnLeft = formSide === "right"

  return (
    <div className="lg:grid lg:min-h-[100dvh] lg:grid-cols-2">
      <aside
        className={`relative hidden overflow-hidden bg-ink-950 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16 ${
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

        <div className="relative max-w-[42ch] text-paper">
          <Micro className="text-paper/50">{eyebrow}</Micro>
          <p className="display mt-6 text-step-3 leading-[1.05] tracking-[-0.02em]">{quote}</p>
          <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-paper/40">
            {source}
          </p>

          {points.length > 0 && (
            <ul className="mt-10 border-t border-paper/10">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 border-b border-paper/10 py-3.5 text-step--1 leading-relaxed text-paper/75"
                >
                  <span
                    className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent"
                    aria-hidden="true"
                  />
                  {point}
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="relative font-mono text-[0.68rem] uppercase tracking-[0.08em] text-paper/30">
          Built by Artdevelopers
        </p>
      </aside>

      <main
        className={`flex min-h-[100dvh] flex-col bg-paper lg:h-[100dvh] lg:min-h-0 lg:overflow-y-auto ${
          quoteOnLeft ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-6 sm:px-10">
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

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10">
          <div className="w-full max-w-[460px]">
            <div className="rounded-[15px] border border-line bg-paper-2 p-6 sm:p-9">{children}</div>
          </div>
        </div>
      </main>
    </div>
  )
}
