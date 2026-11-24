import Reveal from "./Reveal"
import SplitHeading from "./SplitHeading"

export function Container({ children, className = "" }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-6 sm:px-8 ${className}`}>{children}</div>
}

export function Section({ children, className = "", id, rule = true }) {
  return (
    <section id={id} className={`${rule ? "border-t border-line" : ""} py-20 sm:py-28 ${className}`}>
      <Container>{children}</Container>
    </section>
  )
}

export function Eyebrow({ children, className = "" }) {
  return <p className={`eyebrow ${className}`}>{children}</p>
}

export function PageHero({ eyebrow, title, lede, children }) {
  return (
    <header className="px-0 pb-16 pt-36 sm:pt-44">
      <Container>
        {eyebrow && (
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
        )}
        <SplitHeading
          as="h1"
          immediate
          delay={0.05}
          className="mt-6 max-w-[16ch] text-step-5 text-ink-950 display"
        >
          {title}
        </SplitHeading>
        {lede && (
          <Reveal delay={0.15}>
            <p className="mt-7 max-w-[54ch] text-step-1 leading-[1.5] text-ink-600">{lede}</p>
          </Reveal>
        )}
        {children}
      </Container>
    </header>
  )
}

export function Prose({ children, className = "" }) {
  return (
    <div className={`max-w-[68ch] space-y-6 text-step-0 leading-[1.75] text-ink-700 ${className}`}>
      {children}
    </div>
  )
}

export function SectionHeading({ eyebrow, title, lede, className = "" }) {
  return (
    <div className={className}>
      {eyebrow && (
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <SplitHeading as="h2" className="mt-5 max-w-[20ch] text-step-4 text-ink-950 display">
        {title}
      </SplitHeading>
      {lede && (
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[56ch] text-step-0 leading-relaxed text-ink-600">{lede}</p>
        </Reveal>
      )}
    </div>
  )
}
