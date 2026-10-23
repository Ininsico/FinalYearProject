import mongoose from 'mongoose'

const historyEntry = new mongoose.Schema(
  {
    at: { type: String, required: true },
    action: { type: String, required: true },
    detail: { type: String, default: null },
    reference: { type: String, default: null },
  },
  { _id: false }
)

/**
 * One subscription per account. An "account" is either a single user
 * (`user:<id>`, for student plans) or an institution (`institution:<id>`), so the
 * same billing machinery serves both the B2C and B2B models.
 */
const subscriptionSchema = new mongoose.Schema(
  {
    accountId: { type: String, required: true, unique: true, index: true },
    accountType: { type: String, enum: ['user', 'institution'], required: true },
    planId: { type: String, required: true },
    status: {
      type: String,
      enum: ['trialing', 'active', 'canceled', 'expired'],
      default: 'trialing',
    },
    provider: { type: String, default: null },
    seats: { type: Number, default: 1 },
    currentPeriodStart: { type: String, default: null },
    currentPeriodEnd: { type: String, default: null },
    trialEndsAt: { type: String, default: null },
    canceledAt: { type: String, default: null },
    activatedAt: { type: String, default: null },
    lastPaymentReference: { type: String, default: null },
    history: { type: [historyEntry], default: [] },
  },
  { timestamps: true }
)

export default mongoose.model('Subscription', subscriptionSchema)
