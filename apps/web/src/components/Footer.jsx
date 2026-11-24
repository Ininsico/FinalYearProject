import { useNavigate } from "react-router-dom"
import Ticker from "./Ticker"

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
      <Ticker
        items={[
          "Courses drafted with AI",
          "Directed by instructors",
          "Short lessons, real assessments",
          "Free to start",
          "Seat plans for institutions",
          "Built in Abbottabad",
        ]}
        duration={38}
        className="border-b border-line py-4"
        itemClassName="display text-step-1 text-ink-400"
      />

      <div className="mx-auto max-w-[1240px] px-6 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2.4fr)]">
          <div>
            <p className="max-w-[34ch] text-step-1 leading-[1.4] text-ink-700">
              An online teaching academy. AI drafts the material, instructors direct
              it, and students learn in short lessons, exercises and assessments.
            </p>
            <a href="mailto:fablet@artdevelopers.site" className="link-underline mt-5 inline-block text-step--1">
              fablet@artdevelopers.site
            </a>
          </div>

          <div className="grid gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-[0.8rem] font-medium text-ink-950">{col.title}</h3>
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
          <div className="flex items-center gap-6">
            <img
              src="/fablet-logo.png"
              alt=""
              aria-hidden="true"
              draggable="false"
              className="h-20 w-auto sm:h-28"
            />
            <p className="display text-step-6 leading-none text-ink-950">Fablet</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-step--1 text-ink-500">
              &copy; {new Date().getFullYear()} Fablet. All rights reserved.
            </p>
            <p className="text-[0.8rem] text-ink-500">
              Built in Abbottabad
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
