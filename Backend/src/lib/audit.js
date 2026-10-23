import AuditEvent from '../models/AuditEvent.js'

/**
 * Append-only audit trail. Records who changed what, with the before/after
 * values where they matter. Never edited or deleted by any route.
 */
export async function recordAudit({ actor, action, targetType = null, targetId = null, before = null, after = null }) {
  try {
    await AuditEvent.create({
      actorId: actor?.id ?? null,
      actorEmail: actor?.email ?? null,
      action,
      targetType,
      targetId: targetId ? String(targetId) : null,
      before,
      after,
      at: new Date().toISOString(),
    })
  } catch (error) {
    // Auditing must never break the request it is describing.
    console.error('[audit] write failed:', error?.message || error)
  }
}

export function listAudit({ action, limit = 100 } = {}) {
  const filter = {}
  if (action) filter.action = action
  return AuditEvent.find(filter).sort({ at: -1 }).limit(Math.min(Number(limit) || 100, 500))
}
