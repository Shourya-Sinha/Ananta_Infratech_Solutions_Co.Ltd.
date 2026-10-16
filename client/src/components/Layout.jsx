import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight, ArrowUp, ArrowUpRight, CheckCircle2, ChevronDown, Cookie, Eye, Mail, Menu, Phone, X
} from 'lucide-react'
import Brand from './Brand'
import { useContent, useRegistration, useRouteFocus, useSite } from '../lib/site'
import { postJson } from '../lib/api'

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
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    try { setVisible(localStorage.getItem('ananta-cookie-notice') !== 'accepted') } catch { setVisible(true) }
  }, [])
  if (!visible) return null
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
  return (
    <div className="preview-banner">
      <b><Eye size={13} style={{ verticalAlign: '-2px' }} /> Draft preview</b>
      <span>{site.__hasDraft ? 'Showing unpublished changes.' : 'No unsaved draft — showing the live content.'}</span>
      <Link to="/admin">Back to editor</Link>
      <button type="button" onClick={() => togglePreview(false)}>Exit preview</button>
    </div>
  )
}

/* ================================================================= header */

function UtilityBar({ company, registration }) {
  return (
    <div className="utility-bar">
      <div className="shell">
        <span className="utility-bar-links">
          <a href={`tel:${(company.phone || '').replace(/\s/g, '')}`}><Phone size={12} style={{ verticalAlign: '-2px', marginRight: 6 }} />{company.phone}</a>
          <a href={`mailto:${company.email}`}><Mail size={12} style={{ verticalAlign: '-2px', marginRight: 6 }} />{company.email}</a>
        </span>
        <span className="utility-bar-links">
          <Link to="/tenders">Tenders &amp; procurement</Link>
          <span aria-hidden>·</span>
          <Link to="/downloads">Downloads</Link>
          <span aria-hidden>·</span>
          <Link to="/register">Contractor &amp; worker registration{registration.open ? '' : <em className="utility-flag">{registration.label}</em>}</Link>
        </span>
      </div>
    </div>
  )
}

