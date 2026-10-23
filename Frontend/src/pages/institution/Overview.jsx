import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UsersThree, CreditCard, Robot } from "@phosphor-icons/react"
import { fetchInstitution } from "../../lib/billing"

export default function InstitutionOverview() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchInstitution().then(setData).catch((e) => setError(e.message))
  }, [])

  if (error) return <p role="alert" className="text-step--1 text-red-700">{error}</p>
  if (!data) return <p className="text-step--1 text-ink-500">Loading institution…</p>

  const { institution, seats, members } = data

  return (
    <>
      <div>
        <p className="eyebrow">Institution</p>
        <h1 className="display mt-3 text-step-3 text-ink-950">{institution.name}</h1>
        <p className="mt-3 text-step--1 text-ink-500">
          {institution.domain || "No domain set"} · plan {institution.planId} · {institution.status}
        </p>
      </div>

      <dl className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
        {[
          { label: "Seats in use", value: `${seats.used} / ${seats.limit}`, icon: UsersThree },
          { label: "Members", value: String(members.length), icon: Robot },
          { label: "Plan", value: institution.status, icon: CreditCard },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-paper p-6">
            <dt className="flex items-center gap-2 text-ink-500">
              <Icon size={15} weight="regular" aria-hidden="true" />
              <span className="eyebrow">{label}</span>
            </dt>
            <dd className="display mt-4 text-step-3 tabular text-ink-950">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-wrap gap-4">
        <button onClick={() => navigate("/institution/members")} className="btn btn-primary">
          Manage members
        </button>
        <button onClick={() => navigate("/institution/billing")} className="btn btn-ghost">
          Billing & plans
        </button>
      </div>
    </>
  )
}
