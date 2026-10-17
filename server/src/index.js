import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import siteRoutes, { seoRouter, getPublished } from './routes/site.js'
import authRoutes, { protect } from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import submissionRoutes from './routes/submissions.js'
import { useMongo, useLocal, storageKind } from './lib/store.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5050

app.disable('x-powered-by')
app.set('trust proxy', 1)

app.use(cors({ origin: true }))
app.use(express.json({ limit: '4mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), { maxAge: '7d' }))

// A tiny security header set that does not interfere with the Vite preview proxy.
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'SAMEORIGIN'
  })
  next()
})

// The database connection runs in parallel with the HTTP listener coming up,
// so an early request is held briefly (max 8s) instead of being refused with
// ECONNREFUSED while MongoDB's connect/timeout window plays out. `databaseReady`
// is resolved once the storage backend has been chosen (see `boot` below); the
// store itself defaults to the durable local store, so a timeout here still
// leaves the API able to answer.
let markDatabaseReady
const databaseReady = new Promise((resolve) => { markDatabaseReady = resolve })
app.use('/api', async (req, _res, next) => {
  if (req.path === '/health') return next() // health probes must never queue
  await Promise.race([databaseReady, new Promise((resolve) => setTimeout(resolve, 8000))])
  return next()
})

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    database: storageKind(),
    contentVersion: 2,
    uptimeSeconds: Math.round(process.uptime()),
    at: new Date().toISOString()
  })
})

app.use('/api', siteRoutes)
app.use('/', seoRouter)
app.use('/api', authRoutes)
app.use('/api', submissionRoutes)
app.use('/api', protect, adminRoutes)

app.use('/api', (_req, res) => res.status(404).json({ message: 'That API endpoint does not exist.' }))

// In production the built React app is served from this same server.
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.resolve(__dirname, '../../client/dist')
  app.use(express.static(clientDist, { maxAge: '1h', index: false }))
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')))
}

// eslint-disable-next-line no-unused-vars
app.use((error, _req, res, _next) => {
  console.error('Unhandled error:', error)
  if (error?.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'That file is too large.' })
  res.status(500).json({ message: 'Something went wrong on our side. Please try again in a moment.' })
})

async function connectDatabase() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
      useMongo()
      console.log('✔ Connected to MongoDB — content, enquiries and registrations persist in the database.')
    } catch (error) {
      console.warn('⚠ MongoDB unavailable, using the durable local store instead:', error.message)
      useLocal()
    }
  } else {
    useLocal()
    console.log('• MONGODB_URI not set — using the durable local store at server/data/cms.json')
  }

  // Make sure a first-run site has something to serve.
  try { await getPublished() } catch (error) { console.warn('Could not prepare initial content:', error.message) }
}

async function boot() {
  await fs.mkdir(path.join(__dirname, '../data'), { recursive: true })
  await fs.mkdir(path.join(__dirname, '../uploads'), { recursive: true })

  // Connect the database in parallel with opening the port: the listener
  // comes up immediately so the Vite dev proxy no longer gets ECONNREFUSED
  // during boot, and the readiness gate above holds `/api` requests until
  // the storage backend is settled (local by default, MongoDB if it connects).
  // Held requests are queued by the gate — that delay is invisible next to
  // the old behaviour (a failed page load), and it empties the moment
  // `connectDatabase` settles.
  void connectDatabase().finally(markDatabaseReady)

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`▲ Ananta API listening on http://0.0.0.0:${PORT}`)
    console.log(`  • Storage: ${storageKind()}`)
    console.log(`  • Admin portal: /admin`)
  })
}

boot()
