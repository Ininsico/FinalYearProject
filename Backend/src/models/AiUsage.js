import mongoose from 'mongoose'

/** Daily AI usage counters, one row per scope/day. */
const aiUsageSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('AiUsage', aiUsageSchema)
