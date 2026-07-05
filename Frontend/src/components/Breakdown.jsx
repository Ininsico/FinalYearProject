import { useRef, useEffect, useState } from 'react'

const mdcatItems = [
  {
    title: 'Personalized Study Plans',
    desc: 'AI analyzes your strengths and weaknesses to build a custom MDCAT prep plan tailored to your learning style and pace.',
    detail: 'Adaptive algorithms identify weak areas and adjust daily targets so you always focus on what matters most.',
    tag: 'AI Powered',
    stat: '95%',
    statLabel: 'Success Rate',
  },
  {
    title: 'Unlimited Practice Tests',
    desc: 'Full-length MDCAT mock exams with instant scoring, detailed answer explanations, and AI-powered performance analytics.',
    detail: 'Each test adapts to the latest exam pattern with real-time progress tracking across all subjects.',
    tag: 'Practice',
    stat: '10,000+',
    statLabel: 'Tests Taken',
  },
  {
    title: '24/7 AI Tutor Support',
    desc: 'Get instant help anytime, anywhere. Ask questions in Urdu or English and receive detailed explanations from our AI.',
    detail: 'Covering biology, chemistry, physics, and English — no question goes unanswered.',
    tag: 'AI Tutor',
    stat: '24/7',
    statLabel: 'Availability',
  },
  {
    title: 'Expert Video Lectures',
    desc: 'Pre-recorded and live sessions by Pakistan\'s top medical faculty, with AI-generated summaries and chapter recaps.',
    detail: 'Every lecture comes with downloadable notes, diagrams, and quick revision cards.',
    tag: 'Video',
    stat: '200+',
    statLabel: 'Lectures',
  },
  {
    title: 'Complete Progress Analytics',
    desc: 'Track your preparation chapter-by-chapter with detailed insights, weak-spot detection, and score predictions.',
    detail: 'Know exactly where you stand and what to study next — all for free, no hidden charges.',
    tag: 'Analytics',
    stat: '100%',
    statLabel: 'Free Forever',
  },
]

const cssItems = [
  {
    title: 'AI Essay Evaluator',
    desc: 'Submit your essays and get instant AI feedback on structure, content quality, grammar, and CSS marking criteria.',
    detail: 'Practice with past paper topics and receive detailed suggestions for improvement.',
    tag: 'AI Powered',
    stat: '5,000+',
    statLabel: 'Essays Graded',
  },
  {
    title: 'Daily Current Affairs',
    desc: 'AI-curated news summaries delivered every morning, covering national and international events relevant to CSS.',
    detail: 'Includes editorial analysis, key takeaways, and practice MCQs based on daily news.',
    tag: 'Daily',
    stat: '365',
    statLabel: 'Days Covered',
  },
  {
    title: 'All Optional Subjects',
    desc: 'Comprehensive coverage of 50+ CSS optional subjects with expert lectures, notes, and AI-generated practice material.',
    detail: 'From Political Science to Islamic History — everything in one place.',
    tag: 'Subjects',
    stat: '50+',
    statLabel: 'Subjects',
  },
  {
    title: 'Mock Interview Simulator',
    desc: 'AI-powered interview practice that simulates real CSS panel questions with personalized feedback on your responses.',
    detail: 'Build confidence with unlimited practice sessions covering personality assessment and topical questions.',
    tag: 'AI Simulator',
    stat: 'AI',
    statLabel: 'Powered',
  },
  {
    title: 'Completely Free Access',
    desc: 'Every single CSS resource on TheThirdPlanet is 100% free. No subscriptions, no hidden fees, no barriers.',
    detail: 'Quality education is a right, not a privilege — and we mean it.',
    tag: 'Free',
    stat: 'Free',
    statLabel: 'Forever',
  },
]

