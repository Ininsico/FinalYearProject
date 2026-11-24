import { Link, useLocation } from "react-router-dom"

export default function SubscriptionsNav() {
  const { pathname } = useLocation()
  const isPlans = pathname.startsWith("/admin/subscriptions/plans")
  const isPayments = pathname.startsWith("/admin/subscriptions/payments")
  const isAnalytics = pathname === "/admin/subscriptions"
  const isAccounts = !isAnalytics && !isPlans && !isPayments

  const tabs = [
    { to: "/admin/subscriptions", label: "Analytics", active: isAnalytics },
    { to: "/admin/subscriptions/plans", label: "Plans & features", active: isPlans },
    { to: "/admin/subscriptions/accounts", label: "Accounts", active: isAccounts },
    { to: "/admin/subscriptions/payments", label: "Payments", active: isPayments },
  ]

  return (
    <nav aria-label="Subscriptions sections" className="mt-6 flex flex-wrap gap-1 border-b border-line">
      {tabs.map((tab) => (
        <Link
          key={tab.to}
          to={tab.to}
          aria-current={tab.active ? "page" : undefined}
          className={`-mb-px border-b-2 px-4 py-2.5 text-step--1 transition-colors ${
            tab.active
              ? "border-accent-ink text-ink-950"
              : "border-transparent text-ink-600 hover:text-ink-950"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
