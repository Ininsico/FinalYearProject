import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { SignOut } from "@phosphor-icons/react"
import { fetchInstitution } from "../../lib/billing"
import { useAuth } from "../../lib/auth"

export default function InstitutionSettings() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)

  useEffect(() => { fetchInstitution().then(setData).catch(() => {}) }, [])

  async function onSignOut() {
    await signOut()
    navigate("/", { replace: true })
  }

  return (
    <>
      <div>
        <p className="eyebrow">Settings</p>
        <h1 className="display mt-3 text-step-3 text-ink-950">Institution</h1>
      </div>

      <div className="mt-10 max-w-[640px] space-y-6">
        <div className="border border-line p-6">
          <h2 className="eyebrow">Organisation</h2>
          <dl className="mt-5 space-y-4">
            {[
              ["Name", data?.institution?.name ?? "—"],
              ["Domain", data?.institution?.domain || "—"],
              ["Contact", data?.institution?.contactEmail || "—"],
              ["Status", data?.institution?.status ?? "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-t border-line pt-4">
                <dt className="text-step--1 text-ink-500">{k}</dt>
                <dd className="text-step--1 text-ink-900">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="border border-line p-6">
          <h2 className="eyebrow">Your account</h2>
          <dl className="mt-5 space-y-4">
            {[
              ["Name", user?.name],
              ["Email", user?.email],
              ["Institution role", user?.institutionRole],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-t border-line pt-4">
                <dt className="text-step--1 text-ink-500">{k}</dt>
                <dd className="text-step--1 text-ink-900">{v}</dd>
              </div>
            ))}
          </dl>
          <button onClick={onSignOut} className="btn btn-ghost mt-6 h-10">
            <SignOut size={15} weight="bold" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>
    </>
  )
}
