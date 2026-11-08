import { Router } from 'express'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import User, { hashPassword } from '../models/User.js'
import Institution from '../models/Institution.js'
import { requireAdmin } from '../middleware/admin.js'
import { uploadAvatar, removeAvatar, cloudinaryConfigured } from '../lib/cloudinary.js'
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
} from '../utils/tokens.js'
import { env } from '../config/env.js'
import { listIntents, markIntentPaid, serializeIntent } from '../lib/payments.js'
import {
  activateSubscription,
  cancelSubscription,
  getSubscription,
  resumeSubscription,
} from '../lib/subscriptions.js'
import { listAudit, recordAudit } from '../lib/audit.js'
import { FEATURES } from '../config/plans.js'
import { allPlans, planById, planEntitlementsOf, reloadPlanStore } from '../lib/planStore.js'
import Subscription from '../models/Subscription.js'
import Plan from '../models/Plan.js'
import Course from '../models/Course.js'
import {
  serializeCourse,
  courseStats,
  courseFieldsSchema,
  coursePatchSchema,
} from '../lib/coursePayload.js'
import {
  generateDescription,
  generateLessonContent,
  generateKnowledgeGraph,
  generateQuiz,
} from '../lib/aiCourse.js'
import { makeCourseStructureHandlers } from '../lib/courseSections.js'
import { aiConfigured } from '../lib/ai.js'
import { consumeAiQuota } from '../lib/aiQuota.js'
import { callAiUpload } from '../lib/aiService.js'

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
    avatarUrl: u.avatarUrl ?? null,
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
      .select('name email role isVerified createdAt avatarUrl')
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

// --- Profile pictures (Cloudinary) ---

const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/webp']
    if (allowed.includes(file.mimetype)) return cb(null, true)
    cb(new Error('Only PNG, JPEG or WebP images are allowed'))
  },
})

function acceptAvatar(req, res, next) {
  avatarUpload.single('avatar')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message })
    next()
  })
}

router.post('/users/:id/avatar', requireAdmin, acceptAvatar, async (req, res) => {
  const target = await User.findById(req.params.id)
  if (!target) return res.status(404).json({ error: 'User not found' })
  if (!req.file) return res.status(400).json({ error: 'Attach an image in the "avatar" field' })
  if (!cloudinaryConfigured()) {
    return res.status(503).json({ error: 'Image storage is not configured' })
  }

  try {
    const result = await uploadAvatar(req.file.buffer, target._id.toString())
    target.avatarUrl = result.secure_url
    target.avatarPublicId = result.public_id
    await target.save()

    await recordAudit({
      actor: { id: req.userId, email: req.admin?.email },
      action: 'user.avatar_updated',
      targetType: 'user',
      targetId: target._id,
      after: { avatarUrl: result.secure_url },
    })

    return res.json({ user: serializeUser(target) })
  } catch (err) {
    console.error('[avatar] upload failed:', err?.message || err)
    return res.status(502).json({ error: 'Could not upload the image' })
  }
})

router.delete('/users/:id/avatar', requireAdmin, async (req, res) => {
  const target = await User.findById(req.params.id)
  if (!target) return res.status(404).json({ error: 'User not found' })

  if (target.avatarPublicId) {
    try {
      await removeAvatar(target.avatarPublicId)
    } catch (err) {
      console.error('[avatar] delete failed:', err?.message || err)
    }
  }
  target.avatarUrl = null
  target.avatarPublicId = null
  await target.save()

  await recordAudit({
    actor: { id: req.userId, email: req.admin?.email },
    action: 'user.avatar_removed',
    targetType: 'user',
    targetId: target._id,
  })

  res.json({ user: serializeUser(target) })
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
  res.json({ plans: allPlans(), features: FEATURES })
})

const planUpdateSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  amountUsdt: z.coerce.number().min(0).max(1000000).optional(),
  period: z.string().trim().min(1).max(40).optional(),
  summary: z.string().trim().max(400).optional(),
  seats: z.coerce.number().int().min(0).max(10000).optional(),
  features: z.array(z.string().trim().min(1)).max(12).optional(),
  highlights: z.array(z.string().trim().min(1).max(120)).max(20).optional(),
})

