import { Link } from "react-router-dom"
import { ArrowLeft } from "@phosphor-icons/react"
import Wordmark from "./Wordmark"
import { Cross } from "./home/ui"

/**
 * Split frame for the auth pages: the accent panel sticks to the viewport on
 * one side while the form column scrolls naturally on the other. `formSide`
 * mirrors the pages — sign in carries the form on the right, sign up and
 * institution registration on the left.
 */
export default function AuthSplit({ formSide = "right", watermark, backdrop, children }) {
  const panelOnLeft = formSide === "right"

  return (
    <div className="relative lg:grid lg:grid-cols-2">
      {backdrop && (
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
          <img
            src={backdrop}
            alt=""
            className="h-full w-full scale-110 object-cover blur-[22px] saturate-[1.15]"
          />
          <div className="absolute inset-0 bg-paper/55" />
        </div>
      )}

      <aside
        className={`relative z-10 hidden lg:block ${panelOnLeft ? "lg:order-1" : "lg:order-2"}`}
      >
        <div
          className={`sticky top-0 flex h-[100dvh] flex-col justify-between overflow-hidden p-10 text-paper xl:p-14 ${
            backdrop ? "bg-accent/80" : "bg-accent"
          }`}
        >
          <div className="grid-backdrop pointer-events-none absolute inset-0" aria-hidden="true" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(70% 55% at 80% 10%, rgba(249, 247, 242, 0.18), transparent 70%)",
            }}
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-8 -left-4 select-none whitespace-nowrap font-sans text-[9rem] font-bold italic leading-none tracking-[-0.04em] text-transparent opacity-30 [-webkit-text-stroke:1.5px_var(--color-paper)] xl:text-[12rem]"
          >
            {watermark}
          </span>

          <div className="relative flex items-center justify-between gap-4">
            <Link to="/" aria-label="Fablet home" className="inline-flex text-paper">
              <Wordmark tone="light" />
            </Link>
            <Link
              to="/"
              className="group inline-flex items-center gap-1.5 rounded-full border border-paper/25 px-3.5 py-1.5 text-[0.72rem] text-paper/80 transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-ink-950"
            >
              <ArrowLeft
                size={12}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              />
              Back to home
            </Link>
          </div>

          <span className="relative flex items-center gap-4 text-paper/60" aria-hidden="true">
            <Cross />
            <Cross />
          </span>
        </div>
      </aside>

      <main
        className={`relative z-10 flex min-h-[100dvh] flex-col ${
          backdrop ? "bg-transparent" : "bg-paper"
        } ${panelOnLeft ? "lg:order-2" : "lg:order-1"}`}
      >
        <div className="flex items-center justify-between px-5 pt-4 sm:px-10 lg:hidden">
          <Link to="/" aria-label="Fablet home">
            <Wordmark />
          </Link>
          <span className="hidden lg:block" />
          <Link
            to="/"
            className="group inline-flex items-center gap-1.5 rounded-full border border-line-2 px-3.5 py-1.5 text-[0.72rem] text-ink-700 transition-colors duration-300 hover:border-ink-950 hover:bg-ink-950 hover:text-paper"
          >
            <ArrowLeft
              size={12}
              weight="bold"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            <span className="sr-only sm:not-sr-only">Back to home</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-6 sm:px-10">
          <div className="w-full max-w-[440px]">
            <div className="auth-plate relative rounded-[15px] border border-line bg-paper-2 p-5 sm:p-7">
              <Cross className="absolute -left-2.5 -top-2.5 hidden text-line-2 sm:block" />
              <Cross className="absolute -bottom-2.5 -right-2.5 hidden text-line-2 sm:block" />
              {children}
            </div>
            <p className="mt-4 text-center font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-400">
              Built by Artdevelopers
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
