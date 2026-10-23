import { Database, LinkSimple, ClockCounterClockwise } from "@phosphor-icons/react"

const TABLES = [
  { name: "entities", desc: "Characters, scenes, props, assets", icon: Database, rows: "0" },
  { name: "relationships", desc: "Deterministic edges between entities", icon: LinkSimple, rows: "0" },
  { name: "generations", desc: "Every agent produce-and-record cycle", icon: ClockCounterClockwise, rows: "0" },
]

export default function Warehouse() {
  return (
    <>
      <div>
        <p className="eyebrow">Warehouse</p>
        <h1 className="display mt-3 text-step-3 text-ink-950">Content identity</h1>
        <p className="mt-4 max-w-[56ch] leading-relaxed text-ink-600">
          The swarm's shared memory: structured relationships for certainty, vector
          embeddings for meaning.
        </p>
      </div>

      <ul className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
        {TABLES.map(({ name, desc, icon: Icon, rows }) => (
          <li key={name} className="bg-paper p-6">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent-ink" aria-hidden="true">
                <Icon size={18} weight="regular" />
              </span>
              <span className="display text-step-2 tabular text-ink-950">{rows}</span>
            </div>
            <p className="mt-5 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink-900">{name}</p>
            <p className="mt-2 text-step--1 leading-relaxed text-ink-600">{desc}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 border border-dashed border-line-2 px-8 py-14 text-center">
        <p className="display text-step-2 text-ink-950">The warehouse is empty</p>
        <p className="mx-auto mt-3 max-w-[48ch] leading-relaxed text-ink-600">
          Entities, relationships, and generations populate as productions run. Nothing has
          been written yet.
        </p>
      </div>
    </>
  )
}
