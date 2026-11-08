import mongoose from 'mongoose'

/**
 * Editable plan catalogue. Seeded once from `config/plans.js` (the static
 * defaults) and thereafter owned by the database, so admins can tune prices,
 * seats and the features each plan unlocks without a deploy.
 */
const planSchema = new mongoose.Schema(
  {
    planId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    audience: { type: String, enum: ['student', 'institution'], required: true },
    amountUsdt: { type: Number, default: 0 },
    period: { type: String, default: 'per month' },
    summary: { type: String, default: '' },
    highlights: { type: [String], default: [] },
    entitlements: {
      seats: { type: Number, default: 1 },
      features: { type: [String], default: [] },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Plan', planSchema)
