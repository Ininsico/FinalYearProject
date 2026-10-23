import { useEffect, useState } from "react"
import { Student, Buildings, Repeat, CurrencyCircleDollar } from "@phosphor-icons/react"
import { fetchAdminStats } from "../../lib/admin"

export default function AdminOverview() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchAdminStats().then((d) => setStats(d.stats)).catch((e) => setError(e.message))
  }, [])

  if (error) return <p role="alert" className="text-step--1 text-red-700">{error}</p>
  if (!stats) return <p className="text-step--1 text-ink-500">Loading…</p>

  const cards = [
    { label: "Students", value: stats.students, icon: Student },
    { label: "Institutions", value: stats.institutions, icon: Buildings },
    { label: "Active subscriptions", value: stats.activeSubscriptions, icon: Repeat },
    { label: "Payments collected", value: `${stats.revenue} USDT`, icon: CurrencyCircleDollar },
  ]

  return (
    <>
      <div>
        <p className="eyebrow">Operator console</p>
        <h1 className="display mt-3 text-step-3 text-ink-950">Platform overview</h1>
      </div>

      <dl className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-paper p-6">
            <dt className="flex items-center gap-2 text-ink-500">
              <Icon size={15} weight="regular" aria-hidden="true" />
              <span className="eyebrow">{label}</span>
            </dt>
            <dd className="display mt-4 text-step-3 tabular text-ink-950">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 text-step--1 text-ink-500">
        {stats.admins} platform admin{stats.admins === 1 ? "" : "s"} · {stats.payments} confirmed
        payment{stats.payments === 1 ? "" : "s"}
      </p>
    </>
  )
}
