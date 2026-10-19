import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight, ArrowUp, ArrowUpRight, CheckCircle2, ChevronDown, Command, Cookie, CornerDownLeft,
  Eye, Mail, Menu, Phone, Search, X
} from 'lucide-react'
import Brand from './Brand'
import { useContent, useRegistration, useRouteFocus, useSite } from '../lib/site'
import { postJson } from '../lib/api'
import { ServiceIcon } from './Digital'

const SUPPORT_EMAIL = 'support@anantainfratechsolutions.com'

/* ============================================================== scroll fx */

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => {
      const max = document.body.scrollHeight - window.innerHeight
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
  return <div className="scroll-progress" style={{ transform: `scaleX(${Math.min(1, progress / 100)})` }} />
}

function ToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!visible) return null
  return (
    <button className="to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
      <ArrowUp size={19} />
    </button>
  )
}

function CookieNotice() {
  const { site } = useSite()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    try { setVisible(localStorage.getItem('ananta-cookie-notice') !== 'accepted') } catch { setVisible(true) }
  }, [])
  /* The CMS preview is a working surface, not a visit — never cover it. */
  if (site?.__preview || !visible) return null
  const accept = () => {
    try { localStorage.setItem('ananta-cookie-notice', 'accepted') } catch { /* ignore */ }
    setVisible(false)
  }
  return (
    <div className="cookie-notice" role="region" aria-label="Cookie notice">
      <Cookie size={20} />
      <p style={{ margin: 0, flex: '1 1 240px' }}>
        We use a small number of cookies to keep this site secure and understand which pages are useful. See our{' '}
        <Link to="/policy/privacy">privacy policy</Link>.
      </p>
      <button className="button button-sm" onClick={accept}>Understood</button>
    </div>
  )
}

export function PreviewBanner() {
  const { site, togglePreview } = useSite()
  if (!site?.__preview) return null

  /* Inside the CMS preview iframe the banner must not behave like a page
     chrome element: no links back into the portal (they would load /admin
     inside the frame) and no large pill covering the layout being reviewed. */
  const embedded = typeof window !== 'undefined' && window.self !== window.top
  if (embedded) {
    return (
      <div className="preview-banner is-embedded">
        <b><Eye size={12} style={{ verticalAlign: '-2px' }} /> Draft preview</b>
        <span>{site.__hasDraft ? 'Unpublished changes shown' : 'Published content shown'}</span>
      </div>
    )
  }

  return (
    <div className="preview-banner">
      <b><Eye size={13} style={{ verticalAlign: '-2px' }} /> Draft preview</b>
      <span>{site.__hasDraft ? 'Showing unpublished changes.' : 'No unsaved draft — showing the live content.'}</span>
      <Link to="/admin">Back to editor</Link>
      <button type="button" onClick={() => togglePreview(false)}>Exit preview</button>
    </div>
  )
}

/* ========================================================= navigation sync */

/**
 * Keeps the Services menu honest against the Services editor.
 *
 * The panel is authored in Main menu, but services themselves are added and
 * renamed in the Services editor. Without this, a service added there would
 * exist on /services and /technology yet be missing from the menu. Anything
 * missing is appended under its practice; existing labels the admin has chosen
 * are never overwritten.
 */
function syncServiceLinks(nav = [], services = []) {
  const index = nav.findIndex((group) => group.label === 'Services' && Array.isArray(group.children))
  if (index < 0) return nav
  const group = nav[index]
  const present = new Set(group.children.map((item) => item.to))
  const missing = services
    .filter((service) => service?.slug && !present.has(`/services/${service.slug}`))
    .map((service) => ({
      label: service.short || service.title,
      to: `/services/${service.slug}`,
      description: service.category === 'digital' ? 'Digital service' : 'Construction service',
      group: service.category === 'digital' ? 'Digital & IT' : 'Construction · delivery'
    }))
  if (!missing.length) return nav
  const next = [...nav]
  next[index] = { ...group, children: [...group.children, ...missing] }
  return next
}

/* ============================================================ command bar */

