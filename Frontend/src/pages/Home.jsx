import Hero from "../components/home/Hero"
import MotionPaths from "../components/home/MotionPaths"
import Statement from "../components/home/Statement"
import Steps from "../components/home/Steps"
import Capabilities from "../components/home/Capabilities"
import DomainRail from "../components/home/DomainRail"
import ScrollStatement from "../components/home/ScrollStatement"
import Showcase from "../components/home/Showcase"
import IconBand from "../components/home/IconBand"
import Agents from "../components/home/Agents"
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
      <Capabilities />
      <DomainRail />
      <ScrollStatement />
      <Showcase />
      <IconBand />
      <Agents />
      <ParallaxBand />
      <Stats />
      <Faq />
      <ClosingCta />
    </>
  )
}