router.patch('/plans/:planId', requireAdmin, async (req, res) => {
  const parsed = planUpdateSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid plan payload' })

  const data = parsed.data
  const unknown = (data.features ?? []).filter((f) => !FEATURES.includes(f))
  if (unknown.length) {
    return res.status(400).json({ error: `Unknown feature(s): ${unknown.join(', ')}` })
  }

  const plan = await Plan.findOne({ planId: req.params.planId })
  if (!plan) return res.status(404).json({ error: 'Plan not found' })

  const before = {
    name: plan.name,
    amountUsdt: plan.amountUsdt,
    period: plan.period,
    summary: plan.summary,
    seats: plan.entitlements?.seats,
    features: plan.entitlements?.features,
    highlights: plan.highlights,
  }

  if (data.name !== undefined) plan.name = data.name
  if (data.amountUsdt !== undefined) plan.amountUsdt = data.amountUsdt
  if (data.period !== undefined) plan.period = data.period
  if (data.summary !== undefined) plan.summary = data.summary
  if (data.seats !== undefined) plan.set('entitlements.seats', data.seats)
  if (data.features !== undefined) plan.set('entitlements.features', data.features)
  if (data.highlights !== undefined) plan.highlights = data.highlights

  await plan.save()
  await reloadPlanStore()

  await recordAudit({
    actor: { id: req.userId, email: req.admin?.email },
    action: 'plan.updated',
    targetType: 'plan',
    targetId: plan.planId,
    before,
    after: {
      name: plan.name,
      amountUsdt: plan.amountUsdt,
      period: plan.period,
      summary: plan.summary,
      seats: plan.entitlements?.seats,
      features: plan.entitlements?.features,
      highlights: plan.highlights,
    },
  })

  res.json({ plan: planById(plan.planId) })
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

const planMap = () => new Map(allPlans().map((p) => [p.id, p]))

function serializeSubscription(row) {
  const plan = planMap().get(row.planId)
  return {
    accountId: row.accountId,
    accountType: row.accountType,
    planId: row.planId,
    planName: plan?.name ?? row.planId,
    amountUsdt: plan?.amountUsdt ?? 0,
    status: row.status,
    seats: row.seats,
    provider: row.provider,
    currentPeriodStart: row.currentPeriodStart,
    currentPeriodEnd: row.currentPeriodEnd,
    trialEndsAt: row.trialEndsAt,
    canceledAt: row.canceledAt,
    activatedAt: row.activatedAt,
    lastPaymentReference: row.lastPaymentReference,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    entitlements: plan?.entitlements ?? { seats: 1, features: [] },
    history: row.history ?? [],
  }
}

async function accountsForSubscriptions(subs) {
  const ids = (type) =>
    subs.filter((s) => s.accountType === type).map((s) => s.accountId.split(':')[1])
  const [users, institutions] = await Promise.all([
    User.find({ _id: { $in: ids('user') } }).select('name email role'),
    Institution.find({ _id: { $in: ids('institution') } }).select('name contactEmail status'),
  ])
  const map = new Map()
  for (const u of users) {
    map.set(`user:${u._id}`, { name: u.name, email: u.email, role: u.role })
  }
  for (const inst of institutions) {
    map.set(`institution:${inst._id}`, {
      name: inst.name,
      email: inst.contactEmail,
      role: 'institution',
      status: inst.status,
    })
  }
  return map
}

const subListQuery = z.object({
  q: z.string().trim().optional(),
  status: z.enum(['trialing', 'active', 'canceled', 'expired']).optional(),
  type: z.enum(['user', 'institution']).optional(),
})

router.get('/subscriptions', requireAdmin, async (req, res) => {
  const { q, status, type } = subListQuery.parse(req.query)
  const filter = {}
  if (status) filter.status = status
  if (type) filter.accountType = type
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    const [users, institutions] = await Promise.all([
      User.find({ $or: [{ name: rx }, { email: rx }] }).select('_id').limit(50),
      Institution.find({ $or: [{ name: rx }, { contactEmail: rx }, { domain: rx }] })
        .select('_id')
        .limit(50),
    ])
    filter.accountId = {
      $in: [
        ...users.map((u) => `user:${u._id}`),
        ...institutions.map((i) => `institution:${i._id}`),
        ...(q.startsWith('user:') || q.startsWith('institution:') ? [q] : []),
      ],
    }
  }

  const subs = await Subscription.find(filter).sort({ updatedAt: -1 }).limit(200)
  const accounts = await accountsForSubscriptions(subs)

  res.json({
    subscriptions: subs.map((s) => ({
      ...serializeSubscription(s),
      account: accounts.get(s.accountId) ?? null,
    })),
    total: subs.length,
  })
})

router.get('/subscriptions/analytics', requireAdmin, async (req, res) => {
  const [subs, intents] = await Promise.all([
    Subscription.find().sort({ updatedAt: -1 }).limit(2000),
    listIntents(),
  ])

  const plans = new Map(allPlans().map((p) => [p.id, p]))
  const byStatus = { trialing: 0, active: 0, canceled: 0, expired: 0 }
  const byType = { user: 0, institution: 0 }
  const byPlan = new Map()
  const now = Date.now()
  const soon = now + 7 * 86400000
  const trialsEndingSoon = []
  let mrrMonthlyUsdt = 0

  for (const sub of subs) {
    if (byStatus[sub.status] === undefined) byStatus[sub.status] = 0
    byStatus[sub.status] += 1
    if (byType[sub.accountType] === undefined) byType[sub.accountType] = 0
    byType[sub.accountType] += 1

    const plan = plans.get(sub.planId)
    if (!byPlan.has(sub.planId)) {
      byPlan.set(sub.planId, {
        planId: sub.planId,
        name: plan?.name ?? sub.planId,
        amountUsdt: plan?.amountUsdt ?? 0,
        count: 0,
        active: 0,
      })
    }
    const entry = byPlan.get(sub.planId)
    entry.count += 1

    if (sub.status === 'active') {
      entry.active += 1
      mrrMonthlyUsdt += plan?.amountUsdt ?? 0
    }

    if (sub.status === 'trialing' && sub.trialEndsAt) {
      const end = Date.parse(sub.trialEndsAt)
      if (end > now && end <= soon) {
        trialsEndingSoon.push({
          accountId: sub.accountId,
          planName: plan?.name ?? sub.planId,
          trialEndsAt: sub.trialEndsAt,
        })
      }
    }
  }

  trialsEndingSoon.sort((a, b) => Date.parse(a.trialEndsAt) - Date.parse(b.trialEndsAt))

  const confirmed = intents.filter((i) => i.status === 'confirmed' || i.status === 'overpaid')
  const revenueUsdt = confirmed.reduce((sum, i) => sum + (i.matchedTotal || 0), 0)
  const revenue30dUsdt = confirmed
    .filter((i) => i.confirmedAt && now - Date.parse(i.confirmedAt) <= 30 * 86400000)
    .reduce((sum, i) => sum + (i.matchedTotal || 0), 0)

  const recentChanges = await listAudit({ targetType: 'subscription', limit: 12 })

  // Last six months of revenue and signups, for the dashboard charts.
  const monthKey = (iso) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }
  const anchor = new Date()
  anchor.setDate(1)
  anchor.setHours(0, 0, 0, 0)
  const months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(anchor)
    d.setMonth(d.getMonth() - i)
    months.push({ key: monthKey(d), month: d.toLocaleDateString(undefined, { month: 'short' }) })
  }
  const revenueByMonth = months.map((m) => ({ month: m.month, amount: 0 }))
  const revenueIndex = new Map(months.map((m, i) => [m.key, revenueByMonth[i]]))
  for (const intent of confirmed) {
    const at = intent.confirmedAt ?? intent.createdAt
    if (!at) continue
    const bucket = revenueIndex.get(monthKey(at))
    if (bucket) bucket.amount = Math.round((bucket.amount + (intent.matchedTotal || 0)) * 100) / 100
  }
  const newSubsByMonth = months.map((m) => ({ month: m.month, count: 0 }))
  const subsIndex = new Map(months.map((m, i) => [m.key, newSubsByMonth[i]]))
  for (const sub of subs) {
    if (!sub.createdAt) continue
    const bucket = subsIndex.get(monthKey(sub.createdAt))
    if (bucket) bucket.count += 1
  }

  res.json({
    totals: {
      subscriptions: subs.length,
      active: byStatus.active,
      trialing: byStatus.trialing,
      canceled: byStatus.canceled,
      expired: byStatus.expired,
      mrrMonthlyUsdt: Math.round(mrrMonthlyUsdt * 100) / 100,
      revenueUsdt: Math.round(revenueUsdt * 100) / 100,
      revenue30dUsdt: Math.round(revenue30dUsdt * 100) / 100,
      paidPayments: confirmed.length,
    },
    byType,
    byPlan: [...byPlan.values()].sort((a, b) => b.count - a.count),
    revenueByMonth,
    newSubsByMonth,
    trialsEndingSoon: trialsEndingSoon.slice(0, 8),
    recentPayments: intents.slice(0, 8).map(serializeIntent),
    recentChanges: recentChanges.map((e) => ({
      action: e.action,
      actor: e.actorEmail,
      at: e.at,
      targetId: e.targetId,
    })),
  })
})

