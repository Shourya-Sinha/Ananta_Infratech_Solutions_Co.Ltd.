import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
import { useContent } from '../lib/site'
import { ServiceIcon } from '../components/Layout'
import { Seo, breadcrumbSchema } from '../lib/seo'
import {
  Accordion, CtaSlab, Eyebrow, FactGrid, PageHero, ProjectCard, Reveal, SectionLead,
  StatStrip, TextLink
} from '../components/Blocks'

export default function ServiceDetail() {
  const site = useContent()
  const { slug } = useParams()
  const service = (site.services || []).find((item) => item.slug === slug)
  const base = site.meta?.siteUrl || ''

  if (!service) {
    return (
      <main className="not-found">
        <h1>That service<br /><em>does not exist.</em></h1>
        <div className="not-found-actions">
          <Link className="button button-acid" to="/services">All services <ArrowUpRight size={16} /></Link>
        </div>
      </main>
    )
  }

  const others = (site.services || []).filter((item) => item.slug !== slug)
  const relatedProjects = (service.relatedProjects || [])
    .map((id) => (site.projects || []).find((project) => project.id === id))
    .filter(Boolean)
  const relatedSectors = (service.sectors || [])
    .map((sectorSlug) => (site.sectors || []).find((sector) => sector.slug === sectorSlug))
    .filter(Boolean)

  return (
    <main>
      <Seo
        title={service.title}
        description={service.summary}
        image={service.image}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          description: service.summary,
          provider: {
            '@type': service.category === 'digital' ? ['Organization', 'ProfessionalService'] : 'GeneralContractor',
            name: site.company?.name
          },
          areaServed: 'India',
          hasOfferCatalog: { '@type': 'OfferCatalog', name: service.title, itemListElement: service.capabilities.map((item) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: item } })) }
        }}
      />

      <PageHero
        eyebrow={<>{service.icon ? <ServiceIcon name={service.icon} size={13} className="hero-eyebrow-icon" /> : null} Service {service.number}</>}
        title={service.title}
        intro={service.tagline}
        image={service.image}
        trail={[{ label: 'Services', to: '/services' }, { label: service.short, to: `/services/${service.slug}` }]}
        actions={<>
          <Link className="button button-acid" to="/contact">Discuss this service <ArrowUpRight size={16} /></Link>
          <Link className="button button-light" to={service.category === 'digital' ? '/technology' : '/projects'}>
            {service.category === 'digital' ? 'The digital practice' : 'See related work'}
          </Link>
        </>}
      >
        <div style={{ marginTop: '1.6rem' }}>
          <FactGrid
            dark
            facts={service.category === 'digital' ? [
              { label: 'Starts at', value: service.startingAt || 'Scoped per project' },
              { label: 'Timeline', value: service.timeline || '2 – 12 weeks' },
              { label: 'Engagement', value: service.engagement || 'Project or retainer' },
              { label: 'Platforms', value: 'Web · Android · iOS · Cloud' }
            ] : [
              { label: 'Discipline', value: service.short },
              { label: 'Delivery', value: 'In-house teams + vetted specialists' },
              { label: 'Coverage', value: 'Mumbai · Pune · Noida · Bengaluru' },
              { label: 'Typical appointment', value: 'Advisory, CM, GC or EPC' }
            ]}
          />
        </div>
      </PageHero>

      <section className="shell section">
        <div className="with-sidebar">
          <div>
            <SectionLead
              eyebrow="Overview"
              title={service.summary}
            />
            <div className="prose stack">
              {service.description.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>

            <div style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
              <SectionLead eyebrow="What this includes" title={<>Capabilities and<br /><em>scope coverage.</em></>} />
              <div className="grid-2">
                <ul className="check-list">
                  {service.capabilities.slice(0, Math.ceil(service.capabilities.length / 2)).map((item) => <li key={item}><Check size={14} />{item}</li>)}
                </ul>
                <ul className="check-list">
                  {service.capabilities.slice(Math.ceil(service.capabilities.length / 2)).map((item) => <li key={item}><Check size={14} />{item}</li>)}
                </ul>
              </div>
            </div>

            <div style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
              <SectionLead eyebrow="What you receive" title="Deliverables, in writing." />
              <div className="grid-2">
                {service.deliverables.map((deliverable, index) => (
                  <Reveal className="card card-flat" key={deliverable.title} delay={index * 0.05}>
                    <span className="card-number">0{index + 1}</span>
                    <h4>{deliverable.title}</h4>
                    <p style={{ fontSize: 13.6, color: 'var(--ink-2)' }}>{deliverable.text}</p>
                  </Reveal>
                ))}
              </div>
            </div>

            {service.stack?.length ? (
              <div style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
                <SectionLead eyebrow="Tools & technology" title="Built with a stack we can support." />
                <div className="pill-list">
                  {service.stack.map((item) => <span className="tag" key={item}>{item}</span>)}
                </div>
              </div>
            ) : null}

            {service.stats?.length ? (
              <div style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
                <StatStrip stats={service.stats} />
              </div>
            ) : null}

            {service.faqs?.length ? (
              <div style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
                <SectionLead eyebrow="Questions" title="Straight answers." />
                <Accordion items={service.faqs} />
              </div>
            ) : null}
          </div>

          <aside>
            <div className="sidebar-card">
              <h3>All services</h3>
              <nav className="sidebar-nav">
                {(site.services || []).map((item) => (
                  <Link key={item.slug} to={`/services/${item.slug}`} className={item.slug === slug ? 'active' : ''}>{item.short}</Link>
                ))}
              </nav>
              <hr className="divider" />
              <h3>Speak to the team</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                Our {service.short.toLowerCase()} lead is available for a 30-minute technical conversation before you commit to anything.
              </p>
              <Link className="button button-sm" to="/contact">Start a conversation <ArrowUpRight size={14} /></Link>
              <a className="text-button" href={`mailto:${site.company?.technologyEmail || site.company?.supportEmail || site.company?.email}?subject=${encodeURIComponent(`${service.title} enquiry`)}`}>Email this team <ArrowUpRight size={13} /></a>
              <Link className="text-button" to="/downloads">Request the capability pack</Link>
            </div>

            {relatedSectors.length ? (
              <div className="sidebar-card" style={{ marginTop: '1.2rem' }}>
                <h3>Sectors this serves</h3>
                <div className="pill-list">
                  {relatedSectors.map((sector) => (
                    <Link className="tag" key={sector.slug} to={`/sectors/${sector.slug}`}>{sector.short}</Link>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {relatedProjects.length ? (
        <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
          <div className="shell">
            <SectionLead
              eyebrow="Related work"
              title={<>Where this discipline<br />made the <em>difference.</em></>}
              action={<TextLink to="/projects">All projects</TextLink>}
            />
            <div className="projects-grid">
              {relatedProjects.map((project, index) => (
                <Reveal key={project.id} delay={index * 0.07}><ProjectCard project={project} showFacts /></Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="shell section">
        <SectionLead eyebrow="Other disciplines" title="Where else we can help." />
        <div className="grid-3">
          {others.slice(0, 6).map((item, index) => (
            <Reveal key={item.slug} delay={index * 0.04}>
              <Link className="card card-flat" to={`/services/${item.slug}`} style={{ height: '100%' }}>
                <span className="card-number">{item.number}</span>
                <h4>{item.short}</h4>
                <p style={{ fontSize: 13.2, color: 'var(--ink-2)' }}>{item.summary}</p>
                <span className="text-link" style={{ fontSize: 12 }}>Read more <ArrowUpRight size={14} /></span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div style={{ marginTop: '2rem' }}>
          <Link className="back-link" to="/services"><ArrowLeft size={16} /> All services</Link>
        </div>
      </section>

      <CtaSlab
        eyebrow="Next step"
        title={<>Let’s test whether we are<br />right for your <em>project.</em></>}
        text="A short technical call with the person who would actually run the work. No sales pitch, no obligation."
        image={service.image}
        primary={{ to: '/contact', label: 'Book a technical call' }}
        secondary={{ to: '/tenders', label: 'Tender & procurement' }}
      />
    </main>
  )
}
