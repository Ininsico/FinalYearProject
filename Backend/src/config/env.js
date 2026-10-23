import dotenv from 'dotenv'

dotenv.config()

const REQUIRED = ['MONGODB_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']

for (const key of REQUIRED) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

function parseMs(value, fallback) {
  if (!value) return fallback
  const match = /^(\d+)\s*(s|m|h|d)$/.exec(value.trim())
  if (!match) return fallback
  const n = Number(match[1])
  const unit = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[match[2]]
  return n * unit
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenMs: parseMs(process.env.ACCESS_TOKEN_TTL, 15 * 60_000),
  refreshTokenMs: parseMs(process.env.REFRESH_TOKEN_TTL, 7 * 86_400_000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  cookieSecure:
    process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
  cookieSameSite: process.env.COOKIE_SAME_SITE || 'strict',
  isProd: process.env.NODE_ENV === 'production',

  // Password reset (Brevo email + signed reset token)
  jwtResetSecret: process.env.JWT_RESET_SECRET || '',
  resetTokenMs: parseMs(process.env.RESET_TOKEN_TTL, 15 * 60_000),
  // Email verification / account activation (reuses reset token TTL)
  jwtVerifySecret: process.env.JWT_VERIFY_SECRET || process.env.JWT_RESET_SECRET || '',
  resetFrontendUrl:
    process.env.RESET_FRONTEND_URL ||
    `${process.env.FRONTEND_ORIGIN || 'http://localhost:5173'}/auth/reset`,

  // Email via the self-hosted mail gateway (mailapi -> docker-mailserver)
  mailApiUrl: process.env.MAILAPI_URL || 'http://127.0.0.1:5021',
  mailApiKey: process.env.MAILAPI_KEY || '',
  mailFrom: process.env.MAIL_FROM || 'fablet@artdevelopers.site',
  mailFromName: process.env.MAIL_FROM_NAME || 'Fablet',
  contactInbox: process.env.CONTACT_INBOX || 'fablet@artdevelopers.site',

  // Other integrations (available for future endpoints)
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    url: process.env.CLOUDINARY_URL || '',
  },
  groqApiKey: process.env.GROQ_API_KEY || '',

  // Crypto payments — READ-ONLY Binance access for deposit matching.
  binance: {
    apiKey: process.env.BINANCE_API_KEY || '',
    apiSecret: process.env.BINANCE_API_SECRET || '',
    baseUrl: process.env.BINANCE_BASE_URL || 'https://api.binance.com',
    coin: process.env.BINANCE_DEPOSIT_COIN || 'USDT',
    network: process.env.BINANCE_DEPOSIT_NETWORK || 'TRX',
    get configured() {
      return Boolean(this.apiKey && this.apiSecret)
    },
  },

  payments: {
    tolerancePercent: Number(process.env.PAYMENTS_TOLERANCE_PERCENT) || 2,
    pollSeconds: Number(process.env.PAYMENTS_POLL_SECONDS) || 45,
  },

  subscriptions: {
    trialDays: Number(process.env.SUBSCRIPTION_TRIAL_DAYS) || 14,
    periodDays: Number(process.env.SUBSCRIPTION_PERIOD_DAYS) || 30,
  },

  // Instant demo logins, one identity per role. Off unless explicitly enabled.
  instantLogin: {
    enabled: process.env.INSTANT_LOGIN === 'true',
    password: process.env.INSTANT_DEMO_PASSWORD || 'InstantDemo123',
  },
}
