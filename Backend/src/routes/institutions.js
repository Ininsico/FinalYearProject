import { Router } from 'express'
import { z } from 'zod'
import multer from 'multer'
import User, { hashPassword } from '../models/User.js'
import Institution from '../models/Institution.js'
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
import { env } from '../config/env.js'
import { consumeAiQuota } from '../lib/aiQuota.js'
import { callAiUpload } from '../lib/aiService.js'
import { requireAuth } from '../middleware/auth.js'
import { resolveAccount } from '../middleware/account.js'
import { attachEntitlements } from '../middleware/entitlements.js'
import { issueSession } from '../lib/session.js'
import { getSubscription } from '../lib/subscriptions.js'
import { DEFAULT_INSTITUTION_PLAN } from '../config/plans.js'
import { planEntitlementsOf } from '../lib/planStore.js'
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
      seats: planEntitlementsOf(DEFAULT_INSTITUTION_PLAN).seats,
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

const institutionProfileSchema = z.object({
  name: z.string().trim().min(2).max(140).optional(),
  domain: z.string().trim().max(120).optional(),
  contactEmail: z.string().trim().email().optional(),
})

/** Owners and admins can edit the institution's public profile. */
router.patch('/me', async (req, res, next) => {
  try {
    if (!req.user.institutionId) {
      return res.status(404).json({ error: 'You do not belong to an institution' })
    }
    if (!['owner', 'admin'].includes(req.user.institutionRole)) {
      return res.status(403).json({ error: 'Only an institution owner or admin can edit the profile' })
    }

    const parsed = institutionProfileSchema.safeParse(req.body ?? {})
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message })

    const institution = await Institution.findById(req.user.institutionId)
    if (!institution) return res.status(404).json({ error: 'Institution not found' })

    const before = {
      name: institution.name,
      domain: institution.domain,
      contactEmail: institution.contactEmail,
    }

    if (parsed.data.name !== undefined) institution.name = parsed.data.name
    if (parsed.data.domain !== undefined) institution.domain = parsed.data.domain.toLowerCase()
    if (parsed.data.contactEmail !== undefined) {
      institution.contactEmail = parsed.data.contactEmail.toLowerCase()
    }
    await institution.save()

    await recordAudit({
      actor: { id: String(req.user._id), email: req.user.email },
      action: 'institution.profile_updated',
      targetType: 'institution',
      targetId: institution._id,
      before,
      after: {
        name: institution.name,
        domain: institution.domain,
        contactEmail: institution.contactEmail,
      },
    })

    res.json({ institution: institution.toPublicJSON() })
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

// --- Course modules (published publicly through the dictionary) ---

const serializeModule = (m) => serializeCourse(m, courseStats(m))

function requireModuleManager(req, res, next) {
  if (!req.user.institutionId) {
    return res.status(404).json({ error: 'You do not belong to an institution' })
  }
  if (!['owner', 'admin'].includes(req.user.institutionRole)) {
    return res.status(403).json({ error: 'Only an institution owner or admin can manage modules' })
  }
  next()
}

router.get('/modules', async (req, res, next) => {
  try {
    if (!req.user.institutionId) {
      return res.status(404).json({ error: 'You do not belong to an institution' })
    }
    const { page, limit } = z
      .object({
        page: z.coerce.number().int().min(1).optional().default(1),
        limit: z.coerce.number().int().min(1).max(48).optional().default(20),
      })
      .parse(req.query)

    const skip = (page - 1) * limit
    const [modules, total] = await Promise.all([
      Course.find({ institutionId: req.user.institutionId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Course.countDocuments({ institutionId: req.user.institutionId }),
    ])

    res.json({
      modules: modules.map(serializeModule),
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
    })
  } catch (error) {
    next(error)
  }
})

router.get('/modules/:id', async (req, res, next) => {
  try {
    if (!req.user.institutionId) {
      return res.status(404).json({ error: 'You do not belong to an institution' })
    }
    const course = await Course.findOne({
      _id: req.params.id,
      institutionId: req.user.institutionId,
    })
    if (!course) return res.status(404).json({ error: 'Course not found' })
    res.json({
      course: serializeCourse(course, { includeKnowledge: true, ...courseStats(course) }),
    })
  } catch (error) {
    next(error)
  }
})

function sendAiError(res, error) {
  return res.status(error.status || 502).json({ error: error.message })
}

/** Interception: AI actions bill against the institution's daily budget. */
async function interceptAi(req, res) {
  const quota = await consumeAiQuota(
    'institution',
    req.user.institutionId,
    env.ai.dailyLimitInstitution
  )
  if (!quota.allowed) {
    res.status(429).json({
      error: `Daily AI limit reached for this institution (${quota.limit} calls). Try again tomorrow.`,
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

router.post('/ai/extract', requireModuleManager, (req, res) => {
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

router.post('/modules/:id/ai/describe', requireModuleManager, async (req, res, next) => {
  try {
    if (!(await interceptAi(req, res))) return
    const course = await Course.findOne({ _id: req.params.id, institutionId: req.user.institutionId })
    if (!course) return res.status(404).json({ error: 'Course not found' })
    res.json(await generateDescription(course))
  } catch (error) {
    sendAiError(res, error)
  }
})

router.post('/modules/:id/ai/lesson', requireModuleManager, async (req, res, next) => {
  try {
    if (!(await interceptAi(req, res))) return
    const course = await Course.findOne({ _id: req.params.id, institutionId: req.user.institutionId })
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

router.post('/modules/:id/ai/graph', requireModuleManager, async (req, res, next) => {
  try {
    if (!(await interceptAi(req, res))) return
    const course = await Course.findOne({ _id: req.params.id, institutionId: req.user.institutionId })
    if (!course) return res.status(404).json({ error: 'Course not found' })
    res.json({ knowledgeGraph: await generateKnowledgeGraph(course) })
  } catch (error) {
    sendAiError(res, error)
  }
})

router.post('/modules/:id/ai/quiz', requireModuleManager, async (req, res, next) => {
  try {
    if (!(await interceptAi(req, res))) return
    const course = await Course.findOne({ _id: req.params.id, institutionId: req.user.institutionId })
    if (!course) return res.status(404).json({ error: 'Course not found' })
    const { sectionIndex = 0, lessonIndex = 0, types = null } = req.body ?? {}
    res.json(await generateQuiz(course, Number(sectionIndex), Number(lessonIndex), types))
  } catch (error) {
    sendAiError(res, error)
  }
})

// --- Course structure (sections & lessons, page-by-page editing) ---

const institutionCourseStructure = makeCourseStructureHandlers((req) =>
  Course.findOne({ _id: req.params.id, institutionId: req.user.institutionId })
)

router.post('/modules/:id/sections', requireModuleManager, institutionCourseStructure.addSection)
router.patch('/modules/:id/sections/:si', requireModuleManager, institutionCourseStructure.updateSection)
router.delete('/modules/:id/sections/:si', requireModuleManager, institutionCourseStructure.deleteSection)
router.post('/modules/:id/sections/:si/lessons', requireModuleManager, institutionCourseStructure.addLesson)
router.patch(
  '/modules/:id/sections/:si/lessons/:li',
  requireModuleManager,
  institutionCourseStructure.updateLesson
)
router.delete(
  '/modules/:id/sections/:si/lessons/:li',
  requireModuleManager,
  institutionCourseStructure.deleteLesson
)

router.post('/modules', requireModuleManager, async (req, res, next) => {
  try {
    const parsed = courseFieldsSchema.safeParse(req.body ?? {})
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message })

    const module = await Course.create({
      ...parsed.data,
      institutionId: req.user.institutionId,
      createdBy: req.user._id,
      status: 'draft',
    })

    await recordAudit({
      actor: { id: String(req.user._id), email: req.user.email },
      action: 'module.created',
      targetType: 'course_module',
      targetId: module._id,
      after: { title: module.title, subject: module.subject },
    })

    res.status(201).json({ module: serializeModule(module) })
  } catch (error) {
    next(error)
  }
})

router.patch('/modules/:id', requireModuleManager, async (req, res, next) => {
  try {
    const parsed = coursePatchSchema.safeParse(req.body ?? {})
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message })

    const module = await Course.findOne({
      _id: req.params.id,
      institutionId: req.user.institutionId,
    })
    if (!module) return res.status(404).json({ error: 'Module not found' })

    const data = parsed.data
    const before = { title: module.title, status: module.status }

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
      if (data[key] !== undefined) module[key] = data[key]
    }
    if (data.status !== undefined && data.status !== module.status) {
      module.status = data.status
      module.publishedAt = data.status === 'published' ? new Date().toISOString() : null
    }
    await module.save()

    await recordAudit({
      actor: { id: String(req.user._id), email: req.user.email },
      action: 'module.updated',
      targetType: 'course_module',
      targetId: module._id,
      before,
      after: { title: module.title, status: module.status },
    })

    res.json({ module: serializeModule(module) })
  } catch (error) {
    next(error)
  }
})

router.delete('/modules/:id', requireModuleManager, async (req, res, next) => {
  try {
    const module = await Course.findOneAndDelete({
      _id: req.params.id,
      institutionId: req.user.institutionId,
    })
    if (!module) return res.status(404).json({ error: 'Module not found' })

    await recordAudit({
      actor: { id: String(req.user._id), email: req.user.email },
      action: 'module.deleted',
      targetType: 'course_module',
      targetId: module._id,
      before: { title: module.title },
    })

    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

export default router
