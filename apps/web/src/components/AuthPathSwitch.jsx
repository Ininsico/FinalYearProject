import { useNavigate } from "react-router-dom"
import { Buildings, GraduationCap } from "@phosphor-icons/react"

const OPTIONS = [
  {
    id: "student",
    icon: GraduationCap,
    label: "Student",
    line: "Free, for one learner",
    to: "/signup",
  },
  {
    id: "institution",
    icon: Buildings,
    label: "Institution",
    line: "Seats and a shared catalogue",
    to: "/institutions/register",
  },
]

// The account-type choice, as two explicit plates rather than a segmented
// control: each carries an icon, its name and what it gets you.
export default function AuthPathSwitch({ active }) {
  const navigate = useNavigate()

  return (
    <div role="group" aria-label="Account type" className="grid gap-3 sm:grid-cols-2">
      {OPTIONS.map((o) => {
        const isActive = o.id === active
        const Icon = o.icon
        return (
          <button
            key={o.id}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => {
              if (!isActive) navigate(o.to)
            }}
            className={`flex items-start gap-3 rounded-[12px] border p-3.5 text-left transition-colors duration-300 ${
              isActive
                ? "border-ink-950 bg-ink-950 text-paper"
                : "border-line-2 bg-paper text-ink-800 hover:border-ink-950"
            }`}
          >
            <Icon
              size={18}
              weight={isActive ? "fill" : "regular"}
              aria-hidden="true"
              className={`mt-0.5 shrink-0 ${isActive ? "text-accent-soft" : "text-ink-500"}`}
            />
            <span className="min-w-0">
              <span className="block font-mono text-[0.66rem] uppercase tracking-[0.08em]">
                {o.label}
              </span>
              <span
                className={`mt-0.5 block text-[0.74rem] leading-snug ${
                  isActive ? "text-paper/70" : "text-ink-500"
                }`}
              >
                {o.line}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
