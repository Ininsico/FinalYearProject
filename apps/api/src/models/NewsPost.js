import mongoose from 'mongoose'

/**
 * A Fablet newsletter post, written and published from the operator console
 * and shown in every student account.
 */
const newsPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    tag: { type: String, trim: true, maxlength: 40, default: '' },
    body: { type: String, required: true, maxlength: 8000 },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export default mongoose.model('NewsPost', newsPostSchema)
