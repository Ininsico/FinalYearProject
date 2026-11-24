import Ticker from "../Ticker"

const SUBJECTS = ["Mathematics", "Physics", "Computer Science", "Business", "Design"]

const FACULTY = ["Aleeza", "David", "Kim Yaun", "Lisa", "Xavier"]

export default function TickerBand() {
  return (
    <section className="overflow-hidden border-y border-paper/10 bg-ink-950 py-12 text-paper sm:py-16">
      <Ticker
        items={SUBJECTS}
        duration={44}
        itemClassName="font-sans text-[clamp(2.4rem,5.6vw,5rem)] font-bold leading-none tracking-[-0.03em] text-paper"
      />
      <Ticker
        items={FACULTY}
        duration={58}
        offset={2}
        reverse
        className="mt-5 sm:mt-7"
        itemClassName="font-sans text-[clamp(2.4rem,5.6vw,5rem)] font-bold italic leading-none tracking-[-0.03em] text-transparent opacity-70 [-webkit-text-stroke:1.5px_var(--color-paper)]"
      />
    </section>
  )
}
