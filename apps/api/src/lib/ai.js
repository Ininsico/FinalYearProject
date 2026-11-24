import { env } from '../config/env.js'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
// Groq's catalogue rotates; these are the current OSS models. Override with
// GROQ_MODEL to pin a specific one.
const PRIMARY_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b'
const FALLBACK_MODEL = 'openai/gpt-oss-20b'

export const aiConfigured = () => Boolean(env.groqApiKey)

/** Chat completion via Groq's OpenAI-compatible API. */
export async function chat({ system, user, temperature = 0.5, maxTokens = 1200 }) {
  if (!aiConfigured()) {
    const error = new Error('AI is not configured — set GROQ_API_KEY')
    error.status = 503
    throw error
  }

  const models = [...new Set([PRIMARY_MODEL, FALLBACK_MODEL])]
  let lastStatus = 502

  for (const model of models) {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
    })

    if (res.ok) {
      const data = await res.json()
      return data.choices?.[0]?.message?.content?.trim() ?? ''
    }

    lastStatus = res.status
    const detail = await res.text().catch(() => '')
    console.error(`[ai] ${model} failed:`, res.status, detail.slice(0, 200))
    // Unknown/decommissioned model — try the next one; other errors are real.
    if (res.status !== 404) break
  }

  const error = new Error(`AI request failed (${lastStatus})`)
  error.status = 502
  throw error
}

/** Ask for a JSON answer and parse it defensively (handles code fences). */
export async function chatJson({ system, user, temperature = 0.3, maxTokens = 1500 }) {
  const raw = await chat({ system, user, temperature, maxTokens })
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  const body = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned
  try {
    return JSON.parse(body)
  } catch {
    const error = new Error('AI returned an unreadable response — try again')
    error.status = 502
    throw error
  }
}
