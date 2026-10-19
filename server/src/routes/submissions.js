import express from 'express'
import crypto from 'crypto'
import { repo } from '../lib/store.js'
import { getPublished } from './site.js'
import { notify, rateLimit } from '../lib/notify.js'
import { toCsv } from '../lib/content.js'

const router = express.Router()

const text = (value, max = 800) => (typeof value === 'string' ? value.trim().slice(0, max) : '')
const list = (value, max = 24) => (Array.isArray(value) ? value.slice(0, max).map((item) => text(item, 120)).filter(Boolean) : text(value, 300) ? [text(value, 300)] : [])
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
const isPhone = (value) => /^[+]?[\d\s()-]{7,18}$/.test(value)

export function reference(kind) {
  const prefix = { contractor: 'ANC', worker: 'ANW', career: 'ANH', contact: 'ANQ', tender: 'ANT', download: 'AND', vendor: 'ANV' }[kind] || 'ANA'
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, '')
  return `${prefix}-${stamp}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`
}

const meta = (req) => ({ ip: (req.ip || '').slice(0, 60), source: text(req.body?.source, 120) || 'website' })

/** Columns used for the admin CSV export of every submission type. */
export const EXPORT_COLUMNS = {
  inquiries: [
    { key: 'reference', label: 'Reference' }, { key: 'kind', label: 'Type' }, { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Received' }, { key: 'name', label: 'Name' }, { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' }, { key: 'company', label: 'Company' }, { key: 'role', label: 'Role' },
    { key: 'city', label: 'City' }, { key: 'experience', label: 'Experience' }, { key: 'message', label: 'Message' }
  ],
  registrations: [
    { key: 'reference', label: 'Reference' }, { key: 'type', label: 'Registration type' }, { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Received' }, { key: 'company', label: 'Company' }, { key: 'name', label: 'Contact' },
    { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' }, { key: 'city', label: 'City' },
    { key: 'trades', label: 'Trades' }, { key: 'scale', label: 'Scale' }, { key: 'experience', label: 'Experience' },
    { key: 'gst', label: 'GST' }
  ],
  subscribers: [
    { key: 'createdAt', label: 'Subscribed' }, { key: 'email', label: 'Email' }, { key: 'name', label: 'Name' },
    { key: 'source', label: 'Source' }, { key: 'status', label: 'Status' }
  ]
}

/* ------------------------------------------------------------------ contact */

router.post('/contact', rateLimit({ key: 'contact', max: 6 }), async (req, res, next) => {
  try {
    const record = {
      kind: 'contact',
      reference: reference('contact'),
      name: text(req.body?.name, 120),
      email: text(req.body?.email, 160).toLowerCase(),
      phone: text(req.body?.phone, 40),
      company: text(req.body?.company, 160),
      department: text(req.body?.department, 120),
      city: text(req.body?.city, 120),
      interest: text(req.body?.interest, 160),
      message: text(req.body?.message, 4000),
      consent: Boolean(req.body?.consent),
      ...meta(req)
    }
    const problems = []
    if (!record.name) problems.push('your name')
    if (!isEmail(record.email)) problems.push('a valid email address')
    if (!record.message) problems.push('a short note about your project')
    if (record.phone && !isPhone(record.phone)) problems.push('a valid phone number')
    if (problems.length) return res.status(400).json({ message: `Please provide ${problems.join(', ')}.` })

    const saved = await repo.addInquiry(record)
    // Deliver to the support inbox before replying, so the visitor is only told
    // the message is "with our team" once it actually is (or once it is safely
    // stored in the inbox when email is not configured).
    const delivery = await notify({
      type: 'contact-enquiry', reference: saved.reference, name: record.name, email: record.email,
      phone: record.phone, company: record.company, department: record.department, city: record.city,
      message: record.message, source: record.source, at: saved.createdAt
    })
    await repo.updateInquiry(saved.id || saved.reference, { delivery })
    res.status(201).json({
      message: delivery?.email?.sent
        ? 'Thank you. Your enquiry has reached our team inbox and you will hear from us within one working day.'
        : 'Thank you. Your enquiry is with our team and you will hear from us within one working day.',
      reference: saved.reference
    })
  } catch (error) { next(error) }
})

/* ----------------------------------------------------------------- careers */

router.post('/careers', rateLimit({ key: 'careers', max: 6 }), async (req, res, next) => {
  try {
    const record = {
      kind: 'career',
      reference: reference('career'),
      name: text(req.body?.name, 120),
      email: text(req.body?.email, 160).toLowerCase(),
      phone: text(req.body?.phone, 40),
      role: text(req.body?.role, 200),
      jobId: text(req.body?.jobId, 120),
      department: text(req.body?.department, 120),
      city: text(req.body?.city, 120),
      experience: text(req.body?.experience, 60),
      currentCtc: text(req.body?.currentCtc, 60),
      expectedCtc: text(req.body?.expectedCtc, 60),
      noticePeriod: text(req.body?.noticePeriod, 60),
      cv: text(req.body?.cv, 600),
      portfolio: text(req.body?.portfolio, 600),
      message: text(req.body?.message, 4000),
      consent: Boolean(req.body?.consent),
      ...meta(req)
    }
    const problems = []
    if (!record.name) problems.push('your name')
    if (!isEmail(record.email)) problems.push('a valid email address')
    if (!record.role) problems.push('the role you are applying for')
    if (record.cv && !/^https?:\/\//i.test(record.cv)) problems.push('a valid portfolio or CV link starting with http')
    if (problems.length) return res.status(400).json({ message: `Please provide ${problems.join(', ')}.` })

    const saved = await repo.addInquiry(record)
    const delivery = await notify({
      type: 'job-application', reference: saved.reference, role: record.role, name: record.name,
      email: record.email, phone: record.phone, experience: record.experience, city: record.city,
      message: record.message, source: record.source, at: saved.createdAt
    })
    await repo.updateInquiry(saved.id || saved.reference, { delivery })
    res.status(201).json({
      message: `Application received for ${record.role}. Our recruitment team reviews every application within five working days.`,
      reference: saved.reference
    })
  } catch (error) { next(error) }
})

/* ---------------------------------------- contractor & worker registration */

const CONTRACTOR_KINDS = new Set(['contractor', 'supplier', 'vendor', 'consultant'])

router.post('/register', rateLimit({ key: 'register', max: 6 }), async (req, res, next) => {
  try {
    /**
     * The registration section can be switched off from the CMS while the full
     * portal is still being built. When it is off, refuse submissions outright
     * rather than accepting applications nobody can act on yet.
     */
    const site = await getPublished()
    if (site?.register && site.register.enabled === false) {
      const status = site.register.status || 'Coming soon'
      return res.status(403).json({
        message: `Registration is not open yet — ${status.toLowerCase()}. Our contractor and worker portal opens shortly; until then please write to support@anantainfratechsolutions.com (contractors) or support@anantainfratechsolutions.com (workers) and the team will contact you when applications open.`
      })
    }
    const type = CONTRACTOR_KINDS.has(text(req.body?.type, 40)) ? 'contractor' : 'worker'
    const base = {
      type,
      reference: reference(type),
      name: text(req.body?.name, 120),
      email: text(req.body?.email, 160).toLowerCase(),
      phone: text(req.body?.phone, 40),
      city: text(req.body?.city, 120),
      state: text(req.body?.state, 80),
      message: text(req.body?.message, 3000),
      consent: Boolean(req.body?.consent),
      ...meta(req)
    }

    const record = type === 'contractor'
      ? {
          ...base,
          company: text(req.body?.company, 180),
          trades: list(req.body?.trades),
          scale: text(req.body?.scale, 60),
          gst: text(req.body?.gst, 20),
          pan: text(req.body?.pan, 20),
          licences: text(req.body?.licences, 400),
          employees: text(req.body?.employees, 60),
          regions: list(req.body?.regions),
          pastWork: text(req.body?.pastWork, 2000)
        }
      : {
          ...base,
          trade: text(req.body?.trade, 160),
          trades: list(req.body?.trades) ,
          experience: text(req.body?.experience, 60),
          certification: text(req.body?.certification, 300),
          preferredLocation: text(req.body?.preferredLocation, 120)
        }

    const problems = []
    if (!record.name) problems.push(type === 'contractor' ? 'a contact person' : 'your full name')
    if (!isEmail(record.email)) problems.push('a valid email address')
    if (!record.phone) problems.push('a phone number')
    if (type === 'contractor' && !record.company) problems.push('your company or firm name')
    if (type === 'contractor' && !record.trades.length) problems.push('at least one trade or supply category')
    if (type === 'worker' && !record.trade && !record.trades.length) problems.push('your trade or skill')
    if (problems.length) return res.status(400).json({ message: `Please provide ${problems.join(', ')}.` })

    const saved = await repo.addRegistration(record)
    const delivery = await notify({
      type: type === 'contractor' ? 'registration-contractor' : 'registration-worker',
      reference: saved.reference,
      company: saved.company || null,
      name: saved.name,
      email: saved.email,
      phone: saved.phone,
      trades: saved.trades,
      city: saved.city,
      message: saved.message,
      at: saved.createdAt
    })
    await repo.updateRegistration(saved.id || saved.reference, { delivery })
    res.status(201).json({
      message: type === 'contractor'
        ? `Thank you. Your company is on our contractor interest list — reference ${saved.reference}. Our procurement team will contact you as registration opens.`
        : `Thank you. You are on our worker interest list — reference ${saved.reference}. We will contact you by phone and SMS as registration opens.`,
      reference: saved.reference,
      queued: true
    })
  } catch (error) { next(error) }
})

/* -------------------------------------------------------- tenders & vendors */

router.post('/tenders/enquiry', rateLimit({ key: 'tender', max: 6 }), async (req, res, next) => {
  try {
    const record = {
      kind: 'tender',
      reference: reference('tender'),
      name: text(req.body?.name, 120),
      company: text(req.body?.company, 180),
      email: text(req.body?.email, 160).toLowerCase(),
      phone: text(req.body?.phone, 40),
      city: text(req.body?.city, 120),
      interest: text(req.body?.package, 200),
      message: text(req.body?.message, 3000),
      consent: Boolean(req.body?.consent),
      ...meta(req)
    }
    if (!record.name || !isEmail(record.email) || !record.message) {
      return res.status(400).json({ message: 'Please provide your name, a valid email address and a short note about your enquiry.' })
    }
    const saved = await repo.addInquiry(record)
    const delivery = await notify({
      type: 'contact-enquiry', reference: saved.reference, company: record.company, name: record.name,
      email: record.email, phone: record.phone, interest: record.interest, message: record.message,
      messageType: 'Tender enquiry', at: saved.createdAt
    })
    await repo.updateInquiry(saved.id || saved.reference, { delivery })
    res.status(201).json({ message: 'Your tender enquiry has reached our procurement team. We respond to all enquiries in writing.', reference: saved.reference })
  } catch (error) { next(error) }
})

router.post('/downloads/request', rateLimit({ key: 'download', max: 8 }), async (req, res, next) => {
  try {
    const record = {
      kind: 'download',
      reference: reference('download'),
      name: text(req.body?.name, 120),
      company: text(req.body?.company, 180),
      email: text(req.body?.email, 160).toLowerCase(),
      phone: text(req.body?.phone, 40),
      role: text(req.body?.role, 120),
      documents: list(req.body?.documents, 12).join(', '),
      message: text(req.body?.message, 1000),
      consent: Boolean(req.body?.consent),
      ...meta(req)
    }
    if (!record.name || !isEmail(record.email) || !record.documents) {
      return res.status(400).json({ message: 'Please provide your name, a valid email address and at least one document to send.' })
    }
    const saved = await repo.addInquiry(record)
    const delivery = await notify({
      type: 'contact-enquiry', reference: saved.reference, name: record.name, company: record.company,
      email: record.email, phone: record.phone, interest: `Document request: ${record.documents}`,
      message: record.message, at: saved.createdAt
    })
    await repo.updateInquiry(saved.id || saved.reference, { delivery })
    res.status(201).json({ message: 'Thank you. The documents you selected are on their way to your inbox.', reference: saved.reference })
  } catch (error) { next(error) }
})

/* ------------------------------------------------------------- subscribers */

router.post('/subscribe', rateLimit({ key: 'subscribe', max: 5 }), async (req, res, next) => {
  try {
    const email = text(req.body?.email, 160).toLowerCase()
    if (!isEmail(email)) return res.status(400).json({ message: 'Please enter a valid email address.' })
    const saved = await repo.addSubscriber({ email, name: text(req.body?.name, 120), source: text(req.body?.source, 80) || 'website' })
    await notify({ type: 'newsletter', reference: 'NEWSLETTER', email, name: saved?.name || '', source: saved?.source || 'website', at: new Date().toISOString() })
    res.status(201).json({ message: 'You are subscribed. Look out for our next quarterly brief.' })
  } catch (error) { next(error) }
})

/* -------------------------------------------------------- application tracking */

router.get('/track', rateLimit({ key: 'track', max: 20 }), async (req, res, next) => {
  try {
    const ref = text(req.query?.reference, 40).toUpperCase()
    const email = text(req.query?.email, 160).toLowerCase()
    if (!ref && !email) return res.status(400).json({ message: 'Enter the reference number from your acknowledgement, or the email address you applied with.' })

    const wanted = (row) => (ref && String(row.reference || '').toUpperCase() === ref) || (email && String(row.email || '').toLowerCase() === email)
    const inquiries = (await repo.listInquiries({ limit: 500 })).filter(wanted).slice(0, 6)
    const registrations = (await repo.listRegistrations({ limit: 500 })).filter(wanted).slice(0, 6)

    const shape = (row, type) => ({
      reference: row.reference || '—',
      type,
      label:
        row.kind === 'career' ? `Job application — ${row.role || 'role'}`
          : row.kind === 'tender' ? 'Tender enquiry'
            : row.kind === 'download' ? 'Document request'
              : row.kind === 'contact' ? 'Project enquiry'
                : row.type === 'contractor' ? 'Contractor / supplier registration'
                  : 'Worker registration',
      status: row.status || 'new',
      submittedAt: row.createdAt || row.updatedAt || null,
      updatedAt: row.updatedAt || null
    })

    res.json({
      results: [...inquiries.map((row) => shape(row, 'inquiry')), ...registrations.map((row) => shape(row, 'registration'))],
      statuses: ['new', 'reviewing', 'shortlisted', 'contacted', 'closed']
    })
  } catch (error) { next(error) }
})

export default router
export { toCsv }
