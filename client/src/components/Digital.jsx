import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight, BarChart3, Boxes, Building2, Check, CloudCog, Code2, Compass, Cpu, Database,
  Factory, Globe, HardHat, Headphones, Layers, LayoutPanelLeft, MessagesSquare, Network, PenTool,
  RefreshCw, Route, Server, ShieldCheck, ShoppingBag, Smartphone, Sofa, Sparkles, TrendingUp, Zap
} from 'lucide-react'
import { Reveal } from './Blocks'

/**
 * Icon registry for CMS-driven services.
 *
 * A service record stores an icon *name*, never a component, so the admin portal
 * can change the picture on a card without a deploy. Unknown names fall back to
 * a neutral mark instead of breaking the page.
 */
const ICONS = {
  ArrowUpRight, BarChart3, Boxes, Building2, Check, CloudCog, Code2, Compass, Cpu, Database,
  Factory, Globe, HardHat, Headphones, Layers, LayoutPanelLeft, MessagesSquare, Network, PenTool,
  RefreshCw, Route, Server, ShieldCheck, ShoppingBag, Smartphone, Sofa, Sparkles, TrendingUp, Zap
}

export function ServiceIcon({ name, size = 20, strokeWidth = 1.6, className = '' }) {
  const Component = ICONS[name] || Layers
  return <Component size={size} strokeWidth={strokeWidth} className={className} aria-hidden />
}

/* --------------------------------------------------------------- numbers */

/**
 * Animated statistic. Accepts values like “1.9M”, “99.9%”, “24h” or “₹35,000”
 * and counts the numeric part up once the element scrolls into view. The final
 * value is always rendered in full for search engines and reduced-motion users.
 */
export function Counter({ value = '', duration = 1100, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const match = String(value).match(/^([^\d]*)([\d.,]+)(.*)$/)
  const target = match ? Number(match[2].replace(/,/g, '')) : 0
  const decimals = match && /[.,]/.test(match[2]) ? 1 : 0
  const [display, setDisplay] = useState(match ? `${match[1]}0${match[3]}` : value)

  useEffect(() => {
    if (!match) { setDisplay(value); return }
    if (!inView || reduced) { setDisplay(value); return }
    let frame = 0
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - progress) ** 3
      const current = (target * eased).toFixed(decimals)
      // Land on the exact string from the CMS so “02” stays “02”.
      setDisplay(progress >= 1 ? value : `${match[1]}${decimals ? current : Math.round(Number(current)).toLocaleString('en-IN')}${match[3]}`)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduced, target, duration, decimals, value]) // eslint-disable-line react-hooks/exhaustive-deps

  return <span ref={ref} className={className}>{display}</span>
}

/* -------------------------------------------------------------- spotlight */

/**
 * Card wrapper with a cursor-following light. Pure CSS variables driven from a
 * throttled pointer handler, so it costs one paint per move and nothing while
 * the pointer is elsewhere.
 */
export function Spotlight({ children, className = '', as = 'div' }) {
  const Component = motion[as] || motion.div
  const ref = useRef(null)
  const onMove = (event) => {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    node.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`)
    node.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`)
  }
  return (
    <Component ref={ref} className={`spotlight ${className}`.trim()} onMouseMove={onMove}>
      {children}
    </Component>
  )
}

/* ------------------------------------------------------- domain switcher */

/**
 * The home page's central idea: one company, two practices. A keyboard- and
 * touch-friendly switch that cross-fades between construction and digital,
 * with each side reading from the CMS.
 */
