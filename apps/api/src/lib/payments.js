import { randomUUID } from 'node:crypto'
import PaymentIntent from '../models/PaymentIntent.js'
import { CREDITED_STATUSES, PAYMENT_WINDOW_MINUTES } from '../config/plans.js'
import { env } from '../config/env.js'
import { depositHistory } from './binance.js'

const round = (value, digits = 8) => {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function newReference() {
  const stamp = Date.now().toString(36).toUpperCase()
  const tail = randomUUID().slice(0, 4).toUpperCase()
  return `FBLT-${stamp}-${tail}`
}

/** Shape an intent for the client — nothing internal leaks. */
export function serializeIntent(intent) {
  if (!intent) return null
  const row = intent.toObject ? intent.toObject() : intent
  return {
    id: row._id ? String(row._id) : row.id,
    reference: row.reference,
    provider: row.provider,
    accountId: row.accountId,
    accountType: row.accountType,
    planId: row.planId,
    planName: row.planName,
    expectedAmount: row.expectedAmount,
    minAmount: row.minAmount,
    maxAmount: row.maxAmount,
    asset: row.asset,
    network: row.network,
    address: row.address,
    status: row.status,
    statusMessage: row.statusMessage,
    matchedTotal: row.matchedTotal,
    createdAt: row.createdAt,
    expiresAt: row.expiresAt,
    confirmedAt: row.confirmedAt,
    consumedTxIds: row.consumedTxIds ?? [],
    demo: Boolean(row.demo),
  }
}

export async function createIntent({
  user,
  plan,
  accountId,
  accountType,
  asset,
  network,
  address,
  kind = 'subscription',
  provider = 'crypto',
}) {
  const createdAt = new Date()
  const tolerancePercent = env.payments.tolerancePercent

  const intent = await PaymentIntent.create({
    reference: newReference(),
    provider,
    kind,
    accountId,
    accountType,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    planId: plan.id,
    planName: plan.name,
    planPeriod: plan.period,
    expectedAmount: plan.amountUsdt,
    tolerancePercent,
    minAmount: round(plan.amountUsdt * (1 - tolerancePercent / 100), 2),
    maxAmount: round(plan.amountUsdt * (1 + tolerancePercent / 100), 2),
    asset,
    network,
    address,
    status: 'awaiting_payment',
    statusMessage:
      'Send the exact amount to the address below. This page checks for it automatically.',
    matchedTotal: 0,
    consumedTxIds: [],
    attemptCount: 0,
    createdAt: createdAt.toISOString(),
    expiresAt: new Date(createdAt.getTime() + PAYMENT_WINDOW_MINUTES * 60000).toISOString(),
  })

  return intent
}

export function findIntent(id) {
  return PaymentIntent.findById(id)
}

export function findIntentByReference(reference) {
  if (!reference) return Promise.resolve(null)
  return PaymentIntent.findOne({
    $or: [{ reference }, { consumedTxIds: reference }],
  })
}

export function listIntents(filter = {}) {
  return PaymentIntent.find(filter).sort({ createdAt: -1 })
}

export function findOpenIntent(accountId) {
  return PaymentIntent.findOne({ accountId, status: 'awaiting_payment' }).sort({ createdAt: -1 })
}

/**
 * Settle an intent from a trusted source. Idempotent: a second call for an
 * already-confirmed intent changes nothing.
 */
export async function markIntentPaid({ id, reference, amount, note, demo = false }) {
  const intent = await PaymentIntent.findById(id)
  if (!intent) return null
  if (intent.status === 'confirmed' || intent.status === 'overpaid') return intent

  const paid = amount ?? intent.expectedAmount
  const settledAt = new Date().toISOString()

  intent.status = 'confirmed'
  intent.matchedTotal = round(paid)
  intent.confirmedAt = settledAt
  intent.checkedAt = settledAt
  intent.attemptCount = (intent.attemptCount ?? 0) + 1
  intent.paymentReference = reference ?? intent.paymentReference
  intent.demo = intent.demo || demo
  intent.statusMessage =
    note ??
    `Payment of ${round(paid)} ${intent.asset} confirmed. Your ${intent.planName} subscription is active.`

  if (reference && !intent.consumedTxIds.includes(reference)) {
    intent.consumedTxIds = [...intent.consumedTxIds, reference]
  }

  await intent.save()
  return intent
}

export async function markIntentStatus({ id, status, note }) {
  const intent = await PaymentIntent.findById(id)
  if (!intent || intent.status === status) return intent

  intent.status = status
  intent.checkedAt = new Date().toISOString()
  if (note) intent.statusMessage = note
  await intent.save()
  return intent
}

/**
 * Pure matching core — no I/O, so the money rules can be unit-tested.
 *
 * Deposits are credited oldest-intent-first, and a transaction can only ever be
 * claimed once across all intents, so two subscriptions cannot share one deposit.
 */
export function reconcileIntents({ intents, deposits, now = Date.now() }) {
  const usedTxIds = new Set()
  for (const intent of intents) {
    for (const txId of intent.consumedTxIds ?? []) usedTxIds.add(txId)
  }

  const working = intents.map((intent) => ({ ...intent }))
  const changed = []

  const credit = (deposit) =>
    CREDITED_STATUSES.has(Number(deposit.status)) &&
    Number(deposit.amount) > 0 &&
    !usedTxIds.has(deposit.txId)

  const oldestFirst = [...working].sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)))

  for (const intent of oldestFirst) {
    if (intent.status === 'confirmed' || intent.status === 'overpaid') continue

    intent.attemptCount = (intent.attemptCount ?? 0) + 1
    intent.checkedAt = new Date(now).toISOString()

    const windowStart = new Date(intent.createdAt).getTime() - 60000

    const candidates = deposits
      .filter((deposit) => credit(deposit) && new Date(deposit.insertTime ?? deposit.time).getTime() >= windowStart)
      .sort((a, b) => Number(a.insertTime ?? a.time) - Number(b.insertTime ?? b.time))

    const claimed = []
    let total = 0

    for (const candidate of candidates) {
      if (total >= intent.expectedAmount) break
      claimed.push(candidate)
      total += Number(candidate.amount)
    }

    if (total >= intent.minAmount) {
      intent.status = total > intent.maxAmount ? 'overpaid' : 'confirmed'
      intent.matchedTotal = round(total)
      intent.consumedTxIds = claimed.map((deposit) => deposit.txId)
      intent.confirmedAt = new Date(now).toISOString()
      intent.statusMessage =
        total > intent.maxAmount
          ? `Received ${round(total)} ${intent.asset} — more than expected. Contact the finance office to reconcile the difference.`
          : `Payment of ${round(total)} ${intent.asset} confirmed. Your subscription is active.`

      for (const deposit of claimed) usedTxIds.add(deposit.txId)
      changed.push(intent.id ?? String(intent._id))
      continue
    }

    if (total > 0) {
      intent.status = 'mismatch'
      intent.matchedTotal = round(total)
      intent.statusMessage = `Received ${round(total)} ${intent.asset}, which is below the ${intent.minAmount} ${intent.asset} minimum. Send the remaining ${round(intent.expectedAmount - total)} ${intent.asset} to complete it.`
      changed.push(intent.id ?? String(intent._id))
      continue
    }

    if (new Date(intent.expiresAt).getTime() < now) {
      intent.status = 'expired'
      intent.statusMessage = 'This payment window closed before the deposit arrived. Start a new payment.'
      changed.push(intent.id ?? String(intent._id))
    }
  }

  return { intents: working, changed }
}

