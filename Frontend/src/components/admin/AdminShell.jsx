import {
  SquaresFour, Student, Buildings, Repeat, ClockCounterClockwise, Books,
} from "@phosphor-icons/react"
import AppShell from "../shell/AppShell"

const NAV = [
  { to: "/admin", label: "Overview", icon: SquaresFour, end: true },
  { to: "/admin/users", label: "Students & users", icon: Student },
  { to: "/admin/institutions", label: "Institutions", icon: Buildings },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: Repeat },
  { to: "/admin/courses", label: "Courses", icon: Books },
  { to: "/admin/audit", label: "Audit", icon: ClockCounterClockwise },
]

export default function AdminShell() {
  return <AppShell nav={NAV} footerNote="Operator console" />
}
