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
