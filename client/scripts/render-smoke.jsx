/**
 * Render smoke test.
 *
 * Renders every public page — and every CMS editor section — against the live
 * content document and reports anything that throws or comes back empty. It is
 * the cheapest possible guard against the failure mode a content-driven site is
 * most prone to: a page that looks fine in code but breaks on real data.
 *
 * Run it with the API up (it reads `/api/site`, and falls back to the JSON store):
 *
 *   npm run smoke --prefix client
 *
 * Nothing here ships to the browser: the file is only used to produce a
 * server-render bundle under `client/.smoke`.
 */
import { readFile } from 'node:fs/promises'
import { renderToString } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { SiteProvider } from '../src/lib/site'
import { ToastProvider } from '../src/components/Toast'
import ErrorBoundary from '../src/components/ErrorBoundary'

import Home from '../src/pages/Home'
import About from '../src/pages/About'
import Leadership from '../src/pages/Leadership'
import HSE from '../src/pages/HSE'
import Sustainability from '../src/pages/Sustainability'
import Awards from '../src/pages/Awards'
import Clients from '../src/pages/Clients'
import Equipment from '../src/pages/Equipment'
import Newsroom from '../src/pages/Newsroom'
import Services from '../src/pages/Services'
import Technology from '../src/pages/Technology'
import ServiceDetail from '../src/pages/ServiceDetail'
import Sectors from '../src/pages/Sectors'
import SectorDetail from '../src/pages/SectorDetail'
import Projects from '../src/pages/Projects'
import ProjectDetail from '../src/pages/ProjectDetail'
import Insights from '../src/pages/Insights'
import InsightDetail from '../src/pages/InsightDetail'
import Careers from '../src/pages/Careers'
import JobDetail from '../src/pages/JobDetail'
import Register from '../src/pages/Register'
import Tenders from '../src/pages/Tenders'
import Downloads from '../src/pages/Downloads'
import Faq from '../src/pages/Faq'
import Track from '../src/pages/Track'
import SitemapPage from '../src/pages/SitemapPage'
import Policy from '../src/pages/Policy'
import Contact from '../src/pages/Contact'
import NotFound from '../src/pages/NotFound'

import App from '../src/App'
import AdminApp from '../src/pages/admin/AdminApp'
import SectionPanel from '../src/pages/admin/SectionPanel'
import Inbox from '../src/pages/admin/Inbox'
import LivePreview from '../src/pages/admin/LivePreview'
import EmailPanel from '../src/pages/admin/EmailPanel'
import { adminSections } from '../src/lib/adminSchema'

const API = process.env.API_URL || 'http://localhost:5050'

async function loadSite() {
  try {
    const response = await fetch(`${API}/api/site`)
    if (response.ok) return await response.json()
  } catch { /* fall through to the file store */ }
  const raw = JSON.parse(await readFile(new URL('../../server/data/cms.json', import.meta.url), 'utf8'))
  return raw.published || raw
}

const site = await loadSite()

globalThis.fetch = async () => ({ ok: true, json: async () => site })
globalThis.sessionStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }
globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }

const routes = [
  ['/', '/', Home], ['/about', '/about', About], ['/leadership', '/leadership', Leadership],
  ['/hse', '/hse', HSE], ['/sustainability', '/sustainability', Sustainability], ['/awards', '/awards', Awards],
  ['/clients', '/clients', Clients], ['/equipment', '/equipment', Equipment], ['/newsroom', '/newsroom', Newsroom],
  ['/services', '/services', Services], ['/technology', '/technology', Technology], ['/sectors', '/sectors', Sectors], ['/projects', '/projects', Projects],
  ['/insights', '/insights', Insights], ['/careers', '/careers', Careers], ['/register', '/register', Register],
  ['/tenders', '/tenders', Tenders], ['/downloads', '/downloads', Downloads], ['/faq', '/faq', Faq],
  ['/track', '/track', Track], ['/sitemap', '/sitemap', SitemapPage], ['/contact', '/contact', Contact],
  ['/not-a-page', '*', NotFound],
  ...(site.services || []).map((item) => [`/services/${item.slug}`, '/services/:slug', ServiceDetail]),
  ...(site.sectors || []).map((item) => [`/sectors/${item.slug}`, '/sectors/:slug', SectorDetail]),
  ...(site.projects || []).map((item) => [`/projects/${item.id}`, '/projects/:id', ProjectDetail]),
  ...(site.insights || []).map((item) => [`/insights/${item.slug}`, '/insights/:slug', InsightDetail]),
  ...(site.jobs || []).map((item) => [`/careers/${item.id}`, '/careers/:id', JobDetail]),
  ...(site.policies || []).map((item) => [`/policy/${item.slug}`, '/policy/:slug', Policy])
]

