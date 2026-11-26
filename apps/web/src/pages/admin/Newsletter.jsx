import { useEffect, useState } from "react"
import { CircleNotch, PencilSimple, Trash, Warning } from "@phosphor-icons/react"
import {
  createNewsPost,
  deleteNewsPost,
  fetchAdminNews,
  updateNewsPost,
} from "../../lib/news"
import { InlineLoader } from "../../components/LoadingScreen"

const fmtDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })

const EMPTY = { title: "", tag: "", body: "" }

export default function AdminNewsletter() {
  const [posts, setPosts] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchAdminNews()
      .then((data) => setPosts(data.posts ?? []))
      .catch((err) => setError(err.message))
  }, [])

  const refresh = () =>
    fetchAdminNews()
      .then((data) => setPosts(data.posts ?? []))
      .catch((err) => setError(err.message))

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  function reset() {
    setForm(EMPTY)
    setEditingId(null)
  }

  async function save(published) {
    if (!form.title.trim() || !form.body.trim()) {
      setError("A title and a body are required.")
      return
    }
    setBusy(true)
    setError("")
    const payload = {
      title: form.title.trim(),
      tag: form.tag.trim(),
      body: form.body.trim(),
      published,
    }
    try {
      if (editingId) await updateNewsPost(editingId, payload)
      else await createNewsPost(payload)
      reset()
      await refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  function edit(post) {
    setEditingId(post.id)
    setForm({ title: post.title, tag: post.tag ?? "", body: post.body })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function togglePublish(post) {
    setError("")
    try {
      await updateNewsPost(post.id, { published: !post.published })
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(post) {
    if (!window.confirm("Delete this post? This cannot be undone.")) return
    setError("")
    try {
      await deleteNewsPost(post.id)
      if (editingId === post.id) reset()
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <div>
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-500">
          Newsletter
        </p>
        <h1 className="display mt-2 text-step-2 text-ink-950">Compose and publish.</h1>
        <p className="mt-2 max-w-[64ch] text-[0.84rem] leading-relaxed text-ink-600">
          Posts published here appear in every student account under Newsletter.
        </p>
      </div>

      {error && (
        <p role="alert" className="mt-4 flex items-start gap-2 text-[0.82rem] text-red-700">
          <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            save(true)
          }}
          className="rounded-[15px] border border-line bg-paper p-5"
        >
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-500">
            {editingId ? "Editing post" : "New post"}
          </p>

          <div className="mt-3">
            <label htmlFor="news-title" className="mb-1.5 block text-[0.8rem] font-medium text-ink-700">
              Title
            </label>
            <input
              id="news-title"
              value={form.title}
              onChange={update("title")}
              className="field text-[0.9rem]"
              placeholder="What's new at the academy"
            />
          </div>

          <div className="mt-3">
            <label htmlFor="news-tag" className="mb-1.5 block text-[0.8rem] font-medium text-ink-700">
              Tag (optional)
            </label>
            <input
              id="news-tag"
              value={form.tag}
              onChange={update("tag")}
              className="field text-[0.9rem]"
              placeholder="Update, Exams, Faculty…"
            />
          </div>

          <div className="mt-3">
            <label htmlFor="news-body" className="mb-1.5 block text-[0.8rem] font-medium text-ink-700">
              Body
            </label>
            <textarea
              id="news-body"
              value={form.body}
              onChange={update("body")}
              rows={9}
              className="field resize-y text-[0.9rem] leading-relaxed"
              placeholder="Write the post. Markdown is supported."
            />
            <p className="mt-1.5 text-[0.72rem] text-ink-500">Markdown is supported.</p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button type="submit" disabled={busy} className="btn btn-primary h-9 px-4 text-[0.8rem]">
              {busy && <CircleNotch size={13} weight="bold" className="animate-spin" aria-hidden="true" />}
              {editingId ? "Update post" : "Publish now"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => save(false)}
              className="btn btn-ghost h-9 px-4 text-[0.8rem]"
            >
              Save as draft
            </button>
            {editingId && (
              <button type="button" onClick={reset} className="btn btn-quiet h-9 text-[0.8rem]">
                Cancel edit
              </button>
            )}
          </div>
        </form>

        <section className="overflow-hidden rounded-[15px] border border-line bg-paper">
          <header className="border-b border-line px-4 py-2.5">
            <h2 className="display text-[0.95rem] text-ink-950">Posts</h2>
          </header>

          {!posts && <p className="px-4 py-5"><InlineLoader label="Loading posts" /></p>}

          {posts?.length === 0 && (
            <p className="px-4 py-5 text-[0.82rem] text-ink-500">
              No posts yet. Publish the first one.
            </p>
          )}

          <ul className="divide-y divide-line">
            {posts?.map((post) => (
              <li key={post.id} className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 font-mono text-[0.54rem] uppercase tracking-[0.08em] ${
                      post.published
                        ? "border-emerald-700/25 bg-emerald-700/10 text-emerald-800"
                        : "border-line-2 bg-paper-2 text-ink-500"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                  {post.tag && (
                    <span className="rounded-full border border-accent/30 bg-accent-soft px-2 py-0.5 font-mono text-[0.54rem] uppercase tracking-[0.08em] text-accent-ink">
                      {post.tag}
                    </span>
                  )}
                  <span className="font-mono text-[0.58rem] uppercase tracking-[0.08em] text-ink-400">
                    {fmtDate(post.publishedAt ?? post.createdAt)}
                  </span>
                </div>

                <p className="mt-1.5 text-[0.84rem] text-ink-950">{post.title}</p>

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => edit(post)}
                    className="inline-flex h-7 items-center gap-1 rounded-full border border-line-2 px-2.5 font-mono text-[0.56rem] uppercase tracking-[0.08em] text-ink-600 transition-colors hover:border-ink-950 hover:text-ink-950"
                  >
                    <PencilSimple size={11} weight="bold" aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePublish(post)}
                    className="inline-flex h-7 items-center rounded-full border border-line-2 px-2.5 font-mono text-[0.56rem] uppercase tracking-[0.08em] text-ink-600 transition-colors hover:border-ink-950 hover:text-ink-950"
                  >
                    {post.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(post)}
                    aria-label={`Delete ${post.title}`}
                    className="inline-flex h-7 items-center gap-1 rounded-full border border-line-2 px-2.5 font-mono text-[0.56rem] uppercase tracking-[0.08em] text-ink-600 transition-colors hover:border-red-700/40 hover:text-red-700"
                  >
                    <Trash size={11} weight="bold" aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
