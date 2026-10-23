import { Router } from 'express'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import User, { hashPassword } from '../models/User.js'
import Institution from '../models/Institution.js'
import { requireAdmin } from '../middleware/admin.js'
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
} from '../utils/tokens.js'
import { env } from '../config/env.js'
import { listIntents, markIntentPaid, serializeIntent } from '../lib/payments.js'
import { activateSubscription, getSubscription } from '../lib/subscriptions.js'
import { listAudit, recordAudit } from '../lib/audit.js'
import { plansWithEntitlements } from '../config/plans.js'
import Subscription from '../models/Subscription.js'

const router = Router()

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

function cookieMaxAge(token) {
  const exp = jwt.decode(token)?.exp
  if (!exp) return undefined
  return Math.max(0, (exp - Math.floor(Date.now() / 1000)) * 1000)
}

function setAdminCookies(res, accessToken, refreshToken) {
  const sameSite = env.cookieSameSite
  res.cookie('admin_access_token', accessToken, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite,
    maxAge: cookieMaxAge(accessToken),
  })
  res.cookie('admin_refresh_token', refreshToken, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite,
    maxAge: cookieMaxAge(refreshToken),
    path: '/api/admin/refresh',
  })
}

function clearAdminCookies(res) {
  res.clearCookie('admin_access_token')
  res.clearCookie('admin_refresh_token', { path: '/api/admin/refresh' })
}

async function issueAdminSession(res, user) {
  const accessToken = signAccessToken(user._id.toString(), 'admin')
  const refreshToken = signRefreshToken(user._id.toString())
  user.refreshTokens.push(hashToken(refreshToken))
  if (user.refreshTokens.length > 5) {
    user.refreshTokens = user.refreshTokens.slice(-5)
  }
  await user.save()
  setAdminCookies(res, accessToken, refreshToken)
  return user.toPublicJSON()
}

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid email or password' })
  }
  const { email, password } = parsed.data
  const user = await User.findOne({ email: email.toLowerCase() })
    .select('+passwordHash')
    .select('+refreshTokens')
  if (!user || user.role !== 'admin') {
    return res.status(401).json({ error: 'Invalid admin credentials' })
  }
  const ok = await user.verifyPassword(password)
  if (!ok) {
    return res.status(401).json({ error: 'Invalid admin credentials' })
  }
  const publicUser = await issueAdminSession(res, user)
  return res.json({ user: publicUser })
})

router.post('/refresh', async (req, res) => {
  const token = req.cookies?.admin_refresh_token
  if (!token) {
    return res.status(401).json({ error: 'No refresh token' })
  }
  let payload
  try {
    payload = verifyRefreshToken(token)
  } catch {
    return res.status(401).json({ error: 'Invalid refresh token' })
  }
  const user = await User.findById(payload.sub).select('+refreshTokens')
  if (!user) {
    return res.status(401).json({ error: 'Invalid refresh token' })
  }
  const hash = hashToken(token)
  if (!user.refreshTokens.includes(hash)) {
    user.refreshTokens = []
    await user.save()
    return res.status(401).json({ error: 'Refresh token revoked' })
  }
  user.refreshTokens = user.refreshTokens.filter((t) => t !== hash)
  const accessToken = signAccessToken(user._id.toString(), 'admin')
  const refreshToken = signRefreshToken(user._id.toString())
  user.refreshTokens.push(hashToken(refreshToken))
  if (user.refreshTokens.length > 5) {
    user.refreshTokens = user.refreshTokens.slice(-5)
  }
  await user.save()
  setAdminCookies(res, accessToken, refreshToken)
  return res.json({ ok: true })
})

router.post('/logout', async (req, res) => {
  const token = req.cookies?.admin_refresh_token
  if (token) {
    try {
      const payload = verifyRefreshToken(token)
      const user = await User.findById(payload.sub).select('+refreshTokens')
      if (user) {
        user.refreshTokens = user.refreshTokens.filter(
          (t) => t !== hashToken(token)
        )
        await user.save()
      }
    } catch {
      // ignore
    }
  }
  clearAdminCookies(res)
  return res.json({ ok: true })
})

