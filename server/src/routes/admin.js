import express from 'express'
import crypto from 'crypto'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { repo } from '../lib/store.js'
import { clone, normaliseContent, validateContent, sanitise, toCsv, CONTENT_VERSION } from '../lib/content.js'
import { imageUpload, storeImage, cloudinaryStatus, MAX_UPLOAD_BYTES } from '../uploads.js'
import { notify, notificationStatus, mailStatus, sendTestEmail, diagnoseMail, mailQueueStatus, deliverPayload } from '../lib/notify.js'
import { flushOutbox, retryAllNow } from '../lib/outbox.js'
import { getPublished } from './site.js'
import { EXPORT_COLUMNS } from './submissions.js'
import { defaultSite } from '../seed.js'

const router = express.Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.join(__dirname, '../../uploads')
const MAX_REVISIONS = 25

/* -------------------------------------------------------------- content */

router.get('/admin/content', async (_req, res, next) => {
  try {
    const state = await repo.readState()
    res.json({
      published: await getPublished(),
      draft: state.draft ? normaliseContent(state.draft) : null,
      hasDraft: Boolean(state.draft),
      publishedAt: state.publishedAt,
      publishedBy: state.publishedBy,
      contentVersion: CONTENT_VERSION,
      storage: (await import('../lib/store.js')).storageKind(),
      revisions: (state.revisions || []).slice(-MAX_REVISIONS).reverse().map(({ content, ...rest }) => rest)
    })
  } catch (error) { next(error) }
})

/** Saves the working draft. Nothing here reaches the public site. */
router.put('/admin/content/draft', async (req, res, next) => {
  try {
    const payload = req.body?.content ?? req.body
    const problems = validateContent(payload)
    if (problems.length) return res.status(400).json({ message: problems[0], problems })
    const state = await repo.readState()
    await repo.writeState({ ...state, draft: sanitise(payload) })
    res.json({ ok: true, savedAt: new Date().toISOString() })
  } catch (error) { next(error) }
})

/** Publishes either the supplied content or the current draft. */
/**
 * Keeps menu labels in step with the Services editor.
 *
 * The Services menu stores its own labels so they can be written for a menu
 * rather than a page. That is worth keeping — but when nobody has customised a
 * label (it still matches the old service name) and the service is renamed or
 * re-slugged, the menu should follow instead of going stale.
 */
function syncMenuLabels(previous, nextContent) {
  if (!Array.isArray(previous?.services) || !Array.isArray(nextContent?.nav)) return nextContent
  const bySlug = new Map(previous.services.map((service) => [service.slug, service]))
  const fresh = new Map((nextContent.services || []).map((service) => [service.slug, service]))

  nextContent.nav = nextContent.nav.map((group) => {
    if (group.label !== 'Services' || !Array.isArray(group.children)) return group
    return {
      ...group,
      children: group.children.map((child) => {
        const match = String(child.to || '').match(/^\/services\/([a-z0-9-]+)$/)
        if (!match) return child
        const old = bySlug.get(match[1])
        const current = fresh.get(match[1])
        if (!old || !current) return child

        // Only services that were actually renamed can touch the menu, and
        // only labels still matching the previous name. A menu label written
        // for the menu (e.g. “Websites, CMS & e-commerce”) is never overwritten.
        if (old.short === current.short && old.title === current.title) return child
        if (child.label === old.short) return { ...child, label: current.short || current.title || child.label }
        if (child.label === old.title) return { ...child, label: current.title || current.short || child.label }
        return child
      })
    }
  })
  return nextContent
}

router.post('/admin/content/publish', async (req, res, next) => {
  try {
    const state = await repo.readState()
    const source = req.body?.content ?? state.draft
    if (!source) return res.status(400).json({ message: 'There is nothing to publish yet. Save a draft first.' })
    const problems = validateContent(source)
    if (problems.length) return res.status(400).json({ message: problems[0], problems })

    const content = normaliseContent(sanitise(source))
    if (state.published) syncMenuLabels(state.published, content)
    const revision = {
      id: crypto.randomBytes(6).toString('hex'),
      at: new Date().toISOString(),
      by: req.admin?.email || 'admin',
      note: req.body?.note ? String(req.body.note).slice(0, 200) : 'Published from admin portal',
      content: state.published ? clone(state.published) : null
    }
    await repo.writeState({
      ...state,
      published: content,
      draft: null,
      publishedAt: revision.at,
      publishedBy: revision.by,
      revisions: [...(state.revisions || []), revision].slice(-MAX_REVISIONS)
    })
    res.json({ ok: true, publishedAt: revision.at, revision: revision.id })
  } catch (error) { next(error) }
})