const failures = []
let checked = 0

for (const [route, pattern, Component] of routes) {
  checked += 1
  try {
    const html = renderToString(
      <MemoryRouter initialEntries={[route]}>
        <SiteProvider initialSite={site}>
          <ToastProvider>
            <ErrorBoundary>
              <Routes>
                <Route path={pattern} element={<Component />} />
              </Routes>
            </ErrorBoundary>
          </ToastProvider>
        </SiteProvider>
      </MemoryRouter>
    )
    if (!html || html.length < 1200) failures.push(`${route} — suspiciously small output (${html.length} bytes)`)
  } catch (error) {
    failures.push(`${route} — ${error.message}`)
  }
}

// The registration section has two states. The published document decides which
// one visitors see, so both are rendered here rather than trusting the toggle.
for (const [label, content] of [
  ['registration · closed (coming soon)', site],
  ['registration · open (form live)', { ...site, register: { ...site.register, enabled: true } }]
]) {
  checked += 1
  try {
    const html = renderToString(
      <MemoryRouter initialEntries={['/register']}>
        <SiteProvider initialSite={content}>
          <ToastProvider>
            <ErrorBoundary><Routes><Route path="/register" element={<Register />} /></Routes></ErrorBoundary>
          </ToastProvider>
        </SiteProvider>
      </MemoryRouter>
    )
    if (!html || html.length < 2000) failures.push(`${label} — suspiciously small output (${html.length} bytes)`)
  } catch (error) {
    failures.push(`${label} — ${error.message}`)
  }
}

// Every CMS editor is rendered against the real document, so a mistyped schema
// path or a control that cannot read its slice of content fails loudly here.
for (const section of adminSections) {
  checked += 1
  try {
    const html = renderToString(
      <SectionPanel section={section} content={site} onChange={() => {}} uploadImage={async () => ({ url: '/uploads/x.jpg' })} />
    )
    if (!html || html.length < 120) failures.push(`admin · ${section.id} — suspiciously small output (${html.length} bytes)`)
  } catch (error) {
    failures.push(`admin · ${section.id} — ${error.message}`)
  }
}

// The full site frame: fixed header, hover-zone mega menu, command palette,
// footer with the support inbox, cookie notice and every global provider.
for (const route of ['/', '/technology', '/contact', '/services/client-chat-solutions']) {
  checked += 1
  try {
    const html = renderToString(
      <MemoryRouter initialEntries={[route]}>
        <App initialSite={site} />
      </MemoryRouter>
    )
    if (!html || !html.includes('site-header') || !html.includes('site-footer') || html.length < 12000) {
      failures.push(`site frame ${route} — header/footer missing or output too small (${html.length} bytes)`)
    }
  } catch (error) {
    failures.push(`site frame ${route} — ${error.message}`)
  }
}

for (const [label, node] of [
  ['admin sign-in', <MemoryRouter initialEntries={['/admin']}><SiteProvider initialSite={site}><ToastProvider><ErrorBoundary><AdminApp /></ErrorBoundary></ToastProvider></SiteProvider></MemoryRouter>],
  ['admin submissions inbox', <SiteProvider initialSite={site}><ToastProvider><Inbox /></ToastProvider></SiteProvider>],
  ['admin live preview', <LivePreview content={site} section={adminSections.find((item) => item.id === 'technology')} dirty onChange={() => {}} onPublish={() => {}} onClose={() => {}} />],
  ['admin email delivery', <ToastProvider><EmailPanel supportEmail={site.company.supportEmail} /></ToastProvider>]
]) {
  checked += 1
  try {
    const html = renderToString(node)
    if (!html || html.length < 200) failures.push(`${label} — suspiciously small output (${html.length} bytes)`)
  } catch (error) {
    failures.push(`${label} — ${error.message}`)
  }
}

if (failures.length) {
  console.error(`\n✗ ${failures.length} of ${checked} checks failed:\n${failures.map((line) => `  · ${line}`).join('\n')}\n`)
  process.exitCode = 1
} else {
  console.log(`✓ ${checked} checks passed — every route, CMS section and portal panel renders against live content`)
}
