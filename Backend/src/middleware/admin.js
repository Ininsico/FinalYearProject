import { verifyAccessToken } from '../utils/tokens.js'

export function requireAdmin(req, res, next) {
  const token = req.cookies?.admin_access_token
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated as admin' })
  }
  try {
    const payload = verifyAccessToken(token)
    if (payload.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }
    req.userId = payload.sub
    next()
  } catch {
    return res.status(401).json({ error: 'Admin session expired or invalid' })
  }
}
