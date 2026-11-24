import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CircleNotch, CheckCircle, SignOut, Warning } from "@phosphor-icons/react"
import { useAuth, api } from "../../lib/auth"
import AvatarUploader from "../../components/AvatarUploader"

export default function Settings() {
  const { user, signOut, refresh } = useAuth()
  const navigate = useNavigate()
  const [profileName, setProfileName] = useState(user?.name ?? "")
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "", confirm: "" })
  const [busy, setBusy] = useState("")
  const [error, setError] = useState("")
  const [note, setNote] = useState("")

  useEffect(() => { setProfileName(user?.name ?? "") }, [user?.name])

  const setPw = (key) => (e) => setPassword((p) => ({ ...p, [key]: e.target.value }))

  async function saveProfile(e) {
    e.preventDefault()
    setBusy("profile")
    setError("")
    setNote("")
    try {
      await api("/api/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({ name: profileName.trim() }),
      })
      await refresh()
      setNote("Profile updated.")
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy("")
    }
  }

  async function savePassword(e) {
    e.preventDefault()
    setBusy("password")
    setError("")
    setNote("")
    try {
      await api("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify(password),
      })
      setPassword({ currentPassword: "", newPassword: "", confirm: "" })
      setNote("Password changed.")
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
        <h1 className="display mt-3 text-step-3 text-ink-950">Account</h1>
        <p className="mt-4 max-w-[72ch] leading-relaxed text-ink-600">
          Your profile, picture and password. Changes apply immediately across your dashboard.
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
          <h2 className="display text-step-1 text-ink-950">Profile</h2>

          <div className="mt-5">
            <AvatarUploader
              src={user?.avatarUrl}
              name={user?.name}
              uploadPath="/api/auth/avatar"
              removePath="/api/auth/avatar"
              onUpdated={refresh}
            />
          </div>

          <form onSubmit={saveProfile} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-step--1 font-medium text-ink-700">Name</span>
              <input
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="field"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-step--1 font-medium text-ink-700">Email</span>
              <input value={user?.email ?? ""} readOnly disabled className="field opacity-70" />
              <span className="mt-1 block text-[0.72rem] text-ink-500">
                Email is tied to your sign-in and cannot be changed here.
              </span>
            </label>
            <button type="submit" disabled={Boolean(busy)} className="btn btn-primary h-10">
              {busy === "profile" ? (
                <CircleNotch size={15} weight="bold" className="animate-spin" aria-hidden="true" />
              ) : (
                "Save profile"
              )}
            </button>
          </form>
        </section>

        <section className="border border-line bg-paper p-6">
          <h2 className="display text-step-1 text-ink-950">Password</h2>

          <form onSubmit={savePassword} className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 block text-step--1 font-medium text-ink-700">Current password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password.currentPassword}
                onChange={setPw("currentPassword")}
                className="field"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-step--1 font-medium text-ink-700">New password</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password.newPassword}
                onChange={setPw("newPassword")}
                className="field"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-step--1 font-medium text-ink-700">Confirm new password</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password.confirm}
                onChange={setPw("confirm")}
                className="field"
              />
            </label>
            <button type="submit" disabled={Boolean(busy)} className="btn btn-primary h-10">
              {busy === "password" ? (
                <CircleNotch size={15} weight="bold" className="animate-spin" aria-hidden="true" />
              ) : (
                "Change password"
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

        <section className="border border-line bg-paper p-6 lg:col-span-2">
          <h2 className="eyebrow text-red-700">Account deletion</h2>
          <p className="mt-4 flex items-start gap-2 text-step--1 leading-relaxed text-ink-600">
            <Warning size={16} weight="bold" className="mt-0.5 shrink-0 text-red-700" aria-hidden="true" />
            Need your account removed? Contact us and we will handle it with you.
          </p>
          <a href="mailto:fablet@artdevelopers.site" className="btn btn-ghost mt-5 h-10">
            Request deletion
          </a>
        </section>
      </div>
    </>
  )
}
