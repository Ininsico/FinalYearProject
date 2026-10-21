import { useNavigate } from "react-router-dom"

const COLUMNS = [
  { title: "Platform", links: ["How it works", "Domains", "Pricing", "Status"] },
  { title: "Company", links: ["About", "Team", "Contact"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security"] },
]

export default function Footer() {
  const navigate = useNavigate()
  return (
    <footer className="border-t border-ink-100 bg-ink-950 px-6 py-16 text-ink-300">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2.5">
              <img src="/fablet-logo.png" alt="" className="h-8 w-8 object-contain" />
              <span className="text-lg font-bold text-white">Fablet</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-400">
              A self-orchestrating network of AI agents that turns a brief into a
              working product, across education, media, news, and enterprise.
            </p>
            <a
              href="mailto:fablet@artdevelopers.site"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink-200 hover:text-white"
            >
              fablet@artdevelopers.site
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold tracking-wide text-white">{col.title}</h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <button
                        onClick={() => navigate(link === "About" ? "/about" : link === "Contact" ? "/contact" : "/")}
                        className="text-sm text-ink-400 transition-colors hover:text-white"
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 text-sm text-ink-500">
          {"\u00A9"} {new Date().getFullYear()} Fablet. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
