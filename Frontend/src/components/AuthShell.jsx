import { Link } from "react-router-dom"
import Wordmark from "./Wordmark"

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <section className="flex min-h-[100dvh] items-center justify-center px-6 pb-20 pt-32">
      <div className="w-full max-w-[420px]">
        <Link to="/" className="mb-9 flex justify-center" aria-label="Fablet home">
          <Wordmark />
        </Link>

        <h1 className="text-step-3 font-bold text-ink-950">{title}</h1>
        {subtitle && <p className="mt-3 text-step--1 leading-relaxed text-ink-600">{subtitle}</p>}

        <div className="mt-8">{children}</div>

        {footer && <div className="mt-7 text-step--1 text-ink-600">{footer}</div>}
      </div>
    </section>
  )
}
