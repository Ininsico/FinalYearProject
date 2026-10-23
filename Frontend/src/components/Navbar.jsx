import { useEffect, useRef, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import { List, X, ArrowRight } from "@phosphor-icons/react"
import { useAuth, homeForRole } from "../lib/auth"
import Wordmark from "./Wordmark"

const LINKS = [
  { label: "Platform", to: "/platform" },
  { label: "Domains", to: "/domains" },
  { label: "Pricing", to: "/pricing" },
  { label: "Docs", to: "/docs" },
  { label: "For institutions", to: "/institutions/register" },
  { label: "About", to: "/about" },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      if (!open) setHidden(y > 220 && y > lastY.current)
      lastY.current = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [open])

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const go = (to) => {
    setOpen(false)
    navigate(to)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[var(--z-sticky)] transition-[transform,background-color,border-color] duration-300 ${
        scrolled || open ? "border-b border-line bg-paper/85 backdrop-blur-md" : "border-b border-transparent"
      } ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}
    >
      <nav className="mx-auto flex h-[70px] max-w-[1240px] items-center justify-between px-6 sm:px-8">
        <button onClick={() => go("/")} aria-label="Fablet home" className="shrink-0">
          <Wordmark />
        </button>

        <div className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <button
              key={l.to}
              onClick={() => go(l.to)}
              aria-current={location.pathname === l.to ? "page" : undefined}
              className={`text-step--1 transition-colors duration-200 hover:text-ink-950 ${
                location.pathname === l.to ? "text-ink-950" : "text-ink-600"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-5 lg:flex">
          {user ? (
            <>
              <button onClick={() => go(homeForRole(user.role))} className="text-step--1 text-ink-600 transition-colors hover:text-ink-950">
                {user.role === "admin" ? "Console" : "Dashboard"}
              </button>
              <button
                onClick={async () => { await signOut(); navigate("/", { replace: true }) }}
                className="btn btn-ghost h-10"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button onClick={() => go("/signin")} className="text-step--1 text-ink-600 transition-colors hover:text-ink-950">
                Sign in
              </button>
              <button onClick={() => go("/signup")} className="btn btn-primary h-10">
                Get started
                <ArrowRight size={15} weight="bold" aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="flex h-11 w-11 items-center justify-center rounded-[3px] border border-line-2 text-ink-900 lg:hidden"
        >
          {open ? <X size={18} /> : <List size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-paper lg:hidden"
          >
            <div className="px-6 pb-8 pt-2 sm:px-8">
              {LINKS.map((l) => (
                <button
                  key={l.to}
                  onClick={() => go(l.to)}
                  className="block w-full border-b border-line py-4 text-left text-step-1 text-ink-800"
                >
                  {l.label}
                </button>
              ))}
              <div className="mt-6 flex flex-col gap-3">
                {user ? (
                  <>
                    <button onClick={() => go(homeForRole(user.role))} className="btn btn-ghost w-full">
                      {user.role === "admin" ? "Console" : "Dashboard"}
                    </button>
                    <button
                      onClick={async () => { await signOut(); navigate("/", { replace: true }) }}
                      className="btn btn-quiet justify-center"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => go("/signup")} className="btn btn-primary w-full">Get started</button>
                    <button onClick={() => go("/signin")} className="btn btn-ghost w-full">Sign in</button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
