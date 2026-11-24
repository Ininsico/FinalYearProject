import mongoose from 'mongoose'

/**
 * A crypto payment intent. Truth about whether it was paid always comes from the
 * provider (Binance deposit history), never from the client.
 */
const paymentIntentSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true, index: true },
    provider: { type: String, enum: ['crypto'], default: 'crypto' },
    kind: { type: String, default: 'subscription' },
    accountId: { type: String, required: true, index: true },
    accountType: { type: String, enum: ['user', 'institution'], required: true },
    userId: { type: String, required: true },
    userName: { type: String, default: '' },
    userEmail: { type: String, default: '' },
    planId: { type: String, required: true },
    planName: { type: String, default: '' },
    planPeriod: { type: String, default: 'per month' },
    expectedAmount: { type: Number, required: true },
    tolerancePercent: { type: Number, default: 2 },
    minAmount: { type: Number, required: true },
    maxAmount: { type: Number, required: true },
    asset: { type: String, default: 'USDT' },
    network: { type: String, default: 'TRX' },
    address: { type: String, default: null },
    status: {
      type: String,
      enum: ['awaiting_payment', 'confirmed', 'overpaid', 'mismatch', 'expired', 'failed'],
      default: 'awaiting_payment',
      index: true,
    },
    statusMessage: { type: String, default: '' },
    matchedTotal: { type: Number, default: 0 },
    consumedTxIds: { type: [String], default: [] },
    attemptCount: { type: Number, default: 0 },
    createdAt: { type: String, required: true },
    expiresAt: { type: String, required: true },
    checkedAt: { type: String, default: null },
    confirmedAt: { type: String, default: null },
    refundedAt: { type: String, default: null },
    demo: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('PaymentIntent', paymentIntentSchema)
