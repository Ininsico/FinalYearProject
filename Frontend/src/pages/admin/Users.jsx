import { useCallback, useEffect, useState } from "react"
import { CircleNotch, Warning, MagnifyingGlass, Trash } from "@phosphor-icons/react"
import { fetchUsers, updateUser, deleteUser } from "../../lib/admin"
import { useAuth } from "../../lib/auth"

const ROLES = ["student", "institution", "admin"]

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
              {["Name", "Email", "Role", "Verified", ""].map((h, i) => (
                <th key={i} scope="col" className="px-4 py-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!data && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-step--1 text-ink-500">
                <CircleNotch size={16} weight="bold" className="inline animate-spin" aria-hidden="true" /> Loading
              </td></tr>
            )}
            {data?.users?.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-step--1 text-ink-500">No accounts match.</td></tr>
            )}
            {data?.users?.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0">
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
