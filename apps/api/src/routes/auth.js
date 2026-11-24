import { Router } from 'express'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import User, { hashPassword } from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { uploadAvatar, removeAvatar, cloudinaryConfigured } from '../lib/cloudinary.js'
import {
  verifyRefreshToken,
  verifyResetToken,
  signResetToken,
  signVerificationToken,
  verifyVerificationToken,
  hashToken,
} from '../utils/tokens.js'
import { sendEmail, buildResetEmail, buildVerificationEmail } from '../utils/email.js'
import { env } from '../config/env.js'
import { clearAuthCookies, issueSession, refreshSession } from '../lib/session.js'

const router = Router()

const signupSchema = z
  .object({
    name: z.string().trim().min(1).max(80),
    email: z.string().trim().email(),
    password: z.string().min(8).max(200),
    confirm: z.string().min(8).max(200),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

router.post('/signup', async (req, res) => {
  const parsed = signupSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message })
  }
  const { name, email, password } = parsed.data
  try {
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' })
    }
    const user = new User({
      name,
      email: email.toLowerCase(),
      passwordHash: await hashPassword(password),
      isVerified: false,
    })
    await user.save()

    // Send activation email (account stays unverified until the link is clicked).
    try {
      const token = signVerificationToken(user._id.toString())
      const url = `${env.frontendOrigin}/auth/verify?token=${token}`
      const { subject, html } = buildVerificationEmail(url)
      await sendEmail({ to: user.email, subject, html })
    } catch (mailErr) {
      console.error('[auth] activation email failed:', mailErr?.message || mailErr)
    }

    // Do NOT issue a session — user must verify their email before logging in.
    return res.status(201).json({
      needsVerification: true,
      email: user.email,
      message: 'Account created. Check your email to activate your account.',
    })
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Email already registered' })
    }
    console.error('[auth] signup error', err)
    return res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid email or password' })
  }
  const { email, password } = parsed.data
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+passwordHash +refreshTokens'
  )
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  const ok = await user.verifyPassword(password)
  if (!ok) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  // Block sign-in until the account email is verified (admins are pre-verified).
  if (!user.isVerified && user.role !== 'admin') {
    return res.status(403).json({
      error: 'Please verify your email before logging in.',
      needsVerification: true,
      email: user.email,
    })
  }
  const publicUser = await issueSession(res, user)
  return res.json({ user: publicUser })
})

router.post('/refresh', async (req, res) => {
  const user = await refreshSession(req, res)
  if (!user) {
    return res.status(401).json({ error: 'No active session' })
  }
  return res.json({ ok: true, user: user.toPublicJSON() })
})

router.post('/logout', async (req, res) => {
  const token = req.cookies?.refresh_token
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
      // Ignore — still clear cookies.
    }
  }
  clearAuthCookies(res)
  return res.json({ ok: true })
})

router.get('/me', async (req, res) => {
  const token = req.cookies?.access_token
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  try {
    const payload = verifyAccessToken(token)
    const user = await User.findById(payload.sub)
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }
    return res.json({ user: user.toPublicJSON() })
  } catch {
    return res.status(401).json({ error: 'Session expired' })
  }
})

// --- Password reset (Brevo email + signed reset token) ---
const forgotSchema = z.object({ email: z.string().trim().email() })
const resetSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8).max(200),
    confirm: z.string().min(8).max(200),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })

router.post('/forgot-password', async (req, res) => {
  const parsed = forgotSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid email' })
  }
  const { email } = parsed.data
  const user = await User.findOne({ email: email.toLowerCase() })
  // Same response regardless of existence to avoid account enumeration.
  if (user) {
    try {
      const token = signResetToken(user._id.toString())
      const url = `${env.resetFrontendUrl}?token=${token}`
      const { subject, html } = buildResetEmail(url)
      await sendEmail({ to: user.email, subject, html })
    } catch (err) {
      console.error('[auth] reset email failed:', err?.message || err)
    }
  }
  return res.json({
    ok: true,
    message: 'If an account exists, a reset link has been sent.',
  })
})

