import mongoose from 'mongoose'

const institutionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 140 },
    domain: { type: String, trim: true, lowercase: true, default: '' },
    contactEmail: { type: String, trim: true, lowercase: true, default: '' },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seats: { type: Number, default: 10, min: 1 },
    planId: { type: String, default: 'institution-starter' },
    status: {
      type: String,
      enum: ['trialing', 'active', 'canceled', 'suspended'],
      default: 'trialing',
    },
  },
  { timestamps: true }
)

institutionSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    domain: this.domain,
    contactEmail: this.contactEmail,
    ownerId: this.ownerId.toString(),
    seats: this.seats,
    planId: this.planId,
    status: this.status,
    createdAt: this.createdAt,
  }
}

export default mongoose.model('Institution', institutionSchema)