router.post('/admin/content/discard', async (req, res, next) => {
  try {
    const state = await repo.readState()
    await repo.writeState({ ...state, draft: null })
    res.json({ ok: true })
  } catch (error) { next(error) }
})

router.get('/admin/content/revisions', async (_req, res, next) => {
  try {
    const state = await repo.readState()
    res.json((state.revisions || []).slice().reverse().map(({ content, ...rest }) => rest))
  } catch (error) { next(error) }
})

/** Rolls the site back to the state captured before a previous publish. */
router.post('/admin/content/revisions/:id/restore', async (req, res, next) => {
  try {
    const state = await repo.readState()
    const revision = (state.revisions || []).find((item) => item.id === req.params.id)
    if (!revision?.content) return res.status(404).json({ message: 'That revision is no longer available.' })
    const restored = normaliseContent(revision.content)
    const backup = {
      id: crypto.randomBytes(6).toString('hex'),
      at: new Date().toISOString(),
      by: req.admin?.email || 'admin',
      note: `Rolled back to revision from ${new Date(revision.at).toLocaleString('en-IN')}`,
      content: state.published ? clone(state.published) : null
    }
    await repo.writeState({
      ...state,
      published: restored,
      draft: null,
      publishedAt: backup.at,
      publishedBy: backup.by,
      revisions: [...(state.revisions || []), backup].slice(-MAX_REVISIONS)
    })
    res.json({ ok: true, restoredFrom: revision.id, publishedAt: backup.at })
  } catch (error) { next(error) }
})

/** Restores the shipped content. Used after a bad edit or for a clean demo. */
router.post('/admin/content/reset', async (req, res, next) => {
  try {
    if (req.body?.confirm !== 'RESET') return res.status(400).json({ message: 'Send { "confirm": "RESET" } to restore the shipped content.' })
    const state = await repo.readState()
    const backup = { id: crypto.randomBytes(6).toString('hex'), at: new Date().toISOString(), by: req.admin?.email || 'admin', note: 'Factory content restored', content: state.published ? clone(state.published) : null }
    const content = normaliseContent(clone(defaultSite))
    await repo.writeState({ ...state, published: content, draft: null, publishedAt: backup.at, publishedBy: backup.at && (req.admin?.email || 'admin'), revisions: [...(state.revisions || []), backup].slice(-MAX_REVISIONS) })
    res.json({ ok: true })
  } catch (error) { next(error) }
})

/* ---------------------------------------------------------------- media */

router.post('/admin/upload', (req, res, next) => {
  imageUpload.single('file')(req, res, async (error) => {
    if (error) {
      const tooBig = error.code === 'LIMIT_FILE_SIZE'
      return res.status(400).json({ message: tooBig ? 'That image is larger than 10MB. Please choose a smaller file.' : 'That file could not be read. Please try another image.' })
    }
    if (!req.file) return res.status(400).json({ message: 'Please choose a JPG, PNG, WEBP, AVIF, SVG or GIF image under 10MB.' })
    try {
      const stored = await storeImage(req.file, uploadDir)
      res.status(201).json({ ...stored, name: req.file.originalname, uploadedAt: new Date().toISOString() })
    } catch (e) { next(e) }
  })
})

router.get('/admin/upload/status', (_req, res) => {
  const { enabled, signed, cloudName } = cloudinaryStatus()
  res.json({
    storage: enabled ? 'cloudinary' : 'local',
    cloudName: enabled ? cloudName : null,
    mode: enabled ? (signed ? 'signed' : 'unsigned') : null,
    maxBytes: MAX_UPLOAD_BYTES,
    notifications: notificationStatus(),
    database: process.env.MONGODB_URI ? 'mongodb' : 'local'
  })
})

