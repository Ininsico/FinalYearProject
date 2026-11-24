import { Container } from "../layout"
import { Cross, Micro } from "./ui"

const REVIEWS = [
  {
    quote:
      "The revision plan the assistant built cut my MDCAT prep down to the modules I was actually weak in.",
    name: "Ahmedullah",
    role: "MDCAT candidate",
    image: "/ahmedullah.jpg",
  },
  {
    quote:
      "The exercises are sized to one sitting. After college, that is the only kind of study time I have.",
    name: "Ayyan",
    role: "FSc student",
    image: "/ayyan.jpg",
  },
  {
    quote:
      "I stopped chasing twelve-hour video playlists. A module here is about two hours, start to finish.",
    name: "Arslan",
    role: "CSS aspirant",
    image: "/arslan.png",
  },
  {
    quote:
      "Every quiz answer points back at the lesson it came from, so re-reading is never a guessing game.",
    name: "Huzafia",
    role: "Board exams",
    image: "/huzafia.png",
  },
  {
    quote: "The Geology module explains map work better than anything else I found for CSS.",
    name: "Mudasri",
    role: "CSS aspirant",
    image: "/mudasri.png",
  },
  {
    quote: "The instructor sign-off shows. Nothing in the reading wastes a line.",
    name: "Noman",
    role: "University student",
    image: "/noman.jpg",
  },
]

function Rating() {
  return (
    <div className="flex gap-1.5" role="img" aria-label="Five out of five">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="h-1.5 w-1.5 rotate-45 bg-accent" aria-hidden="true" />
      ))}
    </div>
  )
}

export default function Reviews() {
  return (
    <section className="bg-paper-3 py-16 sm:py-24">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div className="flex items-end gap-6">
            <Micro className="text-ink-500">Reviews</Micro>
            <Cross className="hidden text-ink-400 sm:block" />
          </div>
          <Micro dot={false} className="text-ink-400">
            From early students
          </Micro>
        </div>

        <h2 className="display mt-6 max-w-[20ch] text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.02] tracking-[-0.02em] text-ink-950">
          What early students are saying.
        </h2>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure
              key={r.name}
              className="flex h-full flex-col gap-6 rounded-[15px] border border-line bg-paper p-6 transition-colors duration-300 hover:border-line-2 hover:bg-paper-2 sm:p-7"
            >
              <Rating />
              <blockquote className="flex-1 text-step-0 leading-[1.6] text-ink-800">
                {r.quote}
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t border-line pt-4">
                <img
                  src={r.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-11 w-11 shrink-0 rounded-full border border-line-2 object-cover"
                />
                <div className="min-w-0">
                  <p className="display text-step-1 text-ink-950">{r.name}</p>
                  <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-500">
                    {r.role}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  )
}
