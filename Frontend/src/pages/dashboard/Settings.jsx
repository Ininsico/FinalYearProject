import { useNavigate } from "react-router-dom"
import { SignOut, Warning } from "@phosphor-icons/react"
import { useAuth } from "../../lib/auth"

export default function Settings() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function onSignOut() {
    await signOut()
    navigate("/", { replace: true })
  }

  return (
    <>
      <div>
        <p className="eyebrow">Settings</p>
        <h1 className="display mt-3 text-step-3 text-ink-950">Account</h1>
      </div>

      <div className="mt-10 max-w-[640px] space-y-6">
        <div className="border border-line p-6">
          <h2 className="eyebrow">Profile</h2>
          <dl className="mt-5 space-y-4">
            <div className="flex items-center justify-between border-t border-line pt-4">
              <dt className="text-step--1 text-ink-500">Name</dt>
              <dd className="text-step--1 text-ink-900">{user?.name || "—"}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-4">
              <dt className="text-step--1 text-ink-500">Email</dt>
              <dd className="text-step--1 text-ink-900">{user?.email || "—"}</dd>
            </div>
          </dl>
        </div>

        <div className="border border-line p-6">
          <h2 className="eyebrow">Session</h2>
          <p className="mt-4 text-step--1 leading-relaxed text-ink-600">
            Signing out ends this session. Password resets sign out every other device.
          </p>
          <button onClick={onSignOut} className="btn btn-ghost mt-5 h-10">
            <SignOut size={15} weight="bold" aria-hidden="true" />
            Sign out
          </button>
        </div>

        <div className="border border-line p-6">
          <h2 className="eyebrow text-red-700">Danger zone</h2>
          <p className="mt-4 flex items-start gap-2 text-step--1 leading-relaxed text-ink-600">
            <Warning size={16} weight="bold" className="mt-0.5 shrink-0 text-red-700" aria-hidden="true" />
            Deleting your workspace removes all productions, agents, and warehouse data.
            This cannot be undone. Contact us to proceed.
          </p>
          <a href="mailto:fablet@artdevelopers.site" className="btn btn-ghost mt-5 h-10">
            Request deletion
          </a>
        </div>
      </div>
    </>
  )
}
