import { useCallback, useEffect, useState } from "react"
import { CircleNotch, Warning, UserPlus, Check } from "@phosphor-icons/react"
import { fetchInstitution, inviteMember } from "../../lib/billing"

export default function InstitutionMembers() {
  const [data, setData] = useState(null)
  const [form, setForm] = useState({ name: "", email: "" })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [invited, setInvited] = useState(null)

  const load = useCallback(() => fetchInstitution().then(setData).catch((e) => setError(e.message)), [])
  useEffect(() => { load() }, [load])

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError("")
    setInvited(null)
    try {
      const res = await inviteMember({ name: form.name.trim(), email: form.email.trim() })
      setInvited(res)
      setForm({ name: "", email: "" })
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (!data) {
    return (
      <div role="status" className="flex items-center gap-2 text-step--1 text-ink-500">
        <CircleNotch size={16} weight="bold" className="animate-spin" aria-hidden="true" />
        Loading members
      </div>
    )
  }

  const { members, seats, institution } = data
  const full = seats.used >= seats.limit

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Members & seats</p>
          <h1 className="display mt-3 text-step-3 text-ink-950">Team</h1>
          <p className="mt-3 text-step--1 text-ink-500">
            {seats.used} of {seats.limit} seats in use on the {institution.planId} plan.
          </p>
        </div>
      </div>

      {full && (
        <p className="mt-6 flex items-start gap-2 border border-amber-200 bg-amber-50 px-4 py-3 text-step--1 text-amber-900">
          <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          All seats are in use. Upgrade the plan on the billing page to add more members.
        </p>
      )}

      <div className="mt-8 overflow-hidden border border-line">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              {["Name", "Email", "Role"].map((h) => (
                <th key={h} scope="col" className="px-4 py-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 text-step--1 text-ink-900">{m.name}</td>
                <td className="px-4 py-3 text-step--1 text-ink-600">{m.email}</td>
                <td className="px-4 py-3 text-step--1 text-ink-600">{m.institutionRole}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={onSubmit} className="mt-10 max-w-[560px] border-t border-line pt-8">
        <p className="eyebrow">Invite a member</p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="m-name" className="mb-2 block text-step--1 font-medium text-ink-700">Name</label>
            <input id="m-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="field" required />
          </div>
          <div>
            <label htmlFor="m-email" className="mb-2 block text-step--1 font-medium text-ink-700">Email</label>
            <input id="m-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="field" required />
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 flex items-start gap-2 text-step--1 text-red-700">
            <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        {invited && (
          <div className="mt-4 border border-line bg-paper-2 px-4 py-3">
            <p className="flex items-center gap-2 text-step--1 text-ink-900">
              <Check size={15} weight="bold" className="text-accent-ink" aria-hidden="true" />
              {invited.member.email} added.
            </p>
            <p className="mt-1 text-[0.78rem] text-ink-600">
              Temporary password: <code className="font-mono text-ink-900">{invited.password}</code>
            </p>
          </div>
        )}

        <button type="submit" disabled={busy || full} className="btn btn-primary mt-6">
          {busy ? <><CircleNotch size={15} weight="bold" className="animate-spin" /> Adding</> : <><UserPlus size={15} weight="bold" /> Add member</>}
        </button>
      </form>
    </>
  )
}