/** Lists locally stored uploads so the admin can reuse an image without re-uploading. */
router.get('/admin/media', async (_req, res, next) => {
  try {
    await fs.mkdir(uploadDir, { recursive: true })
    const files = await fs.readdir(uploadDir)
    const images = await Promise.all(files.filter((file) => /\.(jpe?g|png|webp|gif|avif|svg)$/i.test(file)).map(async (file) => {
      const stats = await fs.stat(path.join(uploadDir, file))
      return { name: file, url: `/uploads/${file}`, bytes: stats.size, uploadedAt: stats.mtime.toISOString() }
    }))
    images.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
    res.json({ images, ...cloudinaryStatusSummary() })
  } catch (error) { next(error) }
})

function cloudinaryStatusSummary() {
  const { enabled, cloudName } = cloudinaryStatus()
  return { storage: enabled ? 'cloudinary' : 'local', cloudName: enabled ? cloudName : null }
}

/* ----------------------------------------------------------- submissions */

const paginate = (rows, query) => {
  const page = Math.max(1, Number(query.page) || 1)
  const perPage = Math.min(100, Math.max(5, Number(query.perPage) || 25))
  return { rows: rows.slice((page - 1) * perPage, page * perPage), total: rows.length, page, perPage }
}

router.get('/admin/inquiries', async (req, res, next) => {
  try {
    const rows = await repo.listInquiries({ kind: req.query.kind, status: req.query.status, limit: 500 })
    const search = String(req.query.search || '').toLowerCase().trim()
    const filtered = search
      ? rows.filter((row) => [row.name, row.email, row.company, row.role, row.reference, row.message].some((field) => String(field || '').toLowerCase().includes(search)))
      : rows
    res.json({ ...paginate(filtered, req.query), counts: countBy(rows) })
  } catch (error) { next(error) }
})

router.patch('/admin/inquiries/:id', async (req, res, next) => {
  try {
    const patch = {}
    if (typeof req.body?.status === 'string') patch.status = req.body.status.slice(0, 30)
    if (typeof req.body?.note === 'string' && req.body.note.trim()) {
      const state = await repo.readState()
      const existing = (await repo.listInquiries({ limit: 500 })).find((row) => (row._id || row.reference || row.createdAt) === req.params.id)
      patch.notes = [...((existing?.notes) || []), { at: new Date().toISOString(), text: req.body.note.trim().slice(0, 1000), by: req.admin?.email || 'admin' }]
      void state
    }
    const updated = await repo.updateInquiry(req.params.id, patch)
    if (!updated) return res.status(404).json({ message: 'That record could not be found.' })
    res.json(updated)
  } catch (error) { next(error) }
})

router.get('/admin/registrations', async (req, res, next) => {
  try {
    const rows = await repo.listRegistrations({ type: req.query.type, status: req.query.status, limit: 500 })
    const search = String(req.query.search || '').toLowerCase().trim()
    const filtered = search
      ? rows.filter((row) => [row.name, row.company, row.email, row.reference, row.trades?.join(' '), row.trade, row.city].some((field) => String(field || '').toLowerCase().includes(search)))
      : rows
    const byType = {
      contractor: rows.filter((row) => row.type === 'contractor').length,
      worker: rows.filter((row) => row.type === 'worker').length
    }
    res.json({ ...paginate(filtered, req.query), counts: countBy(rows), byType })
  } catch (error) { next(error) }
})

router.patch('/admin/registrations/:id', async (req, res, next) => {
  try {
    const patch = {}
    if (typeof req.body?.status === 'string') patch.status = req.body.status.slice(0, 30)
    if (typeof req.body?.note === 'string' && req.body.note.trim()) {
      const existing = (await repo.listRegistrations({ limit: 500 })).find((row) => (row._id || row.reference || row.createdAt) === req.params.id)
      patch.notes = [...((existing?.notes) || []), { at: new Date().toISOString(), text: req.body.note.trim().slice(0, 1000), by: req.admin?.email || 'admin' }]
    }
    const updated = await repo.updateRegistration(req.params.id, patch)
    if (!updated) return res.status(404).json({ message: 'That registration could not be found.' })
    res.json(updated)
  } catch (error) { next(error) }
})

router.get('/admin/subscribers', async (_req, res, next) => {
  try { res.json(await repo.listSubscribers()) } catch (error) { next(error) }
})

