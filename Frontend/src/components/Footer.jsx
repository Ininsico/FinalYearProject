import { Globe, Send, Rss, AtSign, ArrowRight, Mail } from 'lucide-react'

const columns = [
  {
    title: 'Platform',
    links: ['AI Swarm', 'No-Code Builder', 'Media Engines', 'Enterprise Tools', 'Pricing'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Blog', 'Press', 'Contact'],
  },
  {
    title: 'Resources',
    links: ['Docs', 'API Reference', 'Status', 'Community', 'Changelog'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Security', 'Cookies'],
  },
]

const socials = [
  { icon: Globe, label: 'Website' },
  { icon: Send, label: 'Updates' },
  { icon: Rss, label: 'Blog' },
  { icon: AtSign, label: 'Social' },
]

export default function Footer() {
  return (
    <footer className="relative bg-[#070b1c] text-slate-300 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand + newsletter */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <img src="/fablet-logo.png" alt="Fablet" className="w-9 h-9 rounded-lg object-contain" />
              <span className="text-xl font-bold text-white">Fablet</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs mb-6">
              The self-orchestrating AI swarm that builds anything you can imagine —
              from education and media to enterprise tools, end to end.
            </p>

            <form
              className="flex items-center gap-2 max-w-sm"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full rounded-lg bg-white/5 border border-white/10 pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-400/60 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="p-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-white font-semibold text-sm mb-4 tracking-wide">
                  {col.title}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-slate-500">
            &copy; 2026 Fablet. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-400/50 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
