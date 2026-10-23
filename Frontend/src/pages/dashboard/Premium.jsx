import { useNavigate } from "react-router-dom"
import { Sparkle, ArrowRight } from "@phosphor-icons/react"
import BillingPanel from "../../components/billing/BillingPanel"
import VideoAgentCard from "../../components/premium/VideoAgentCard"
import { useAuth } from "../../lib/auth"

export default function StudentPremium() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Premium</p>
          <h1 className="display mt-3 text-step-3 text-ink-950">Agentic orchestration and the video agent</h1>
          <p className="mt-4 max-w-[56ch] leading-relaxed text-ink-600">
            A basic student account includes the workspace and course productions. Premium adds the
            agentic orchestration engine and the AI video-generation agent.
          </p>
        </div>
        <button onClick={() => navigate("/dashboard")} className="btn btn-ghost h-10">
          <ArrowRight size={15} weight="bold" className="rotate-180" aria-hidden="true" />
          Back to overview
        </button>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <VideoAgentCard upgradeTo="#plans" />
        <div className="border border-line p-6">
          <p className="eyebrow">Your account</p>
          <dl className="mt-5 space-y-3">
            <div className="flex items-center justify-between border-t border-line pt-3">
              <dt className="text-step--1 text-ink-500">Signed in as</dt>
              <dd className="text-step--1 text-ink-900">{user?.email}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-3">
              <dt className="text-step--1 text-ink-500">Role</dt>
              <dd className="text-step--1 text-ink-900">{user?.role}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-3">
              <dt className="text-step--1 text-ink-500">Plan</dt>
              <dd className="text-step--1 text-ink-900">{user?.planId}</dd>
            </div>
          </dl>
          <p className="mt-6 flex items-start gap-2 text-step--1 leading-relaxed text-ink-600">
            <Sparkle size={15} weight="bold" className="mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
            Premium is billed in USDT and activates as soon as the deposit is confirmed on-chain.
          </p>
        </div>
      </div>

      <div id="plans" className="mt-12 scroll-mt-28">
        <BillingPanel audience="student" />
      </div>
    </>
  )
}
