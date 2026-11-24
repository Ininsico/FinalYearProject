import Hero from "../components/home/Hero"
import TickerBand from "../components/home/TickerBand"
import ValueBand from "../components/home/ValueBand"
import Manifesto from "../components/home/Manifesto"
import Teachers from "../components/home/Teachers"
import HowItWorks from "../components/home/HowItWorks"
import Institutions from "../components/home/Institutions"
import Faq from "../components/home/Faq"
import ClosingCta from "../components/home/ClosingCta"

export default function Home() {
  return (
    <>
      <Hero />
      <TickerBand />
      <ValueBand />
      <Manifesto />
      <Teachers />
      <HowItWorks />
      <Institutions />
      <Faq />
      <ClosingCta />
    </>
  )
}
