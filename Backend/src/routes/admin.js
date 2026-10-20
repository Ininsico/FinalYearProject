import { Router } from 'express'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import User, { hashPassword } from '../models/User.js'
import { requireAdmin } from '../middleware/admin.js'
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
} from '../utils/tokens.js'
import { env } from '../config/env.js'

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
    createdAt: u.createdAt,
  }
}

const listQuery = z.object({
  q: z.string().trim().optional(),
  role: z.enum(['user', 'admin']).optional(),
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
  role: z.enum(['user', 'admin']).optional(),
  isVerified: z.boolean().optional(),
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
  if (parsed.data.role !== undefined) target.role = parsed.data.role
  if (parsed.data.isVerified !== undefined) target.isVerified = parsed.data.isVerified
  await target.save()
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

export default router
