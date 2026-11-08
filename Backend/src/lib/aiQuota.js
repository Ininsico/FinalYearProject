import AiUsage from '../models/AiUsage.js'

/**
 * Per-scope daily AI quota. Counts live in Mongo so limits survive restarts;
 * every AI action must pass through here before touching the AI service.
 */
export async function consumeAiQuota(scope, id, limit) {
  const day = new Date().toISOString().slice(0, 10)
  const key = `${scope}:${id}:${day}`

  const doc = await AiUsage.findOneAndUpdate(
    { key },
    { $inc: { count: 1 } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  )

  return { allowed: doc.count <= limit, used: doc.count, limit, day }
}