/**
 * ⌘K / Ctrl+K command palette. It indexes the live navigation, every service
 * and the key pages, so a visitor can jump straight to what they need instead
 * of walking the menus. Keyboard-first: arrows move, Enter opens, Esc closes.
 */
/* Words people actually type, mapped onto the services they mean. Titles alone
   make "chat", "app" or "hosting" miss entirely. */
const SEARCH_ALIASES = {
  'digital-products': 'software product app build development custom',
  'web-development': 'website site web cms ecommerce shop online store',
  'mobile-app-development': 'app android ios mobile flutter react native expo',
  'client-chat-solutions': 'chat talk messaging whatsapp inbox conversation support',
  'enterprise-it-solutions': 'it enterprise systems integration automation consulting',
  'erp-crm-systems': 'erp crm sales inventory billing accounting',
  'content-management': 'cms content blog editorial publishing website',
  'seo-growth': 'seo google search marketing growth organic ranking',
  'ui-ux-design': 'design ui ux figma prototype research wireframe',
  'cloud-devops': 'cloud aws hosting devops ci cd deployment server',
  'cybersecurity': 'security secure audit testing qa penetration',
  'managed-it-support': 'support helpdesk maintenance monitoring managed',
  'analytics-dashboards': 'analytics dashboard reports data bi charts',
  'ecommerce-stores': 'ecommerce store shop payments cart online'
}

