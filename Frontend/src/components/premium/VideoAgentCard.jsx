import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Lock, FilmSlate, Check, ArrowRight } from "@phosphor-icons/react"
import { fetchPremiumStatus } from "../../lib/billing"

/**
 * The premium AI video-generation agent. Locked UI: access is genuinely gated on
 * the plan (the API answers 402 without it), the render pipeline is not built.
 */
export default function VideoAgentCard({ upgradeTo = "/dashboard/premium" }) {
  const navigate = useNavigate()
  const [state, setState] = useState(null)

  useEffect(() => {
    fetchPremiumStatus().then(setState).catch(() => setState({ live: false, features: [] }))
  }, [])

  const unlocked = state?.live && state?.features?.includes("video")

  return (
    <article
      className={`relative overflow-hidden border p-8 ${
        unlocked ? "border-accent-ink bg-accent-soft/40" : "border-line bg-paper-2"
      }`}
    >
      <div className="flex items-start justify-between gap-6">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            unlocked ? "bg-accent text-paper" : "bg-paper-3 text-ink-500"
          }`}
          aria-hidden="true"
        >
          {unlocked ? <FilmSlate size={22} weight="regular" /> : <Lock size={20} weight="regular" />}
        </span>
        <span className={`rounded-full px-3 py-1 text-[0.68rem] uppercase tracking-[0.14em] ${
          unlocked ? "bg-accent text-paper" : "bg-paper-3 text-ink-600"
        }`}>
          {unlocked ? "unlocked" : "locked"}
        </span>
      </div>

      <h3 className="display mt-6 text-step-3 text-ink-950">AI video-generation agent</h3>
      <p className="mt-3 max-w-[52ch] leading-relaxed text-ink-600">
        A specialist agent that turns a brief and a storyboard into a rendered video, orchestrated
        alongside the rest of the swarm.
      </p>

      <ul className="mt-6 space-y-2 border-t border-line pt-5">
        {["Brief to storyboard", "Voice, music and captions", "Agentic rendering queue"].map((f) => (
          <li key={f} className="flex items-baseline gap-2 text-step--1 text-ink-700">
            <Check size={13} weight="bold" className="shrink-0 translate-y-[2px] text-accent-ink" aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>

      {unlocked ? (
        <p className="mt-6 text-step--1 text-ink-600">
          Enabled on your plan. Rendering opens shortly — you will be notified in the dashboard.
        </p>
      ) : (
        <button onClick={() => navigate(upgradeTo)} className="btn btn-accent mt-6">
          Unlock with a premium plan
          <ArrowRight size={15} weight="bold" aria-hidden="true" />
        </button>
      )}
    </article>
  )
}
