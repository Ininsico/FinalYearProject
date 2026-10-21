import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { env } from './config/env.js'
import { connectDB } from './db.js'
import authRouter from './routes/auth.js'
import adminRouter from './routes/admin.js'
import { requireAuth } from './middleware/auth.js'
import { requireAdmin } from './middleware/admin.js'
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
  const users = await User.countDocuments({ role: 'user' })
  const admins = await User.countDocuments({ role: 'admin' })
  res.json({ stats: { users, admins } })
})

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
      html: `<p>${message.replace(/</g, '&amp;').replace(/>/g, '&amp;').replace(/\n/g, '<br/>')}</p>
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
  .then(() => {
    app.listen(env.port, () => {
      console.log(`[server] Auth API listening on http://localhost:${env.port}`)
    })
  })
  .catch((err) => {
    console.error('[db] failed to connect:', err?.message || err)
    process.exit(1)
  })
