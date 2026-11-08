const AI_URL = (process.env.AI_SERVICE_URL || 'http://127.0.0.1:8001').replace(/\/+$/, '')
const AI_KEY = process.env.AI_SERVICE_KEY || ''

/**
 * Client for the Fablet AI service (Flask + Chroma). The Node backend is the
 * only caller — the secret key keeps the service internal.
 */
export async function callAi(path, payload, timeoutMs = 90000) {
  let res
  try {
    res = await fetch(`${AI_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(AI_KEY ? { 'X-AI-Key': AI_KEY } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch {
    const error = new Error('AI service is offline — start Fablet/AI (python app.py)')
    error.status = 503
    throw error
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error(data.error || `AI service error (${res.status})`)
    error.status = res.status
    throw error
  }
  return data
}

/** Upload a file to the AI service (multipart) for text extraction. */
export async function callAiUpload(path, buffer, filename, mimetype) {
  const form = new FormData()
  form.append(
    'file',
    new Blob([buffer], { type: mimetype || 'application/octet-stream' }),
    filename || 'upload'
  )

  let res
  try {
    res = await fetch(`${AI_URL}${path}`, {
      method: 'POST',
      headers: { ...(AI_KEY ? { 'X-AI-Key': AI_KEY } : {}) },
      body: form,
      signal: AbortSignal.timeout(120000),
    })
  } catch {
    const error = new Error('AI service is offline — start Fablet/AI (python app.py)')
    error.status = 503
    throw error
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error(data.error || `AI service error (${res.status})`)
    error.status = res.status
    throw error
  }
  return data
}
