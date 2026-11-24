import { useNavigate } from "react-router-dom"
import { PageHero, Section } from "../components/layout"

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <>
      <PageHero
        eyebrow="404"
        title="This page is not in the warehouse."
        lede="The link you followed does not resolve to anything the swarm has built."
      />
      <Section>
        <button onClick={() => navigate("/")} className="btn btn-primary">
          Back to home
        </button>
      </Section>
    </>
  )
}
