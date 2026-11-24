import { Robot } from "@phosphor-icons/react"
import { AGENT_ROLES } from "../../lib/content"

export default function InstitutionAgents() {
  return (
    <>
      <div>
        <p className="eyebrow">Agents</p>
        <h1 className="display mt-3 text-step-3 text-ink-950">Agent roster</h1>
        <p className="mt-4 max-w-[56ch] leading-relaxed text-ink-600">
          The specialist agents the orchestrator can assign across the institution's productions.
        </p>
      </div>

      <ul className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {AGENT_ROLES.map((r) => (
          <li key={r} className="flex items-center gap-3 bg-paper p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-ink" aria-hidden="true">
              <Robot size={16} weight="regular" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-step--1 text-ink-900">{r}</span>
              <span className="block font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-500">available</span>
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}
