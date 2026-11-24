import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "@phosphor-icons/react"
import { fetchDictionary } from "../../lib/dictionary"
import { Container } from "../layout"

const LEVEL = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" }

export default function Catalogue() {
  const navigate = useNavigate()
  const [catalogue, setCatalogue] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    let live = true
    fetchDictionary({ limit: 6 })
      .then((data) => {
        if (live) setCatalogue(data)
      })
      .catch(() => {
        if (live) setError("The catalogue is not answering right now.")
      })
    return () => {
      live = false
    }
  }, [])

  const modules = catalogue?.modules ?? []
  const total = catalogue?.total ?? 0
  const subjects = catalogue?.subjects ?? []

  return (
    <section id="catalogue" className="border-y border-line bg-paper-2 py-14 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-step-2 text-ink-950">The opening catalogue.</h2>
          <p className="max-w-[44ch] text-step--1 text-ink-500">
            Live from the platform: every published course, with its subject, level and
            premium shelf.
          </p>
        </div>

        {error && (
          <p role="alert" className="mt-10 max-w-[60ch] border-t border-line pt-5 text-step--1 leading-relaxed text-ink-600">
            {error} Try again in a moment, or create a free account and browse from your
            dashboard.
          </p>
        )}

        {!catalogue && !error && (
          <p aria-live="polite" className="mt-10 border-t border-line pt-5 text-step--1 text-ink-500">
            Loading the catalogue
          </p>
        )}

        {catalogue && modules.length === 0 && (
          <p className="mt-10 max-w-[60ch] border-t border-line pt-5 text-step--1 leading-relaxed text-ink-600">
            The catalogue is being written. Create a free account and the first modules
            will be waiting when they publish.
          </p>
        )}

        {catalogue && modules.length > 0 && (
          <>
            <ul className="mt-10">
              {modules.map((m, i) => (
                <li
                  key={m.id}
                  className="grid gap-3 border-t border-line py-5 md:grid-cols-[56px_minmax(0,1fr)_auto] md:items-baseline md:gap-4"
                >
                  <span className="font-mono text-[0.7rem] tabular text-ink-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="display text-step-1 text-ink-950">{m.title}</h3>
                    <p className="mt-1.5 max-w-[62ch] text-step--1 leading-relaxed text-ink-600">
                      {m.summary}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5 text-step--1 text-ink-500 md:justify-end">
                    <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em]">
                      {m.subject}
                    </span>
                    <span>{LEVEL[m.level] ?? m.level}</span>
                    <span className="tabular">
                      {m.lessons} lesson{m.lessons === 1 ? "" : "s"}
                    </span>
                    {m.premium && (
                      <span className="rounded-[2px] border border-line-2 bg-paper px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-700">
                        Premium
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5 border-t border-line pt-6">
              <p className="max-w-[52ch] text-step--1 text-ink-500">
                {total} course{total === 1 ? "" : "s"} published across {subjects.join(", ")}.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <button onClick={() => navigate("/signup")} className="btn btn-accent">
                  Create your free account
                  <ArrowRight size={16} weight="bold" aria-hidden="true" />
                </button>
                <button onClick={() => navigate("/pricing")} className="link-underline text-step--1">
                  See pricing
                </button>
              </div>
            </div>
          </>
        )}
      </Container>
    </section>
  )
}
