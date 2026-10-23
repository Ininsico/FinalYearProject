import { entitlementsFor, upgradeRequired } from '../lib/subscriptions.js'

/**
 * Put the caller's entitlement envelope on the request so routes can read it
 * without re-fetching. `req.account` is `{ type, id }` and is set by
 * `resolveAccount` below.
 */
export async function attachEntitlements(req, res, next) {
  try {
    const account = req.account
    if (!account) return next()

    req.entitlements = await entitlementsFor(account.type, account.id)
    next()
  } catch (error) {
    next(error)
  }
}

/**
 * Gate a premium feature. Hiding a button is not enforcement, so this runs on
 * every premium endpoint and answers with a 402 the client can act on.
 */
export function requireFeature(feature) {
  return async (req, res, next) => {
    try {
      const account = req.account
      if (!account) return res.status(400).json({ error: 'No billing account resolved' })

      const ent = req.entitlements ?? (await entitlementsFor(account.type, account.id))

      if (!ent.live) {
        const error = upgradeRequired(ent.reason ?? 'Your plan is not active')
        return res.status(error.status).json({
          error: error.message,
          code: error.code,
          feature,
          entitlements: { live: ent.live, planId: ent.subscription.planId },
        })
      }

      if (!ent.features.includes(feature)) {
        const error = upgradeRequired(
          `The ${feature} feature needs a plan that includes it.`,
          feature
        )
        return res.status(error.status).json({
          error: error.message,
          code: error.code,
          feature,
          entitlements: { live: ent.live, planId: ent.subscription.planId, features: ent.features },
        })
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
