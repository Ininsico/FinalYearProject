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

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center border-b border-line px-4">
        <Wordmark />
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-3" aria-label="Section">
        <p className="px-2.5 pb-1.5 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-ink-400">
          Menu
        </p>
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `mb-0.5 flex items-center gap-2.5 rounded-full px-2.5 py-2 text-[0.82rem] transition-colors ${
                isActive ? "bg-accent-soft text-accent-ink" : "text-ink-600 hover:bg-paper-3 hover:text-ink-950"
              }`
            }
          >
            <Icon size={16} weight="regular" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-2.5">
          <img
            src={user?.avatarUrl || "/defaultprofile.png"}
            alt=""
            className="h-8 w-8 shrink-0 rounded-full border border-line-2 object-cover"
            onError={(e) => {
              if (!e.currentTarget.src.endsWith("/defaultprofile.png")) {
                e.currentTarget.src = "/defaultprofile.png"
              }
            }}
          />
          <div className="min-w-0">
            <p className="truncate text-[0.8rem] text-ink-900">{user?.name}</p>
            <p className="truncate text-[0.7rem] text-ink-500">{user?.email}</p>
          </div>
        </div>
        {footerNote && (
          <p className="mt-2.5 text-[0.68rem] leading-relaxed text-ink-500">{footerNote}</p>
        )}
        <button
          onClick={async () => { await signOut(); navigate("/", { replace: true }) }}
          className="btn btn-ghost mt-2.5 h-9 w-full text-[0.8rem]"
        >
          <SignOut size={14} weight="bold" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-[100dvh] bg-paper">
      <aside className="fixed inset-y-0 left-0 hidden w-[232px] border-r border-line bg-paper-2 lg:block">
        {sidebar}
      </aside>

      <div className="sticky top-0 z-[var(--z-sticky)] flex h-14 items-center justify-between border-b border-line bg-paper/90 px-4 backdrop-blur-md lg:hidden">
        <Wordmark />
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line-2 text-ink-900"
        >
          {open ? <X size={18} /> : <List size={18} />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[var(--z-modal)] lg:hidden">
          <button aria-label="Close menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-ink-950/40" />
          <div className="absolute inset-y-0 left-0 w-[260px] border-r border-line bg-paper-2">{sidebar}</div>
        </div>
      )}

      <div className="lg:pl-[232px]">
        <div className="px-5 py-8 sm:px-8 sm:py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
