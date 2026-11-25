import { Router } from 'express'
import { z } from 'zod'
import mongoose from 'mongoose'
import Course from '../models/Course.js'
import LessonProgress from '../models/LessonProgress.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

const lessonBody = z.object({
  courseId: z.string().trim().min(1),
  lessonId: z.string().trim().min(1),
  completed: z.boolean(),
})

const attemptBody = z.object({
  courseId: z.string().trim().min(1),
  lessonId: z.string().trim().min(1),
  score: z.coerce.number().int().min(0).max(200),
  total: z.coerce.number().int().min(1).max(200),
})

const pct = (score, total) => (total > 0 ? Math.round((score / total) * 100) : 0)

/**
 * The signed-in student's own progress, joined with the course curriculum so
 * the client gets percentages, minutes and scores without a second round trip.
 */
router.get('/progress', async (req, res, next) => {
  try {
    const records = await LessonProgress.find({ userId: req.userId }).sort({ updatedAt: -1 })
    const courseIds = records.map((r) => r.courseId)
    const courses = await Course.find({ _id: { $in: courseIds }, status: 'published' }).select(
      'title subject level curriculum'
    )
    const byId = new Map(courses.map((c) => [String(c._id), c]))

    const items = []
    const recentAttempts = []
    let lessonsCompleted = 0
    let minutesStudied = 0
    let quizzesTaken = 0
    let scorePercentSum = 0
    let coursesCompleted = 0

    for (const record of records) {
      const course = byId.get(String(record.courseId))
      if (!course) continue

      const lessons = (course.curriculum ?? []).flatMap((s) => s.lessons ?? [])
      if (lessons.length === 0) continue
      const byLesson = new Map(lessons.map((l) => [String(l._id), l]))

      const done = record.completedLessons.filter((id) => byLesson.has(id))
      const minutes = done.reduce((sum, id) => sum + (byLesson.get(id).durationMinutes || 0), 0)
      const percent = Math.round((done.length / lessons.length) * 100)
      const attemptRows = record.attempts ?? []
      const attemptPercents = attemptRows.map((a) => pct(a.score, a.total))
      const averageScore = attemptPercents.length
        ? Math.round(attemptPercents.reduce((a, b) => a + b, 0) / attemptPercents.length)
        : null

      lessonsCompleted += done.length
      minutesStudied += minutes
      quizzesTaken += attemptRows.length
      scorePercentSum += attemptPercents.reduce((a, b) => a + b, 0)
      if (percent >= 100) coursesCompleted += 1

      for (const a of attemptRows.slice(-4)) {
        recentAttempts.push({
          courseId: String(course._id),
          courseTitle: course.title,
          score: a.score,
          total: a.total,
          percent: pct(a.score, a.total),
          at: a.at,
        })
      }

      items.push({
        courseId: String(course._id),
        title: course.title,
        subject: course.subject,
        level: course.level,
        lessonsTotal: lessons.length,
        lessonsComplete: done.length,
        percent,
        minutesSpent: minutes,
        quizzesTaken: attemptRows.length,
        averageScore,
        lastActivity: record.updatedAt,
        completedLessons: done,
        attempts: attemptRows.slice(-10),
      })
    }

    recentAttempts.sort((a, b) => new Date(b.at) - new Date(a.at))

    res.json({
      items,
      summary: {
        coursesStarted: items.length,
        coursesCompleted,
        lessonsCompleted,
        minutesStudied,
        quizzesTaken,
        averageScore: quizzesTaken ? Math.round(scorePercentSum / quizzesTaken) : null,
      },
      recentAttempts: recentAttempts.slice(0, 6),
    })
  } catch (error) {
    next(error)
  }
})

/** Mark a lesson complete (or undo it). */
router.post('/progress/lesson', async (req, res, next) => {
  try {
    const parsed = lessonBody.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message })
    }
    const { courseId, lessonId, completed } = parsed.data
    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ error: 'Unknown course.' })
    }

    const update = completed
      ? { $addToSet: { completedLessons: lessonId } }
      : { $pull: { completedLessons: lessonId } }

    const record = await LessonProgress.findOneAndUpdate(
      { userId: req.userId, courseId },
      update,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    res.json({ ok: true, completedLessons: record.completedLessons.length })
  } catch (error) {
    next(error)
  }
})

/** Record one quiz attempt (score out of total). */
router.post('/progress/quiz', async (req, res, next) => {
  try {
    const parsed = attemptBody.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message })
    }
    const { courseId, lessonId, score, total } = parsed.data
    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ error: 'Unknown course.' })
    }
    if (score > total) {
      return res.status(400).json({ error: 'Score cannot exceed total.' })
    }

    const record = await LessonProgress.findOneAndUpdate(
      { userId: req.userId, courseId },
      { $push: { attempts: { lessonId, score, total, at: new Date() } } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    res.json({ ok: true, attempts: record.attempts.length })
  } catch (error) {
    next(error)
  }
})

export default router
