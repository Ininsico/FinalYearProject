import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "@phosphor-icons/react"
import { fetchDictionary } from "../../lib/dictionary"
import { Container } from "../layout"
import Reveal from "../Reveal"
import SplitHeading from "../SplitHeading"

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
    <section id="catalogue" data-bg="#eef0ff" className="border-t border-line py-20 sm:py-28">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-20">
          <SplitHeading as="h2" className="max-w-[16ch] text-step-4 text-ink-950 display">
            The opening catalogue.
          </SplitHeading>
          <Reveal>
            <p className="max-w-[48ch] text-step-0 leading-relaxed text-ink-600">
              Live from the platform: every published course, its subject and its
              premium shelf, exactly as students see it after signing in.
            </p>
          </Reveal>
        </div>

        {error && (
          <p role="alert" className="mt-12 max-w-[60ch] border-t border-line pt-6 text-step--1 leading-relaxed text-ink-600">
            {error} Try again in a moment, or create a free account and browse from your
            dashboard.
          </p>
        )}

        {!catalogue && !error && (
          <p aria-live="polite" className="mt-12 border-t border-line pt-6 text-step--1 text-ink-500">
            Loading the catalogue
          </p>
        )}

        {catalogue && modules.length === 0 && (
          <p className="mt-12 max-w-[60ch] border-t border-line pt-6 text-step--1 leading-relaxed text-ink-600">
            The catalogue is being written. Create a free account and the first modules
            will be waiting when they publish.
          </p>
        )}

        {catalogue && modules.length > 0 && (
          <>
            <ul className="mt-12">
              {modules.map((m, i) => (
                <li
                  key={m.id}
                  className="grid gap-4 border-t border-line py-7 sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:items-baseline"
                >
                  <span className="font-mono text-[0.7rem] tabular text-accent-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="display text-step-2 text-ink-950">{m.title}</h3>
                    <p className="mt-2 max-w-[62ch] text-step--1 leading-relaxed text-ink-600">
                      {m.summary}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 text-step--1 text-ink-500 sm:justify-end">
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em]">
                      {m.subject}
                    </span>
                    <span>{LEVEL[m.level] ?? m.level}</span>
                    <span className="tabular">
                      {m.lessons} lesson{m.lessons === 1 ? "" : "s"}
                    </span>
                    {m.premium && (
                      <span className="rounded-[2px] border border-line-2 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink-700">
                        Premium
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6 border-t border-line pt-7">
              <p className="max-w-[52ch] text-step--1 text-ink-500">
                {total} course{total === 1 ? "" : "s"} published across {subjects.join(", ")}.
              </p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
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
