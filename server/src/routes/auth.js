import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { rateLimit } from '../lib/notify.js'

const router = express.Router()
export const JWT_SECRET = () => process.env.JWT_SECRET || 'change-this-before-production'
const ADMIN_EMAIL = () => (process.env.ADMIN_EMAIL || 'admin@anantainfratech.com').toLowerCase()

export function protect(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  try {
    req.admin = jwt.verify(token, JWT_SECRET())
    if (req.admin?.role !== 'admin') throw new Error('Insufficient role')
    next()
  } catch {
    res.status(401).json({ message: 'Your session has expired. Please sign in again.' })
  }
}

const input = (value, max = 400) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

router.post('/auth/login', rateLimit({ key: 'login', max: 10, windowMs: 300_000 }), async (req, res) => {
  const email = input(req.body?.email, 160).toLowerCase()
  const password = input(req.body?.password, 200)
  if (!email || !password) return res.status(400).json({ message: 'Enter your email and password.' })

  const configuredHash = process.env.ADMIN_PASSWORD_HASH
  const fallbackPassword = process.env.ADMIN_PASSWORD || 'Ananta@2016'
  const passwordOk = configuredHash ? await bcrypt.compare(password, configuredHash) : password === fallbackPassword
  const emailOk = email === ADMIN_EMAIL()

  if (!passwordOk || !emailOk) {
    return res.status(401).json({ message: 'That email and password combination is not recognised.' })
  }

  res.json({
    token: jwt.sign({ email, role: 'admin' }, JWT_SECRET(), { expiresIn: '12h' }),
    user: { email, name: 'Ananta administrator', role: 'Administrator' },
    usingDefaultPassword: !configuredHash && !process.env.ADMIN_PASSWORD
  })
})

/** Lets the portal confirm a stored token is still valid on reload. */
router.get('/auth/session', protect, (req, res) => {
  res.json({
    user: { email: req.admin.email, role: 'Administrator' },
    expiresAt: req.admin.exp ? new Date(req.admin.exp * 1000).toISOString() : null
  })
})

export default router
