import { env } from '../config/env.js'
import User, { hashPassword } from '../models/User.js'
import Institution from '../models/Institution.js'
import { getSubscription } from './subscriptions.js'
import { DEFAULT_INSTITUTION_PLAN, planEntitlements } from '../config/plans.js'

/**
 * The demo identities behind the instant-login buttons — one per role, so the
 * three dashboards can be seen side by side without signing up.
 *
 * Off unless INSTANT_LOGIN=true. These accounts are real rows with real roles;
 * nothing about the dashboards is faked.
 */
const INSTITUTION_NAME = 'Instant Demo Institute'

export const INSTANT_IDENTITIES = [
  {
    role: 'student',
    label: 'Student',
    name: 'Demo Student',
    email: 'student@fablet.dev',
    summary: 'Free account, basic dashboard',
  },
  {
    role: 'institution',
    label: 'Institution',
    name: 'Demo Institution Owner',
    email: 'institution@fablet.dev',
    summary: 'Owns a demo institute on a 14-day trial',
    institution: true,
  },
  {
    role: 'admin',
    label: 'Admin',
    name: 'Fablet Admin',
    email: 'admin@fablet.dev',
    summary: 'Full operator console',
  },
]

async function ensureUser(definition) {
  const email = definition.email.toLowerCase()
  const existing = await User.findOne({ email }).select('+passwordHash')

  if (existing) {
    // Keep the demo password in lockstep with INSTANT_DEMO_PASSWORD so the
    // one-click buttons can never fail against a stale hash.
    existing.passwordHash = await hashPassword(env.instantLogin.password)
    existing.isVerified = true
    existing.role = definition.role
    await existing.save()
    return existing
  }

  return User.create({
    name: definition.name,
    email,
    passwordHash: await hashPassword(env.instantLogin.password),
    isVerified: true,
    role: definition.role,
    planId: definition.role === 'institution' ? DEFAULT_INSTITUTION_PLAN : 'student-basic',
  })
}

export async function ensureInstantLogins() {
  if (!env.instantLogin.enabled) return null

  let institution = null

  for (const definition of INSTANT_IDENTITIES) {
    const user = await ensureUser(definition)

    if (!definition.institution) continue

    institution = user.institutionId
      ? await Institution.findById(user.institutionId)
      : null

    if (!institution) {
      institution = await Institution.create({
        name: INSTITUTION_NAME,
        domain: 'demo.fablet.dev',
        contactEmail: user.email,
        ownerId: user._id,
        planId: DEFAULT_INSTITUTION_PLAN,
        seats: planEntitlements(DEFAULT_INSTITUTION_PLAN).seats,
        status: 'trialing',
      })

      user.institutionId = institution._id
      user.institutionRole = 'owner'
      await user.save()

      await getSubscription('institution', institution._id.toString())
    }
  }

  return { accounts: INSTANT_IDENTITIES.length, institution: institution?.name ?? null }
}

/** Identities for the sign-in chooser. Only served when instant login is on. */
export function demoIdentities() {
  if (!env.instantLogin.enabled) return []
  return INSTANT_IDENTITIES.map(({ role, label, name, email, summary }) => ({
    role,
    label,
    name,
    email,
    summary,
    password: env.instantLogin.password,
  }))
}
