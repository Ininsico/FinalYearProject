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
      enum: ['user', 'admin'],
      default: 'user',
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
  }
}

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 12)
}

const User = mongoose.model('User', userSchema)

export default User
