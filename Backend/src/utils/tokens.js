import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { env } from '../config/env.js'

export function signAccessToken(userId, role = 'user') {
  return jwt.sign({ sub: userId, role }, env.jwtAccessSecret, {
    expiresIn: Math.floor(env.accessTokenMs / 1000),
  })
}

export function signRefreshToken(userId) {
  return jwt.sign({ sub: userId }, env.jwtRefreshSecret, {
    expiresIn: Math.floor(env.refreshTokenMs / 1000),
  })
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtAccessSecret)
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwtRefreshSecret)
}

// Refresh tokens are stored hashed (sha256) so a DB leak can't be reused.
export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export function signResetToken(userId) {
  return jwt.sign({ sub: userId }, env.jwtResetSecret, {
    expiresIn: Math.floor(env.resetTokenMs / 1000),
  })
}

export function verifyResetToken(token) {
  return jwt.verify(token, env.jwtResetSecret)
}

// Email verification / account-activation tokens reuse the reset secret family.
export function signVerificationToken(userId) {
  return jwt.sign({ sub: userId }, env.jwtVerifySecret, {
    expiresIn: Math.floor(env.resetTokenMs / 1000),
  })
}

export function verifyVerificationToken(token) {
  return jwt.verify(token, env.jwtVerifySecret)
}
