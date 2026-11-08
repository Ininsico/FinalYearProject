import mongoose from 'mongoose'

/**
 * A full course: catalogue metadata plus a structured curriculum
 * (sections → lessons of type video/reading/exercise/quiz/assignment/project).
 * The collection name is kept from the earlier flat "course module" model so
 * existing data carries over without a migration.
 */
const quizPairSchema = new mongoose.Schema(
  {
    left: { type: String, default: '', maxlength: 200 },
    right: { type: String, default: '', maxlength: 200 },
  },
  { _id: false }
)

const quizQuestionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['mcq', 'truefalse', 'fillblank', 'match'], default: 'mcq' },
    prompt: { type: String, default: '', maxlength: 1000 },
    options: { type: [String], default: [] },
    answerIndex: { type: Number, default: 0 },
    answer: { type: String, default: '' },
    pairs: { type: [quizPairSchema], default: [] },
  },
  { _id: false }
)

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    type: {
      type: String,
      enum: ['video', 'reading', 'exercise', 'quiz', 'assignment', 'project', 'live'],
      default: 'reading',
    },
    durationMinutes: { type: Number, default: 0, min: 0, max: 10000 },
    videoUrl: { type: String, default: '' },
    content: { type: String, default: '' },
    quiz: { type: [quizQuestionSchema], default: [] },
  },
  { _id: true }
)

const sectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    summary: { type: String, default: '', maxlength: 400 },
    lessons: { type: [lessonSchema], default: [] },
  },
  { _id: true }
)

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    subject: { type: String, required: true, trim: true, maxlength: 60, index: true },
    summary: { type: String, trim: true, maxlength: 600, default: '' },
    description: { type: String, trim: true, maxlength: 6000, default: '' },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    topics: { type: [String], default: [] },
    lessons: { type: Number, default: 1, min: 1, max: 500 },
    premium: { type: Boolean, default: false },
    sponsored: { type: Boolean, default: false },
    outcomes: { type: [String], default: [] },
    curriculum: { type: [sectionSchema], default: [] },
    // Retrieval sources for the AI generation pipeline (RAG).
    knowledge: {
      type: [
        new mongoose.Schema(
          {
            title: { type: String, default: 'Source', trim: true, maxlength: 160 },
            text: { type: String, default: '', maxlength: 20000 },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
    // AI-extracted concept graph for the course material.
    knowledgeGraph: {
      nodes: { type: [{ id: String, label: String, summary: String }], default: [] },
      edges: { type: [{ from: String, to: String, relation: String }], default: [] },
      generatedAt: { type: String, default: null },
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      default: null,
      index: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    publishedAt: { type: String, default: null },
  },
  { timestamps: true, collection: 'coursemodules' }
)

// Fablet's own courses (no institution) are free, full stop.
courseSchema.pre('save', function enforceFabletFree() {
  if (!this.institutionId) this.premium = false
})

export default mongoose.model('Course', courseSchema)
