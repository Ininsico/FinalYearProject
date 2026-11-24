import Hero from "../components/home/Hero"
import TickerBand from "../components/home/TickerBand"
import ValueBand from "../components/home/ValueBand"
import Facts from "../components/home/Facts"
import Manifesto from "../components/home/Manifesto"
import Teachers from "../components/home/Teachers"
import HowItWorks from "../components/home/HowItWorks"
import WhoDoesWhat from "../components/home/WhoDoesWhat"
import Plans from "../components/home/Plans"
import Institutions from "../components/home/Institutions"
import Faq from "../components/home/Faq"
import ClosingCta from "../components/home/ClosingCta"

export default function Home() {
  return (
    <>
      <Hero />
      <TickerBand />
      <ValueBand />
      <Facts />
      <Manifesto />
      <Teachers />
      <HowItWorks />
      <WhoDoesWhat />
      <Plans />
      <Institutions />
      <Faq />
      <ClosingCta />
    </>
  )
}
