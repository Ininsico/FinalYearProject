import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { env } from '../config/env.js'
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
} from '../utils/tokens.js'

function cookieMaxAge(token) {
  const exp = jwt.decode(token)?.exp
  if (!exp) return undefined
  return Math.max(0, (exp - Math.floor(Date.now() / 1000)) * 1000)
}

export function setAuthCookies(res, accessToken, refreshToken) {
  const sameSite = env.cookieSameSite
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite,
    maxAge: cookieMaxAge(accessToken),
  })
  // Scoped to the whole auth surface so the silent refresh in /api/auth/me
  // can read it, not just the /refresh endpoint.
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite,
    maxAge: cookieMaxAge(refreshToken),
    path: '/api/auth',
  })
}

export function clearAuthCookies(res) {
  res.clearCookie('access_token')
  res.clearCookie('refresh_token', { path: '/api/auth' })
  // Legacy scope from earlier builds — clear it too so no stale cookie lingers.
  res.clearCookie('refresh_token', { path: '/api/auth/refresh' })
}

/** Start a session for a user and hand back their public shape. */
export async function issueSession(res, user) {
  const accessToken = signAccessToken(user._id.toString(), user.role)
  const refreshToken = signRefreshToken(user._id.toString())

  user.refreshTokens.push(hashToken(refreshToken))
  if (user.refreshTokens.length > 5) {
    user.refreshTokens = user.refreshTokens.slice(-5)
  }
  await user.save()

  setAuthCookies(res, accessToken, refreshToken)
  return user.toPublicJSON()
}

/**
 * Rotate a session using the refresh-token cookie. The presented token is
 * one-time use: it is invalidated and a fresh access + refresh pair is issued.
 * Returns null when there is no usable session; reuse of an already-rotated
 * token revokes every session for that user.
 */
export async function refreshSession(req, res) {
  const token = req.cookies?.refresh_token
  if (!token) return null

  let payload
  try {
    payload = verifyRefreshToken(token)
  } catch {
    return null
  }

  const user = await User.findById(payload.sub).select('+refreshTokens')
  if (!user) return null

  const hash = hashToken(token)
  if (!user.refreshTokens.includes(hash)) {
    // Logged out already, or a replayed token after rotation.
    user.refreshTokens = []
    await user.save()
    return null
  }

  user.refreshTokens = user.refreshTokens.filter((t) => t !== hash)
  const accessToken = signAccessToken(user._id.toString(), user.role)
  const refreshToken = signRefreshToken(user._id.toString())
  user.refreshTokens.push(hashToken(refreshToken))
  if (user.refreshTokens.length > 5) {
    user.refreshTokens = user.refreshTokens.slice(-5)
  }
  await user.save()

  setAuthCookies(res, accessToken, refreshToken)
  return user
}

/**
 * Resolve the current user for a request: a valid access token wins, otherwise
 * the refresh cookie silently rotates the session in place. Session restore
 * uses this, so an expired 15-minute access token never reads as "logged out".
 */
export async function resolveSession(req, res) {
  const accessToken = req.cookies?.access_token
  if (accessToken) {
    try {
      const payload = verifyAccessToken(accessToken)
      const user = await User.findById(payload.sub)
      if (user) return user
    } catch {
      // Expired or invalid — fall through to the refresh cookie.
    }
  }
  return refreshSession(req, res)
}
