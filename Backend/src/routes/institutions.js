import { Router } from 'express'
import { z } from 'zod'
import User, { hashPassword } from '../models/User.js'
import Institution from '../models/Institution.js'
import { requireAuth } from '../middleware/auth.js'
import { resolveAccount } from '../middleware/account.js'
import { attachEntitlements } from '../middleware/entitlements.js'
import { issueSession } from '../lib/session.js'
import { getSubscription } from '../lib/subscriptions.js'
import { DEFAULT_INSTITUTION_PLAN, planEntitlements } from '../config/plans.js'
import { recordAudit } from '../lib/audit.js'

const router = Router()

const registerSchema = z.object({
  institutionName: z.string().trim().min(2).max(140),
  domain: z.string().trim().max(120).optional().default(''),
  contactEmail: z.string().trim().email(),
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
  password: z.string().min(8).max(200),
})

/**
 * B2B onboarding — the separate module companies pass through, distinct from the
 * student signup. It creates the institution, its owner, and the trial
 * subscription, and starts a session so the wizard can continue straight into
 * plan selection and payment.
 */
router.post('/register', async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body ?? {})
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message })
    }

    const { institutionName, domain, contactEmail, name, email, password } = parsed.data
    const normalizedEmail = email.toLowerCase()

    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    const owner = new User({
      name,
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
      // B2B onboarding is gated by the subscription, not an email link, so the
      // owner can proceed straight into plan selection.
      isVerified: true,
      role: 'institution',
      institutionRole: 'owner',
      planId: DEFAULT_INSTITUTION_PLAN,
    })
    await owner.save()

    const institution = await Institution.create({
      name: institutionName,
      domain: (domain || '').toLowerCase(),
      contactEmail: (contactEmail || normalizedEmail).toLowerCase(),
      planId: DEFAULT_INSTITUTION_PLAN,
      seats: planEntitlements(DEFAULT_INSTITUTION_PLAN).seats,
      status: 'trialing',
      ownerId: owner._id,
    })

    owner.institutionId = institution._id
    await owner.save()

    await getSubscription('institution', institution._id.toString())

    await recordAudit({
      actor: { id: String(owner._id), email: owner.email },
      action: 'institution.registered',
      targetType: 'institution',
      targetId: institution._id,
      after: { name: institution.name, planId: institution.planId },
    })

    const user = await issueSession(res, owner)

    return res.status(201).json({ user, institution: institution.toPublicJSON() })
  } catch (error) {
    next(error)
  }
})

router.use(requireAuth, resolveAccount, attachEntitlements)

/** The institution the signed-in user belongs to. */
router.get('/me', async (req, res, next) => {
  try {
    if (!req.user.institutionId) {
      return res.status(404).json({ error: 'You do not belong to an institution' })
    }
    const institution = await Institution.findById(req.user.institutionId)
    if (!institution) return res.status(404).json({ error: 'Institution not found' })

    const members = await User.find({ institutionId: institution._id })
      .select('name email institutionRole createdAt')
      .sort({ createdAt: 1 })

    res.json({
      institution: institution.toPublicJSON(),
      members: members.map((m) => ({
        id: String(m._id),
        name: m.name,
        email: m.email,
        institutionRole: m.institutionRole,
        createdAt: m.createdAt,
      })),
      seats: {
        used: members.length,
        limit: req.entitlements?.seats ?? institution.seats,
      },
    })
  } catch (error) {
    next(error)
  }
})

const memberSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
  password: z.string().min(8).max(200).optional(),
})

/** Invite a member. Seat count is enforced from entitlements, not the UI. */
router.post('/members', async (req, res, next) => {
  try {
    if (!req.user.institutionId) {
      return res.status(404).json({ error: 'You do not belong to an institution' })
    }
    if (!['owner', 'admin'].includes(req.user.institutionRole)) {
      return res.status(403).json({ error: 'Only an institution owner or admin can invite members' })
    }

    const parsed = memberSchema.safeParse(req.body ?? {})
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message })

    const used = await User.countDocuments({ institutionId: req.user.institutionId })
    const limit = req.entitlements?.seats ?? 1

    if (used >= limit) {
      return res.status(402).json({
        error: `All ${limit} seats are in use. Upgrade the plan to add more members.`,
        code: 'seat_limit',
      })
    }

    const email = parsed.data.email.toLowerCase()
    if (await User.findOne({ email })) {
      return res.status(409).json({ error: 'That email is already registered' })
    }

    const password = parsed.data.password || `Fablet-${Math.random().toString(36).slice(2, 10)}`

    const member = await User.create({
      name: parsed.data.name,
      email,
      passwordHash: await hashPassword(password),
      isVerified: true,
      role: 'institution',
      institutionId: req.user.institutionId,
      institutionRole: 'member',
      planId: req.user.planId,
    })

    await recordAudit({
      actor: { id: String(req.user._id), email: req.user.email },
      action: 'institution.member_added',
      targetType: 'user',
      targetId: member._id,
      after: { email: member.email, institutionId: String(req.user.institutionId) },
    })

    // The generated password is returned once so the owner can hand it over.
    return res.status(201).json({
      member: {
        id: String(member._id),
        name: member.name,
        email: member.email,
        institutionRole: member.institutionRole,
      },
      password,
    })
  } catch (error) {
    next(error)
  }
})

export default router
