import { useRef, useState } from "react"
import { CircleNotch } from "@phosphor-icons/react"
import { api } from "../lib/auth"

/** Self-service profile picture control used on the settings pages. */
export default function AvatarUploader({ src, name, uploadPath, removePath, onUpdated }) {
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
      await api(uploadPath, { method: "POST", body: formData, headers: {} })
      onUpdated?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!window.confirm("Remove your profile picture?")) return
    setBusy(true)
    setError("")
    try {
      await api(removePath, { method: "DELETE" })
      onUpdated?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        title="Change profile picture"
        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-line-2 bg-accent-soft"
      >
        <img
          src={src || "/defaultprofile.png"}
          alt={name ? `${name}'s profile picture` : ""}
          className="h-full w-full object-cover"
          onError={(e) => {
            if (!e.currentTarget.src.endsWith("/defaultprofile.png")) {
              e.currentTarget.src = "/defaultprofile.png"
            }
          }}
        />
        {busy && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink-950/45">
            <CircleNotch size={16} weight="bold" className="animate-spin text-paper" />
          </span>
        )}
      </button>

      <div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="link-underline text-step--1 text-ink-700"
          >
            Change picture
          </button>
          {src && (
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="text-step--1 text-ink-500 transition-colors hover:text-red-700"
            >
              Remove
            </button>
          )}
        </div>
        <p className="mt-1 text-[0.72rem] text-ink-500">PNG, JPEG or WebP · up to 5MB</p>
        {error && <p className="mt-1 text-[0.72rem] text-red-700">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={onFile}
        className="hidden"
        aria-label="Upload a profile picture"
      />
    </div>
  )
}
