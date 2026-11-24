import { Link } from "react-router-dom"
import Wordmark from "./Wordmark"

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <section className="flex min-h-[100dvh] items-center justify-center bg-paper px-5 pb-20 pt-28 sm:px-8">
      <div className="w-full max-w-[440px]">
        <Link to="/" className="mb-8 flex justify-center" aria-label="Fablet home">
          <Wordmark />
        </Link>

        <div className="rounded-[15px] border border-line bg-paper-2 p-6 sm:p-9">
          <h1 className="display text-step-3 text-ink-950">{title}</h1>
          {subtitle && (
            <p className="mt-3 text-step--1 leading-relaxed text-ink-600">{subtitle}</p>
          )}

          <div className="mt-8">{children}</div>
        </div>

        {footer && <div className="mt-6 text-center text-step--1 text-ink-600">{footer}</div>}
      </div>
    </section>
  )
}