router.get('/subscriptions/:accountId', requireAdmin, async (req, res) => {
  const { accountId } = req.params
  const subscription = await Subscription.findOne({ accountId })
  if (!subscription) return res.status(404).json({ error: 'Subscription not found' })

  const rawId = accountId.split(':')[1]
  let account = null
  if (subscription.accountType === 'user') {
    const user = await User.findById(rawId).select('name email role isVerified createdAt')
    if (user) {
      account = {
        type: 'user',
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      }
    }
  } else {
    const institution = await Institution.findById(rawId)
    if (institution) {
      account = {
        type: 'institution',
        members: await User.countDocuments({ institutionId: institution._id }),
        ...institution.toPublicJSON(),
      }
    }
  }

  const [audit, intents] = await Promise.all([
    listAudit({ targetId: accountId, limit: 50 }),
    listIntents(),
  ])
  const payments = intents
    .filter((i) => i.accountId === accountId)
    .slice(0, 25)
    .map(serializeIntent)

  res.json({
    subscription: serializeSubscription(subscription),
    account,
    payments,
    audit: audit.map((e) => e.toObject()),
  })
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

  await activateSubscription({
    accountType: subscription.accountType,
    id: subscription.accountId.split(':')[1],
    planId: parsed.data.planId ?? subscription.planId,
    provider: 'admin',
    reference: parsed.data.reference ?? `admin-${Date.now()}`,
  })

  const fresh = await Subscription.findOne({ accountId: req.params.accountId })

  await recordAudit({
    actor: { id: req.userId, email: req.admin?.email },
    action: 'subscription.activated_by_admin',
    targetType: 'subscription',
    targetId: subscription.accountId,
    after: { planId: fresh?.planId },
  })

  res.json({ subscription: serializeSubscription(fresh) })
})

