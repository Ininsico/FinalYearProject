import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { env } from './config/env.js'
import { connectDB } from './db.js'
import authRouter from './routes/auth.js'
import adminRouter from './routes/admin.js'
import subscriptionsRouter from './routes/subscriptions.js'
import institutionsRouter from './routes/institutions.js'
import premiumRouter from './routes/premium.js'
import { requireAuth } from './middleware/auth.js'
import { requireAdmin } from './middleware/admin.js'
import { startPaymentWatcher } from './lib/paymentWatcher.js'
import { ensureInstantLogins, demoIdentities } from './lib/instantLogins.js'
import User from './models/User.js'
import { z } from 'zod'
import { sendEmail } from './utils/email.js'

const app = express()

// Trust the nginx reverse proxy in front of this service so rate limiting and
// secure cookies resolve the real client IP from X-Forwarded-For / X-Forwarded-Proto.
app.set('trust proxy', 1)

// --- Security baseline ---
app.use(helmet())
app.use(
  cors({
    origin: env.frontendOrigin,
    credentials: true,
  })
)
app.use(cookieParser())
app.use(express.json({ limit: '10kb' }))

// Brute-force protection on the auth surface.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts, try again later' },
})
app.use('/api/auth', authLimiter)

app.get('/health', (req, res) => res.json({ ok: true }))

// Current user (protected) for session restore on the frontend.
app.get('/api/auth/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  res.json({ user: user.toPublicJSON() })
})

// Demo identities for the sign-in chooser. Empty unless INSTANT_LOGIN is on.
app.get('/api/auth/demo-identities', (req, res) => {
  res.json({ enabled: env.instantLogin.enabled, identities: demoIdentities() })
})

app.use('/api/auth', authRouter)

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts, try again later' },
})
app.use('/api/admin', adminLimiter, adminRouter)
app.get('/api/admin/dashboard', requireAdmin, async (req, res) => {
  const students = await User.countDocuments({ role: 'student' })
  const institutions = await User.countDocuments({ role: 'institution' })
  const admins = await User.countDocuments({ role: 'admin' })
  res.json({ stats: { students, institutions, admins } })
})

// Billing, institutions and premium (entitlement-gated) surfaces.
app.use('/api/subscriptions', subscriptionsRouter)
app.use('/api/institutions', institutionsRouter)
app.use('/api/premium', premiumRouter)

// Public contact form: emails the enquiry to the Fablet inbox.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages, try again later' },
})
const contactSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
  message: z.string().trim().min(1).max(5000),
})
app.post('/api/contact', contactLimiter, async (req, res) => {
  const parsed = contactSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message })
  }
  const { name, email, message } = parsed.data
  try {
    await sendEmail({
      to: env.contactInbox,
      replyTo: email,
      subject: `New Fablet enquiry from ${name}`,
      text: `${message}\n\nFrom: ${name} <${email}>`,
      html: `<p>${message.replace(/</g, '&amp;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')}</p>
             <p style="color:#666">From: ${name} &lt;${email}&gt;</p>`,
    })
    return res.json({ ok: true })
  } catch (err) {
    console.error('[contact] send failed:', err?.message || err)
    return res.status(502).json({ error: 'Could not send your message right now' })
  }
})

// Catch-all error handler — never leak internals.
app.use((err, req, res, next) => {
  console.error('[error]', err?.message || err)
  if (err?.code === 11000) {
    return res.status(409).json({ error: 'Resource already exists' })
  }
  res.status(500).json({ error: 'Internal server error' })
})

connectDB()
  .then(async () => {
    try {
      const seeded = await ensureInstantLogins()
      if (seeded) {
        console.log(`[demo] instant logins ready (${seeded.accounts} identities, ${seeded.institution})`)
      }
    } catch (err) {
      console.error('[demo] instant login seeding failed:', err?.message || err)
    }

    startPaymentWatcher()

    app.listen(env.port, () => {
      console.log(`[server] Fablet API listening on http://localhost:${env.port}`)
    })
  })
  .catch((err) => {
    console.error('[db] failed to connect:', err?.message || err)
    process.exit(1)
  })