router.get('/me', async (req, res) => {
  const token = req.cookies?.admin_access_token
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  try {
    const payload = verifyAccessToken(token)
    if (payload.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }
    const user = await User.findById(payload.sub)
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }
    return res.json({ user: user.toPublicJSON() })
  } catch {
    return res.status(401).json({ error: 'Session expired' })
  }
})

// --- User management (superadmin) ---

function serializeUser(u) {
  return {
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    role: u.role,
    isVerified: u.isVerified,
    institutionId: u.institutionId ? u.institutionId.toString() : null,
    institutionRole: u.institutionRole ?? null,
    planId: u.planId ?? null,
    createdAt: u.createdAt,
  }
}

const ROLE = z.enum(['student', 'institution', 'admin'])

const listQuery = z.object({
  q: z.string().trim().optional(),
  role: ROLE.optional(),
  verified: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
})

router.get('/users', requireAdmin, async (req, res) => {
  const { q, role, verified, page = 1, limit = 20 } = listQuery.parse(req.query)
  const filter = {}
  if (role) filter.role = role
  if (verified === 'true') filter.isVerified = true
  if (verified === 'false') filter.isVerified = false
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
    ]
  }
  const skip = (page - 1) * limit
  const [users, total] = await Promise.all([
    User.find(filter)
      .select('name email role isVerified createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ])
  res.json({ users: users.map(serializeUser), total, page, limit })
})

const updateUserSchema = z.object({
  role: ROLE.optional(),
  isVerified: z.boolean().optional(),
  planId: z.string().optional(),
})

router.patch('/users/:id', requireAdmin, async (req, res) => {
  const parsed = updateUserSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid update payload' })
  }
  const target = await User.findById(req.params.id)
  if (!target) return res.status(404).json({ error: 'User not found' })

  // Don't let an admin change their own role (avoids self-lockout).
  if (
    target._id.toString() === req.userId &&
    parsed.data.role &&
    parsed.data.role !== target.role
  ) {
    return res.status(400).json({ error: 'You cannot change your own role' })
  }

  const before = { role: target.role, isVerified: target.isVerified, planId: target.planId }

  if (parsed.data.role !== undefined) target.role = parsed.data.role
  if (parsed.data.isVerified !== undefined) target.isVerified = parsed.data.isVerified
  if (parsed.data.planId !== undefined) target.planId = parsed.data.planId
  await target.save()

  await recordAudit({
    actor: { id: req.userId, email: req.admin?.email },
    action: 'user.updated',
    targetType: 'user',
    targetId: target._id,
    before,
    after: { role: target.role, isVerified: target.isVerified, planId: target.planId },
  })

  return res.json({ user: serializeUser(target) })
})

router.delete('/users/:id', requireAdmin, async (req, res) => {
  const target = await User.findById(req.params.id)
  if (!target) return res.status(404).json({ error: 'User not found' })
  if (target._id.toString() === req.userId) {
    return res.status(400).json({ error: 'You cannot delete your own account' })
  }
  // Never delete the last remaining admin.
  if (target.role === 'admin') {
    const adminCount = await User.countDocuments({ role: 'admin' })
    if (adminCount <= 1) {
      return res.status(400).json({ error: 'Cannot delete the last admin' })
    }
  }
  await target.deleteOne()
  return res.json({ ok: true })
})

// --- Platform overview ---

router.get('/stats', requireAdmin, async (req, res) => {
  const [students, institutions, admins, subs, intents] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'institution' }),
    User.countDocuments({ role: 'admin' }),
    Subscription.countDocuments({ status: 'active' }),
    listIntents(),
  ])

  const confirmed = intents.filter((i) => i.status === 'confirmed' || i.status === 'overpaid')

  res.json({
    stats: {
      students,
      institutions,
      admins,
      activeSubscriptions: subs,
      payments: confirmed.length,
      revenue: Math.round(confirmed.reduce((sum, i) => sum + (i.matchedTotal || 0), 0) * 100) / 100,
    },
  })
})

// --- Plans ---

router.get('/plans', requireAdmin, (req, res) => {
  res.json({ plans: plansWithEntitlements() })
})

// --- Institutions ---

