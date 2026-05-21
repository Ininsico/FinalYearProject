import { HeroSection } from '../components/sections/HeroSection'
import { CapabilitiesSection } from '../components/sections/CapabilitiesSection'
import { ArchitectureSection } from '../components/sections/ArchitectureSection'
import { StatsSection } from '../components/sections/StatsSection'
import { TimelineSection } from '../components/sections/TimelineSection'
import { CTASection } from '../components/sections/CTASection'

function Divider() {
  return <div className="section-divider max-w-4xl mx-auto" />
}

export function LandingPage() {
  return (
    <main>
      <HeroSection />
      <Divider />
      <CapabilitiesSection />
      <Divider />
      <ArchitectureSection />
      <Divider />
      <StatsSection />
      <Divider />
      <TimelineSection />
      <CTASection />
    </main>
  )
}
