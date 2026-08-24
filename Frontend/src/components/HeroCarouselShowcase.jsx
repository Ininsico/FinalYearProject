import HeroCarousel from "@/components/ui/hero-carousel"

const U = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`

const SLIDES = [
  {
    id: "swarm",
    title: "Agentic\nSwarm",
    image: U("1518770660439-4636190af475"),
    credit: "BY FABLET LABS.",
    meta: ["AI", "ORCHESTRATION", "V1"],
    accent: "#7b61ff",
  },
  {
    id: "nocode",
    title: "No-Code\nCreation",
    image: U("1531297484001-80022131f5a1"),
    credit: "BY FABLET LABS.",
    meta: ["PLAIN", "LANGUAGE", "INPUT"],
    accent: "#00c8ff",
  },
  {
    id: "media",
    title: "Adaptive\nMedia",
    image: U("1517077304055-6e89abbf09b0"),
    credit: "BY FABLET LABS.",
    meta: ["COMEDY", "NEWS", "ENGINES"],
    accent: "#ff2f9c",
  },
  {
    id: "edtech",
    title: "Ed-Tech\nEngine",
    image: U("1503676260728-1c00da094a0b"),
    credit: "BY FABLET LABS.",
    meta: ["BILINGUAL", "TUTORING", "24/7"],
    accent: "#2f7bff",
  },
  {
    id: "news",
    title: "News\nFabric",
    image: U("1451187580459-43490279c0fa"),
    credit: "BY FABLET LABS.",
    meta: ["REAL-TIME", "SUMMARY", "GLOBAL"],
    accent: "#39c8ff",
  },
  {
    id: "enterprise",
    title: "Enterprise\nTools",
    image: U("1497366216548-37526070297c"),
    credit: "BY FABLET LABS.",
    meta: ["WORKFLOWS", "AUTOMATION", "ON-DEMAND"],
    accent: "#ff4114",
  },
  {
    id: "learning",
    title: "Self\nImproving",
    image: U("1635070041078-e363dbe005cb"),
    credit: "BY FABLET LABS.",
    meta: ["FEEDBACK", "LOOPS", "EVOLVING"],
    accent: "#4356c8",
  },
  {
    id: "comedy",
    title: "Comedy\nChannels",
    image: U("1550745165-9bc0b252726f"),
    credit: "BY FABLET LABS.",
    meta: ["WRITE", "PRODUCE", "PUBLISH"],
    accent: "#e5231b",
  },
]

export default function HeroCarouselShowcase() {
  return (
    <HeroCarousel
      items={SLIDES}
      defaultIndex={4}
      autoplay
      autoplayDelay={4500}
    />
  )
}
