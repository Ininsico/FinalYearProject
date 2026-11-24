import { Router } from 'express'
import { z } from 'zod'
import Course from '../models/Course.js'
import Institution from '../models/Institution.js'
import { serializeCourse, courseStats } from '../lib/coursePayload.js'

const router = Router()

const listQuery = z.object({
  q: z.string().trim().optional(),
  subject: z.string().trim().optional(),
  institutionId: z.string().trim().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  // Two shelves: courses led by institutions, or courses offered by Fablet.
  source: z.enum(['institution', 'fablet']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(48).optional().default(12),
})

/**
 * Public catalogue: every published course, split into institution-led and
 * Fablet-official shelves. Sponsored courses are pinned first. No auth.
 */
router.get('/', async (req, res, next) => {
  try {
    const { q, subject, institutionId, level, source, page, limit } = listQuery.parse(req.query)

    const filter = { status: 'published' }
    if (subject) filter.subject = subject
    if (level) filter.level = level
    if (source === 'institution') filter.institutionId = { $ne: null }
    if (source === 'fablet') filter.institutionId = null
    if (institutionId) filter.institutionId = institutionId
    if (q) {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      filter.$or = [{ title: rx }, { subject: rx }, { summary: rx }, { topics: rx }]
    }

    const skip = (page - 1) * limit
    const [courses, total] = await Promise.all([
      Course.find(filter)
        .sort({ sponsored: -1, publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Course.countDocuments(filter),
    ])

    const institutionIds = [
      ...new Set(courses.map((m) => m.institutionId).filter(Boolean).map(String)),
    ]
    const institutions = await Institution.find({ _id: { $in: institutionIds } }).select('name domain')
    const institutionMap = new Map(
      institutions.map((i) => [String(i._id), { id: String(i._id), name: i.name, domain: i.domain }])
    )

    // Facets and shelf counts come from the whole published catalogue, not the
    // filtered slice, so the controls never collapse to a single option.
    const allPublished = await Course.find({ status: 'published' }).select(
      'subject institutionId sponsored'
    )
    const subjects = [...new Set(allPublished.map((m) => m.subject))].sort()
    const facetIds = [...new Set(allPublished.map((m) => m.institutionId).filter(Boolean).map(String))]
    const facetInstitutions = await Institution.find({ _id: { $in: facetIds } }).select('name')

    res.json({
      modules: courses.map((course) =>
        serializeCourse(course, {
          institution: course.institutionId
            ? institutionMap.get(String(course.institutionId)) ?? null
            : null,
          ...courseStats(course),
        })
      ),
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
      subjects,
      institutions: facetInstitutions
        .map((i) => ({ id: String(i._id), name: i.name }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      counts: {
        institution: allPublished.filter((m) => m.institutionId).length,
        fablet: allPublished.filter((m) => !m.institutionId).length,
        sponsored: allPublished.filter((m) => m.sponsored).length,
      },
    })
  } catch (error) {
    next(error)
  }
})

/** Public course detail: full curriculum for a published course. */
router.get('/:id', async (req, res, next) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, status: 'published' })
    if (!course) return res.status(404).json({ error: 'Course not found' })

    const institution = course.institutionId
      ? await Institution.findById(course.institutionId).select('name domain')
      : null

    res.json({
      course: serializeCourse(course, {
        institution: institution
          ? { id: String(institution._id), name: institution.name, domain: institution.domain }
          : null,
        ...courseStats(course),
      }),
    })
  } catch (error) {
    next(error)
  }
})

export default router
