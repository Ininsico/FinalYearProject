import { z } from 'zod'

/**
 * Shared course payload validation + serialisation used by the public
 * catalogue, the admin console and the institution workspace.
 */

export const LESSON_TYPES = [
  'video',
  'reading',
  'exercise',
  'quiz',
  'assignment',
  'project',
  'live',
]

export const quizQuestionSchema = z.object({
  type: z.enum(['mcq', 'truefalse', 'fillblank', 'match']).optional().default('mcq'),
  prompt: z.string().trim().min(1).max(1000),
  options: z.array(z.string().trim().max(300)).max(8).optional().default([]),
  answerIndex: z.coerce.number().int().min(0).max(7).optional().default(0),
  answer: z.string().trim().max(300).optional().default(''),
  pairs: z
    .array(
      z.object({
        left: z.string().trim().max(200),
        right: z.string().trim().max(200),
      })
    )
    .max(10)
    .optional()
    .default([]),
})

export const lessonSchema = z.object({
  title: z.string().trim().min(1).max(160),
  type: z.enum(LESSON_TYPES).optional().default('reading'),
  durationMinutes: z.coerce.number().min(0).max(10000).optional().default(0),
  videoUrl: z.string().trim().max(500).optional().default(''),
  content: z.string().max(8000).optional().default(''),
  quiz: z.array(quizQuestionSchema).max(30).optional(),
})

export const sectionSchema = z.object({
  title: z.string().trim().min(1).max(160),
  summary: z.string().trim().max(400).optional().default(''),
  lessons: z.array(lessonSchema).max(50).optional().default([]),
})

export const curriculumSchema = z.array(sectionSchema).max(30).optional()

export const courseFieldsSchema = z.object({
  title: z.string().trim().min(2).max(140),
  subject: z.string().trim().min(1).max(60),
  summary: z.string().trim().max(600).optional().default(''),
  description: z.string().trim().max(6000).optional().default(''),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional().default('beginner'),
  topics: z.array(z.string().trim().min(1).max(40)).max(15).optional().default([]),
  lessons: z.coerce.number().int().min(1).max(500).optional().default(1),
  premium: z.boolean().optional().default(false),
  sponsored: z.boolean().optional().default(false),
  outcomes: z.array(z.string().trim().min(1).max(200)).max(20).optional().default([]),
  curriculum: curriculumSchema,
  knowledge: z
    .array(
      z.object({
        title: z.string().trim().max(160).optional().default('Source'),
        text: z.string().max(20000).optional().default(''),
      })
    )
    .max(20)
    .optional(),
})

export const coursePatchSchema = courseFieldsSchema.partial().extend({
  status: z.enum(['draft', 'published']).optional(),
})

/**
 * Shape a course for clients. Fablet offers its own courses (no institution)
 * for free, so `premium` is forced off for them.
 */
export function serializeCourse(course, extras = {}) {
  const { includeKnowledge, ...rest } = extras
  const obj = course.toObject ? course.toObject() : course
  return {
    id: String(obj._id),
    title: obj.title,
    subject: obj.subject,
    summary: obj.summary,
    description: obj.description ?? '',
    level: obj.level,
    topics: obj.topics ?? [],
    lessons: obj.lessons,
    premium: Boolean(obj.premium && obj.institutionId),
    sponsored: Boolean(obj.sponsored),
    outcomes: obj.outcomes ?? [],
    curriculum: (obj.curriculum ?? []).map((section) => ({
      id: String(section._id),
      title: section.title,
      summary: section.summary ?? '',
      lessons: (section.lessons ?? []).map((lesson) => ({
        id: String(lesson._id),
        title: lesson.title,
        type: lesson.type,
        durationMinutes: lesson.durationMinutes,
        videoUrl: lesson.videoUrl ?? '',
        content: lesson.content ?? '',
        quiz: (lesson.quiz ?? []).map((question) => ({
          type: question.type,
          prompt: question.prompt,
          options: question.options ?? [],
          answerIndex: question.answerIndex ?? 0,
          answer: question.answer ?? '',
          pairs: (question.pairs ?? []).map((pair) => ({ left: pair.left, right: pair.right })),
        })),
      })),
    })),
    status: obj.status,
    publishedAt: obj.publishedAt,
    createdAt: obj.createdAt,
    ...(includeKnowledge
      ? {
          knowledge: (obj.knowledge ?? []).map((source) => ({
            title: source.title,
            text: source.text,
          })),
          knowledgeGraph: obj.knowledgeGraph ?? { nodes: [], edges: [], generatedAt: null },
        }
      : {}),
    ...rest,
  }
}

/** Totals used in list views. */
export function courseStats(obj) {
  const sections = obj.curriculum ?? []
  const lessons = sections.reduce((sum, s) => sum + (s.lessons?.length ?? 0), 0)
  const minutes = sections.reduce(
    (sum, s) => sum + (s.lessons ?? []).reduce((m, l) => m + (l.durationMinutes || 0), 0),
    0
  )
  return { sections: sections.length, curriculumLessons: lessons, minutes }
}
