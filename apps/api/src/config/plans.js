/**
 * Plan catalogue — the single source of truth for prices and entitlements.
 *
 * Premium (agentic orchestration and the video-generation agent) is unlocked by a
 * paid plan. Both individual students and institutions can subscribe; the only
 * difference is which plans they are offered and how many seats they carry.
 *
 * Prices are in USDT. A crypto deposit is matched against this exact figure
 * within a tolerance band.
 */

export const FEATURES = ['orchestration', 'video']

export const AUDIENCES = ['student', 'institution']

export const PLANS = [
  {
    id: 'student-basic',
    name: 'Student Basic',
    audience: 'student',
    amountUsdt: 0,
    period: 'free',
    summary: 'A free account for a single learner.',
    features: ['Personal workspace', 'Course productions', 'Community support'],
    entitlements: { seats: 1, features: [] },
  },
  {
    id: 'student-pro',
    name: 'Student Pro',
    audience: 'student',
    amountUsdt: 9,
    period: 'per month',
    summary: 'Unlocks the agentic orchestration and the AI video agent.',
    features: [
      'Everything in Basic',
      'Agentic orchestration',
      'AI video-generation agent',
      'Priority orchestration queue',
    ],
    entitlements: { seats: 1, features: ['orchestration', 'video'] },
    highlighted: true,
  },
  {
    id: 'institution-starter',
    name: 'Institution Starter',
    audience: 'institution',
    amountUsdt: 49,
    period: 'per month',
    summary: 'For a department or a small institution.',
    features: [
      'Everything in Student Pro',
      'Up to 10 seats',
      'Institution-wide productions',
      'Shared course library',
    ],
    entitlements: { seats: 10, features: ['orchestration', 'video'] },
  },
  {
    id: 'institution-scale',
    name: 'Institution Scale',
    audience: 'institution',
    amountUsdt: 149,
    period: 'per month',
    summary: 'For a whole institution, with priority support.',
    features: [
      'Everything in Starter',
      'Up to 50 seats',
      'Priority rendering and support',
      'Custom agent fine-tunes',
    ],
    entitlements: { seats: 50, features: ['orchestration', 'video'] },
  },
]

export const DEFAULT_STUDENT_PLAN = 'student-basic'
export const DEFAULT_INSTITUTION_PLAN = 'institution-starter'

/** How long a crypto deposit window stays open before the intent expires. */
export const PAYMENT_WINDOW_MINUTES = 60

/** Binance deposit status codes that mean the funds actually landed. */
export const CREDITED_STATUSES = new Set([1, 6])

export function findPlan(id) {
  return PLANS.find((plan) => plan.id === id) ?? null
}

export function defaultPlanFor(accountType) {
  return accountType === 'institution' ? DEFAULT_INSTITUTION_PLAN : DEFAULT_STUDENT_PLAN
}

export function planEntitlements(planId) {
  return findPlan(planId)?.entitlements ?? { seats: 1, features: [] }
}

export function plansForAudience(audience) {
  return PLANS.filter((plan) => !audience || plan.audience === audience)
}

/** Plans with entitlements inlined, shaped for the API (amount kept in `amountUsdt`). */
export function plansWithEntitlements() {
  return PLANS.map((plan) => ({ ...plan }))
}
