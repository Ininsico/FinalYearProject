import { useEffect, useState } from "react"
import { Warning } from "@phosphor-icons/react"
import { fetchNews } from "../../lib/news"
import Markdown from "../../components/Markdown"
import { InlineLoader } from "../../components/LoadingScreen"

const fmtDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })

export default function Newsletter() {
  const [posts, setPosts] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchNews()
      .then((data) => setPosts(data.posts ?? []))
      .catch((err) => setError(err.message))
  }, [])

  return (
    <>
      <div>
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-500">
          Newsletter
        </p>
        <h1 className="display mt-2 text-step-2 text-ink-950">From Fablet.</h1>
      </div>

      {error && (
        <p role="alert" className="mt-4 flex items-start gap-2 text-[0.82rem] text-red-700">
          <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {!posts && !error && (
        <p className="mt-6">
          <InlineLoader label="Loading the newsletter" />
        </p>
      )}

      {posts?.length === 0 && (
        <div className="mt-5 rounded-[15px] border border-dashed border-line-2 bg-paper-2 px-5 py-8">
          <p className="text-[0.84rem] leading-relaxed text-ink-700">
            No posts yet. When Fablet publishes a newsletter, it will appear here in your account.
          </p>
        </div>
      )}

      <div className="mt-5 space-y-4">
        {posts?.map((post) => (
          <article key={post.id} className="rounded-[15px] border border-line bg-paper p-5">
            <div className="flex flex-wrap items-center gap-2">
              {post.tag && (
                <span className="rounded-full border border-accent/30 bg-accent-soft px-2.5 py-0.5 font-mono text-[0.56rem] uppercase tracking-[0.08em] text-accent-ink">
                  {post.tag}
                </span>
              )}
              <time
                dateTime={post.publishedAt ?? post.createdAt}
                className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-ink-400"
              >
                {fmtDate(post.publishedAt ?? post.createdAt)}
              </time>
            </div>

            <h2 className="display mt-2.5 text-step-1 text-ink-950">{post.title}</h2>
            <Markdown text={post.body} className="mt-2.5 max-w-[78ch] text-[0.88rem]" />
          </article>
        ))}
      </div>
    </>
  )
}
