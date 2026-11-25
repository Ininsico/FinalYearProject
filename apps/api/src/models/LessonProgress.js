import mongoose from 'mongoose'

/**
 * One student's progress through one course: the lesson ids they marked
 * complete and every quiz attempt they submitted, so the dashboard can chart
 * real history rather than catalogue guesses.
 */
const attemptSchema = new mongoose.Schema(
  {
    lessonId: { type: String, required: true },
    score: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 1 },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
)

const lessonProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    completedLessons: { type: [String], default: [] },
    attempts: { type: [attemptSchema], default: [] },
  },
  { timestamps: true }
)

lessonProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true })

export default mongoose.model('LessonProgress', lessonProgressSchema)
