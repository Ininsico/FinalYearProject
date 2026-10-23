import {
  SquaresFour, Student, Buildings, Repeat, CurrencyCircleDollar, Stack, ClockCounterClockwise,
} from "@phosphor-icons/react"
import AppShell from "../shell/AppShell"

const NAV = [
  { to: "/admin", label: "Overview", icon: SquaresFour, end: true },
  { to: "/admin/users", label: "Students & users", icon: Student },
  { to: "/admin/institutions", label: "Institutions", icon: Buildings },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: Repeat },
  { to: "/admin/payments", label: "Payments", icon: CurrencyCircleDollar },
  { to: "/admin/plans", label: "Plans", icon: Stack },
  { to: "/admin/audit", label: "Audit", icon: ClockCounterClockwise },
]

export default function AdminShell() {
  return <AppShell nav={NAV} footerNote="Operator console" />
}
