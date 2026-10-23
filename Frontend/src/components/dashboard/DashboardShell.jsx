import {
  SquaresFour, Rocket, Robot, Database, GearSix, Sparkle,
} from "@phosphor-icons/react"
import AppShell from "../shell/AppShell"

const NAV = [
  { to: "/dashboard", label: "Overview", icon: SquaresFour, end: true },
  { to: "/dashboard/productions", label: "Productions", icon: Rocket },
  { to: "/dashboard/agents", label: "Agents", icon: Robot },
  { to: "/dashboard/warehouse", label: "Warehouse", icon: Database },
  { to: "/dashboard/premium", label: "Premium", icon: Sparkle },
  { to: "/dashboard/settings", label: "Settings", icon: GearSix },
]

export default function DashboardShell() {
  return <AppShell nav={NAV} />
}