function ScrollCards({ items, activeIndex }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={item.title}
          className={`p-6 rounded-xl border-2 transition-all duration-700 ${
            i === activeIndex
              ? 'bg-white border-planet-900 shadow-xl opacity-100 scale-100'
              : i < activeIndex
                ? 'bg-white/20 border-transparent opacity-15 scale-[0.95]'
                : 'bg-white/30 border-transparent opacity-30 scale-[0.97]'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className={`text-sm font-mono font-bold transition-colors duration-500 ${
                i === activeIndex ? 'text-planet-900' : 'text-planet-300'
              }`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className={`font-bold transition-colors duration-500 ${
                i === activeIndex ? 'text-planet-900' : 'text-planet-400'
              }`}>
                {item.title}
              </h3>
            </div>
            <span className={`px-3 py-1 text-[10px] font-bold rounded tracking-wider transition-colors duration-500 ${
              i === activeIndex ? 'bg-planet-900 text-white' : 'bg-planet-100 text-planet-400'
            }`}>
              {item.tag}
            </span>
          </div>
          <div className={`pl-9 transition-all duration-500 ${i === activeIndex ? 'opacity-100' : 'opacity-40'}`}>
            <p className="text-sm leading-relaxed text-planet-700">
              {i === activeIndex ? item.detail : item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function StaticPanel({ badge, title, highlight, desc, phase, stat, statLabel }) {
  return (
    <div className="space-y-5">
      <span className="inline-block px-4 py-1.5 bg-planet-900 text-white text-xs font-bold rounded-md tracking-wider">
        {badge}
      </span>
      <h2 className="text-4xl sm:text-5xl font-bold text-planet-900 leading-tight">
        {title}
        <span className="text-planet-600 block mt-1">{highlight}</span>
      </h2>
      <p className="text-planet-600 text-lg leading-relaxed">{desc}</p>
      <div className="pt-5 border-t border-planet-200 flex items-end gap-4">
        <div>
          <p className="text-4xl font-bold text-planet-900 tracking-tight">{stat}</p>
          <p className="text-sm font-medium text-planet-500">{statLabel}</p>
        </div>
        <div className="flex-1 h-1 bg-planet-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-planet-900 rounded-full transition-all duration-500"
            style={{ width: `${((phase + 1) / 5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default function Breakdown() {
  const mdcatRef = useRef(null)
  const cssRef = useRef(null)
  const [mdcatPhase, setMdcatPhase] = useState(0)
  const [cssPhase, setCssPhase] = useState(0)

  useEffect(() => {
    const el = mdcatRef.current
    if (!el) return

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const offset = -rect.top
      const scrollable = rect.height - window.innerHeight
      if (scrollable <= 0) return
      const pct = Math.max(0, Math.min(1, offset / scrollable))
      setMdcatPhase(Math.min(4, Math.floor(pct * 5)))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = cssRef.current
    if (!el) return

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const offset = -rect.top
      const scrollable = rect.height - window.innerHeight
      if (scrollable <= 0) return
      const pct = Math.max(0, Math.min(1, offset / scrollable))
      setCssPhase(Math.min(4, Math.floor(pct * 5)))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="features">
      <div ref={mdcatRef} className="relative" style={{ height: '500vh' }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-gradient-to-br from-planet-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <StaticPanel
                badge="MDCAT"
                title="AI-Powered Preparation"
                highlight="for Medical Entrance"
                desc="From biology to chemistry, AI teachers break down every MDCAT topic with video lectures, practice tests, and personalized guidance."
                phase={mdcatPhase}
                stat={mdcatItems[mdcatPhase].stat}
                statLabel={mdcatItems[mdcatPhase].statLabel}
              />
              <ScrollCards items={mdcatItems} activeIndex={mdcatPhase} />
            </div>
          </div>
        </div>
      </div>

      <div ref={cssRef} className="relative" style={{ height: '500vh' }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-gradient-to-bl from-white to-planet-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <ScrollCards items={cssItems} activeIndex={cssPhase} />
              </div>
              <div className="order-1 lg:order-2">
                <StaticPanel
                  badge="CSS"
                  title="Ace Your CSS"
                  highlight="with AI Teachers"
                  desc="From essay writing to current affairs, the AI-powered platform prepares you for every aspect of the CSS examination. No fees, ever."
                  phase={cssPhase}
                  stat={cssItems[cssPhase].stat}
                  statLabel={cssItems[cssPhase].statLabel}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
