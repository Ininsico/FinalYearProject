import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Courses', href: '#courses' },
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        hidden ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      } ${
        scrolled
          ? 'bg-white/95 backdrop-blur border-b border-planet-100 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              scrolled ? 'bg-planet-900' : 'bg-white/20 backdrop-blur'
            }`}>
              <span className="text-white font-bold text-sm">T3P</span>
            </div>
            <span className={`text-xl font-bold transition-colors ${
              scrolled ? 'text-planet-900' : 'text-white'
            }`}>
              TheThirdPlanet
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`font-medium text-sm transition-colors ${
                  scrolled
                    ? 'text-planet-700 hover:text-planet-900'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button className={`px-4 py-2 text-sm font-medium transition-colors ${
              scrolled
                ? 'text-planet-700 hover:text-planet-900'
                : 'text-white/80 hover:text-white'
            }`}>
              Sign In
            </button>
            <button className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition-all shadow-sm ${
              scrolled
                ? 'bg-planet-900 hover:bg-planet-800'
                : 'bg-white/20 backdrop-blur hover:bg-white/30'
            }`}>
              Get Started
            </button>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 transition-colors ${
              scrolled ? 'text-planet-700' : 'text-white'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className={`md:hidden pb-4 pt-4 ${
            scrolled ? 'border-t border-planet-100' : 'border-t border-white/20'
          }`}>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`font-medium text-sm transition-colors ${
                    scrolled ? 'text-planet-700 hover:text-planet-900' : 'text-white/80 hover:text-white'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-3 pt-2">
                <button className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  scrolled
                    ? 'text-planet-700 border border-planet-300 hover:bg-planet-50'
                    : 'text-white border border-white/30 hover:bg-white/10'
                }`}>
                  Sign In
                </button>
                <button className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  scrolled
                    ? 'bg-planet-900 hover:bg-planet-800'
                    : 'bg-white/20 backdrop-blur hover:bg-white/30'
                }`}>
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
