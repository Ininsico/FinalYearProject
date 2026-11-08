import { Link } from "react-router-dom"
import { ArrowLeft } from "@phosphor-icons/react"
import Wordmark from "./Wordmark"

/**
 * Split-screen frame for the auth pages: one half is the form, the other half
 * is a quote panel. `formSide` mirrors the two pages — sign in carries the
 * form on the right, sign up on the left — without changing the DOM order.
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
        style={{
          backgroundImage:
            "radial-gradient(70% 55% at 82% 12%, color-mix(in oklab, var(--color-accent) 34%, transparent), transparent 68%)",
        }}
      >
        <span
          aria-hidden="true"
          className="display pointer-events-none absolute -bottom-10 -left-6 select-none whitespace-nowrap text-[11rem] leading-none text-paper/[0.045] xl:text-[14rem]"
        >
          {watermark}
        </span>

        <Link to="/" aria-label="Fablet home" className="relative inline-flex">
          <Wordmark tone="light" />
        </Link>

        <div className="relative max-w-[42ch]">
          <p aria-hidden="true" className="display text-step-5 leading-[0.6] text-paper/20">
            &ldquo;
          </p>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-paper/40">{eyebrow}</p>
          <blockquote className="mt-6">
            <p className="display text-step-3 text-paper">{quote}</p>
            <footer className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-paper/40">
              {source}
            </footer>
          </blockquote>

          {points.length > 0 && (
            <ul className="mt-12 space-y-4 border-t border-paper/10 pt-8">
              {points.map((point) => (
                <li key={point} className="flex items-baseline gap-4 text-step--1 text-paper/70">
                  <span aria-hidden="true" className="display text-step--1 text-accent-soft">
                    &ndash;
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="relative font-mono text-[0.68rem] uppercase tracking-[0.18em] text-paper/30">
          From a sentence to a running product.
        </p>
      </aside>

      <main
        className={`flex min-h-[100dvh] flex-col bg-paper lg:h-[100dvh] lg:min-h-0 lg:overflow-y-auto ${
          quoteOnLeft ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-7 sm:px-10">
          <Link to="/" aria-label="Fablet home">
            <Wordmark />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[0.8rem] text-ink-600 transition-colors hover:text-ink-950"
          >
            <ArrowLeft size={14} weight="bold" aria-hidden="true" />
            Back to home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-14 sm:px-10">
          <div className="w-full max-w-[440px]">{children}</div>
        </div>
      </main>
    </div>
  )
}
