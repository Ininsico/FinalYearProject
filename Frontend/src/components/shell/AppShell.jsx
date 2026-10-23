import { useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { List, X, SignOut } from "@phosphor-icons/react"
import Wordmark from "../Wordmark"
import { useAuth } from "../../lib/auth"

/** Sidebar shell shared by the student, institution and admin areas. */
export default function AppShell({ nav, footerNote = null }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const initial = (user?.name || "?").trim().slice(0, 1).toUpperCase()

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-[70px] shrink-0 items-center border-b border-line px-5">
        <Wordmark />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Section">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `mb-1 flex items-center gap-3 rounded-[3px] px-3 py-2.5 text-step--1 transition-colors ${
                isActive ? "bg-accent-soft text-accent-ink" : "text-ink-600 hover:bg-paper-3 hover:text-ink-950"
              }`
            }
          >
            <Icon size={17} weight="regular" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line p-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-step--1 font-medium text-accent-ink"
          >
            {initial}
          </span>
          <div className="min-w-0">
            <p className="truncate text-step--1 text-ink-900">{user?.name}</p>
            <p className="truncate text-[0.74rem] text-ink-500">{user?.email}</p>
          </div>
        </div>
        {footerNote && <p className="mt-3 text-[0.72rem] leading-relaxed text-ink-500">{footerNote}</p>}
        <button
          onClick={async () => { await signOut(); navigate("/", { replace: true }) }}
          className="btn btn-ghost mt-3 h-10 w-full"
        >
          <SignOut size={15} weight="bold" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-[100dvh] bg-paper">
      <aside className="fixed inset-y-0 left-0 hidden w-[264px] border-r border-line bg-paper-2 lg:block">
        {sidebar}
      </aside>

      <div className="sticky top-0 z-[var(--z-sticky)] flex h-[62px] items-center justify-between border-b border-line bg-paper/90 px-4 backdrop-blur-md lg:hidden">
        <Wordmark />
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-[3px] border border-line-2 text-ink-900"
        >
          {open ? <X size={18} /> : <List size={18} />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[var(--z-modal)] lg:hidden">
          <button aria-label="Close menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-ink-950/40" />
          <div className="absolute inset-y-0 left-0 w-[280px] border-r border-line bg-paper-2">{sidebar}</div>
        </div>
      )}

      <div className="lg:pl-[264px]">
        <div className="mx-auto max-w-[1100px] px-6 py-10 sm:px-8 sm:py-14">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
