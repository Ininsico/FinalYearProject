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
  { value: 7, suffix: "", label: "courses in the opening catalogue" },
  { value: 5, suffix: "", label: "subjects, from calculus to design systems" },
  { value: 4, suffix: "", label: "lesson formats: video, reading, exercise, quiz" },
]

export const FAQS = [
  { q: "What is Fablet?", a: "An online teaching academy. Courses across mathematics, physics, computer science, business and design are drafted with AI, directed by instructors, and delivered as short video, reading, exercise and quiz lessons." },
  { q: "Who can join?", a: "Anyone can create a free student account and study the free modules. Institutions register separately, choose a seat plan, and bring their members under one roof." },
  { q: "How much does it cost?", a: "Students start free. Student Pro is 9 USDT per month for premium modules and the AI video agent. Institutions pay 49 or 149 USDT per month for 10 or 50 seats." },
  { q: "What does the AI actually do?", a: "It drafts course material: descriptions, lesson text and quizzes. It can also turn uploaded notes, PDFs and images into module content. Instructors direct it, edit it, and decide what gets published." },
  { q: "How do payments work?", a: "Plans are paid in USDT on the TRX network. A deposit is matched against the exact amount within a small tolerance, and the subscription activates automatically." },
  { q: "Can an institution publish its own courses?", a: "Yes. Institutions build modules with the same editor and AI tools as the platform, publish them to the shared catalogue, and keep them current module by module." },
]

export const TEAM = [
  { name: "Arslan Rathore", role: "Swarm architecture", image: "/arslan.png" },
  { name: "Huzaifa Sadar", role: "Orchestration", image: "/huzafia.png" },
  { name: "Mahnoor Sardar", role: "Design and research", image: null },
]
