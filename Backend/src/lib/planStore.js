import Plan from '../models/Plan.js'
import { PLANS } from '../config/plans.js'

/**
 * The live plan catalogue: database-backed (seeded from the static defaults)
 * with a synchronous in-memory cache, so pricing, checkout, activation and
 * entitlement checks all read the same editable source of truth.
 */
let cache = new Map()

const shape = (row) => ({
  id: row.planId,
  name: row.name,
  audience: row.audience,
  amountUsdt: row.amountUsdt,
  period: row.period,
  summary: row.summary ?? '',
  features: row.highlights ?? [],
  entitlements: {
    seats: row.entitlements?.seats ?? 1,
    features: row.entitlements?.features ?? [],
  },
})

const staticFallback = () =>
  new Map(
    PLANS.map((plan) => [
      plan.id,
      shape({
        planId: plan.id,
        name: plan.name,
        audience: plan.audience,
        amountUsdt: plan.amountUsdt,
        period: plan.period,
        summary: plan.summary,
        highlights: plan.features,
        entitlements: plan.entitlements,
      }),
    ])
  )

/** Seed missing plans from the static defaults (insert-only) and load the cache. */
export async function initPlanStore() {
  await Promise.all(
    PLANS.map((plan, index) =>
      Plan.updateOne(
        { planId: plan.id },
        {
          $setOnInsert: {
            planId: plan.id,
            name: plan.name,
            audience: plan.audience,
            amountUsdt: plan.amountUsdt,
            period: plan.period,
            summary: plan.summary,
            highlights: plan.features,
            entitlements: { seats: plan.entitlements.seats, features: plan.entitlements.features },
            order: index,
          },
        },
        { upsert: true }
      )
    )
  )
  await reloadPlanStore()
}

export async function reloadPlanStore() {
  const rows = await Plan.find().sort({ order: 1, planId: 1 })
  cache = new Map(rows.map((row) => [row.planId, shape(row.toObject())]))
}

const store = () => (cache.size ? cache : staticFallback())

export function allPlans() {
  return [...store().values()]
}

export function planById(planId) {
  return store().get(planId) ?? null
}

export function planEntitlementsOf(planId) {
  return planById(planId)?.entitlements ?? { seats: 1, features: [] }
}

export function plansForAudience(audience) {
  return allPlans().filter((plan) => !audience || plan.audience === audience)
}
