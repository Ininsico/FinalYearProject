export const AGENT_ROLES = [
  "Scripting", "Outline", "Visual Asset", "Background", "Animation Logic",
  "Temporal Coordinator", "Audio Synthesis", "Music", "SFX", "Quality Assurance",
  "Rendering", "Localization", "Dubbing", "Research", "Style",
  "Character Consistency", "Continuity", "Caption", "Thumbnail", "SEO",
  "Brand", "Accessibility", "Fact-Check", "Feedback",
]

export const STEPS = [
  {
    n: "01",
    title: "Brief",
    body: "Describe the outcome in plain language. No specs, no diagrams, no tickets. One sentence is a complete input.",
  },
  {
    n: "02",
    title: "Plan",
    body: "The orchestrator decomposes the goal, sequences the work, and instantiates the specialists the production needs.",
  },
  {
    n: "03",
    title: "Execute",
    body: "Agents build in parallel, each reasoning against a shared understanding of the content instead of rigid hand-offs.",
  },
  {
    n: "04",
    title: "Operate",
    body: "Fablet validates, refines, and sustains what it built, then keeps improving it run after run.",
  },
]

export const DOMAINS = [
  {
    key: "education",
    name: "Education",
    tag: "Adaptive courses",
    body: "Bilingual, adaptive courses that teach, quiz, and tutor in real time, adjusting to each learner as they go.",
    points: ["Adaptive pacing", "Assessment generation", "Localized delivery"],
  },
  {
    key: "media",
    name: "Media & entertainment",
    tag: "Channels that run themselves",
    body: "Comedy, commentary, and branded content that research, write, storyboard, voice, and publish on a schedule.",
    points: ["Script to screen", "Voice and music", "Publishing cadence"],
  },
  {
    key: "news",
    name: "News & information",
    tag: "Always-on reporting",
    body: "Reporting, summaries, and explainers tuned to any audience, region, or tone, sourced and fact-checked as they ship.",
    points: ["Source verification", "Audience tuning", "Continuous updates"],
  },
  {
    key: "enterprise",
    name: "Enterprise",
    tag: "Systems composed on demand",
    body: "Internal tools, automations, and customer-facing systems assembled, wired, and maintained without an engineering backlog.",
    points: ["Workflow automation", "Internal tools", "Systems that persist"],
  },
]

export const STATS = [
  { value: 24, suffix: "", label: "specialist agent roles in the catalog" },
  { value: 4, suffix: "", label: "content domains served by one foundation" },
  { value: 0, suffix: "", label: "engineers required to ship a production" },
]

export const FAQS = [
  { q: "What exactly is Fablet?", a: "A self-orchestrating swarm of AI agents. You describe an outcome in plain language, and a coordinated network of specialists plans, builds, runs, and refines it for you." },
  { q: "Do I need to know how to code?", a: "No. Fablet is no-code by default. You brief the swarm in natural language and it handles architecture, wiring, and delivery behind the scenes." },
  { q: "What can I build with it?", a: "Anything the swarm can orchestrate: personalized courses, comedy and news channels, branded media, enterprise workflows, internal tools, and beyond." },
  { q: "How does the orchestration work?", a: "A single brief is decomposed into a sequenced plan, assigned to specialist agents that execute in parallel, then operated and optimized end to end." },
  { q: "Is my data and IP safe?", a: "Your briefs, assets, and outputs stay within your workspace. The swarm improves from usage patterns, never by exposing your private content." },
  { q: "How much does it cost?", a: "Fablet is built to remove gatekeepers, so there is no budget wall to start. Plans and pricing are coming soon, reach out on the contact page for early access." },
]

export const TEAM = [
  { name: "Arslan Rathore", role: "Swarm architecture", image: "/arslan.png" },
  { name: "Huzaifa Sadar", role: "Orchestration", image: "/huzafia.png" },
  { name: "Mahnoor Sardar", role: "Design and research", image: null },
]
