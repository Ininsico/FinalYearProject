import { useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { List, SidebarSimple, SignOut, X } from "@phosphor-icons/react"
import Wordmark from "../Wordmark"
import { useAuth } from "../../lib/auth"

/** Sidebar shell shared by the student, institution and admin areas. */
export default function AppShell({ nav, footerNote = null }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("fablet.sidebar") === "collapsed"
  )

  const toggleCollapsed = () => {
    setCollapsed((v) => {
      localStorage.setItem("fablet.sidebar", v ? "open" : "collapsed")
      return !v
    })
  }

  const sidebar = (compact) => (
    <div className="flex h-full flex-col bg-accent-soft">
      <div
        className={`flex h-14 shrink-0 items-center border-b border-accent-ink/15 ${
          compact ? "justify-center px-2" : "justify-between px-4"
        }`}
      >
        {!compact && <Wordmark />}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={compact ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!compact}
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-700 transition-colors duration-300 hover:bg-paper/60 hover:text-ink-950"
        >
          <SidebarSimple size={16} weight="bold" aria-hidden="true" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2.5" aria-label="Section">
        {!compact && (
          <p className="px-2.5 pb-1.5 font-mono text-[0.58rem] uppercase tracking-[0.08em] text-ink-700">
            Menu
          </p>
        )}
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            title={compact ? label : undefined}
            className={({ isActive }) =>
              `mb-0.5 flex items-center rounded-full py-1.5 text-[0.8rem] transition-colors duration-300 ${
                compact ? "justify-center px-0" : "gap-2 px-2.5"
              } ${
                isActive
                  ? "bg-ink-950 text-paper"
                  : "text-ink-700 hover:bg-paper/60 hover:text-ink-950"
              }`
            }
          >
            <Icon size={16} weight="regular" aria-hidden="true" />
            {!compact && label}
          </NavLink>
        ))}
      </nav>

      <div className={`border-t border-accent-ink/15 ${compact ? "p-2" : "p-2.5"}`}>
        <div className={`flex items-center ${compact ? "justify-center" : "gap-2"}`}>
          <img
            src={user?.avatarUrl || "/defaultprofile.png"}
            alt=""
            title={user?.name}
            className="h-7 w-7 shrink-0 rounded-full border border-accent-ink/20 object-cover"
            onError={(e) => {
              if (!e.currentTarget.src.endsWith("/defaultprofile.png")) {
                e.currentTarget.src = "/defaultprofile.png"
              }
            }}
          />
          {!compact && (
            <div className="min-w-0">
              <p className="truncate text-[0.78rem] text-ink-950">{user?.name}</p>
              <p className="truncate text-[0.68rem] text-ink-700">{user?.email}</p>
            </div>
          )}
        </div>
        {!compact && footerNote && (
          <p className="mt-2 text-[0.66rem] leading-relaxed text-ink-700">{footerNote}</p>
        )}
        <button
          onClick={async () => { await signOut(); navigate("/", { replace: true }) }}
          title="Sign out"
          className={`btn btn-ghost h-8 ${compact ? "mt-2 w-full justify-center px-0" : "mt-2 w-full border-accent-ink/25 px-3 text-[0.76rem]"}`}
        >
          <SignOut size={13} weight="bold" aria-hidden="true" />
          {!compact && "Sign out"}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-[100dvh] bg-paper">
      <aside
        className={`fixed inset-y-0 left-0 hidden border-r border-accent-ink/15 lg:block ${
          collapsed ? "w-16" : "w-[208px]"
        }`}
      >
        {sidebar(collapsed)}
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
          <div className="absolute inset-y-0 left-0 w-[240px] border-r border-accent-ink/15">
            {sidebar(false)}
          </div>
        </div>
      )}

      <div className={collapsed ? "lg:pl-16" : "lg:pl-[208px]"}>
        <div className="px-5 py-8 sm:px-8 sm:py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
