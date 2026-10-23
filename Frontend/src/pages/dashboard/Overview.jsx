import { useNavigate } from "react-router-dom"
import { Plus, Rocket, Robot, Clock } from "@phosphor-icons/react"
import { useAuth } from "../../lib/auth"

const CARDS = [
  { label: "Active swarm", value: "0", hint: "agents assigned", icon: Robot },
  { label: "Runs", value: "0", hint: "productions shipped", icon: Rocket },
  { label: "Compute", value: "0h", hint: "this month", icon: Clock },
]

export default function Overview() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const first = user?.name?.split(" ")[0]

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="display mt-3 text-step-3 text-ink-950">
            {first ? `Welcome back, ${first}.` : "Welcome back."}
          </h1>
        </div>
        <button onClick={() => navigate("/contact")} className="btn btn-primary h-10">
          <Plus size={15} weight="bold" aria-hidden="true" />
          New production
        </button>
      </div>

      <dl className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
        {CARDS.map(({ label, value, hint, icon: Icon }) => (
          <div key={label} className="bg-paper p-6">
            <dt className="flex items-center gap-2 text-ink-500">
              <Icon size={15} weight="regular" aria-hidden="true" />
              <span className="eyebrow">{label}</span>
            </dt>
            <dd className="display mt-4 text-step-4 tabular text-ink-950">{value}</dd>
            <p className="mt-1 text-step--1 text-ink-500">{hint}</p>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="border border-dashed border-line-2 px-8 py-14 text-center">
          <h2 className="display text-step-2 text-ink-950">No runs yet</h2>
          <p className="mx-auto mt-3 max-w-[46ch] leading-relaxed text-ink-600">
            Your workspace is ready. Brief the swarm to create your first production, and
            its agents, output, and history will appear here.
          </p>
          <button onClick={() => navigate("/contact")} className="btn btn-primary mt-7">
            Start your first run
          </button>
        </div>

        <div className="border border-line p-6">
          <h2 className="eyebrow">Activity</h2>
          <ul className="mt-5 space-y-4">
            {["Workspace created", "Agent roster synchronised", "Warehouse initialised"].map((e) => (
              <li key={e} className="flex items-start gap-3 border-t border-line pt-4 text-step--1 text-ink-600">
                <span className="mt-[7px] block h-[6px] w-[6px] shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {e}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
