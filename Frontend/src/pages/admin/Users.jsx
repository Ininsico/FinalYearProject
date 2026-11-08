import { useCallback, useEffect, useRef, useState } from "react"
import { CircleNotch, Warning, MagnifyingGlass, Trash, X } from "@phosphor-icons/react"
import { fetchUsers, updateUser, deleteUser } from "../../lib/admin"
import { useAuth, api } from "../../lib/auth"

const ROLES = ["student", "institution", "admin"]

/** Round avatar that doubles as the upload control, with a remove action. */
function AvatarPicker({ user, onUpdated }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef(null)

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    const formData = new FormData()
    formData.append("avatar", file)
    setBusy(true)
    setError("")
    try {
      await api(`/api/admin/users/${user.id}/avatar`, { method: "POST", body: formData, headers: {} })
      onUpdated()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!window.confirm(`Remove the profile picture of ${user.email}?`)) return
    setBusy(true)
    setError("")
    try {
      await api(`/api/admin/users/${user.id}/avatar`, { method: "DELETE" })
      onUpdated()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        title={user.avatarUrl ? "Replace profile picture" : "Set profile picture"}
        className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-line-2 bg-accent-soft"
      >
        <img
          src={user.avatarUrl || "/defaultprofile.png"}
          alt=""
          className="h-full w-full object-cover"
          onError={(e) => {
            if (!e.currentTarget.src.endsWith("/defaultprofile.png")) {
              e.currentTarget.src = "/defaultprofile.png"
            }
          }}
        />
        {busy && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink-950/45">
            <CircleNotch size={14} weight="bold" className="animate-spin text-paper" />
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={onFile}
        className="hidden"
        aria-label={`Upload a profile picture for ${user.email}`}
      />
      {user.avatarUrl && (
        <button
          onClick={remove}
          disabled={busy}
          title="Remove picture"
          className="text-ink-400 transition-colors hover:text-red-700"
        >
          <X size={13} weight="bold" />
        </button>
      )}
      {error && <span className="max-w-[140px] text-[0.7rem] text-red-700">{error}</span>}
    </div>
  )
}

export default function AdminUsers() {
  const { user: me } = useAuth()
  const [data, setData] = useState(null)
  const [query, setQuery] = useState("")
  const [role, setRole] = useState("")
  const [busy, setBusy] = useState("")
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    try {
      setData(await fetchUsers({ q: query, role }))
    } catch (err) {
      setError(err.message)
    }
  }, [query, role])

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [load])

  async function changeRole(id, next) {
    setBusy(id)
    setError("")
    try {
      await updateUser(id, { role: next })
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy("")
    }
  }

  async function remove(id, email) {
    if (!window.confirm(`Delete ${email}? This cannot be undone.`)) return
    setBusy(id)
    try {
      await deleteUser(id)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy("")
    }
  }

  return (
    <>
      <div>
        <p className="eyebrow">Students & users</p>
        <h1 className="display mt-3 text-step-3 text-ink-950">Accounts</h1>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <label className="relative flex-1 min-w-[240px]">
          <span className="sr-only">Search accounts</span>
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email"
            className="field pl-9"
          />
        </label>
        <label className="flex items-center gap-2 text-step--1 text-ink-600">
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)} className="field w-[160px] py-2">
            <option value="">All</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-5 flex items-start gap-2 text-step--1 text-red-700">
          <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <div className="mt-6 overflow-hidden border border-line">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              {["Avatar", "Name", "Email", "Role", "Verified", ""].map((h, i) => (
                <th key={i} scope="col" className="px-4 py-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!data && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-step--1 text-ink-500">
                <CircleNotch size={16} weight="bold" className="inline animate-spin" aria-hidden="true" /> Loading
              </td></tr>
            )}
            {data?.users?.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-step--1 text-ink-500">No accounts match.</td></tr>
            )}
            {data?.users?.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <AvatarPicker user={u} onUpdated={load} />
                </td>
                <td className="px-4 py-3 text-step--1 text-ink-900">{u.name}</td>
                <td className="px-4 py-3 text-step--1 text-ink-600">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    disabled={busy === u.id || u.id === me?.id}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    aria-label={`Role for ${u.email}`}
                    className="field w-[150px] py-1.5 text-step--1"
                  >
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-step--1 text-ink-600">{u.isVerified ? "yes" : "no"}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => remove(u.id, u.email)}
                    disabled={busy === u.id || u.id === me?.id}
                    aria-label={`Delete ${u.email}`}
                    className="text-ink-400 transition-colors hover:text-red-700 disabled:opacity-30"
                  >
                    <Trash size={16} weight="regular" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && (
        <p className="mt-4 text-step--1 text-ink-500">{data.total} account{data.total === 1 ? "" : "s"}</p>
      )}
    </>
  )
}