router.post('/reset-password', async (req, res) => {
  const parsed = resetSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message })
  }
  const { token, password } = parsed.data
  let payload
  try {
    payload = verifyResetToken(token)
  } catch {
    return res.status(400).json({ error: 'Invalid or expired reset link' })
  }
  const user = await User.findById(payload.sub).select('+refreshTokens')
  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired reset link' })
  }
  user.passwordHash = await hashPassword(password)
  // Invalidate every existing session so the old password can't be reused.
  user.refreshTokens = []
  await user.save()
  return res.json({ ok: true })
})

// --- Email verification / account activation ---

const verifySchema = z.object({ token: z.string().min(1) })

router.post('/verify-email', async (req, res) => {
  const parsed = verifySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid activation link' })
  }
  let payload
  try {
    payload = verifyVerificationToken(parsed.data.token)
  } catch {
    return res.status(400).json({ error: 'Invalid or expired activation link' })
  }
  const user = await User.findById(payload.sub)
  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired activation link' })
  }
  if (user.isVerified) {
    return res.json({ ok: true, alreadyVerified: true })
  }
  user.isVerified = true
  // Verification also counts as activation — no extra session is issued; the
  // user still logs in with their password afterwards.
  await user.save()
  return res.json({ ok: true })
})

const resendSchema = z.object({ email: z.string().trim().email() })

router.post('/resend-verification', async (req, res) => {
  const parsed = resendSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid email' })
  }
  const { email } = parsed.data
  const user = await User.findOne({ email: email.toLowerCase() })
  // Generic response to avoid account enumeration.
  if (user && !user.isVerified) {
    try {
      const token = signVerificationToken(user._id.toString())
      const url = `${env.frontendOrigin}/auth/verify?token=${token}`
      const { subject, html } = buildVerificationEmail(url)
      await sendEmail({ to: user.email, subject, html })
    } catch (mailErr) {
      console.error('[auth] resend verification failed:', mailErr?.message || mailErr)
    }
  }
  return res.json({
    ok: true,
    message: 'If the email exists and is unverified, a new activation link was sent.',
  })
})

// --- Self-service profile ---

const profileSchema = z.object({
  name: z.string().trim().min(1).max(80),
})

router.patch('/profile', requireAuth, async (req, res) => {
  const parsed = profileSchema.safeParse(req.body ?? {})
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message })

  const user = await User.findById(req.userId)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  user.name = parsed.data.name
  await user.save()
  return res.json({ user: user.toPublicJSON() })
})

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

router.post('/avatar', requireAuth, acceptAvatar, async (req, res) => {
  const user = await User.findById(req.userId)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!req.file) return res.status(400).json({ error: 'Attach an image in the "avatar" field' })
  if (!cloudinaryConfigured()) {
    return res.status(503).json({ error: 'Image storage is not configured' })
  }

  try {
    const result = await uploadAvatar(req.file.buffer, user._id.toString())
    user.avatarUrl = result.secure_url
    user.avatarPublicId = result.public_id
    await user.save()
    return res.json({ user: user.toPublicJSON() })
  } catch (err) {
    console.error('[avatar] upload failed:', err?.message || err)
    return res.status(502).json({ error: 'Could not upload the image' })
  }
})

router.delete('/avatar', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  if (user.avatarPublicId) {
    try {
      await removeAvatar(user.avatarPublicId)
    } catch (err) {
      console.error('[avatar] delete failed:', err?.message || err)
    }
  }
  user.avatarUrl = null
  user.avatarPublicId = null
  await user.save()
  return res.json({ user: user.toPublicJSON() })
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(200),
    confirm: z.string().min(8).max(200),
  })
  .refine((d) => d.newPassword === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })

router.post('/change-password', requireAuth, async (req, res) => {
  const parsed = passwordSchema.safeParse(req.body ?? {})
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message })

  const user = await User.findById(req.userId).select('+passwordHash')
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  const ok = await user.verifyPassword(parsed.data.currentPassword)
  if (!ok) return res.status(400).json({ error: 'Current password is incorrect' })

  user.passwordHash = await hashPassword(parsed.data.newPassword)
  await user.save()
  return res.json({ ok: true })
})

export default router
