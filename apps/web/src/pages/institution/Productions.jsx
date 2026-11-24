import { useNavigate } from "react-router-dom"
import { Plus } from "@phosphor-icons/react"

export default function InstitutionProductions() {
  const navigate = useNavigate()
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Productions</p>
          <h1 className="display mt-3 text-step-3 text-ink-950">Institution runs</h1>
        </div>
        <button onClick={() => navigate("/contact")} className="btn btn-primary h-10">
          <Plus size={15} weight="bold" aria-hidden="true" />
          New production
        </button>
      </div>

      <div className="mt-10 overflow-hidden border border-line">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              {["Brief", "Course", "State", "Created"].map((h) => (
                <th key={h} scope="col" className="px-5 py-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="px-5 py-20 text-center">
                <p className="display text-step-2 text-ink-950">Nothing in production yet</p>
                <p className="mx-auto mt-3 max-w-[46ch] leading-relaxed text-ink-600">
                  Institution productions appear here once you brief the swarm. Premium plans unlock
                  the full agentic orchestration engine.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
