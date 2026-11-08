import { z } from 'zod'
import { lessonSchema, serializeCourse, courseStats } from './coursePayload.js'

const sectionCreateSchema = z.object({
  title: z.string().trim().min(1).max(160),
  summary: z.string().trim().max(400).optional().default(''),
})

const sectionUpdateSchema = sectionCreateSchema.partial()
const lessonUpdateSchema = lessonSchema.partial()

/**
 * Section/lesson CRUD shared by the admin console and the institution
 * workspace — each supplies its own course loader for ownership checks.
 */
export function makeCourseStructureHandlers(loadCourse) {
  const invalid = (res, error) =>
    res.status(400).json({ error: error.issues?.[0]?.message ?? 'Invalid payload' })

  const respond = (res, course, status = 200, extra = {}) =>
    res.status(status).json({ course: serializeCourse(course, courseStats(course)), ...extra })

  const sectionIndex = (req) => Number(req.params.si)
  const lessonIndex = (req) => Number(req.params.li)

  return {
    async addSection(req, res) {
      const course = await loadCourse(req)
      if (!course) return res.status(404).json({ error: 'Course not found' })

      const parsed = sectionCreateSchema.safeParse(req.body ?? {})
      if (!parsed.success) return invalid(res, parsed.error)

      course.curriculum.push({ title: parsed.data.title, summary: parsed.data.summary, lessons: [] })
      await course.save()

      const index = course.curriculum.length - 1
      respond(res, course, 201, {
        sectionIndex: index,
        sectionId: String(course.curriculum[index]._id),
      })
    },

    async updateSection(req, res) {
      const course = await loadCourse(req)
      if (!course) return res.status(404).json({ error: 'Course not found' })

      const section = course.curriculum?.[sectionIndex(req)]
      if (!section) return res.status(404).json({ error: 'Section not found' })

      const parsed = sectionUpdateSchema.safeParse(req.body ?? {})
      if (!parsed.success) return invalid(res, parsed.error)

      if (parsed.data.title !== undefined) section.title = parsed.data.title
      if (parsed.data.summary !== undefined) section.summary = parsed.data.summary
      await course.save()
      respond(res, course)
    },

    async deleteSection(req, res) {
      const course = await loadCourse(req)
      if (!course) return res.status(404).json({ error: 'Course not found' })

      const index = sectionIndex(req)
      if (!course.curriculum?.[index]) return res.status(404).json({ error: 'Section not found' })

      course.curriculum.splice(index, 1)
      await course.save()
      respond(res, course)
    },

    async addLesson(req, res) {
      const course = await loadCourse(req)
      if (!course) return res.status(404).json({ error: 'Course not found' })

      const section = course.curriculum?.[sectionIndex(req)]
      if (!section) return res.status(404).json({ error: 'Section not found' })

      const parsed = lessonSchema.safeParse(req.body ?? {})
      if (!parsed.success) return invalid(res, parsed.error)

      section.lessons.push(parsed.data)
      await course.save()

      respond(res, course, 201, { lessonIndex: section.lessons.length - 1 })
    },

    async updateLesson(req, res) {
      const course = await loadCourse(req)
      if (!course) return res.status(404).json({ error: 'Course not found' })

      const section = course.curriculum?.[sectionIndex(req)]
      const lesson = section?.lessons?.[lessonIndex(req)]
      if (!section || !lesson) return res.status(404).json({ error: 'Lesson not found' })

      const parsed = lessonUpdateSchema.safeParse(req.body ?? {})
      if (!parsed.success) return invalid(res, parsed.error)

      for (const key of ['title', 'type', 'durationMinutes', 'videoUrl', 'content', 'quiz']) {
        if (parsed.data[key] !== undefined) lesson[key] = parsed.data[key]
      }
      await course.save()
      respond(res, course)
    },

    async deleteLesson(req, res) {
      const course = await loadCourse(req)
      if (!course) return res.status(404).json({ error: 'Course not found' })

      const section = course.curriculum?.[sectionIndex(req)]
      if (!section) return res.status(404).json({ error: 'Section not found' })

      const index = lessonIndex(req)
      if (!section.lessons?.[index]) return res.status(404).json({ error: 'Lesson not found' })

      section.lessons.splice(index, 1)
      await course.save()
      respond(res, course)
    },
  }
}
