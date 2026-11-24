import Hero from "../components/home/Hero"
import TickerBand from "../components/home/TickerBand"
import ValueBand from "../components/home/ValueBand"
import Subjects from "../components/home/Subjects"
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
      <Subjects />
      <HowItWorks />
      <Institutions />
      <Faq />
      <ClosingCta />
    </>
  )
}
