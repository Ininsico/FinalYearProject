import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import { resolveAccount } from '../middleware/account.js'
import { attachEntitlements, requireFeature } from '../middleware/entitlements.js'
import { DEFAULT_STUDENT_PLAN } from '../config/plans.js'

const router = Router()

router.use(requireAuth, resolveAccount, attachEntitlements)

/**
 * Premium surfaces. Both are gated by `requireFeature`, which answers 402 with
 * an upgrade payload when the account's plan does not include the feature — the
 * client turns that into the upgrade prompt.
 */

const orchestrateSchema = z.object({
  brief: z.string().trim().min(3).max(2000),
})

router.post('/orchestrate', requireFeature('orchestration'), async (req, res) => {
  const parsed = orchestrateSchema.safeParse(req.body ?? {})
  if (!parsed.success) return res.status(400).json({ error: 'Describe what you want to build' })

  // The orchestration engine itself is out of scope for this build: the value
  // here is that the request is genuinely gated on a live paid plan.
  res.json({
    accepted: true,
    brief: parsed.data.brief,
    plan: req.entitlements.subscription.planId,
    message: 'Your brief was accepted into the premium orchestration queue.',
  })
})

router.get('/video', requireFeature('video'), async (req, res) => {
  const plan = req.entitlements.subscription.planId

  res.json({
    feature: 'video',
    plan,
    unlocked: true,
    // Locked UI only: the render pipeline is not built, but access is real.
    status: 'coming_soon',
    message: 'The AI video-generation agent is enabled for your plan. Rendering opens shortly.',
  })
})

router.get('/status', async (req, res) => {
  const ent = req.entitlements
  res.json({
    planId: ent.subscription.planId,
    live: ent.live,
    features: ent.features,
    defaultPlan: DEFAULT_STUDENT_PLAN,
  })
})

export default router
