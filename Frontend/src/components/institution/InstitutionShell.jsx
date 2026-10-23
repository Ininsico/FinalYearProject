import {
  SquaresFour, UsersThree, Rocket, Robot, CreditCard, GearSix,
} from "@phosphor-icons/react"
import AppShell from "../shell/AppShell"

const NAV = [
  { to: "/institution", label: "Overview", icon: SquaresFour, end: true },
  { to: "/institution/members", label: "Members & seats", icon: UsersThree },
  { to: "/institution/agents", label: "Agents", icon: Robot },
  { to: "/institution/productions", label: "Productions", icon: Rocket },
  { to: "/institution/billing", label: "Billing", icon: CreditCard },
  { to: "/institution/settings", label: "Settings", icon: GearSix },
]

export default function InstitutionShell() {
  return <AppShell nav={NAV} footerNote="Institution workspace" />
}
