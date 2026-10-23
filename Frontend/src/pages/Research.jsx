import { PageHero, Container } from "../components/layout"
import Architecture from "../components/Architecture"

export default function Research() {
  return (
    <>
      <PageHero
        eyebrow="Research / Architecture"
        title="The architecture, in full."
        lede="A conceptual architecture for autonomous AI swarm orchestration in content creation, documented honestly: capabilities scoped to the techniques that back them, and limitations stated plainly."
      />
      <Container className="px-0">
        <div className="border-t border-line" />
      </Container>
      <div className="pt-12">
        <Architecture />
      </div>
    </>
  )
}
