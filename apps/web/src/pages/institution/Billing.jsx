import BillingPanel from "../../components/billing/BillingPanel"
import VideoAgentCard from "../../components/premium/VideoAgentCard"

export default function InstitutionBilling() {
  return (
    <>
      <div>
        <p className="eyebrow">Billing</p>
        <h1 className="display mt-3 text-step-3 text-ink-950">Subscription</h1>
        <p className="mt-4 max-w-[56ch] leading-relaxed text-ink-600">
          Pay in USDT. Your subscription activates the moment the deposit is confirmed on-chain,
          and covers every seat in the institution.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <BillingPanel audience="institution" />
        <VideoAgentCard upgradeTo="/institution/billing" />
      </div>
    </>
  )
}