router.get('/institutions', requireAdmin, async (req, res) => {
  const institutions = await Institution.find().sort({ createdAt: -1 }).limit(200)

  const rows = await Promise.all(
    institutions.map(async (inst) => {
      const [members, subscription] = await Promise.all([
        User.countDocuments({ institutionId: inst._id }),
        getSubscription('institution', inst._id.toString()),
      ])
      return { ...inst.toPublicJSON(), members, subscription }
    })
  )

  res.json({ institutions: rows })
})

const updateInstitutionSchema = z.object({
  status: z.enum(['trialing', 'active', 'canceled', 'suspended']).optional(),
  seats: z.coerce.number().int().min(1).max(1000).optional(),
  planId: z.string().optional(),
})

router.patch('/institutions/:id', requireAdmin, async (req, res) => {
  const parsed = updateInstitutionSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid update payload' })

  const institution = await Institution.findById(req.params.id)
  if (!institution) return res.status(404).json({ error: 'Institution not found' })

  const before = { status: institution.status, seats: institution.seats, planId: institution.planId }

  if (parsed.data.status !== undefined) institution.status = parsed.data.status
  if (parsed.data.seats !== undefined) institution.seats = parsed.data.seats
  if (parsed.data.planId !== undefined) institution.planId = parsed.data.planId
  await institution.save()

  await recordAudit({
    actor: { id: req.userId },
    action: 'institution.updated',
    targetType: 'institution',
    targetId: institution._id,
    before,
    after: { status: institution.status, seats: institution.seats, planId: institution.planId },
  })

  res.json({ institution: institution.toPublicJSON() })
})

// --- Subscriptions ---

router.get('/subscriptions', requireAdmin, async (req, res) => {
  const subs = await Subscription.find().sort({ updatedAt: -1 }).limit(200)
  res.json({ subscriptions: subs.map((s) => s.toObject()) })
})

const activateSchema = z.object({
  planId: z.string().optional(),
  reference: z.string().optional(),
})

router.post('/subscriptions/:accountId/activate', requireAdmin, async (req, res) => {
  const parsed = activateSchema.safeParse(req.body ?? {})
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' })

  const subscription = await Subscription.findOne({ accountId: req.params.accountId })
  if (!subscription) return res.status(404).json({ error: 'Subscription not found' })

  const updated = await activateSubscription({
    accountType: subscription.accountType,
    id: subscription.accountId.split(':')[1],
    planId: parsed.data.planId ?? subscription.planId,
    provider: 'admin',
    reference: parsed.data.reference ?? `admin-${Date.now()}`,
  })

  await recordAudit({
    actor: { id: req.userId },
    action: 'subscription.activated_by_admin',
    targetType: 'subscription',
    targetId: subscription.accountId,
    after: { planId: updated?.planId },
  })

  res.json({ subscription: updated })
})

// --- Payments ---

router.get('/payments', requireAdmin, async (req, res) => {
  const intents = await listIntents()
  res.json({ payments: intents.slice(0, 200).map(serializeIntent) })
})

/** Demo settle: mark a crypto intent paid without waiting for a chain deposit. */
router.post('/payments/:id/settle', requireAdmin, async (req, res) => {
  const intent = await markIntentPaid({
    id: req.params.id,
    reference: `admin-demo-${Date.now()}`,
    note: 'Settled by an administrator (demo).',
    demo: true,
  })

  if (!intent) return res.status(404).json({ error: 'Payment not found' })

  const subscription = await activateSubscription({
    accountType: intent.accountType,
    id: String(intent.accountId).split(':')[1],
    planId: intent.planId,
    provider: 'crypto',
    reference: intent.consumedTxIds?.[0] ?? intent.reference,
  })

  await recordAudit({
    actor: { id: req.userId },
    action: 'payment.settled_by_admin',
    targetType: 'payment',
    targetId: intent._id,
    after: { planId: intent.planId },
  })

  res.json({ intent: serializeIntent(intent), subscription })
})

// --- Audit ---

router.get('/audit', requireAdmin, async (req, res) => {
  const events = await listAudit({ action: req.query.action, limit: req.query.limit })
  res.json({ events: events.map((e) => e.toObject()) })
})

export default router
