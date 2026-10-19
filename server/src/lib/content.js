import { defaultSite } from '../seed.js'

export const CONTENT_VERSION = 6

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


  // ------------------------------------------------------------------ v6
  // The footer used to carry its own phone, email and address, copied from the
  // company profile. That meant editing the phone in one place left a stale
  // number in the other. Footer contact fields are now optional overrides and
  // the company profile is the single source, so the whole site updates at once.
  if (previousVersion < 6) {
    if (migrated.footer?.contact) {
      const contact = migrated.footer.contact
      const legacy = {
        email: 'support@anantainfratechsolutions.com',
        phone: '+91 22 4968 2016',
        address: 'Juhu, Mumbai, Maharashtra, India'
      }
      migrated.footer.contact = {
        ...contact,
        email: contact.email === legacy.email ? '' : contact.email,
        phone: contact.phone === legacy.phone ? '' : contact.phone,
        address: contact.address === legacy.address ? '' : contact.address
      }
    }
    if (migrated.footer?.supportNote === 'For any query — construction, technology, careers or procurement — write to support@anantainfratechsolutions.com and the team will route it internally.') {
      migrated.footer.supportNote = defaultSite.footer.supportNote
    }
  }

  // ---------------------------------------------------------------- v4: digital
  // Adds the technology practice, the additional digital services and the
  // navigation entries that lead to them. Existing copy is never overwritten:
  // only missing services, groups and links are appended.
  if (previousVersion < 4) {
    const savedServices = Array.isArray(migrated.services) ? migrated.services : []
    const presentSlugs = new Set(savedServices.map((service) => service.slug))
    migrated.services = [
      ...savedServices.map((service) => {
        // Give previously saved digital services the new presentation fields
        // (icon, stack, starting price) only where the CMS has no value yet.
        const fresh = defaultSite.services.find((item) => item.slug === service.slug)
        if (!fresh) return service
        const enriched = { ...service }
        for (const key of ['icon', 'tags', 'stack', 'startingAt', 'timeline', 'engagement', 'highlight', 'category', 'family']) {
          if (enriched[key] === undefined || enriched[key] === null || enriched[key] === '') enriched[key] = clone(fresh[key])
        }
        return enriched
      }),
      ...defaultSite.services.filter((service) => !presentSlugs.has(service.slug))
    ]

    if (Array.isArray(migrated.nav)) {
      const navLabels = new Set(migrated.nav.map((group) => group.label))
      if (!navLabels.has('Technology')) {
        const techNav = clone(defaultSite.nav.find((group) => group.label === 'Technology'))
        const servicesIndex = migrated.nav.findIndex((group) => group.label === 'Services')
        migrated.nav = servicesIndex >= 0
          ? [...migrated.nav.slice(0, servicesIndex + 1), techNav, ...migrated.nav.slice(servicesIndex + 1)]
          : [...migrated.nav, techNav]
      }
      migrated.nav = migrated.nav.map((group) => {
        if (group.label !== 'Services' || !Array.isArray(group.children)) return group
        const fresh = defaultSite.nav.find((item) => item.label === 'Services')
        const keys = new Set(group.children.map((item) => `${item.to}|${item.label}`))
        const additions = (fresh?.children || []).filter((item) => !keys.has(`${item.to}|${item.label}`))
        return {
          ...group,
          blurb: group.blurb || fresh?.blurb,
          children: [
            ...group.children.map((child) => {
              const match = (fresh?.children || []).find((item) => item.to === child.to)
              return match && !child.group ? { ...child, group: match.group } : child
            }),
            ...additions
          ]
        }
      })
    }

    if (Array.isArray(migrated.sitemap) && !migrated.sitemap.some((group) => group.group === 'Technology')) {
      const techGroup = clone(defaultSite.sitemap.find((group) => group.group === 'Technology'))
      const workIndex = migrated.sitemap.findIndex((group) => group.group === 'Work')
      migrated.sitemap = workIndex >= 0
        ? [...migrated.sitemap.slice(0, workIndex), techGroup, ...migrated.sitemap.slice(workIndex)]
        : [...migrated.sitemap, techGroup]
    }

    if (migrated.home?.digitalSection) {
      if (Array.isArray(migrated.home.digitalSection.serviceSlugs)) {
        const fresh = new Set(defaultSite.home.digitalSection.serviceSlugs)
        migrated.home.digitalSection.serviceSlugs = [
          ...migrated.home.digitalSection.serviceSlugs,
          ...[...fresh].filter((slug) => !migrated.home.digitalSection.serviceSlugs.includes(slug))
        ]
      }
      for (const key of ['stats', 'chips', 'chatTeaser', 'engagementLabel', 'engagementNote']) {
        if (migrated.home.digitalSection[key] === undefined) migrated.home.digitalSection[key] = clone(defaultSite.home.digitalSection[key])
      }
    }
    if (migrated.home && !migrated.home.domains) migrated.home.domains = clone(defaultSite.home.domains)

    if (migrated.contact && Array.isArray(migrated.contact.departments) && !migrated.contact.departments.some((item) => item.id === 'technology')) {
      const tech = clone(defaultSite.contact.departments.find((item) => item.id === 'technology'))
      const mediaIndex = migrated.contact.departments.findIndex((item) => item.id === 'media')
      migrated.contact.departments = mediaIndex >= 0
        ? [...migrated.contact.departments.slice(0, mediaIndex), tech, ...migrated.contact.departments.slice(mediaIndex)]
        : [...migrated.contact.departments, tech]
    }

    if (migrated.company && !migrated.company.supportEmail) migrated.company.supportEmail = defaultSite.company.supportEmail
    if (migrated.company && !migrated.company.technologyEmail) migrated.company.technologyEmail = defaultSite.company.technologyEmail
    if (migrated.footer && !migrated.footer.supportNote) migrated.footer.supportNote = defaultSite.footer.supportNote

    if (migrated.footer?.columns?.length) {
      migrated.footer.columns = migrated.footer.columns.map((column) => {
        if (!Array.isArray(column.links) || !/what we do/i.test(column.title || '')) return column
        const keys = new Set(column.links.map((link) => link.to))
        const techLinks = [
          { label: 'Digital & IT solutions', to: '/technology' },
          { label: 'Websites, CMS & SEO', to: '/services/web-development' },
          { label: 'Android & iOS apps', to: '/services/mobile-app-development' },
          { label: 'Client chat solutions', to: '/services/client-chat-solutions' }
        ].filter((link) => !keys.has(link.to))
        const allIndex = column.links.findIndex((link) => link.to === '/services')
        const links = [...column.links]
        links.splice(allIndex >= 0 ? allIndex + 1 : 0, 0, ...techLinks)
        return { ...column, links }
      })
    }
  }

  // ------------------------------------------------------------------ v5
  // The Services mega menu grew beyond three columns, so the construction
  // links are now split into advisory / structure / delivery, and the digital
  // hero slide finally points at digital artwork instead of a site photo.
  // Both changes are applied only to values that still hold the old defaults.
  if (previousVersion < 5) {
    if (Array.isArray(migrated.nav)) {
      const freshServices = defaultSite.nav.find((group) => group.label === 'Services')
      const freshGroups = new Map((freshServices?.children || []).map((item) => [item.to, item.group]))
      const oldLabels = new Set(['Construction & infrastructure'])
      migrated.nav = migrated.nav.map((group) => {
        if (group.label !== 'Services' || !Array.isArray(group.children)) return group
        return {
          ...group,
          children: group.children.map((child) => {
            const nextGroup = freshGroups.get(child.to)
            if (!nextGroup || !oldLabels.has(child.group)) return child
            return { ...child, group: nextGroup }
          })
        }
      })
    }

    if (Array.isArray(migrated.home?.slides)) {
      const freshSlide = defaultSite.home.slides.find((slide) => /digital products/i.test(slide.eyebrow || ''))
      const legacyImages = new Set(['/assets/ananta-signature-structure.jpg', '/assets/hero-site.jpg'])
      migrated.home.slides = migrated.home.slides.map((slide) => {
        if (!/digital products/i.test(slide.eyebrow || '')) return slide
        if (!legacyImages.has(slide.image)) return slide
        return { ...slide, image: freshSlide?.image || slide.image, alt: freshSlide?.alt || slide.alt }
      })
    }

    if (migrated.technology && !migrated.technology.cases) {
      migrated.technology.cases = clone(defaultSite.technology.cases)
    }

  }

  const next = mergeWithDefaults(migrated)
  // Repair: digital services inherited construction photography when they were
  // first added. Only that exact legacy artwork is replaced — an image chosen in
  // the CMS is left alone — so this runs on every load rather than once.
  const legacyDigitalImages = new Set(['/assets/ananta-signature-structure.jpg', '/assets/drawings.jpg'])
  if (Array.isArray(next.services)) {
    next.services = next.services.map((service) => {
      const fresh = defaultSite.services.find((item) => item.slug === service.slug)
      if (!fresh || fresh.category !== 'digital') return service
      if (!legacyDigitalImages.has(service.image)) return service
      return { ...service, image: fresh.image }
    })
  }

  // The opening slide used to introduce Ananta as a construction company only.
  // The site now leads with both practices; the sentence is replaced only while
  // it still holds that original default, so an admin rewrite always wins.
  if (Array.isArray(next.home?.slides) && next.home.slides[0]?.eyebrow === 'Integrated construction partner · Mumbai, India') {
    next.home.slides = [
      { ...next.home.slides[0], eyebrow: defaultSite.home.slides[0].eyebrow },
      ...next.home.slides.slice(1)
    ]
  }

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
