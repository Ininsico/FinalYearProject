import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

const LINKS = [
  { label: "How it works", to: "/#how" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location.pathname])

  const go = (to) => {
    setOpen(false)
    if (to.startsWith("/#")) {
      const id = to.slice(2)
      if (location.pathname !== "/") {
        navigate("/")
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 60)
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
      }
      return
    }
    navigate(to)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-ink-100 bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <button onClick={() => go("/")} className="flex items-center gap-2.5" aria-label="Fablet home">
          <img src="/fablet-logo.png" alt="" className="h-8 w-8 object-contain" />
          <span className="text-lg font-bold tracking-tight text-ink-950">Fablet</span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <button
              key={l.to}
              onClick={() => go(l.to)}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-950"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => go("/contact")}
            className="ml-2 rounded-lg bg-ink-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
          >
            Request access
          </button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink-200 text-ink-900 md:hidden"
        >
          <span className="relative block h-4 w-5">
            <span className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rounded-full bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`absolute bottom-0 left-0 h-0.5 w-5 rounded-full bg-current transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink-100 bg-paper px-6 pb-4 pt-2 md:hidden">
          {LINKS.map((l) => (
            <button
              key={l.to}
              onClick={() => go(l.to)}
              className="block w-full rounded-lg px-3 py-3 text-left text-base font-medium text-ink-700 hover:bg-ink-100"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => go("/contact")}
            className="mt-2 w-full rounded-lg bg-ink-950 px-4 py-3 text-base font-semibold text-white"
          >
            Request access
          </button>
        </div>
      )}
    </header>
  )
}
