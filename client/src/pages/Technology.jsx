import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Check, Mail, MessagesSquare, Phone, Sparkles
} from 'lucide-react'
import { useContent } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import { Accordion, CtaSlab, Eyebrow, Reveal, SectionLead, StatStrip } from '../components/Blocks'
import {
  ChatPreview, Counter, DigitalGrid, EngagementGrid, ServiceIcon, StackMarquee,
  TechCapabilityGrid, TechOrbit
} from '../components/Digital'

const SUPPORT_EMAIL = 'support@anantainfratechsolutions.com'

/* ------------------------------------------------------------------ hero */

function TechHero({ tech, company, digitalCount }) {
  const badges = tech.badges || []
  return (
    <section className="tech-hero">
      <div className="tech-hero-bg" aria-hidden>
        <img src={tech.image} alt="" />
        <div className="tech-hero-shade" />
        <div className="tech-hero-grid" />
      </div>

      <div className="shell tech-hero-inner">
        <div className="tech-hero-copy">
          <motion.p className="eyebrow eyebrow-light" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <i />{tech.eyebrow || 'Ananta Digital'}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}>
            {tech.title}
          </motion.h1>
          <motion.p className="tech-hero-intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
            {tech.intro}
          </motion.p>

          <motion.div className="tech-hero-badges" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            {badges.map((badge) => <span key={badge}><Sparkles size={12} />{badge}</span>)}
          </motion.div>

          <motion.div className="button-row" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Link className="button button-acid" to="#digital-services">See all {digitalCount} services <ArrowUpRight size={16} /></Link>
            <a className="button button-light" href={`mailto:${company.technologyEmail || SUPPORT_EMAIL}?subject=Digital%20project%20enquiry`}>
              <Mail size={15} /> Email the team
            </a>
          </motion.div>

          <motion.div className="tech-hero-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
            {(tech.heroStats || []).map((stat) => (
              <div key={stat.label}>
                <strong><Counter value={stat.value} /></strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="tech-hero-art">
          <TechOrbit />
          <motion.div
            className="tech-code-card"
            initial={{ opacity: 0, y: 20, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="tech-code-head"><span /><span /><span /><em>ananta.digital</em></div>
            <pre aria-hidden>{`const practice = {
  build: ['web', 'cms', 'apps'],
  connect: ['chat', 'erp', 'api'],
  grow: ['seo', 'analytics'],
  run: ['cloud', 'support']
}`}</pre>
            <div className="tech-code-foot">
              <span><i /> systems operational</span>
              <span>99.9% uptime</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="tech-hero-foot">
        <div className="shell">
          <span>Scroll to explore <ArrowRight size={13} /></span>
          <span>Websites · CMS · Apps · Chat · ERP · SEO · Cloud</span>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- services */

const FILTERS = ['All', 'Build', 'Systems', 'Growth', 'Support']

function ServiceExplorer({ services }) {
  const [filter, setFilter] = useState('All')
  const families = useMemo(() => {
    const present = new Set(services.map((service) => service.family || 'Build'))
    return FILTERS.filter((name) => name === 'All' || present.has(name))
  }, [services])
  const shown = filter === 'All' ? services : services.filter((service) => (service.family || 'Build') === filter)

  return (
    <div id="digital-services" className="tech-explorer">
      <div className="dx-filter">
        <div className="dx-filter-tabs" role="tablist" aria-label="Filter digital services">
        {families.map((name) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={filter === name}
            className={filter === name ? 'is-active' : ''}
            onClick={() => setFilter(name)}
          >
            {name}
            <em>{name === 'All' ? services.length : services.filter((service) => (service.family || 'Build') === name).length}</em>
          </button>
        ))}
        </div>
        <span className="dx-filter-note">{shown.length} services shown</span>
      </div>
      <motion.div key={filter} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <DigitalGrid services={shown} label="DIGITAL" />
      </motion.div>
    </div>
  )
}

/* ----------------------------------------------------------- how we work */

function PromiseRail({ promise }) {
  return (
    <div className="tech-promise">
      <div className="shell">
      <div className="tech-promise-head">
        <Eyebrow inverse>{promise.eyebrow}</Eyebrow>
        <h2>{promise.title}</h2>
        <p>{promise.text}</p>
      </div>
      <div className="tech-promise-grid">
        {(promise.points || []).map((point, index) => (
          <Reveal key={point.title} className="tech-promise-item" delay={index * 0.06}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{point.title}</h3>
            <p>{point.text}</p>
          </Reveal>
        ))}
      </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ page */

export default function Technology() {
  const site = useContent()
  const tech = site.technology || {}
  const company = site.company || {}
  const digital = (site.services || []).filter((service) => service.category === 'digital')
  const base = site.meta?.siteUrl || ''
  const supportEmail = company.technologyEmail || company.supportEmail || SUPPORT_EMAIL

  return (
    <main className="tech-page">
      <Seo
        title="Digital & IT solutions"
        description={tech.intro || site.meta?.description}
        image={tech.image}
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            breadcrumbSchema(base, [{ label: 'Technology', to: '/technology' }]),
            {
              '@type': 'Service',
              serviceType: 'Software and digital technology services',
              provider: { '@type': 'Organization', name: company.name, url: base },
              areaServed: 'IN',
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Ananta Digital services',
                itemListElement: digital.map((service) => ({
                  '@type': 'Offer',
                  itemOffered: { '@type': 'Service', name: service.title, description: service.summary }
                }))
              }
            }
          ]
        }}
      />

      <TechHero tech={tech} company={company} digitalCount={digital.length} />

      <StackMarquee items={(tech.stack || []).flatMap((group) => group.items)} />

      {/* Proof */}
      <section className="shell tech-proof">
        <StatStrip stats={tech.proof} withDetail />
      </section>

      {/* Services */}
      <section className="shell tech-section">
        <SectionLead
          number={`${digital.length} services`}
          eyebrow={tech.servicesSection?.eyebrow}
          title={tech.servicesSection?.title}
          copy={tech.servicesSection?.text}
          action={<a className="text-link" href={`mailto:${supportEmail}`}>Ask about a service <ArrowUpRight size={15} /></a>}
        />
        <ServiceExplorer services={digital} />
      </section>

      {/* Capabilities */}
      <section className="tech-band">
        <div className="shell">
          <SectionLead
            eyebrow="What we build"
            title={<>Fourteen services, grouped into<br />the work they <em>actually do.</em></>}
            copy="Most clients do not arrive asking for a technology. They arrive with a problem: a slow site, a manual process, an app that never shipped. These are the capabilities we bring to it."
          />
          <TechCapabilityGrid items={tech.capabilities} />
        </div>
      </section>

      {/* Chat */}
      <section className="tech-chat">
        <div className="shell">
          <ChatPreview
            eyebrow={tech.chatDemo?.eyebrow}
            title={tech.chatDemo?.title}
            text={tech.chatDemo?.text}
            thread={tech.chatDemo?.thread}
            features={tech.chatDemo?.features}
          />
        </div>
      </section>

      {/* Process */}
      <section className="tech-process">
        <div className="shell">
          <SectionLead
            eyebrow="How a project runs"
            title={<>A process you can<br />see <em>working.</em></>}
            copy="No phase lasts long enough to hide in. You get a demo, a document or a decision every two weeks."
          />
          <ol className="tech-steps">
            {(tech.process || []).map((step, index) => (
              <Reveal as="li" key={step.number} className="tech-step" delay={index * 0.06}>
                <span className="tech-step-num">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Engagement */}
      <section className="shell tech-section">
        <SectionLead
          eyebrow="Engagement models"
          title={<>Four ways to work<br />with <em>Ananta Digital.</em></>}
          copy="Pricing is indicative — the scope drives the number, and the number is agreed in writing before work starts."
        />
        <EngagementGrid items={tech.engagement} />
      </section>

      {/* Case studies */}
      {tech.cases?.items?.length ? (
        <section className="tech-cases">
          <div className="shell">
            <SectionLead
              eyebrow={tech.cases.eyebrow}
              title={tech.cases.title}
              copy={tech.cases.text}
            />
            <div className="dx-cases">
              {tech.cases.items.map((item, index) => (
                <Reveal key={item.title} className="dx-case" delay={index * 0.07}>
                  <div className="dx-case-image">
                    <img src={item.image} alt="" loading="lazy" />
                    <span className="dx-case-status">{item.status}</span>
                  </div>
                  <div className="dx-case-body">
                    <div className="dx-case-meta">
                      <span>{item.client}</span>
                      <span>{item.sector}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <div className="dx-case-block">
                      <span>The problem</span>
                      <p>{item.problem}</p>
                    </div>
                    <div className="dx-case-block">
                      <span>What we built</span>
                      <p>{item.solution}</p>
                    </div>
                    <div className="dx-case-stack">
                      {(item.stack || []).map((tool) => <em key={tool}>{tool}</em>)}
                    </div>
                    <div className="dx-case-results">
                      {(item.result || []).map((result) => (
                        <div key={result.label}>
                          <strong>{result.value}</strong>
                          <span>{result.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <PromiseRail promise={tech.promise || {}} />

      {/* Ownership + SEO note */}
      <section className="shell tech-owned">
        <Reveal className="tech-owned-card">
          <div className="tech-owned-icon"><ServiceIcon name="ShieldCheck" size={24} /></div>
          <div>
            <h2>{tech.seoNote?.title || 'This website is the demo.'}</h2>
            <p>{tech.seoNote?.text}</p>
            <div className="button-row">
              <Link className="button button-sm" to="/admin">Open the content portal <ArrowUpRight size={14} /></Link>
              <a className="button button-sm button-ghost" href={`mailto:${supportEmail}?subject=I%20would%20like%20a%20CMS%20like%20yours`}>Ask for the same setup</a>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="tech-stack-panel">
          <h3>Tools we work with</h3>
          {(tech.stack || []).map((group) => (
            <div key={group.group} className="tech-stack-row">
              <span>{group.group}</span>
              <div>{group.items.map((item) => <em key={item}>{item}</em>)}</div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="tech-faq">
        <div className="shell">
          <div className="tech-faq-grid">
            <div>
              <Eyebrow>Questions</Eyebrow>
              <h2>Straight answers<br /><em>before you commit.</em></h2>
              <p className="tech-faq-note">
                Something not covered? Write to{' '}
                <a href={`mailto:${supportEmail}`}>{supportEmail}</a> — you will get a reply from the person who would lead the work, not a sales desk.
              </p>
              <div className="tech-faq-contact">
                <a href={`mailto:${supportEmail}`}><Mail size={15} /> {supportEmail}</a>
                <a href={`tel:${(company.phone || '').replace(/\s/g, '')}`}><Phone size={15} /> {company.phone}</a>
                <span><MessagesSquare size={15} /> Chat, web, app and email — one thread</span>
              </div>
            </div>
            <Accordion items={tech.faqs} defaultOpen={0} />
          </div>
        </div>
      </section>

      <section className="shell tech-back">
        <Link className="back-link" to="/services"><ArrowLeft size={16} /> All services</Link>
        <Link className="back-link" to="/projects">See construction work <ArrowRight size={16} /></Link>
      </section>

      <CtaSlab
        eyebrow={tech.cta?.eyebrow}
        title={tech.cta?.title}
        text={tech.cta?.text}
        image={tech.cta?.image || tech.image}
        primary={{ to: '/contact', label: 'Start a digital project' }}
        secondary={{ to: '/services', label: 'Explore all services' }}
      />
    </main>
  )
}
