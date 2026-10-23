import mongoose from 'mongoose'

/** Append-only record of who changed what. Never updated or deleted by any route. */
const auditEventSchema = new mongoose.Schema(
  {
    actorId: { type: String, default: null },
    actorEmail: { type: String, default: null },
    action: { type: String, required: true },
    targetType: { type: String, default: null },
    targetId: { type: String, default: null },
    before: { type: mongoose.Schema.Types.Mixed, default: null },
    after: { type: mongoose.Schema.Types.Mixed, default: null },
    at: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('AuditEvent', auditEventSchema)
