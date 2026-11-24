import { Container } from "../layout"

const TEACHERS = [
  { name: "Aleeza", image: "/teachers/Aleeza.jpg" },
  { name: "David", image: "/teachers/david.png" },
  { name: "Kim Yaun", image: "/teachers/KimYaun.jpg" },
  { name: "Lisa", image: "/teachers/Lisa.jpg" },
  { name: "Xavier", image: "/teachers/Xavier.png" },
]

export default function Teachers() {
  return (
    <section id="teachers" className="border-t border-line bg-paper py-14 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display max-w-[20ch] text-step-2 text-ink-950">
            Meet the AI teachers.
          </h2>
          <p className="max-w-[46ch] text-step--1 text-ink-500">
            Every teacher is a trained persona with their own voice and delivery. A few
            have joined the faculty so far, with many more coming up.
          </p>
        </div>

        <ul className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {TEACHERS.map((t) => (
            <li key={t.name} className="bg-paper">
              <img
                src={t.image}
                alt={`${t.name}, an AI teacher at Fablet`}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="flex items-baseline justify-between gap-3 border-t border-line px-4 py-3">
                <h3 className="display text-step-1 text-ink-950">{t.name}</h3>
                <span className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-ink-500">
                  AI teacher
                </span>
              </div>
            </li>
          ))}

          <li className="flex flex-col justify-center bg-accent-soft p-6 sm:p-8">
            <p className="display text-step-1 text-accent-ink">Many more coming up.</p>
            <p className="mt-2 max-w-[30ch] text-step--1 leading-relaxed text-ink-700">
              New teachers join the faculty as their voices and courses are trained.
            </p>
          </li>
        </ul>
      </Container>
    </section>
  )
}