router.post('/subscriptions/:accountId/cancel', requireAdmin, async (req, res) => {
  const subscription = await Subscription.findOne({ accountId: req.params.accountId })
  if (!subscription) return res.status(404).json({ error: 'Subscription not found' })

  await cancelSubscription(subscription.accountType, subscription.accountId.split(':')[1])
  const fresh = await Subscription.findOne({ accountId: req.params.accountId })

  await recordAudit({
    actor: { id: req.userId, email: req.admin?.email },
    action: 'subscription.canceled_by_admin',
    targetType: 'subscription',
    targetId: subscription.accountId,
    after: { status: 'canceled' },
  })

  res.json({ subscription: serializeSubscription(fresh) })
})

router.post('/subscriptions/:accountId/resume', requireAdmin, async (req, res) => {
  const subscription = await Subscription.findOne({ accountId: req.params.accountId })
  if (!subscription) return res.status(404).json({ error: 'Subscription not found' })

  await resumeSubscription(subscription.accountType, subscription.accountId.split(':')[1])
  const fresh = await Subscription.findOne({ accountId: req.params.accountId })

  await recordAudit({
    actor: { id: req.userId, email: req.admin?.email },
    action: 'subscription.resumed_by_admin',
    targetType: 'subscription',
    targetId: subscription.accountId,
    after: { status: fresh?.status },
  })

  res.json({ subscription: serializeSubscription(fresh) })
})

const updateSubscriptionSchema = z.object({
  planId: z.string().trim().min(1).optional(),
  status: z.enum(['trialing', 'active', 'canceled', 'expired']).optional(),
  seats: z.coerce.number().int().min(1).max(1000).optional(),
  currentPeriodStart: z.string().trim().min(1).optional(),
  currentPeriodEnd: z.string().trim().min(1).optional(),
})