function MegaMenu({ group, onClose }) {
  return (
    <motion.div
      className="mega-menu"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      onMouseLeave={onClose}
    >
      <div className="shell mega-grid">
        <div className="mega-intro">
          <p className="eyebrow eyebrow-light"><i />{group.label}</p>
          <h3>{group.label === 'Company' ? 'The Ananta story' : group.label === 'Services' ? 'What we deliver' : group.label === 'Sectors' ? 'Where we work' : 'Work with us'}</h3>
          <p>{group.blurb}</p>
          <Link className="text-link light" to={group.to} onClick={onClose}>Overview <ArrowUpRight size={16} /></Link>
        </div>
        <div className="mega-links">
          {group.children.map((item) => (
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
    </motion.div>
  )
}

export function Header() {
  const { site } = useSite()
  const registration = useRegistration()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState(null)
  const [solid, setSolid] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const location = useLocation()
  const closeTimer = useRef(null)

  const nav = site?.nav || []
  const company = site?.company || {}

  useRouteFocus(location.pathname, location.hash)

  useEffect(() => {
    setMobileOpen(false)
    setOpenGroup(null)
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

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') { setMobileOpen(false); setOpenGroup(null) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openMenu = (label) => {
    clearTimeout(closeTimer.current)
    setOpenGroup(label)
  }
  const scheduleClose = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenGroup(null), 180)
  }

  return (
    <>
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
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    className="nav-trigger"
                    aria-expanded={openGroup === group.label}
                    aria-haspopup="true"
                    onClick={() => setOpenGroup(openGroup === group.label ? null : group.label)}
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
            <Link to="/contact" className="header-contact">Start a conversation <ArrowUpRight size={15} /></Link>
            <button className="menu-toggle" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={23} /></button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {openGroup ? (
          <MegaMenu
            group={nav.find((item) => item.label === openGroup)}
            onClose={() => setOpenGroup(null)}
          />
        ) : null}
      </AnimatePresence>

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
                        {group.children.map((item) => <Link key={item.to + item.label} to={item.to}>{item.label}</Link>)}
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
              <Link to="/contact">
                <span>{String(nav.length + 1).padStart(2, '0')}</span>
                <span>Contact</span>
                <ArrowUpRight size={20} />
              </Link>
            </nav>

            <div className="mobile-menu-bottom">
              <div className="mobile-cta">
                <a href={`tel:${(company.phone || '').replace(/\s/g, '')}`}><Phone size={14} style={{ verticalAlign: '-2px', marginRight: 8 }} />{company.phone}</a>
                <a href={`mailto:${company.email}`}><Mail size={14} style={{ verticalAlign: '-2px', marginRight: 8 }} />{company.email}</a>
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
<<<<<<< HEAD
  const { site } = useSite(); const c = site?.company || {}
  return <footer className="site-footer">
    <div className="footer-top"><p className="eyebrow">Ready when you are</p><h2>Let’s make a <em>lasting</em><br/>difference.</h2><Link to="/contact" className="circle-link" aria-label="Contact Ananta"><ArrowUpRight size={29}/></Link></div>
    <div className="footer-grid"><div><Brand inverse/><p className="footer-tagline">{c.tagline}</p></div><div><span>Explore</span><Link to="/about">About us</Link><Link to="/capabilities">Capabilities</Link><Link to="/projects">Projects</Link><Link to="/sustainability">Sustainability</Link></div><div><span>Connect</span><a href={`mailto:${c.email || ''}`}>{c.email || 'hello@anantainfratech.com'}</a><a href={`tel:${(c.phone || '').replace(/\s/g,'')}`}>{c.phone || '+91 22 4968 2016'}</a><p>{c.address || 'Juhu, Mumbai, Maharashtra'}</p></div><div><span>Follow</span><a target="_blank" rel="noreferrer" href={c.linkedin || '#'}><span className="social-glyph">in</span> LinkedIn</a><a target="_blank" rel="noreferrer" href={c.instagram || '#'}><span className="social-glyph">◎</span> Instagram</a><Link to="/admin">Client portal</Link></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Ananta Infratech Solutions</span><span>BUILDING THE FUTUR, CONNECTING THE DOTS.</span><a href="#top">Back to top ↑</a></div>
  </footer>
=======
  const site = useContent()
  const company = site.company || {}
  const footer = site.footer || {}
  const year = new Date().getFullYear()

  const socials = [
    { href: company.linkedin, label: 'in' },
    { href: company.instagram, label: 'ig' },
    { href: company.facebook, label: 'fb' },
    { href: company.youtube, label: 'yt' }
  ].filter((item) => item.href)

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-cta">
          <div>
            <p className="eyebrow eyebrow-light"><i />{footer.cta?.eyebrow || 'Ready when you are'}</p>
            <h2>{footer.cta?.title || 'Let’s make a lasting difference.'}</h2>
          </div>
          <Link to="/contact" className="circle-link" aria-label={footer.cta?.linkLabel || 'Contact Ananta'}><ArrowUpRight size={28} /></Link>
        </div>

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
              <a href={`mailto:${footer.contact?.email || company.email}`}>{footer.contact?.email || company.email}</a>
              <a href={`tel:${(footer.contact?.phone || company.phone || '').replaceAll(' ', '')}`}>{footer.contact?.phone || company.phone}</a>
              <p>{footer.contact?.address || company.address}</p>
            </div>
            {socials.length ? (
              <div className="social-row">
                {socials.map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>{item.label}</a>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} {company.name}. All rights reserved.</span>
          <span className="footer-legal">
            {(footer.legalLinks || []).map((link) => <Link key={link.to} to={link.to}>{link.label}</Link>)}
          </span>
          <span>{footer.credit}</span>
        </div>
      </div>
    </footer>
  )
>>>>>>> 627feeec503d6b8d41aa536f5d3a9847c1793ec1
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

export { ToTop, CookieNotice }