/** CSV export used by the procurement and HR teams. */
router.get('/admin/export/:type', async (req, res, next) => {
  try {
    const type = req.params.type
    const rows = type === 'registrations'
      ? await repo.listRegistrations({ limit: 2000 })
      : type === 'subscribers'
        ? await repo.listSubscribers()
        : await repo.listInquiries({ limit: 2000 })
    const columns = EXPORT_COLUMNS[type] || EXPORT_COLUMNS.inquiries
    const shaped = rows.map((row) => ({
      ...row,
      trades: Array.isArray(row.trades) ? row.trades.join(' | ') : row.trades,
      createdAt: row.createdAt ? new Date(row.createdAt).toISOString().slice(0, 19).replace('T', ' ') : ''
    }))
    res.type('text/csv')
    res.set('Content-Disposition', `attachment; filename="ananta-${type}-${new Date().toISOString().slice(0, 10)}.csv"`)
    res.send(toCsv(shaped, columns))
  } catch (error) { next(error) }
})

/* ------------------------------------------------------------- dashboard */

router.get('/admin/stats', async (_req, res, next) => {
  try {
    const [inquiries, registrations, subscribers, site] = await Promise.all([
      repo.listInquiries({ limit: 1000 }),
      repo.listRegistrations({ limit: 1000 }),
      repo.listSubscribers(),
      getPublished()
    ])
    const state = await repo.readState()
    const week = Date.now() - 7 * 24 * 3600 * 1000
    const recent = (rows) => rows.filter((row) => row.createdAt && new Date(row.createdAt).getTime() > week).length
    res.json({
      inquiries: { total: inquiries.length, new: inquiries.filter((row) => (row.status || 'new') === 'new').length, thisWeek: recent(inquiries), counts: countBy(inquiries) },
      registrations: {
        total: registrations.length,
        new: registrations.filter((row) => (row.status || 'new') === 'new').length,
        thisWeek: recent(registrations),
        contractor: registrations.filter((row) => row.type === 'contractor').length,
        worker: registrations.filter((row) => row.type === 'worker').length
      },
      subscribers: { total: subscribers.length },
      content: {
        hasDraft: Boolean(state.draft),
        publishedAt: state.publishedAt,
        publishedBy: state.publishedBy,
        revisions: (state.revisions || []).length,
        contentVersion: CONTENT_VERSION
      },
      portfolio: {
        projects: site.projects.length,
        inProgress: site.projects.filter((project) => project.status === 'In progress').length,
        services: site.services.length,
        sectors: site.sectors.length,
        insights: site.insights.length,
        openRoles: site.jobs.length,
        offices: site.offices.length
      },
      notification: notificationStatus()
    })
  } catch (error) { next(error) }
})

/** Sends a test email (and webhook, if configured) so the inbox can be verified. */
router.post('/admin/notify/test', async (req, res, next) => {
  try {
    const recipient = String(req.body?.email || '').trim()
    const email = await sendTestEmail(recipient || undefined)
    const webhook = await notify({ type: 'test', name: 'Ananta admin', email: recipient || null, message: 'Notification webhook test from the admin portal.' })
    res.json({
      email,
      webhook: webhook.webhook,
      diagnostics: email.diagnostics,
      mail: mailStatus(),
      status: notificationStatus(),
      outbox: await mailQueueStatus()
    })
  } catch (error) { next(error) }
})

/**
 * Step-by-step connection check: configuration, DNS, TCP, TLS, sign-in and
 * sender address. This is the screen that answers "why did no email arrive?".
 */
router.post('/admin/notify/diagnose', async (req, res, next) => {
  try {
    const recipient = String(req.body?.email || '').trim()
    const report = await diagnoseMail({ sendTest: Boolean(req.body?.send), recipient: recipient || undefined })
    res.json({ ...report, mail: mailStatus(), outbox: await mailQueueStatus() })
  } catch (error) { next(error) }
})

/** Health of the outbound email channel, shown in the admin dashboard. */
router.get('/admin/notify/status', async (_req, res, next) => {
  try {
    res.json({ mail: mailStatus(), status: notificationStatus(), outbox: await mailQueueStatus() })
  } catch (error) { next(error) }
})

/** Re-sends every enquiry still waiting in the outbox. */
router.post('/admin/notify/outbox/retry', async (_req, res, next) => {
  try {
    await retryAllNow()
    const report = await flushOutbox({ deliver: deliverPayload, limit: 25, force: true })
    res.json({ report, outbox: await mailQueueStatus(), mail: mailStatus() })
  } catch (error) { next(error) }
})

function countBy(rows) {
  return rows.reduce((acc, row) => {
    const key = row.status || 'new'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
}

export default router