function toIso(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

router.patch('/subscriptions/:accountId', requireAdmin, async (req, res) => {
  const parsed = updateSubscriptionSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid update payload' })

  const subscription = await Subscription.findOne({ accountId: req.params.accountId })
  if (!subscription) return res.status(404).json({ error: 'Subscription not found' })

  const data = parsed.data
  const before = {
    planId: subscription.planId,
    status: subscription.status,
    seats: subscription.seats,
    currentPeriodStart: subscription.currentPeriodStart,
    currentPeriodEnd: subscription.currentPeriodEnd,
  }

  const changes = []

  if (data.planId && data.planId !== subscription.planId) {
    const plan = planById(data.planId)
    if (!plan) return res.status(400).json({ error: 'Unknown plan' })
    subscription.planId = plan.id
    subscription.seats = planEntitlementsOf(plan.id).seats
    changes.push(`plan → ${plan.name}`)
  }

  if (data.seats !== undefined && data.seats !== subscription.seats) {
    subscription.seats = data.seats
    changes.push(`seats → ${data.seats}`)
  }

  if (data.status && data.status !== subscription.status) {
    subscription.status = data.status
    subscription.canceledAt = data.status === 'canceled' ? new Date().toISOString() : null
    if (data.status === 'active' && !subscription.activatedAt) {
      subscription.activatedAt = new Date().toISOString()
    }
    changes.push(`status → ${data.status}`)
  }

  for (const key of ['currentPeriodStart', 'currentPeriodEnd']) {
    if (!data[key]) continue
    const iso = toIso(data[key])
    if (!iso) return res.status(400).json({ error: `Invalid date for ${key}` })
    if (iso !== subscription[key]) {
      subscription[key] = iso
      changes.push(`${key} → ${iso.slice(0, 10)}`)
    }
  }

  if (!changes.length) {
    return res.json({ subscription: serializeSubscription(subscription), changed: false })
  }

  subscription.history = [
    {
      at: new Date().toISOString(),
      action: 'subscription.updated_by_admin',
      detail: changes.join(' · '),
    },
    ...(subscription.history ?? []),
  ].slice(0, 100)

  await subscription.save()

  await recordAudit({
    actor: { id: req.userId, email: req.admin?.email },
    action: 'subscription.updated',
    targetType: 'subscription',
    targetId: subscription.accountId,
    before,
    after: {
      planId: subscription.planId,
      status: subscription.status,
      seats: subscription.seats,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
    },
  })

  res.json({ subscription: serializeSubscription(subscription), changed: true })
})

// --- Courses (admin management) ---

const adminCourseQuery = z.object({
  q: z.string().trim().optional(),
  status: z.enum(['draft', 'published']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(48).optional().default(20),
})

router.get('/courses', requireAdmin, async (req, res) => {
  const { q, status, page, limit } = adminCourseQuery.parse(req.query)
  const filter = {}
  if (status) filter.status = status
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ title: rx }, { subject: rx }, { summary: rx }]
  }

  const skip = (page - 1) * limit
  const [courses, total] = await Promise.all([
    Course.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit),
    Course.countDocuments(filter),
  ])
  const institutionIds = [...new Set(courses.map((c) => c.institutionId).filter(Boolean).map(String))]
  const institutions = await Institution.find({ _id: { $in: institutionIds } }).select('name')
  const names = new Map(institutions.map((i) => [String(i._id), i.name]))

  res.json({
    courses: courses.map((c) =>
      serializeCourse(c, {
        institutionName: c.institutionId ? names.get(String(c.institutionId)) ?? null : null,
        ...courseStats(c),
      })
    ),
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    aiEnabled: aiConfigured(),
  })
})

router.get('/courses/:id', requireAdmin, async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (!course) return res.status(404).json({ error: 'Course not found' })
  res.json({
    course: serializeCourse(course, { includeKnowledge: true, ...courseStats(course) }),
    aiEnabled: aiConfigured(),
  })
})

function sendAiError(res, error) {
  return res.status(error.status || 502).json({ error: error.message })
}

/** Interception: every AI action consumes the caller's daily budget first. */
async function interceptAi(req, res) {
  const quota = await consumeAiQuota('admin', req.userId, env.ai.dailyLimitUser)
  if (!quota.allowed) {
    res.status(429).json({
      error: `Daily AI limit reached (${quota.limit} calls). Try again tomorrow.`,
    })
    return false
  }
  return true
}

// Read a PDF / image / DOCX / text upload into its text (no LLM quota used).
const aiExtractUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
})

router.post('/ai/extract', requireAdmin, (req, res) => {
  aiExtractUpload.single('file')(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message })
    if (!req.file) return res.status(400).json({ error: 'Attach a file in the "file" field' })

    try {
      const result = await callAiUpload(
        '/extract',
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      )
      res.json(result)
    } catch (error) {
      res.status(error.status || 502).json({ error: error.message })
    }
  })
})

