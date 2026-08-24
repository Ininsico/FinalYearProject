import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const vh = window.innerHeight
      setScrolled(y > 80)
      setHidden(y > vh * 0.85 && y < vh * 11)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (to) => {
    setOpen(false)
    navigate(to)
  }

  const solid = scrolled || open

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        hidden && !open ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      } ${
        solid
          ? 'bg-white/95 backdrop-blur border-b border-planet-100 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => go('/')} className="flex items-center gap-2" aria-label="Fablet home">
          <img
            src="/fablet-logo.png"
            alt="Fablet"
            className={`h-8 w-8 rounded-lg object-contain transition-colors ${
              solid ? '' : 'bg-white/20 p-0.5 backdrop-blur'
            }`}
          />
          <span className={`text-xl font-bold transition-colors ${solid ? 'text-planet-900' : 'text-white'}`}>
            Fablet
          </span>
        </button>

        {/* Hamburger — always visible */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className={`relative flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
            solid
              ? 'border-planet-200 text-planet-900 hover:bg-planet-100'
              : 'border-white/30 text-white hover:bg-white/10'
          }`}
        >
          <span className="relative block h-5 w-6">
            <motion.span
              className="absolute left-0 top-0 h-0.5 w-6 rounded-full bg-current"
              animate={open ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            />
            <motion.span
              className="absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 rounded-full bg-current"
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute bottom-0 left-0 h-0.5 w-6 rounded-full bg-current"
              animate={open ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            />
          </span>
        </button>
      </div>

      {/* Compact dropdown pinned under the button */}
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden="true" />
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-4 top-full z-40 mt-3 w-60 overflow-hidden rounded-2xl border border-planet-100 bg-white p-2 shadow-2xl sm:right-6 lg:right-8"
            >
              {LINKS.map((l) => {
                const active = location.pathname === l.to
                return (
                  <button
                    key={l.to}
                    onClick={() => go(l.to)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-base font-medium transition-colors ${
                      active ? 'bg-blue-50 text-blue-600' : 'text-planet-800 hover:bg-planet-50'
                    }`}
                  >
                    {l.label}
                    <span className="text-planet-300">→</span>
                  </button>
                )
              })}
              <button
                onClick={() => go('/contact')}
                className="mt-1 w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-blue-500"
              >
                Get started
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
