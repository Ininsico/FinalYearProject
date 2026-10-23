import Subscription from '../models/Subscription.js'
import { env } from '../config/env.js'
import {
  defaultPlanFor,
  findPlan,
  planEntitlements,
  FEATURES,
} from '../config/plans.js'

const addDays = (date, days) => new Date(date.getTime() + days * 86400000).toISOString()

export const accountKey = (accountType, id) => `${accountType}:${id}`

function normalize(row) {
  const plan = findPlan(row.planId) ?? findPlan(defaultPlanFor(row.accountType))
  const entitlements = planEntitlements(plan.id)
  return {
    accountId: row.accountId,
    accountType: row.accountType,
    planId: plan.id,
    planName: plan.name,
    amountUsdt: plan.amountUsdt,
    status: row.status,
    provider: row.provider,
    seats: row.seats,
    currentPeriodStart: row.currentPeriodStart,
    currentPeriodEnd: row.currentPeriodEnd,
    trialEndsAt: row.trialEndsAt,
    canceledAt: row.canceledAt,
    activatedAt: row.activatedAt,
    lastPaymentReference: row.lastPaymentReference,
    entitlements,
    features: entitlements.features,
    history: row.history ?? [],
  }
}

/** The subscription for an account, created as a trial on first read. */
export async function getSubscription(accountType, id) {
  const key = accountKey(accountType, id)
  const existing = await Subscription.findOne({ accountId: key })
  if (existing) return normalize(existing)

  const planId = defaultPlanFor(accountType)
  const plan = findPlan(planId)
  const now = new Date()
  const trialDays = env.subscriptions.trialDays

  // Students start on the free plan with no trial; institutions get a real trial.
  const isTrial = accountType === 'institution'

  const created = await Subscription.findOneAndUpdate(
    { accountId: key },
    {
      $setOnInsert: {
        accountId: key,
        accountType,
        planId,
        status: isTrial ? 'trialing' : 'active',
        provider: null,
        seats: planEntitlements(planId).seats,
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: isTrial ? addDays(now, trialDays) : null,
        trialEndsAt: isTrial ? addDays(now, trialDays) : null,
        history: [
          {
            at: now.toISOString(),
            action: isTrial ? 'trial.started' : 'account.created',
            detail: isTrial
              ? `${trialDays}-day trial of ${plan.name}`
              : `Free ${plan.name} account`,
          },
        ],
      },
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  )

  return normalize(created)
}

async function appendHistory(key, entry) {
  await Subscription.updateOne(
    { accountId: key },
    { $push: { history: { $each: [{ at: new Date().toISOString(), ...entry }], $position: 0, $slice: 100 } } }
  )
}

/**
 * Settle a subscription from a confirmed payment. Idempotent per payment
 * reference, so a retried webhook cannot extend the period twice.
 */
export async function activateSubscription({
  accountType,
  id,
  planId,
  provider,
  reference,
  periodDays = env.subscriptions.periodDays,
}) {
  const key = accountKey(accountType, id)
  const subscription = await Subscription.findOne({ accountId: key })
  if (!subscription) return null

  if (reference && subscription.lastPaymentReference === reference) return normalize(subscription)

  const plan = findPlan(planId) ?? findPlan(subscription.planId)
  const now = new Date()

  subscription.planId = plan.id
  subscription.status = 'active'
  subscription.provider = provider ?? subscription.provider ?? null
  subscription.seats = planEntitlements(plan.id).seats
  subscription.currentPeriodStart = now.toISOString()
  subscription.currentPeriodEnd = addDays(now, periodDays)
  subscription.trialEndsAt = null
  subscription.canceledAt = null
  subscription.activatedAt = now.toISOString()
  subscription.lastPaymentReference = reference ?? null
  subscription.history = [
    {
      at: now.toISOString(),
      action: 'subscription.activated',
      detail: `${plan.name} via ${provider ?? 'payment'} · ${periodDays} days`,
      reference: reference ?? null,
    },
    ...(subscription.history ?? []),
  ].slice(0, 100)

  await subscription.save()
  return normalize(subscription)
}

export async function cancelSubscription(accountType, id) {
  const key = accountKey(accountType, id)
  const subscription = await Subscription.findOne({ accountId: key })
  if (!subscription) return null

  subscription.status = 'canceled'
  subscription.canceledAt = new Date().toISOString()
  await subscription.save()
  await appendHistory(key, {
    action: 'subscription.canceled',
    detail: `Access continues until ${new Date(subscription.currentPeriodEnd).toDateString()}`,
  })

  return normalize(await Subscription.findById(subscription._id))
}

export async function resumeSubscription(accountType, id) {
  const key = accountKey(accountType, id)
  const subscription = await Subscription.findOne({ accountId: key })
  if (!subscription) return null

  subscription.status = subscription.trialEndsAt ? 'trialing' : 'active'
  subscription.canceledAt = null
  await subscription.save()
  await appendHistory(key, { action: 'subscription.resumed' })

  return normalize(await Subscription.findById(subscription._id))
}

const isLive = (subscription, now = Date.now()) =>
  subscription.status === 'active' ||
  (subscription.status === 'trialing' &&
    subscription.currentPeriodEnd &&
    Date.parse(subscription.currentPeriodEnd) > now)

/** The entitlement envelope an account currently holds. */
export async function entitlementsFor(accountType, id) {
  const subscription = await getSubscription(accountType, id)
  const live = isLive(subscription)

  return {
    subscription,
    live,
    expired: !live && (subscription.status === 'trialing' || subscription.status === 'active'),
    reason: live
      ? null
      : subscription.status === 'canceled'
        ? `The subscription was canceled on ${new Date(subscription.canceledAt).toDateString()}`
        : `The ${subscription.status} period ended on ${new Date(subscription.currentPeriodEnd).toDateString()}`,
    features: live ? subscription.features : [],
    seats: subscription.entitlements.seats,
    allFeatures: FEATURES,
  }
}

/** True when the account may use a premium feature right now. */
export async function hasFeature(accountType, id, feature) {
  const ent = await entitlementsFor(accountType, id)
  return ent.live && ent.features.includes(feature)
}

/** Thrown as a 402 so the client can send the user to the upgrade page. */
export function upgradeRequired(message, feature = null) {
  const error = new Error(message ?? 'This feature needs an active plan')
  error.status = 402
  error.code = 'upgrade_required'
  error.feature = feature
  return error
}