router.post('/courses/:id/ai/describe', requireAdmin, async (req, res) => {
  try {
    if (!(await interceptAi(req, res))) return
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ error: 'Course not found' })
    res.json(await generateDescription(course))
  } catch (error) {
    sendAiError(res, error)
  }
})

router.post('/courses/:id/ai/lesson', requireAdmin, async (req, res) => {
  try {
    if (!(await interceptAi(req, res))) return
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ error: 'Course not found' })
    const { sectionIndex = 0, lessonIndex = 0, instruction = '' } = req.body ?? {}
    res.json(
      await generateLessonContent(
        course,
        Number(sectionIndex),
        Number(lessonIndex),
        String(instruction)
      )
    )
  } catch (error) {
    sendAiError(res, error)
  }
})

router.post('/courses/:id/ai/graph', requireAdmin, async (req, res) => {
  try {
    if (!(await interceptAi(req, res))) return
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ error: 'Course not found' })
    res.json({ knowledgeGraph: await generateKnowledgeGraph(course) })
  } catch (error) {
    sendAiError(res, error)
  }
})

router.post('/courses/:id/ai/quiz', requireAdmin, async (req, res) => {
  try {
    if (!(await interceptAi(req, res))) return
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ error: 'Course not found' })
    const { sectionIndex = 0, lessonIndex = 0, types = null } = req.body ?? {}
    res.json(await generateQuiz(course, Number(sectionIndex), Number(lessonIndex), types))
  } catch (error) {
    sendAiError(res, error)
  }
})

// --- Course structure (sections & lessons, page-by-page editing) ---

const courseStructure = makeCourseStructureHandlers((req) => Course.findById(req.params.id))

router.post('/courses/:id/sections', requireAdmin, courseStructure.addSection)
router.patch('/courses/:id/sections/:si', requireAdmin, courseStructure.updateSection)
router.delete('/courses/:id/sections/:si', requireAdmin, courseStructure.deleteSection)
router.post('/courses/:id/sections/:si/lessons', requireAdmin, courseStructure.addLesson)
router.patch('/courses/:id/sections/:si/lessons/:li', requireAdmin, courseStructure.updateLesson)
router.delete('/courses/:id/sections/:si/lessons/:li', requireAdmin, courseStructure.deleteLesson)

router.post('/courses', requireAdmin, async (req, res) => {
  const parsed = courseFieldsSchema.safeParse(req.body ?? {})
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message })

  const course = await Course.create({
    ...parsed.data,
    institutionId: null,
    createdBy: req.userId,
    status: 'draft',
  })

  await recordAudit({
    actor: { id: req.userId, email: req.admin?.email },
    action: 'course.created',
    targetType: 'course',
    targetId: course._id,
    after: { title: course.title, subject: course.subject },
  })

  res.status(201).json({ course: serializeCourse(course, courseStats(course)) })
})

router.patch('/courses/:id', requireAdmin, async (req, res) => {
  const parsed = coursePatchSchema.safeParse(req.body ?? {})
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message })

  const course = await Course.findById(req.params.id)
  if (!course) return res.status(404).json({ error: 'Course not found' })

  const data = parsed.data
  const before = { title: course.title, status: course.status }

  for (const key of [
    'title',
    'subject',
    'summary',
    'description',
    'level',
    'topics',
    'lessons',
    'premium',
    'sponsored',
    'outcomes',
    'curriculum',
    'knowledge',
  ]) {
    if (data[key] !== undefined) course[key] = data[key]
  }
  if (data.status !== undefined && data.status !== course.status) {
    course.status = data.status
    course.publishedAt = data.status === 'published' ? new Date().toISOString() : null
  }
  await course.save()

  await recordAudit({
    actor: { id: req.userId, email: req.admin?.email },
    action: 'course.updated',
    targetType: 'course',
    targetId: course._id,
    before,
    after: { title: course.title, status: course.status },
  })

  res.json({ course: serializeCourse(course, courseStats(course)) })
})

router.delete('/courses/:id', requireAdmin, async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id)
  if (!course) return res.status(404).json({ error: 'Course not found' })

  await recordAudit({
    actor: { id: req.userId, email: req.admin?.email },
    action: 'course.deleted',
    targetType: 'course',
    targetId: course._id,
    before: { title: course.title },
  })

  res.json({ ok: true })
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
