import { verifyAccessToken } from '../utils/tokens.js'

/**
 * Admin guard. Accepts either the dedicated admin session cookie (the separate
 * admin login) or a normal session belonging to an admin, so an operator who
 * signed in once can reach both the app and the console.
 */
export function requireAdmin(req, res, next) {
  const token = req.cookies?.admin_access_token || req.cookies?.access_token

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated as admin' })
  }

  try {
    const payload = verifyAccessToken(token)
    if (payload.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }
    req.userId = payload.sub
    req.isAdminSession = Boolean(req.cookies?.admin_access_token)
    next()
  } catch {
    return res.status(401).json({ error: 'Admin session expired or invalid' })
  }
}
