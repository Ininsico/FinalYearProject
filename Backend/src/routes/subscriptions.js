import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import { resolveAccount } from '../middleware/account.js'
import { attachEntitlements } from '../middleware/entitlements.js'
import { env } from '../config/env.js'
import { findPlan, plansWithEntitlements, defaultPlanFor } from '../config/plans.js'
import { depositAddress } from '../lib/binance.js'
import {
  createIntent,
  findIntent,
  findOpenIntent,
  listIntents,
  reconcilePayments,
  serializeIntent,
} from '../lib/payments.js'
import { activateSubscription, entitlementsFor } from '../lib/subscriptions.js'
import { recordAudit } from '../lib/audit.js'

const router = Router()

/** Public: the plan catalogue, so marketing pages can render real prices. */
router.get('/plans', (req, res) => {
  const audience = ['student', 'institution'].includes(String(req.query.audience))
    ? String(req.query.audience)
    : null
  res.json({
    plans: plansWithEntitlements().filter((plan) => !audience || plan.audience === audience),
  })
})

router.use(requireAuth, resolveAccount, attachEntitlements)

/** The whole billing state of the account in one read. */
router.get('/', async (req, res) => {
  const entitlements = await entitlementsFor(req.account.type, req.account.id)
  const [open, intents] = await Promise.all([
    findOpenIntent(`${req.account.type}:${req.account.id}`),
    listIntents({ accountId: `${req.account.type}:${req.account.id}` }),
  ])

  res.json({
    account: { type: req.account.type, id: req.account.id },
    ...entitlements,
    plans: plansWithEntitlements().filter((plan) => plan.audience === req.account.type),
    providers: [
      {
        id: 'crypto',
        label: `Crypto (${env.binance.coin})`,
        available: env.binance.configured,
        asset: env.binance.coin,
        network: env.binance.network,
      },
    ],
    openIntent: serializeIntent(open),
    invoices: intents.slice(0, 25).map((intent) => ({
      id: String(intent._id),
      reference: intent.reference,
      planName: intent.planName,
      planId: intent.planId,
      provider: intent.provider,
      amount: intent.matchedTotal || intent.expectedAmount,
      asset: intent.asset,
      status: intent.status,
      createdAt: intent.createdAt,
      confirmedAt: intent.confirmedAt,
    })),
  })
})

const checkoutSchema = z.object({
  planId: z.string().min(1),
  provider: z.literal('crypto').optional(),
})

/** Start a paid period. The money goes through a crypto payment intent. */
router.post('/checkout', async (req, res, next) => {
  try {
    const parsed = checkoutSchema.safeParse(req.body ?? {})
    if (!parsed.success) return res.status(400).json({ error: 'Choose a valid plan' })

    const plan = findPlan(parsed.data.planId)
    if (!plan) return res.status(400).json({ error: 'Choose a valid plan' })
    if (plan.audience !== req.account.type) {
      return res.status(400).json({ error: `That plan is for ${plan.audience} accounts` })
    }
    if (plan.amountUsdt <= 0) {
      return res.status(400).json({ error: 'That plan is free — nothing to pay' })
    }

    const accountId = `${req.account.type}:${req.account.id}`
    const existing = await findOpenIntent(accountId)
    if (existing) {
      return res.status(409).json({
        error: 'This account already has a payment waiting',
        intent: serializeIntent(existing),
      })
    }

    if (!env.binance.configured) {
      return res.status(503).json({ error: 'Crypto payments are not configured' })
    }

    let address
    try {
      address = await depositAddress({ coin: env.binance.coin, network: env.binance.network })
    } catch (error) {
      return res.status(502).json({ error: `Could not load the deposit address: ${error.message}` })
    }

    const intent = await createIntent({
      user: { id: String(req.user._id), name: req.user.name, email: req.user.email },
      plan,
      accountId,
      accountType: req.account.type,
      asset: env.binance.coin,
      network: env.binance.network,
      address: address.address,
    })

    return res.status(201).json({ intent: serializeIntent(intent) })
  } catch (error) {
    next(error)
  }
})

const confirmSchema = z.object({ intentId: z.string().optional() })

/** Confirm the open payment and, if it landed, start the period. */
router.post('/confirm', async (req, res, next) => {
  try {
    const parsed = confirmSchema.safeParse(req.body ?? {})
    const accountId = `${req.account.type}:${req.account.id}`

    const target = parsed.success && parsed.data.intentId
      ? await findIntent(parsed.data.intentId)
      : await findOpenIntent(accountId)

    if (!target || target.accountId !== accountId) {
      return res.status(404).json({ error: 'No payment is waiting for this account' })
    }

    const result = await reconcilePayments()
    const updated = result.intents.find((row) => row.id === String(target._id)) ?? null
    const state = updated ?? target.toObject()

    if (state.status !== 'confirmed' && state.status !== 'overpaid') {
      return res.json({ settled: false, intent: serializeIntent(state) })
    }

    const subscription = await activateSubscription({
      accountType: req.account.type,
      id: req.account.id,
      planId: state.planId,
      provider: 'crypto',
      reference: state.consumedTxIds?.[0] ?? state.reference,
    })

    await recordAudit({
      actor: { id: String(req.user._id), email: req.user.email },
      action: 'subscription.activated',
      targetType: req.account.type,
      targetId: req.account.id,
      after: { planId: state.planId, reference: state.consumedTxIds?.[0] ?? state.reference },
    })

    return res.json({ settled: true, intent: serializeIntent(state), subscription })
  } catch (error) {
    next(error)
  }
})

router.post('/cancel', async (req, res, next) => {
  try {
    const { cancelSubscription } = await import('../lib/subscriptions.js')
    const subscription = await cancelSubscription(req.account.type, req.account.id)
    await recordAudit({
      actor: { id: String(req.user._id), email: req.user.email },
      action: 'subscription.canceled',
      targetType: req.account.type,
      targetId: req.account.id,
    })
    res.json({ subscription })
  } catch (error) {
    next(error)
  }
})

router.post('/resume', async (req, res, next) => {
  try {
    const { resumeSubscription } = await import('../lib/subscriptions.js')
    const subscription = await resumeSubscription(req.account.type, req.account.id)
    await recordAudit({
      actor: { id: String(req.user._id), email: req.user.email },
      action: 'subscription.resumed',
      targetType: req.account.type,
      targetId: req.account.id,
    })
    res.json({ subscription })
  } catch (error) {
    next(error)
  }
})

export default router
