import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Never store a raw password. Only the bcrypt hash lives here, and it is
    // excluded from query results by default (select: false).
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    // Hashed refresh tokens currently valid for this user. Lets us revoke
    // sessions on logout and detect reused/leaked tokens.
    refreshTokens: {
      type: [String],
      default: [],
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'institution', 'admin'],
      default: 'student',
    },
    // Institution (B2B) membership. Null for students and platform admins.
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      default: null,
    },
    institutionRole: {
      type: String,
      enum: ['owner', 'admin', 'member', null],
      default: null,
    },
    // The individual plan for a student account (institutions are billed by
    // Institution.planId instead).
    planId: {
      type: String,
      default: 'student-basic',
    },
    // Email verification / account activation. Signups start unverified and
    // cannot log in until they click the activation link.
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

userSchema.methods.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash)
}

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    institutionId: this.institutionId ? this.institutionId.toString() : null,
    institutionRole: this.institutionRole ?? null,
    planId: this.planId ?? null,
  }
}

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 12)
}

const User = mongoose.model('User', userSchema)

export default User