/** Fetch live deposits and settle whatever can be settled. */
export async function reconcilePayments({ deposits, now } = {}) {
  const intents = await listIntents()
  const open = intents.filter((intent) => intent.status !== 'confirmed' && intent.status !== 'overpaid')

  let depositList = deposits

  if (!depositList) {
    if (!env.binance.configured || open.length === 0) {
      return { changed: [], intents }
    }

    const earliest = Math.min(...open.map((intent) => new Date(intent.createdAt).getTime()))
    depositList = await depositHistory({ coin: env.binance.coin, startTime: earliest })
  }

  const plain = intents.map((intent) => ({
    ...intent.toObject(),
    id: String(intent._id),
  }))

  const { intents: updated, changed } = reconcileIntents({ intents: plain, deposits: depositList, now })

  if (changed.length > 0) {
    for (const row of updated) {
      if (!changed.includes(row.id)) continue
      await PaymentIntent.findByIdAndUpdate(row.id, {
        status: row.status,
        matchedTotal: row.matchedTotal,
        consumedTxIds: row.consumedTxIds,
        statusMessage: row.statusMessage,
        confirmedAt: row.confirmedAt ?? null,
        checkedAt: row.checkedAt,
        attemptCount: row.attemptCount,
      })
    }
  }

  return { changed, intents: updated }
}
