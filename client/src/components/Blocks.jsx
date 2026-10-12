import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Minus,
  Plus,
  Search,
  X
} from 'lucide-react'

/* ------------------------------------------------------------------ motion */

/** Scroll-triggered reveal used across the site. Animates once, then stays put. */
export function Reveal({ children, className = '', delay = 0, y = 24, as = 'div' }) {
  const Component = motion[as] || motion.div
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  )
}

/* -------------------------------------------------------------------- atoms */

export function Eyebrow({ children, inverse = false, className = '' }) {
  return <p className={`eyebrow ${inverse ? 'eyebrow-light' : ''} ${className}`.trim()}><i />{children}</p>
}

export function Tag({ children, tone = '', className = '' }) {
  return <span className={`tag ${tone} ${className}`.trim()}>{children}</span>
}

/**
 * Small status pill used wherever a feature is visible but not yet open.
 * `open` flips it to a positive "Open now" badge so the same markup serves both
 * states of the CMS registration toggle.
 */
export function ComingSoonTag({ open = false, label = 'Coming soon', className = '', tone }) {
  const resolved = tone || (open ? 'tag-success' : 'tag-warning')
  return (
    <span className={`coming-soon-tag tag ${resolved} ${className}`.trim()}>
      <Clock size={11} />
      {open ? 'Open now' : label}
    </span>
  )
}

export function TextLink({ to, href, children, light = false, className = '' }) {
  const classes = `text-link ${light ? 'light' : ''} ${className}`.trim()
  if (href) {
    const external = /^https?:/i.test(href)
    return <a className={classes} href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}<ArrowUpRight size={16} /></a>
  }
  return <Link className={classes} to={to}>{children}<ArrowUpRight size={16} /></Link>
}

