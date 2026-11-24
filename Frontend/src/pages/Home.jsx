import Hero from "../components/home/Hero"
import MotionPaths from "../components/home/MotionPaths"
import Statement from "../components/home/Statement"
import Steps from "../components/home/Steps"
import Catalogue from "../components/home/Catalogue"
import Showcase from "../components/home/Showcase"
import Institutions from "../components/home/Institutions"
import ScrollStatement from "../components/home/ScrollStatement"
import ParallaxBand from "../components/home/ParallaxBand"
import Stats from "../components/home/Stats"
import Faq from "../components/home/Faq"
import ClosingCta from "../components/home/ClosingCta"

export default function Home() {
  return (
    <>
      <Hero />
      <MotionPaths />
      <Statement />
      <Steps />
      <Catalogue />
      <Showcase />
      <Institutions />
      <ScrollStatement />
      <ParallaxBand />
      <Stats />
      <Faq />
      <ClosingCta />
    </>
  )
}
