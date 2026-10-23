import { useId, useState } from "react"
import { Plus } from "@phosphor-icons/react"
import { FAQS } from "../../lib/content"
import { Container } from "../layout"
import Reveal from "../Reveal"
import SplitHeading from "../SplitHeading"

export default function Faq() {
  const [open, setOpen] = useState(-1)
  const uid = useId()

  return (
    <section id="faq" data-bg="#f9f7f3" className="border-t border-line py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.6fr)] lg:gap-20">
          <div>
            <p className="eyebrow">FAQ</p>
            <SplitHeading as="h2" className="mt-5 max-w-[12ch] text-step-4 text-ink-950 display">
              Questions, answered.
            </SplitHeading>
          </div>

          <div className="border-t border-line">
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
                      className="flex w-full items-start justify-between gap-6 py-6 text-left"
                    >
                      <span className="display text-step-2 text-ink-950">{f.q}</span>
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
                      <p className="max-w-[66ch] pb-6 leading-relaxed text-ink-600">{f.a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