export function Breadcrumbs({ trail, base = '' }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {trail.map((item, index) => (
        <span key={`${item.label}-${index}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <span aria-hidden>/</span>
          {item.to && index < trail.length - 1 ? <Link to={item.to}>{item.label}</Link> : <span style={{ opacity: 1 }}>{item.label}</span>}
        </span>
      ))}
      {base ? null : null}
    </nav>
  )
}

export function CheckList({ items = [], className = '' }) {
  return <ul className={`check-list ${className}`.trim()}>{items.map((item) => <li key={item}><Check size={14} />{item}</li>)}</ul>
}

export function StatStrip({ stats = [], dark = false, withDetail = false }) {
  if (!stats.length) return null
  return (
    <div className={`stats-strip ${dark ? 'stats-strip-dark' : ''}`}>
      {stats.map((stat, index) => (
        <div key={`${stat.label}-${index}`}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
          {withDetail && stat.detail ? <p>{stat.detail}</p> : null}
        </div>
      ))}
    </div>
  )
}

export function MetricGrid({ items = [] }) {
  if (!items.length) return null
  return (
    <div className="grid-4">
      {items.map((item) => (
        <div className="metric-card" key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
          {item.baseline ? <small>{item.baseline}</small> : null}
        </div>
      ))}
    </div>
  )
}

export function FactGrid({ facts = [], dark = false }) {
  if (!facts.length) return null
  return (
    <div className={`fact-grid ${dark ? 'fact-grid-dark' : ''}`}>
      {facts.map((fact) => (
        <div key={fact.label}>
          <span>{fact.label}</span>
          <b>{fact.value}</b>
        </div>
      ))}
    </div>
  )
}

export function BadgeGrid({ items = [] }) {
  if (!items.length) return null
  return (
    <div className="badge-grid">
      {items.map((item, index) => (
        <div key={`${item.value}-${index}`}>
          <span>{item.label}</span>
          <b>{item.value}</b>
          {item.detail ? <p>{item.detail}</p> : null}
        </div>
      ))}
    </div>
  )
}

export function LogoStrip({ items = [] }) {
  if (!items.length) return null
  return (
    <div className="logo-strip">
      {items.map((item) => (
        <div key={item.value || item.label}>
          <span>{item.label}</span>
          <b>{item.value}</b>
        </div>
      ))}
    </div>
  )
}

export function InlineCta({ title, text, to, toLabel = 'Talk to our team', children }) {
  return (
    <div className="inline-cta">
      <div>
        <h3>{title}</h3>
        {text ? <p>{text}</p> : null}
      </div>
      {children || (to ? <Link className="button button-sm" to={to}>{toLabel} <ArrowUpRight size={15} /></Link> : null)}
    </div>
  )
}

export function EmptyState({ icon: Icon = Search, title, text, action }) {
  return (
    <div className="empty-state">
      <Icon size={26} />
      <h3>{title}</h3>
      {text ? <p>{text}</p> : null}
      {action}
    </div>
  )
}

export function Marquee({ text = 'BUILD WITH INTENT', inverse = false }) {
  return (
    <div className={`marquee ${inverse ? 'marquee-inverse' : ''}`} aria-hidden="true">
      <div>{Array.from({ length: 6 }).map((_, index) => <span key={index}>{text}<b>✳</b></span>)}</div>
    </div>
  )
}

export function TickerBar({ items = [], label = 'Latest' }) {
  if (!items.length) return null
  return (
    <div className="ticker">
      <div className="shell" style={{ display: 'flex', alignItems: 'center', gap: 0, paddingInline: 0 }}>
        <span className="ticker-label">{label}</span>
        <div className="ticker-inner" style={{ paddingLeft: '1.25rem' }}>
          {[...items, ...items].map((item, index) => <span className="ticker-item" key={index}>{item}</span>)}
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- headings */

export function SectionLead({ number, eyebrow, title, copy, action, children }) {
  return (
    <div className="section-lead">
      <div className="section-lead-side">
        {number ? <span className="section-number">{number}</span> : null}
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      </div>
      <div>
        <h2>{title}</h2>
        {copy ? <p>{copy}</p> : null}
        {children}
        {action ? <div className="section-actions">{action}</div> : null}
      </div>
    </div>
  )
}

export function PageHero({ eyebrow, title, intro, image, trail, meta = [], stats = [], actions, children, note }) {
  return (
    <section className={`page-hero ${image ? 'with-image' : ''}`} style={image ? { backgroundImage: `url(${image})` } : undefined}>
      <div className="shell">
        {trail ? <Breadcrumbs trail={trail} /> : null}
        {eyebrow ? <Eyebrow inverse className={trail ? 'mt-4' : ''} >{eyebrow}</Eyebrow> : null}
        <h1>{title}</h1>
        {intro ? <p>{intro}</p> : null}
        {note ? <div style={{ marginTop: '1.4rem' }}>{note}</div> : null}
        {meta.length ? <div className="page-hero-meta">{meta.map((item) => <span key={item}>{item}</span>)}</div> : null}
        {stats.length ? (
          <div className="page-hero-stats">
            {stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        ) : null}
        {actions ? <div className="button-row" style={{ marginTop: '1.6rem' }}>{actions}</div> : null}
        {children}
      </div>
    </section>
  )
}

export function CtaSlab({ eyebrow, title, text, image, primary, secondary }) {
  return (
    <section className="cta-slab">
      {image ? <div className="cta-slab-bg"><img src={image} alt="" loading="lazy" /></div> : null}
      <div className="shell">
        {eyebrow ? <Eyebrow inverse>{eyebrow}</Eyebrow> : null}
        <h2>{title}</h2>
        {text ? <p>{text}</p> : null}
        <div className="button-row">
          {primary ? <Link className="button button-acid" to={primary.to}>{primary.label} <ArrowUpRight size={16} /></Link> : null}
          {secondary ? <Link className="button button-light" to={secondary.to}>{secondary.label}</Link> : null}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------- cards */

export function ProjectCard({ project, featured = false, showFacts = false }) {
  const id = project.id || project._id
  return (
    <Link to={`/projects/${id}`} className={`project-card ${featured ? 'project-featured' : ''}`}>
      <div className="project-image">
        <img src={project.image} alt={project.title} loading="lazy" />
        {project.status ? <span className="project-status">{project.status}</span> : null}
        <span className="project-arrow" aria-hidden><ArrowUpRight size={19} /></span>
      </div>
      <div className="project-meta">
        <span>{project.category}</span>
        <span>{project.location}</span>
      </div>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      {showFacts ? (
        <div className="project-facts">
          {project.year ? <Tag>{project.year}</Tag> : null}
          {project.area ? <Tag>{project.area}</Tag> : null}
          {project.value ? <Tag>{project.value}</Tag> : null}
        </div>
      ) : null}
    </Link>
  )
}

export function ServiceTile({ service }) {
  return (
    <article className="service-tile">
      <span>{service.number}</span>
      <h3><Link to={`/services/${service.slug}`}>{service.title}</Link></h3>
      <p>{service.summary}</p>
      <span className="service-tile-arrow"><ArrowUpRight size={18} /></span>
    </article>
  )
}

export function SectorCard({ sector, compact = false }) {
  return (
    <Link className="sector-card" to={`/sectors/${sector.slug}`}>
      <img src={sector.image} alt={sector.title} loading="lazy" />
      <div className="sector-card-copy">
        <div className="sector-meta">
          <span>{sector.projectCount} projects</span>
          <span>{sector.short}</span>
        </div>
        <h3>{sector.title}</h3>
        {!compact ? <p>{sector.summary}</p> : null}
        <span className="text-link light" style={{ fontSize: 12.5 }}>Explore sector <ArrowUpRight size={15} /></span>
      </div>
    </Link>
  )
}

export function TeamCard({ person }) {
  return (
    <article className="team-card">
      <div className="team-photo"><img src={person.image} alt={person.name} loading="lazy" /></div>
      <span className="team-role">{person.role}</span>
      <h3>{person.name}</h3>
      {person.focus ? <p style={{ fontSize: 12.6, color: 'var(--muted)', margin: 0 }}>{person.focus}</p> : null}
      <p>{person.bio}</p>
      {person.highlights?.length ? (
        <ul className="team-facts">{person.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
      ) : null}
    </article>
  )
}

export function TestimonialCard({ testimonial }) {
  return (
    <figure className="quote-card">
      <span className="quote-mark" aria-hidden>“</span>
      <blockquote>{testimonial.quote}</blockquote>
      <footer>
        <b>{testimonial.author}</b>
        <span>{testimonial.role}</span>
        {testimonial.project ? <span style={{ marginTop: 6 }}>{testimonial.project} · {testimonial.year}</span> : null}
      </footer>
    </figure>
  )
}

export function InsightCard({ insight }) {
  return (
    <article className="insight-card">
      <Link to={`/insights/${insight.slug}`} className="insight-image">
        <img src={insight.image} alt={insight.title} loading="lazy" />
      </Link>
      <div className="insight-meta">
        <span>{insight.type}</span>
        <span>{insight.date}</span>
        <span>{insight.readingTime}</span>
      </div>
      <h3><Link to={`/insights/${insight.slug}`}>{insight.title}</Link></h3>
      <p>{insight.excerpt}</p>
      <div className="insight-foot">
        <span>{insight.author}</span>
        <Link className="text-link" to={`/insights/${insight.slug}`} style={{ fontSize: 12 }}>Read <ArrowUpRight size={14} /></Link>
      </div>
    </article>
  )
}

/* ---------------------------------------------------------------- process */

export function ProcessGrid({ steps = [] }) {
  if (!steps.length) return null
  return (
    <div className="process-grid">
      {steps.map((step, index) => (
        <Reveal className="process-card" key={step.number || index} delay={index * 0.06}>
          <span>{step.number}</span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
          {step.outputs?.length ? (
            <div className="process-outputs">{step.outputs.map((output) => <span key={output}>{output}</span>)}</div>
          ) : null}
        </Reveal>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------- accordion */

export function Accordion({ items = [], defaultOpen = -1, labelKey = 'question', bodyKey = 'answer' }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="accordion">
      {items.map((item, index) => {
        const isOpen = open === index
        return (
          <div className={`accordion-item ${isOpen ? 'is-open' : ''}`} key={item[labelKey] || index}>
            <button type="button" onClick={() => setOpen(isOpen ? -1 : index)} aria-expanded={isOpen}>
              {item[labelKey]}
              <Plus size={19} />
            </button>
            {isOpen ? (
              <motion.div className="accordion-panel" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {Array.isArray(item[bodyKey])
                  ? item[bodyKey].map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)
                  : <p>{item[bodyKey]}</p>}
                {item.points?.length ? <CheckList items={item.points} className="mt-3" /> : null}
              </motion.div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

/* -------------------------------------------------------------------- tabs */

export function Tabs({ tabs = [], active, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------- pagination */

export function Pagination({ page, total, perPage, onChange }) {
  const pages = Math.max(1, Math.ceil(total / perPage))
  if (pages <= 1) return null
  const windowSize = 5
  const start = Math.max(1, Math.min(page - 2, pages - windowSize + 1))
  const list = Array.from({ length: Math.min(windowSize, pages) }, (_, index) => start + index).filter((item) => item <= pages)
  return (
    <nav className="pagination" aria-label="Pagination">
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page <= 1} aria-label="Previous page"><ChevronLeft size={16} /></button>
      {list.map((item) => (
        <button key={item} onClick={() => onChange(item)} aria-current={item === page ? 'page' : undefined}>{item}</button>
      ))}
      <button onClick={() => onChange(Math.min(pages, page + 1))} disabled={page >= pages} aria-label="Next page"><ChevronRight size={16} /></button>
    </nav>
  )
}

/* ---------------------------------------------------------------- slider */

/** Horizontal, scroll-snapped slider with keyboard-friendly arrow controls. */
export function Slider({ children, controlsLabel = 'items' }) {
  const trackRef = useRef(null)
  const scrollBy = (direction) => {
    const track = trackRef.current
    if (!track) return
    const amount = Math.min(track.clientWidth * 0.85, 420) * direction
    track.scrollBy({ left: amount, behavior: 'smooth' })
  }
  return (
    <div>
      <div className="eyebrow-row" style={{ marginBottom: '1.2rem' }}>
        <span className="result-count">Swipe or use the arrows to browse {controlsLabel}</span>
        <div className="slider-controls">
          <button className="icon-button" onClick={() => scrollBy(-1)} aria-label="Previous"><ArrowLeft size={17} /></button>
          <button className="icon-button" onClick={() => scrollBy(1)} aria-label="Next"><ArrowRight size={17} /></button>
        </div>
      </div>
      <div className="slider-track" ref={trackRef}>{children}</div>
    </div>
  )
}

/* --------------------------------------------------------------- gallery */

export function Gallery({ images = [], caption, alt = 'Project photograph' }) {
  const [active, setActive] = useState(null)
  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') setActive(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  if (!images.length) return null
  return (
    <>
      <div className="gallery-grid">
        {images.map((src, index) => (
          <figure key={`${src}-${index}`} onClick={() => setActive(src)}>
            <img src={src} alt={`${alt} ${index + 1}`} loading="lazy" />
          </figure>
        ))}
      </div>
      {caption ? <div className="figure-caption"><span>{caption}</span><span>{images.length} photographs</span></div> : null}
      {active ? (
        <div className="lightbox" onClick={() => setActive(null)} role="dialog" aria-modal="true">
          <button className="icon-button icon-button-inverse" onClick={() => setActive(null)} aria-label="Close gallery"><X size={20} /></button>
          <img src={active} alt={alt} />
        </div>
      ) : null}
    </>
  )
}

/* ---------------------------------------------------------------- lists */

export function RowList({ items = [], columns = () => null, to = () => '#', meta = () => null }) {
  return (
    <div className="row-list">
      {items.map((item, index) => (
        <Link className="row-list-item" to={to(item)} key={item.id || item.slug || index}>
          <span className="card-index">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3>{item.title || item.name}</h3>
            {meta(item)}
          </div>
          <div>{columns(item)}</div>
          <ArrowUpRight size={19} />
        </Link>
      ))}
    </div>
  )
}

export function ValueRow({ value }) {
  return (
    <Reveal className="value-row">
      <span>{value.number}</span>
      <h3>{value.title}</h3>
      <p>{value.text}</p>
      <ArrowRight size={19} />
    </Reveal>
  )
}

export function Timeline({ items = [], yearKey = 'year', titleKey = 'title', textKey = 'text' }) {
  return (
    <div className="timeline">
      {items.map((item, index) => (
        <Reveal className="timeline-item" key={item[yearKey] || index} delay={index * 0.04}>
          <span className="timeline-year">{item[yearKey]}</span>
          <div>
            <h3>{item[titleKey]}</h3>
            <p>{item[textKey]}</p>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

export function ProgressBar({ value = 0 }) {
  return <div className="progress-bar"><span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>
}

export function RoundArrow() {
  return <span className="round-arrow"><ArrowDownRight size={22} /></span>
}

export function Stepper({ steps = [] }) {
  return (
    <ol className="process-grid">
      {steps.map((step, index) => (
        <Reveal as="li" className="process-card" key={step.title} delay={index * 0.05}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </Reveal>
      ))}
    </ol>
  )
}

export { Minus, Plus }
