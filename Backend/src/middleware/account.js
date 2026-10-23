import User from '../models/User.js'

/**
 * Resolve the authenticated user and the billing account their subscription
 * hangs off: an institution account is billed as a whole, a student is billed
 * individually.
 */
export async function resolveAccount(req, res, next) {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(401).json({ error: 'Not authenticated' })

    req.user = user
    req.account =
      user.role === 'institution' && user.institutionId
        ? { type: 'institution', id: user.institutionId.toString() }
        : { type: 'user', id: user._id.toString() }

    next()
  } catch (error) {
    next(error)
  }
}
