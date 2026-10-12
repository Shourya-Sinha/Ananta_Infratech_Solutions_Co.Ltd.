import express from 'express'
import jwt from 'jsonwebtoken'
import { repo } from '../lib/store.js'
import { clone, normaliseContent, CONTENT_VERSION } from '../lib/content.js'
import { defaultSite } from '../seed.js'

const router = express.Router()
/** Search-engine files are served from the site root, not under /api. */
export const seoRouter = express.Router()
const JWT_SECRET = () => process.env.JWT_SECRET || 'change-this-before-production'

/** Reads the published content, upgrading and repairing it as needed. */
export async function getPublished() {
  const state = await repo.readState()
  const needsWrite = !state.published || state.published.contentVersion !== CONTENT_VERSION
  const content = normaliseContent(state.published || clone(defaultSite))
  if (needsWrite) {
    try {
      await repo.writeState({ ...state, published: content, publishedAt: state.publishedAt || new Date().toISOString() })
    } catch (error) {
      console.warn('Could not persist normalised content:', error.message)
    }
  }
  return content
}

const tokenFrom = (req) => req.headers.authorization?.replace('Bearer ', '') || req.query.token

router.get('/site', async (req, res, next) => {
  try {
    // The admin portal asks for the working draft so it can preview unpublished changes.
    if (req.query.preview === '1' && tokenFrom(req)) {
      try {
        const claims = jwt.verify(tokenFrom(req), JWT_SECRET())
        if (claims?.role === 'admin') {
          const state = await repo.readState()
          return res.json({
            ...(state.draft ? normaliseContent(state.draft) : await getPublished()),
            __preview: true,
            __hasDraft: Boolean(state.draft),
            __publishedAt: state.publishedAt || null
          })
        }
      } catch {
        // An invalid or expired token simply falls through to the published site.
      }
    }
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    res.json(await getPublished())
  } catch (error) { next(error) }
})

/** Lightweight payload used by the sitemap generator and search indexing. */
router.get('/site/index', async (_req, res, next) => {
  try {
    const site = await getPublished()
    res.json({
      updatedAt: new Date().toISOString(),
      services: site.services.map((item) => ({ slug: item.slug, title: item.title })),
      sectors: site.sectors.map((item) => ({ slug: item.slug, title: item.title })),
      projects: site.projects.map((item) => ({ id: item.id, title: item.title, category: item.category, location: item.location, year: item.year })),
      insights: site.insights.map((item) => ({ slug: item.slug, title: item.title, date: item.dateISO, category: item.category })),
      jobs: site.jobs.map((item) => ({ id: item.id, title: item.title, department: item.department, location: item.location }))
    })
  } catch (error) { next(error) }
})

/** Server-rendered robots.txt so the sitemap URL always matches the deployment. */
seoRouter.get('/robots.txt', (req, res) => {
  const base = process.env.SITE_URL || `${req.protocol}://${req.get('host')}`
  res.type('text/plain').send([
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api',
    '',
    `Sitemap: ${base.replace(/\/$/, '')}/sitemap.xml`
  ].join('\n'))
})

/** Server-rendered XML sitemap built from live CMS content. */
seoRouter.get('/sitemap.xml', async (req, res, next) => {
  try {
    const site = await getPublished()
    const base = (process.env.SITE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '')
    const today = new Date().toISOString().slice(0, 10)
    const urls = [
      { loc: '/', priority: '1.0', changefreq: 'weekly' },
      { loc: '/about', priority: '0.9' }, { loc: '/leadership', priority: '0.7' },
      { loc: '/hse', priority: '0.8' }, { loc: '/sustainability', priority: '0.7' },
      { loc: '/awards', priority: '0.6' }, { loc: '/clients', priority: '0.7' },
      { loc: '/equipment', priority: '0.6' }, { loc: '/newsroom', priority: '0.6' },
      { loc: '/services', priority: '0.9' }, { loc: '/sectors', priority: '0.9' },
      { loc: '/projects', priority: '0.9' }, { loc: '/insights', priority: '0.8' },
      { loc: '/careers', priority: '0.9' }, { loc: '/register', priority: '0.9' },
      { loc: '/tenders', priority: '0.7' }, { loc: '/downloads', priority: '0.6' },
      { loc: '/faq', priority: '0.6' }, { loc: '/contact', priority: '0.9' },
      { loc: '/track', priority: '0.4' }, { loc: '/sitemap', priority: '0.3' },
      { loc: '/policy/privacy', priority: '0.2' }, { loc: '/policy/terms', priority: '0.2' },
      { loc: '/policy/code-of-conduct', priority: '0.2' }, { loc: '/policy/anti-bribery', priority: '0.2' },
      { loc: '/policy/whistleblower', priority: '0.2' },
      ...site.services.map((item) => ({ loc: `/services/${item.slug}`, priority: '0.8' })),
      ...site.sectors.map((item) => ({ loc: `/sectors/${item.slug}`, priority: '0.8' })),
      ...site.projects.map((item) => ({ loc: `/projects/${item.id}`, priority: '0.7' })),
      ...site.insights.map((item) => ({ loc: `/insights/${item.slug}`, priority: '0.6', lastmod: item.dateISO })),
      ...site.jobs.map((item) => ({ loc: `/careers/${item.id}`, priority: '0.6' }))
    ]
    const body = urls.map((url) => [
      '  <url>',
      `    <loc>${base}${url.loc}</loc>`,
      `    <lastmod>${url.lastmod || today}</lastmod>`,
      `    <changefreq>${url.changefreq || 'monthly'}</changefreq>`,
      `    <priority>${url.priority || '0.5'}</priority>`,
      '  </url>'
    ].join('\n')).join('\n')
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`)
  } catch (error) { next(error) }
})

export default router