export function DomainSwitch({ block }) {
  const [active, setActive] = useState('digital')
  const sides = [
    { id: 'construction', ...(block?.construction || {}) },
    { id: 'digital', ...(block?.digital || {}) }
  ].filter((side) => side.label)
  if (!sides.length) return null
  const side = sides.find((item) => item.id === active) || sides[0]

  return (
    <section className="dx-domains">
      <div className="shell">
        <div className="dx-domains-head">
          <div>
            <p className="eyebrow eyebrow-light"><i />{block?.eyebrow || 'Two practices. One standard.'}</p>
            <h2>{block?.title || 'We build the place. Then we build what runs inside it.'}</h2>
          </div>
          <p>{block?.text}</p>
        </div>

        <div className="dx-switch" role="tablist" aria-label="Choose a practice">
          {sides.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={side.id === item.id}
              className={`dx-switch-tab ${side.id === item.id ? 'is-active' : ''}`}
              onClick={() => setActive(item.id)}
            >
              {side.id === item.id ? (
                <motion.span layoutId="dx-switch-pill" className="dx-switch-pill" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />
              ) : null}
              <span className="dx-switch-icon"><ServiceIcon name={item.icon || (item.id === 'digital' ? 'Code2' : 'Building2')} size={18} /></span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <motion.div className="dx-side" key={side.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
          <div className="dx-side-copy">
            <h3>{side.headline}</h3>
            <p>{side.text}</p>
            <ul className="dx-check">
              {(side.points || []).map((point) => <li key={point}><Check size={13} />{point}</li>)}
            </ul>
            <div className="dx-side-stats">
              {(side.stats || []).map((stat) => (
                <div key={stat.label}>
                  <strong><Counter value={stat.value} /></strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
            <Link className="button button-acid" to={side.to || '/services'}>{side.label2 || 'Explore' } <ArrowUpRight size={16} /></Link>
          </div>
          <div className={`dx-side-art ${side.id === 'digital' ? 'is-digital' : 'is-build'}`} aria-hidden>
            <div className="dx-rings">
              <span /><span /><span /><span />
            </div>
            <div className="dx-art-glyphs">
              {(side.id === 'digital'
                ? ['Code2', 'Smartphone', 'MessagesSquare', 'Database', 'CloudCog', 'ShieldCheck']
                : ['Building2', 'HardHat', 'Compass', 'Factory', 'Route', 'RefreshCw']).map((name, index) => (
                <span key={name} style={{ '--i': index }} className="dx-glyph"><ServiceIcon name={name} size={19} /></span>
              ))}
            </div>
            <div className="dx-art-label">
              <span>{side.id === 'digital' ? 'ANANTA DIGITAL' : 'ANANTA BUILD'}</span>
              <small>{side.id === 'digital' ? 'web · apps · systems · support' : 'design · build · commission'}</small>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------- service grid */

export function DigitalGrid({ services = [], label = 'DIGITAL' }) {
  return (
    <div className="dx-grid">
      {services.map((service, index) => (
        <Reveal key={service.slug} delay={index * 0.05}>
          <Spotlight className="dx-card">
            <div className="dx-card-top">
              <span className="dx-card-icon"><ServiceIcon name={service.icon} size={19} /></span>
              <span className="dx-card-index">{String(index + 1).padStart(2, '0')} <em>/ {label}</em></span>
            </div>
            <h3>{service.short}</h3>
            <p>{service.summary}</p>
            {(service.tags || []).length ? (
              <div className="dx-card-tags">
                {service.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            ) : null}
            <div className="dx-card-foot">
              {service.startingAt ? <span className="dx-price">{service.startingAt}</span> : <span />}
              <Link to={`/services/${service.slug}`} aria-label={`Explore ${service.title}`}>Explore <ArrowUpRight size={15} /></Link>
            </div>
          </Spotlight>
        </Reveal>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------- chat demo */

export function ChatPreview({ thread = [], features = [], eyebrow, title, text, compact = false }) {
  const [visible, setVisible] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!inView) return undefined
    if (reduced) { setVisible(thread.length); return undefined }
    let index = 0
    const timer = setInterval(() => {
      index += 1
      setVisible(index)
      if (index >= thread.length) clearInterval(timer)
    }, 850)
    return () => clearInterval(timer)
  }, [inView, reduced, thread.length])

  if (!thread.length) return null

  return (
    <div className={`dx-chat ${compact ? 'is-compact' : ''}`} ref={ref}>
      <div className="dx-chat-copy">
        {eyebrow ? <p className="eyebrow eyebrow-light"><i />{eyebrow}</p> : null}
        {title ? <h3>{title}</h3> : null}
        {text ? <p>{text}</p> : null}
        {features.length ? (
          <ul className="dx-chat-features">
            {features.map((feature) => <li key={feature}><Check size={13} />{feature}</li>)}
          </ul>
        ) : null}
      </div>

      <div className="dx-chat-device">
        <div className="dx-chat-head">
          <span className="dx-chat-avatar">A</span>
          <span>
            <b>Ananta project desk</b>
            <small><i className="dx-dot" /> online · replies in minutes</small>
          </span>
          <MessagesSquare size={17} />
        </div>
        <div className="dx-chat-body">
          {thread.map((message, index) => (
            <motion.div
              key={`${message.time}-${index}`}
              className={`dx-bubble dx-bubble-${message.from}`}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={index < visible ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {message.from === 'system' ? (
                <span className="dx-system">{message.text}</span>
              ) : (
                <>
                  <small>{message.name}</small>
                  <p>{message.text}</p>
                  <time>{message.time}</time>
                </>
              )}
            </motion.div>
          ))}
          {visible < thread.length ? (
            <div className="dx-typing" aria-label="Someone is typing"><span /><span /><span /></div>
          ) : null}
        </div>
        <div className="dx-chat-input" aria-hidden>
          <span>Write a reply…</span>
          <span className="dx-send"><ArrowUpRight size={14} /></span>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- stack strip */

export function StackMarquee({ items = [] }) {
  if (!items.length) return null
  const row = [...items, ...items]
  return (
    <div className="dx-stack" aria-label="Technologies we use">
      <div className="dx-stack-track">
        {row.map((item, index) => (
          <span key={`${item}-${index}`}><i />{item}</span>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- engagement */

export function EngagementGrid({ items = [] }) {
  if (!items.length) return null
  return (
    <div className="dx-engage">
      {items.map((item, index) => (
        <Reveal key={item.name} className="dx-engage-card" delay={index * 0.06}>
          <span className="dx-engage-index">{String(index + 1).padStart(2, '0')}</span>
          <h3>{item.name}</h3>
          <p className="dx-engage-price">{item.price}</p>
          <p className="dx-engage-text">{item.text}</p>
          <ul>{item.includes?.map((line) => <li key={line}><Check size={13} />{line}</li>)}</ul>
          <span className="dx-engage-best">{item.best}</span>
        </Reveal>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------- capability */

export function TechCapabilityGrid({ items = [] }) {
  if (!items.length) return null
  return (
    <div className="dx-cap-grid">
      {items.map((item, index) => (
        <Reveal key={item.title} className="dx-cap" delay={index * 0.04}>
          <span className="dx-cap-icon"><ServiceIcon name={item.icon} size={20} /></span>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          <ul>{item.points?.map((point) => <li key={point}>{point}</li>)}</ul>
        </Reveal>
      ))}
    </div>
  )
}

/* --------------------------------------------------------------- orbit fx */

/** Decorative, aria-hidden visual used behind the technology hero. */
export function TechOrbit() {
  return (
    <div className="dx-orbit" aria-hidden>
      <span className="dx-orbit-ring r1" />
      <span className="dx-orbit-ring r2" />
      <span className="dx-orbit-ring r3" />
      <span className="dx-orbit-core"><Code2 size={26} /></span>
      <span className="dx-orbit-node n1"><Globe size={15} /></span>
      <span className="dx-orbit-node n2"><Smartphone size={15} /></span>
      <span className="dx-orbit-node n3"><Database size={15} /></span>
      <span className="dx-orbit-node n4"><CloudCog size={15} /></span>
    </div>
  )
}
