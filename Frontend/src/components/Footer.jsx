import { useNavigate } from "react-router-dom"
import Marquee from "./Marquee"

const COLUMNS = [
  {
    title: "Platform",
    links: [
      ["How it works", "/platform"],
      ["Domains", "/domains"],
      ["Pricing", "/pricing"],
      ["Documentation", "/docs"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Team", "/team"],
      ["Careers", "/careers"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Research", "/research"],
      ["Blog", "/blog"],
      ["Security", "/security"],
      ["Status", "/changelog"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
      ["Security", "/security"],
    ],
  },
]

export default function Footer() {
  const navigate = useNavigate()
  return (
    <footer className="border-t border-line bg-paper-2">
      <Marquee
        items={["Brief", "Plan", "Execute", "Operate", "Refine"]}
        speed={45}
        className="border-b border-line py-5"
        itemClassName="mx-8 display text-step-1 text-ink-400"
      />

      <div className="mx-auto max-w-[1240px] px-6 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2.4fr)]">
          <div>
            <p className="max-w-[34ch] text-step-1 leading-[1.4] text-ink-700">
              A self-orchestrating network of AI agents that turns a brief into a
              working product.
            </p>
            <a href="mailto:fablet@artdevelopers.site" className="link-underline mt-5 inline-block text-step--1">
              fablet@artdevelopers.site
            </a>
          </div>

          <div className="grid gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="eyebrow">{col.title}</h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map(([label, to]) => (
                    <li key={`${col.title}-${label}`}>
                      <button
                        onClick={() => navigate(to)}
                        className="text-step--1 text-ink-600 transition-colors duration-200 hover:text-ink-950"
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-line pt-8">
          <p className="display text-step-6 leading-none text-ink-950">Fablet</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-step--1 text-ink-500">
              &copy; {new Date().getFullYear()} Fablet. All rights reserved.
            </p>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-500">
              Built in Abbottabad
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
