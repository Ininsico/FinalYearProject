import { useState, useEffect } from 'react'
import erebusLogo from '../../assets/erebus_logo.png'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Metrics', href: '#metrics' },
  { label: 'Timeline', href: '#timeline' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[rgba(5,8,7,0.85)] backdrop-blur-2xl border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3 select-none">
          <div className="w-8 h-8 relative">
            <img src={erebusLogo} alt="Erebus" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-[0.2em] uppercase text-text m-0 leading-none">
              Erebus <span className="text-accent">AVR</span>
            </h1>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs tracking-widest uppercase text-muted hover:text-accent transition-colors font-semibold"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#cta"
            className="bg-accent text-bg px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase hover:brightness-110 transition shadow-[0_0_20px_rgba(34,255,102,0.15)]"
          >
            Get Started
          </a>
        </nav>
      </div>
    </header>
  )
}
