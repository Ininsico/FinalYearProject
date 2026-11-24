import { useNavigate } from "react-router-dom"

// Segmented student/institution switcher shared by the three registration paths,
// so the two account types are always visibly differentiated.
export default function AuthPathSwitch({ active }) {
  const navigate = useNavigate()

  const options = [
    { id: "student", label: "Student", to: "/signup" },
    { id: "institution", label: "Institution", to: "/institutions/register" },
  ]

  return (
    <div
      role="tablist"
      aria-label="Account type"
      className="grid grid-cols-2 gap-1 rounded-full border border-line-2 bg-paper p-1"
    >
      {options.map((o) => {
        const isActive = o.id === active
        return (
          <button
            key={o.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => {
              if (!isActive) navigate(o.to)
            }}
            className={`h-10 rounded-full font-mono text-[0.66rem] uppercase tracking-[0.08em] transition-colors duration-300 ${
              isActive ? "bg-ink-950 text-paper" : "text-ink-600 hover:text-ink-950"
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