function CommandPalette({ open, onClose }) {
  const site = useContent()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)

  const items = useMemo(() => {
    const list = [
      { label: 'Home', to: '/', kind: 'Page' },
      { label: 'Technology & IT solutions', to: '/technology', kind: 'Practice' },
      { label: 'All services', to: '/services', kind: 'Page' },
      { label: 'Projects', to: '/projects', kind: 'Page' },
      { label: 'Sectors', to: '/sectors', kind: 'Page' },
      { label: 'About us', to: '/about', kind: 'Company' },
      { label: 'Insights', to: '/insights', kind: 'Page' },
      { label: 'Careers', to: '/careers', kind: 'Company' },
      { label: 'Contact', to: '/contact', kind: 'Page' },
      ...(site.services || []).map((service) => ({
        label: service.title,
        to: `/services/${service.slug}`,
        kind: service.category === 'digital' ? 'Digital service' : 'Service',
        /* Titles alone are a poor index: people search for "cms", "app" or
           "seo", which live in the short name, tags and slug. */
        terms: [
          service.short, service.slug, service.category,
          SEARCH_ALIASES[service.slug] || '',
          ...(service.tags || []), ...(service.capabilities || []), ...(service.stack || [])
        ].filter(Boolean).join(' ')
      })),
      ...(site.sectors || []).map((sector) => ({ label: sector.title, to: `/sectors/${sector.slug}`, kind: 'Sector' })),
      { label: 'Email support@anantainfratechsolutions.com', href: `mailto:${SUPPORT_EMAIL}`, kind: 'Email' }
    ]
    const seen = new Set()
    return list.filter((item) => {
      const key = item.to || item.href
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [site.services, site.sectors])

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return items.slice(0, 8)
    return items
      .filter((item) => `${item.label} ${item.kind} ${item.terms || ''}`.toLowerCase().includes(term))
      .slice(0, 10)
  }, [items, query])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActive(0)
    const timer = setTimeout(() => inputRef.current?.focus(), 40)
    return () => clearTimeout(timer)
  }, [open])

  useEffect(() => { setActive(0) }, [query])

  const go = useCallback((item) => {
    if (!item) return
    onClose()
    if (item.href) window.location.href = item.href
    else navigate(item.to)
  }, [navigate, onClose])

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((current) => Math.min(results.length - 1, current + 1)) }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActive((current) => Math.max(0, current - 1)) }
    if (event.key === 'Enter') { event.preventDefault(); go(results[active]) }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="command-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Site search"
        >
          <motion.div
            className="command-panel"
            initial={{ opacity: 0, y: -14, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="command-input">
              <Search size={18} />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search services, pages and contacts…"
                aria-label="Search the site"
              />
              <kbd>esc</kbd>
            </div>
            <div className="command-results" role="listbox">
              {results.map((item, index) => (
                <button
                  key={`${item.to || item.href}-${index}`}
                  type="button"
                  role="option"
                  aria-selected={index === active}
                  className={index === active ? 'is-active' : ''}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => go(item)}
                >
                  <span className="command-kind">{item.kind}</span>
                  <span className="command-label">{item.label}</span>
                  <CornerDownLeft size={14} />
                </button>
              ))}
              {!results.length ? <p className="command-empty">No match. Try “CMS”, “apps”, “SEO” or “contact”.</p> : null}
            </div>
            <div className="command-foot">
              <span><kbd>↑</kbd><kbd>↓</kbd> to move</span>
              <span><kbd>↵</kbd> to open</span>
              <a href={`mailto:${SUPPORT_EMAIL}`}>Write to support <ArrowUpRight size={12} /></a>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

/* ================================================================= header */

function UtilityBar({ company, registration }) {
  return (
    <div className="utility-bar">
      <div className="shell">
        <span className="utility-bar-links">
          <a href={`tel:${(company.phone || '').replace(/\s/g, '')}`}><Phone size={12} style={{ verticalAlign: '-2px', marginRight: 6 }} />{company.phone}</a>
          <a href={`mailto:${company.supportEmail || company.email}`}><Mail size={12} style={{ verticalAlign: '-2px', marginRight: 6 }} />{company.supportEmail || company.email}</a>
        </span>
        <span className="utility-bar-links">
          <Link className="utility-digital" to="/technology">Digital &amp; IT solutions</Link>
          <span aria-hidden>·</span>
          <Link to="/tenders">Tenders</Link>
          <span aria-hidden>·</span>
          <Link to="/downloads">Downloads</Link>
          <span aria-hidden>·</span>
          <Link to="/register">Contractor &amp; worker registration{registration.open ? '' : <em className="utility-flag">{registration.label}</em>}</Link>
        </span>
      </div>
    </div>
  )
}

/**
 * Mega menu.
 *
 * The panel is rendered inside the same hover zone as the navigation, so moving
 * the cursor from a trigger into the panel never counts as leaving the menu.
 * Links are grouped when the CMS sends a `group` value (Services, Technology),
 * which is what keeps a fifteen-link menu readable.
 */
function MegaMenu({ group, registration, serviceCount, onClose }) {
  if (!group) return null
  const links = group.children || []
  const grouped = links.some((item) => item.group)
  let columns = grouped
    ? [...new Set(links.map((item) => item.group || 'More'))].map((label) => ({
        label,
        items: links.filter((item) => (item.group || 'More') === label)
      }))
    : [{ label: null, items: links }]

  /* A column that only repeats the menu's own overview link is dead space:
     the intro already links there. Dropping it gives the remaining groups the
     width they need to stay on one row instead of wrapping under the panel. */
  if (columns.length > 2) {
    columns = columns.filter((column) => !(
      column.items.length === 1 && column.items[0].to === group.to
    ))
  }

  return (
    <motion.div
      className="mega-menu"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={`shell mega-grid ${grouped ? 'is-grouped' : ''}`}>
        <div className="mega-intro">
          <p className="eyebrow eyebrow-light"><i />{group.label}</p>
          <h3>{group.label === 'Company' ? 'The Ananta story' : group.label === 'Services' ? 'What we deliver' : group.label === 'Technology' ? 'Ananta Digital' : group.label === 'Sectors' ? 'Where we work' : 'Work with us'}</h3>
          <p>{group.blurb}</p>
          <Link className="text-link light" to={group.to} onClick={onClose}>
            {group.label === 'Services' ? `All ${serviceCount || links.length} services` : 'Overview'} <ArrowUpRight size={16} />
          </Link>
          <div className="mega-support">
            <span>Any question?</span>
            <a href={`mailto:${SUPPORT_EMAIL}`}><Mail size={13} />{SUPPORT_EMAIL}</a>
          </div>
        </div>

        <div className={`mega-columns ${grouped ? 'is-grouped' : ''}`}>
          {columns.map((column) => (
            <div className="mega-column" key={column.label || 'all'}>
              {column.label ? <span className="mega-column-title">{column.label}</span> : null}
              <div className="mega-links">
                {column.items.map((item) => (
                  <Link key={item.to + item.label} to={item.to} onClick={onClose}>
                    <b>
                      {item.label}
                      {item.to === '/register' && !registration.open ? <em className="mega-flag">{registration.label}</em> : null}
                    </b>
                    {item.description ? <small>{item.description}</small> : null}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function Header() {
  const { site } = useSite()
  const registration = useRegistration()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState(null)
  const [solid, setSolid] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const zoneRef = useRef(null)
  const closeTimer = useRef(null)
  const focusOpenedAt = useRef(0)

  const nav = useMemo(
    () => syncServiceLinks(site?.nav || [], site?.services || []),
    [site?.nav, site?.services]
  )
  const company = site?.company || {}

  useRouteFocus(location.pathname, location.hash)

  const clearClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenGroup(null)
    setPaletteOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('is-locked', mobileOpen)
    return () => document.body.classList.remove('is-locked')
  }, [mobileOpen])

  /* Escape closes whatever is open; ⌘K / Ctrl+K opens search from anywhere. */
  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((current) => !current)
        return
      }
      if (event.key === 'Escape') {
        setMobileOpen(false)
        setOpenGroup(null)
        setPaletteOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* Clicking anywhere outside the navigation closes the panel. */
  useEffect(() => {
    if (!openGroup) return undefined
    const onPointerDown = (event) => {
      if (zoneRef.current && !zoneRef.current.contains(event.target)) setOpenGroup(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [openGroup])

  useEffect(() => () => clearClose(), [clearClose])

  const openMenu = (label) => {
    clearClose()
    if (openGroup !== label) focusOpenedAt.current = Date.now()
    setOpenGroup(label)
  }

  /**
   * A click on a trigger toggles the panel — but a click immediately after the
   * panel was opened by focus (which happens on every mouse click, because the
   * button receives focus first) must not close it again. That double-handling
   * was what made the menu flash open and vanish before the cursor could reach
   * it. Clicks within 450ms of the focus-open keep the panel open.
   */
  const toggleMenu = (label) => {
    clearClose()
    if (openGroup === label && Date.now() - focusOpenedAt.current > 450) {
      setOpenGroup(null)
      return
    }
    focusOpenedAt.current = Date.now()
    setOpenGroup(label)
  }

  const scheduleClose = () => {
    clearClose()
    /* Generous grace period: enough to cross any dead space between the trigger
       and the panel, and cancelled the moment the pointer re-enters the zone. */
    closeTimer.current = setTimeout(() => setOpenGroup(null), 360)
  }

  return (
    <>
      <div
        className={`nav-zone ${openGroup ? 'is-open' : ''}`}
        ref={zoneRef}
        onMouseLeave={scheduleClose}
        onMouseEnter={clearClose}
      >
        <header className={`site-header ${solid ? 'is-solid' : ''} ${mobileOpen ? 'is-menu-open' : ''}`}>
          <div className="header-utility">
            <UtilityBar company={company} registration={registration} />
          </div>

          <div className="header-main">
            <Brand />

            <nav className="desktop-nav" aria-label="Main navigation">
              {nav.map((group) => (
                group.children?.length ? (
                  <div
                    key={group.label}
                    className={`nav-group ${openGroup === group.label ? 'is-open' : ''}`}
                    onMouseEnter={() => openMenu(group.label)}
                  >
                    <button
                      type="button"
                      className="nav-trigger"
                      aria-expanded={openGroup === group.label}
                      aria-haspopup="true"
                      onClick={() => toggleMenu(group.label)}
                      onFocus={() => openMenu(group.label)}
                    >
                      {group.label}
                      <ChevronDown size={13} />
                    </button>
                  </div>
                ) : (
                  <NavLink key={group.to} to={group.to} className={({ isActive }) => (isActive ? 'active' : '')}>{group.label}</NavLink>
                )
              ))}
            </nav>

            <div className="header-actions">
              <button type="button" className="header-search" onClick={() => setPaletteOpen(true)} aria-label="Search the website">
                <Search size={15} />
                <span>Search</span>
                <kbd><Command size={10} />K</kbd>
              </button>
              <Link to="/contact" className="header-contact">Start a conversation <ArrowUpRight size={15} /></Link>
              <button className="menu-toggle" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={23} /></button>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {openGroup ? (
            <MegaMenu
              group={nav.find((item) => item.label === openGroup)}
              registration={registration}
              serviceCount={(site.services || []).length}
              onClose={() => setOpenGroup(null)}
            />
          ) : null}
        </AnimatePresence>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="mobile-menu-top">
              <Brand inverse />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={26} /></button>
            </div>

            <nav className="mobile-menu-nav" aria-label="Mobile navigation">
              {nav.map((group, index) => (
                group.children?.length ? (
                  <div key={group.label}>
                    <button
                      className={expanded === group.label ? 'is-open' : ''}
                      onClick={() => setExpanded(expanded === group.label ? null : group.label)}
                      aria-expanded={expanded === group.label}
                    >
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <span>{group.label}</span>
                      <ChevronDown size={20} />
                    </button>
                    {expanded === group.label ? (
                      <div className="mobile-submenu">
                        {group.children.map((item) => (
                          <Link key={item.to + item.label} to={item.to}>
                            {item.label}
                            {item.to === '/register' && !registration.open ? <em className="mega-flag">{registration.label}</em> : null}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <Link key={group.to} to={group.to}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span>{group.label}</span>
                    <ArrowUpRight size={20} />
                  </Link>
                )
              ))}
              <button type="button" onClick={() => { setMobileOpen(false); setTimeout(() => setPaletteOpen(true), 220) }}>
                <span>{String(nav.length + 1).padStart(2, '0')}</span>
                <span>Search the site</span>
                <Search size={20} />
              </button>
              <Link to="/contact">
                <span>{String(nav.length + 2).padStart(2, '0')}</span>
                <span>Contact</span>
                <ArrowUpRight size={20} />
              </Link>
            </nav>

            <div className="mobile-menu-bottom">
              <div className="mobile-cta">
                <a href={`tel:${(company.phone || '').replace(/[^\d+]/g, '')}`}><Phone size={14} style={{ verticalAlign: '-2px', marginRight: 8 }} />{company.phone}</a>
                <a href={`mailto:${company.supportEmail || company.email}`}><Mail size={14} style={{ verticalAlign: '-2px', marginRight: 8 }} />{company.supportEmail || company.email}</a>
              </div>
              <p style={{ margin: 0 }}>{company.address}</p>
              <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
                <Link to="/register">Register interest{registration.open ? '' : ` (${registration.label})`}</Link>
                <Link to="/tenders">Tenders</Link>
                <Link to="/admin">Client portal</Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

/* ================================================================= footer */

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState({ busy: false, message: '', error: false })

  const submit = async (event) => {
    event.preventDefault()
    setState({ busy: true, message: '', error: false })
    try {
      const data = await postJson('/api/subscribe', { email, source: 'footer' })
      setState({ busy: false, message: data.message || 'You are subscribed.', error: false })
      setEmail('')
    } catch (error) {
      setState({ busy: false, message: error.message, error: true })
    }
  }

  return (
    <form onSubmit={submit}>
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@company.com"
        aria-label="Email address"
      />
      <button type="submit" disabled={state.busy}>{state.busy ? 'Sending…' : 'Subscribe'}</button>
      {state.message ? <p className="form-message" style={{ border: 0, background: 'none', padding: 0, color: state.error ? '#ffb4a8' : 'var(--acid)' }}>{state.message}</p> : null}
    </form>
  )
}

export function Footer() {
  const site = useContent()
  const company = site.company || {}
  const footer = site.footer || {}
  const year = new Date().getFullYear()
  const supportEmail = footer.contact?.email || company.supportEmail || company.email || SUPPORT_EMAIL

  const socials = [
    { href: company.linkedin, label: 'in', name: 'LinkedIn' },
    { href: company.instagram, label: 'ig', name: 'Instagram' },
    { href: company.facebook, label: 'fb', name: 'Facebook' },
    { href: company.youtube, label: 'yt', name: 'YouTube' },
    { href: company.twitter, label: 'x', name: 'X' }
  ].filter((item) => item.href)

  return (
    <footer className="site-footer">
      <div className="footer-glow" aria-hidden />
      <div className="shell">
        <div className="footer-cta">
          <div>
            <p className="eyebrow eyebrow-light"><i />{footer.cta?.eyebrow || 'Ready when you are'}</p>
            <h2>{footer.cta?.title || 'Let’s make a lasting difference.'}</h2>
          </div>
          <Link to={footer.cta?.linkTo || '/contact'} className="circle-link" aria-label={footer.cta?.linkLabel || 'Contact Ananta'}><ArrowUpRight size={28} /></Link>
        </div>

        {/* One visible inbox for every kind of question. */}
        <a className="footer-inbox" href={`mailto:${supportEmail}`}>
          <span className="footer-inbox-icon"><Mail size={20} /></span>
          <span className="footer-inbox-copy">
            <small>{footer.inboxEyebrow || 'Any question — construction, technology, careers or procurement'}</small>
            <b>{supportEmail}</b>
          </span>
          <span className="footer-inbox-note">{footer.supportNote || 'One inbox, routed internally'}</span>
          <ArrowUpRight size={20} />
        </a>

        <div className="footer-grid">
          <div>
            <Brand inverse />
            <p className="footer-tagline">{footer.blurb || company.tagline}</p>
            <div className="footer-badges">
              {(site.badges || []).slice(0, 3).map((badge) => (
                <span className="tag tag-inverse" key={badge.value}>{badge.value}</span>
              ))}
            </div>
          </div>

          {(footer.columns || []).map((column) => (
            <div key={column.title}>
              <span>{column.title}</span>
              {column.links.map((link) => <Link key={link.to + link.label} to={link.to}>{link.label}</Link>)}
            </div>
          ))}

          <div>
            <span>{footer.newsletter?.title || 'Stay in touch'}</span>
            <div className="footer-newsletter">
              <p style={{ fontSize: 13, color: 'var(--muted-inverse)', marginBottom: 4 }}>{footer.newsletter?.text}</p>
              <NewsletterForm />
              <small>{footer.newsletter?.note}</small>
            </div>
            <div className="footer-contact-details">
              <span>{footer.contact?.label || 'Contact'}</span>
              <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
              <a href={`tel:${String(footer.contact?.phone || company.phone || '').replace(/[^\d+]/g, '')}`}>{footer.contact?.phone || company.phone}</a>
              <p>{footer.contact?.address || company.address}</p>
            </div>
            {socials.length ? (
              <div className="social-row">
                {socials.map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noreferrer" title={item.name} aria-label={item.name}>{item.label}</a>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} {company.name}. {footer.copyright || 'All rights reserved.'}</span>
          <span className="footer-legal">
            {(footer.legalLinks || []).map((link) => <Link key={link.to} to={link.to}>{link.label}</Link>)}
          </span>
          <span>{footer.credit}</span>
        </div>
      </div>
    </footer>
  )
}

/* =============================================================== chrome */

export function PageLoader({ label = 'Building clarity' }) {
  return (
    <div className="page-loader">
      <div className="loader-mark">A</div>
      <p>{label}</p>
      <div className="loader-bar"><span /></div>
    </div>
  )
}

export function ConnectionError({ onRetry, message }) {
  return (
    <div className="connection-error">
      <h1>We’re preparing the site.</h1>
      <p>{message || 'The content service is taking a moment. Please refresh to continue.'}</p>
      {onRetry ? (
        <button className="button button-light" style={{ marginTop: '1.6rem' }} onClick={onRetry}>
          Try again <ArrowRight size={16} />
        </button>
      ) : null}
    </div>
  )
}

/** One-line statement shown under sticky elements when content is loading. */
export function InlineSpinner({ label = 'Loading' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--muted)' }}>
      <CheckCircle2 size={14} className="spin" /> {label}
    </span>
  )
}

export { ToTop, CookieNotice, ServiceIcon }
