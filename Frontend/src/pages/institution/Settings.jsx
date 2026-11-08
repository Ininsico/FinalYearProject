import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CircleNotch, CheckCircle, SignOut, Warning } from "@phosphor-icons/react"
import { fetchInstitution } from "../../lib/billing"
import { useAuth, api } from "../../lib/auth"
import AvatarUploader from "../../components/AvatarUploader"

export default function InstitutionSettings() {
  const { user, signOut, refresh } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [org, setOrg] = useState({ name: "", domain: "", contactEmail: "" })
  const [accountName, setAccountName] = useState(user?.name ?? "")
  const [busy, setBusy] = useState("")
  const [error, setError] = useState("")
  const [note, setNote] = useState("")

  const canEditOrg = ["owner", "admin"].includes(user?.institutionRole)

  const load = useCallback(async () => {
    try {
      const detail = await fetchInstitution()
      setData(detail)
      setOrg({
        name: detail.institution?.name ?? "",
        domain: detail.institution?.domain ?? "",
        contactEmail: detail.institution?.contactEmail ?? "",
      })
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => { setAccountName(user?.name ?? "") }, [user?.name])

  const setOrgField = (key) => (e) => setOrg((o) => ({ ...o, [key]: e.target.value }))

  async function saveOrg(e) {
    e.preventDefault()
    setBusy("org")
    setError("")
    setNote("")
    try {
      await api("/api/institutions/me", {
        method: "PATCH",
        body: JSON.stringify({
          name: org.name.trim(),
          domain: org.domain.trim(),
          contactEmail: org.contactEmail.trim(),
        }),
      })
      await load()
      setNote("Institution profile updated.")
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy("")
    }
  }

  async function saveAccount(e) {
    e.preventDefault()
    setBusy("account")
    setError("")
    setNote("")
    try {
      await api("/api/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({ name: accountName.trim() }),
      })
      await refresh()
      setNote("Your account was updated.")
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy("")
    }
  }

  async function onSignOut() {
    await signOut()
    navigate("/", { replace: true })
  }

  return (
    <>
      <div>
        <p className="eyebrow">Settings</p>
        <h1 className="display mt-3 text-step-3 text-ink-950">Institution</h1>
        <p className="mt-4 max-w-[72ch] leading-relaxed text-ink-600">
          Edit the institution's public profile and your own account.
        </p>
      </div>

      {error && (
        <p role="alert" className="mt-5 flex items-start gap-2 text-step--1 text-red-700">
          <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
      {note && (
        <p role="status" className="mt-5 flex items-start gap-2 text-step--1 text-emerald-800">
          <CheckCircle size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {note}
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="border border-line bg-paper p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="display text-step-1 text-ink-950">Organisation</h2>
            <span className="border border-line-2 bg-paper-3 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-600">
              {data?.institution?.status ?? "—"}
            </span>
          </div>

          {!canEditOrg && (
            <p className="mt-4 text-step--1 text-ink-500">
              Only an institution owner or admin can edit this profile.
            </p>
          )}

          <form onSubmit={saveOrg} className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 block text-step--1 font-medium text-ink-700">Institution name</span>
              <input required disabled={!canEditOrg || Boolean(busy)} value={org.name} onChange={setOrgField("name")} className="field" />
            </label>
            <label className="block">
              <span className="mb-2 block text-step--1 font-medium text-ink-700">Domain</span>
              <input disabled={!canEditOrg || Boolean(busy)} value={org.domain} onChange={setOrgField("domain")} placeholder="e.g. college.edu.pk" className="field" />
            </label>
            <label className="block">
              <span className="mb-2 block text-step--1 font-medium text-ink-700">Contact email</span>
              <input type="email" disabled={!canEditOrg || Boolean(busy)} value={org.contactEmail} onChange={setOrgField("contactEmail")} className="field" />
            </label>
            {canEditOrg && (
              <button type="submit" disabled={Boolean(busy)} className="btn btn-primary h-10">
                {busy === "org" ? (
                  <CircleNotch size={15} weight="bold" className="animate-spin" aria-hidden="true" />
                ) : (
                  "Save institution"
                )}
              </button>
            )}
          </form>
        </section>

        <section className="border border-line bg-paper p-6">
          <h2 className="display text-step-1 text-ink-950">Your account</h2>

          <div className="mt-5">
            <AvatarUploader
              src={user?.avatarUrl}
              name={user?.name}
              uploadPath="/api/auth/avatar"
              removePath="/api/auth/avatar"
              onUpdated={refresh}
            />
          </div>

          <form onSubmit={saveAccount} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-step--1 font-medium text-ink-700">Name</span>
              <input required value={accountName} onChange={(e) => setAccountName(e.target.value)} className="field" />
            </label>
            <label className="block">
              <span className="mb-2 block text-step--1 font-medium text-ink-700">Email</span>
              <input value={user?.email ?? ""} readOnly disabled className="field opacity-70" />
            </label>
            <div className="flex items-center justify-between border-t border-line pt-4">
              <span className="text-step--1 text-ink-500">Institution role</span>
              <span className="text-step--1 text-ink-900">{user?.institutionRole ?? "—"}</span>
            </div>
            <button type="submit" disabled={Boolean(busy)} className="btn btn-primary h-10">
              {busy === "account" ? (
                <CircleNotch size={15} weight="bold" className="animate-spin" aria-hidden="true" />
              ) : (
                "Save account"
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-line pt-5">
            <h3 className="eyebrow">Session</h3>
            <button onClick={onSignOut} className="btn btn-ghost mt-4 h-10">
              <SignOut size={15} weight="bold" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </section>
      </div>
    </>
  )
}
