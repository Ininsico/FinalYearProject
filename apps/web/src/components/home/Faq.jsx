import { useId, useState } from "react"
import { Plus } from "@phosphor-icons/react"
import { FAQS } from "../../lib/content"
import { Container } from "../layout"
import { Micro } from "./ui"

export default function Faq() {
  const [open, setOpen] = useState(-1)
  const uid = useId()

  return (
    <section id="faq" className="bg-paper py-16 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.02] tracking-[-0.02em] text-ink-950">
            Questions, answered.
          </h2>
          <Micro className="text-ink-500">The FAQ</Micro>
        </div>

        <div className="mt-10 border-t border-line">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            const btnId = `${uid}-btn-${i}`
            const panelId = `${uid}-panel-${i}`
            return (
              <div key={f.q} className="border-b border-line">
                <h3>
                  <button
                    id={btnId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-start justify-between gap-4 px-3 py-5 text-left transition-colors duration-300 hover:bg-paper-2 sm:gap-6 sm:px-4"
                  >
                    <span className="display text-step-1 text-ink-950 sm:text-step-2">{f.q}</span>
                    <Plus
                      size={20}
                      weight="light"
                      aria-hidden="true"
                      className={`mt-1 shrink-0 text-ink-500 transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[66ch] px-4 pb-6 text-step--1 leading-relaxed text-ink-600">{f.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
