import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import fs from 'fs/promises'
import path from 'path'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { defaultSite } from './seed.js'
import { Site, Project, Inquiry } from './models.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5050
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-before-production'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@anantainfratech.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Ananta@2016'
const dataPath = path.join(__dirname, '../data/cms.json')
const uploadDir = path.join(__dirname, '../uploads')
const upload = multer({ storage: multer.diskStorage({ destination: (_req, _file, cb) => { fs.mkdir(uploadDir, { recursive: true }).then(() => cb(null, uploadDir)).catch(cb) }, filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-')}`) }), limits: { fileSize: 7 * 1024 * 1024 }, fileFilter: (_req, file, cb) => cb(null, /^image\/(jpeg|jpg|png|webp|gif)$/.test(file.mimetype)) })
let mongoReady = false

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use('/uploads', express.static(uploadDir))

const copy = (value) => JSON.parse(JSON.stringify(value))
async function readLocal() {
  try { return JSON.parse(await fs.readFile(dataPath, 'utf8')) } catch { return copy(defaultSite) }
}
async function writeLocal(content) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true })
  await fs.writeFile(dataPath, JSON.stringify(content, null, 2))
}
async function getSite() {
  if (!mongoReady) return readLocal()
  let doc = await Site.findOne({ key: 'primary' }).lean()
  if (!doc) { doc = await Site.create({ key: 'primary', content: defaultSite }); return doc.content }
  return doc.content
}
async function saveSite(content) {
  if (!mongoReady) return writeLocal(content)
  await Site.findOneAndUpdate({ key: 'primary' }, { content }, { upsert: true, new: true })
}
function protect(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  try { req.admin = jwt.verify(token, JWT_SECRET); next() } catch { res.status(401).json({ message: 'Please sign in to continue.' }) }
}
function input(value, max = 6000) { return typeof value === 'string' ? value.trim().slice(0, max) : '' }

app.get('/api/health', (_req, res) => res.json({ ok: true, database: mongoReady ? 'mongodb' : 'local-fallback' }))
app.get('/api/site', async (_req, res, next) => { try { res.json(await getSite()) } catch (e) { next(e) } })
app.post('/api/auth/login', async (req, res) => {
  const email = input(req.body.email, 120).toLowerCase()
  const password = input(req.body.password, 200)
  const configuredHash = process.env.ADMIN_PASSWORD_HASH
  const valid = configuredHash ? await bcrypt.compare(password, configuredHash) : (email === ADMIN_EMAIL && password === ADMIN_PASSWORD)
  if (!valid || email !== ADMIN_EMAIL) return res.status(401).json({ message: 'Email or password is not recognised.' })
  res.json({ token: jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '8h' }), user: { email, name: 'Ananta administrator' } })
})
app.put('/api/admin/site', protect, async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return res.status(400).json({ message: 'A site content object is required.' })
    await saveSite(req.body)
    res.json({ ok: true, updatedAt: new Date().toISOString() })
  } catch (e) { next(e) }
})
app.post('/api/admin/upload', protect, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Please upload a JPG, PNG, WEBP or GIF image under 7MB.' })
  res.status(201).json({ url: `/uploads/${req.file.filename}`, name: req.file.originalname })
})
app.post('/api/contact', async (req, res, next) => {
  try {
    const inquiry = { kind: 'contact', name: input(req.body.name, 120), email: input(req.body.email, 160), phone: input(req.body.phone, 50), company: input(req.body.company, 160), message: input(req.body.message, 4000) }
    if (!inquiry.name || !inquiry.email || !inquiry.message) return res.status(400).json({ message: 'Name, email and a project note are required.' })
    if (mongoReady) await Inquiry.create(inquiry); else { const site = await readLocal(); site.inquiries = [...(site.inquiries || []), { ...inquiry, createdAt: new Date().toISOString() }]; await writeLocal(site) }
    res.status(201).json({ message: 'Thank you. Our team will be in touch shortly.' })
  } catch (e) { next(e) }
})
app.post('/api/careers', async (req, res, next) => {
  try {
    const inquiry = { kind: 'career', name: input(req.body.name, 120), email: input(req.body.email, 160), phone: input(req.body.phone, 50), role: input(req.body.role, 160), message: input(req.body.message, 4000), cv: input(req.body.cv, 500) }
    if (!inquiry.name || !inquiry.email || !inquiry.role) return res.status(400).json({ message: 'Name, email and role are required.' })
    if (mongoReady) await Inquiry.create(inquiry); else { const site = await readLocal(); site.inquiries = [...(site.inquiries || []), { ...inquiry, createdAt: new Date().toISOString() }]; await writeLocal(site) }
    res.status(201).json({ message: 'Application received. Thank you for your interest in Ananta.' })
  } catch (e) { next(e) }
})
app.get('/api/admin/inquiries', protect, async (_req, res, next) => {
  try { res.json(mongoReady ? await Inquiry.find().sort({ createdAt: -1 }).lean() : (await readLocal()).inquiries || []) } catch (e) { next(e) }
})
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ message: 'Something went wrong. Please try again.' }) })

if (process.env.NODE_ENV === 'production') {
  const clientDist = path.resolve(__dirname, '../../client/dist')
  app.use(express.static(clientDist))
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')))
}

async function boot() {
  if (process.env.MONGODB_URI) {
    try { await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 4000 }); mongoReady = true; console.log('Connected to MongoDB') }
    catch (error) { console.warn('MongoDB unavailable; using local CMS fallback.', error.message) }
  } else console.log('MONGODB_URI not set; using local CMS fallback.')
  app.listen(PORT, '0.0.0.0', () => console.log(`Ananta API on http://0.0.0.0:${PORT}`))
}
boot()
