import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { signAccessToken, signRefreshToken, hashToken } from '../utils/tokens.js'

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
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite,
    maxAge: cookieMaxAge(refreshToken),
    path: '/api/auth/refresh',
  })
}

export function clearAuthCookies(res) {
  res.clearCookie('access_token')
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
