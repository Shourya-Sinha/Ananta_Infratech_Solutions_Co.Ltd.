import { defaultSite } from '../seed.js'

export const CONTENT_VERSION = 3

const LEGACY_LOGOS = ['/assets/dlogo-removebg.png', '/assets/logo.png', '/assets/logo.jpeg', '/assets/logo.jpg', 'dlogo-removebg.png', '']
const PRIMARY_LOGO = defaultSite.company.logo

export const clone = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)))
const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value)

/**
 * Fills in anything a stored content record is missing.
 *
 * Stored values always win — this function only adds keys that do not exist yet,
 * which is what lets us ship new pages and sections to a live site without
 * overwriting the client's own words.
 */
export function mergeWithDefaults(stored, defaults = defaultSite) {
  if (Array.isArray(defaults)) return Array.isArray(stored) ? stored : clone(defaults)
  if (!isPlainObject(defaults)) return stored === undefined ? defaults : stored
  const out = isPlainObject(stored) ? { ...stored } : {}
  for (const [key, value] of Object.entries(defaults)) {
    if (out[key] === undefined || out[key] === null) out[key] = clone(value)
    else if (isPlainObject(value) && isPlainObject(out[key])) out[key] = mergeWithDefaults(out[key], value)
    else if (Array.isArray(value) && !Array.isArray(out[key])) out[key] = clone(value)
  }
  return out
}

/** Repairs brand and image references that would otherwise 404. */
export function normaliseContent(content) {
  const previousVersion = Number(content?.contentVersion || 0)
  const migrated = clone(content || {})

  // One-time additive migration for previously saved CMS content. Existing
  // construction copy and admin edits stay intact; newly introduced digital
  // services and the digital hero slide are added only when missing.
  if (previousVersion < 3) {
    const digitalServices = defaultSite.services.filter((service) => Number(service.number) >= 9)
    const savedServices = Array.isArray(migrated.services) ? migrated.services : []
    const presentSlugs = new Set(savedServices.map((service) => service.slug))
    migrated.services = [...savedServices, ...digitalServices.filter((service) => !presentSlugs.has(service.slug))]

    if (Array.isArray(migrated.home?.slides) && !migrated.home.slides.some((slide) => /digital products/i.test(slide.eyebrow || ''))) {
      const digitalSlide = defaultSite.home.slides.find((slide) => /digital products/i.test(slide.eyebrow || ''))
      if (digitalSlide) migrated.home.slides = [...migrated.home.slides, clone(digitalSlide)]
    }

    if (migrated.servicesIntro) {
      migrated.servicesIntro.eyebrow = defaultSite.servicesIntro.eyebrow
      migrated.servicesIntro.title = defaultSite.servicesIntro.title
      migrated.servicesIntro.intro = defaultSite.servicesIntro.intro
      migrated.servicesIntro.stats = clone(defaultSite.servicesIntro.stats)
    }
    if (migrated.home?.servicesSection?.title === 'Eight disciplines. One delivery engine.') {
      migrated.home.servicesSection = clone(defaultSite.home.servicesSection)
    }

    // Re-point legacy company-domain addresses and canonical URLs to the new
    // official contact/domain during the same backwards-compatible migration.
    const updateBrandContacts = (value) => {
      if (Array.isArray(value)) return value.map(updateBrandContacts)
      if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, updateBrandContacts(item)]))
      if (typeof value !== 'string') return value
      return value.replace(/[\w.+-]+@anantainfratech\.com/g, 'support@anantainfratechsolutions.com').replace('https://www.anantainfratech.com', 'https://anantainfratechsolutions.com')
    }
    Object.assign(migrated, updateBrandContacts(migrated))
  }

  const next = mergeWithDefaults(migrated)
  const stale = (value) => typeof value !== 'string' || LEGACY_LOGOS.includes(value.trim())
  next.company = next.company || {}
  if (stale(next.company.logo)) next.company.logo = PRIMARY_LOGO
  if (stale(next.company.alternateLogo)) next.company.alternateLogo = PRIMARY_LOGO
  next.contentVersion = CONTENT_VERSION
  return next
}

/** Keys the public site cannot render without. */
const REQUIRED = [
  ['meta', 'object'],
  ['company', 'object'],
  ['home', 'object'],
  ['nav', 'array'],
  ['services', 'array'],
  ['sectors', 'array'],
  ['projects', 'array'],
  ['jobs', 'array'],
  ['insights', 'array']
]

export function validateContent(content) {
  const problems = []
  if (!isPlainObject(content)) return ['The content must be a single object.']
  for (const [key, type] of REQUIRED) {
    const value = content[key]
    const ok = type === 'array' ? Array.isArray(value) : isPlainObject(value)
    if (!ok) problems.push(`“${key}” must be ${type === 'array' ? 'a list' : 'an object'}.`)
  }
  if (isPlainObject(content.home) && !Array.isArray(content.home.slides)) {
    problems.push('Home hero needs a “slides” list.')
  }
  return problems
}

export function slugify(value, fallback = 'item') {
  const slug = String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return slug || fallback
}

/** Trims every string in a submitted payload so stored data stays clean. */
export function sanitise(value, depth = 0) {
  if (depth > 12) return undefined
  if (typeof value === 'string') return value.slice(0, 12000)
  if (Array.isArray(value)) return value.slice(0, 600).map((item) => sanitise(item, depth + 1)).filter((item) => item !== undefined)
  if (isPlainObject(value)) {
    const out = {}
    for (const [key, item] of Object.entries(value).slice(0, 400)) {
      if (key.startsWith('$') || key === '__proto__' || key === 'constructor') continue
      const clean = sanitise(item, depth + 1)
      if (clean !== undefined) out[key] = clean
    }
    return out
  }
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'boolean') return value
  return undefined
}

export function toCsv(rows, columns) {
  const escape = (value) => {
    const text = value === null || value === undefined ? '' : String(value)
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  const head = columns.map((column) => escape(column.label)).join(',')
  const body = rows.map((row) => columns.map((column) => escape(row[column.key])).join(',')).join('\n')
  return `${head}\n${body}`
}
