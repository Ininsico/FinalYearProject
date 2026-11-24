import {
  SquaresFour, GearSix, Sparkle, BookOpen,
} from "@phosphor-icons/react"
import AppShell from "../shell/AppShell"

const NAV = [
  { to: "/dashboard", label: "Overview", icon: SquaresFour, end: true },
  { to: "/dashboard/courses", label: "Courses", icon: BookOpen },
  { to: "/dashboard/premium", label: "Premium", icon: Sparkle },
  { to: "/dashboard/settings", label: "Settings", icon: GearSix },
]

export default function DashboardShell() {
  return <AppShell nav={NAV} />
}
