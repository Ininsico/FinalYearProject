import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container } from "../layout"
import { ArrowIcon, Micro, Pill } from "./ui"

const CODE = "OpenUp"

export default function OfferBand() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CODE)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="bg-paper py-16 sm:py-24">
      <Container>
        <div className="overflow-hidden rounded-[15px] border border-line-2 bg-accent-soft">
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-0">
            <div>
              <Micro className="text-accent-ink">Launch offer</Micro>
              <p className="display mt-6 max-w-[22ch] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] tracking-[-0.02em] text-ink-950">
                40% off with the launch code.
              </p>
              <p className="mt-5 max-w-[52ch] text-step--1 leading-relaxed text-ink-700">
                Enter the code at checkout and it applies to Student Pro and every
                institution plan, for as long as the launch offer runs.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-4 border-t border-dashed border-accent-ink/30 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <button
                type="button"
                onClick={copy}
                aria-label={`Copy coupon code ${CODE}`}
                className="inline-flex w-full items-center justify-between gap-4 rounded-[12px] border border-dashed border-accent-ink/50 bg-paper px-5 py-3 transition-colors duration-300 hover:bg-paper-2 sm:w-auto"
              >
                <span className="font-mono text-step-0 uppercase tracking-[0.14em] text-ink-950 sm:text-step-1">
                  {CODE}
                </span>
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-500">
                  {copied ? "Copied" : "Copy"}
                </span>
              </button>
              <span aria-live="polite" className="sr-only">
                {copied ? `Coupon code ${CODE} copied` : ""}
              </span>

              <Pill
                onClick={() => navigate("/signup")}
                tone="dark"
                className="w-full sm:w-auto"
              >
                Create a free account
                <ArrowIcon />
              </Pill>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
