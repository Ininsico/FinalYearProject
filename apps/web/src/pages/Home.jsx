import Hero from "../components/home/Hero"
import ValueBand from "../components/home/ValueBand"
import Catalogue from "../components/home/Catalogue"
import HowItWorks from "../components/home/HowItWorks"
import Institutions from "../components/home/Institutions"
import Faq from "../components/home/Faq"
import ClosingCta from "../components/home/ClosingCta"

export default function Home() {
  return (
    <>
      <Hero />
      <ValueBand />
      <Catalogue />
      <HowItWorks />
      <Institutions />
      <Faq />
      <ClosingCta />
    </>
  )
}
