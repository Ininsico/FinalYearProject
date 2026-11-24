import { useNavigate } from "react-router-dom"
import { Container } from "../layout"
import { ArrowIcon, Cross, Micro, Pill } from "./ui"

const LINE_1 = ["An", "online", "academy,"]
const LINE_2 = ["taught", "by", "AI", "teachers."]

export default function Hero() {
  const navigate = useNavigate()
  let order = 0

  const words = (line) =>
    line.map((w) => (
      <span key={`${w}-${order}`} className="word-rise">
        <span style={{ "--i": order++ }}>{w}</span>
      </span>
    ))

  return (
    <section className="relative overflow-hidden bg-paper">
      <Container className="pb-10 pt-28 sm:pt-32">
        <div className="flex items-center justify-between">
          <Micro className="text-ink-500">The AI teaching academy</Micro>
          <Micro className="hidden text-ink-500 sm:flex" dot={false}>
            Seven courses live
          </Micro>
        </div>

        <h1 className="display mt-10 max-w-[15ch] text-[clamp(2.8rem,7.2vw,6.8rem)] leading-[0.98] tracking-[-0.02em] text-ink-950">
          <span className="block">{words(LINE_1)}</span>
          <span className="block">{words(LINE_2)}</span>
        </h1>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Pill onClick={() => navigate("/signup")} tone="dark">
            Create a free account
            <ArrowIcon />
          </Pill>
          <Pill onClick={() => navigate("/institutions/register")} tone="outline">
            For institutions
          </Pill>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-end md:gap-12">
          <p className="max-w-[56ch] text-step-0 leading-[1.7] text-ink-600">
            Fablet writes its courses with AI, keeps them current with the instructors
            who own them, and teaches them in short lessons, worked practice and an
            assessment at the end of every module.
          </p>

          <figure className="relative ml-auto w-full max-w-[460px]">
            <Cross className="absolute -left-6 -top-6 hidden text-ink-400 sm:block" />
            <Cross className="absolute -bottom-6 -right-6 hidden text-ink-400 sm:block" />
            <img
              src="/teachers/Aleeza.jpg"
              alt="Aleeza, an AI teacher at Fablet"
              className="aspect-[4/3] w-full rounded-[15px] object-cover object-top"
            />
            <figcaption className="mt-3 flex items-center justify-between">
              <Micro dot={false} className="text-ink-500">
                Aleeza, faculty of five
              </Micro>
              <Micro dot={false} className="text-ink-400">
                AI teacher
              </Micro>
            </figcaption>
          </figure>
        </div>
      </Container>

      <div className="flex items-center justify-center gap-5 pb-8 text-ink-400">
        <Cross />
        <Micro dot={false} className="text-ink-500">
          Scroll to explore
        </Micro>
        <Cross />
      </div>
    </section>
  )
}
