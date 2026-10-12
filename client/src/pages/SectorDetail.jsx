import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
import { useContent } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import {
  CtaSlab, Eyebrow, PageHero, ProjectCard, Reveal, SectorCard, SectionLead, StatStrip, TestimonialCard, TextLink
} from '../components/Blocks'

export default function SectorDetail() {
  const site = useContent()
  const { slug } = useParams()
  const sector = (site.sectors || []).find((item) => item.slug === slug)
  const base = site.meta?.siteUrl || ''

  if (!sector) {
    return (
      <main className="not-found">
        <h1>That sector<br /><em>does not exist.</em></h1>
        <div className="not-found-actions">
          <Link className="button button-acid" to="/sectors">All sectors <ArrowUpRight size={16} /></Link>
        </div>
      </main>
    )
  }

  const projects = (site.projects || []).filter((project) => project.sector === slug)
  const testimonials = (site.testimonials || []).filter((item) => projects.some((project) => project.id === item.project || item.project === project.title))
  const services = (site.services || []).filter((service) => (service.sectors || []).includes(slug))
  const otherSectors = (site.sectors || []).filter((item) => item.slug !== slug)

  return (
    <main>
      <Seo
        title={sector.title}
        description={sector.summary}
        image={sector.image}
        jsonLd={breadcrumbSchema(base, [{ label: 'Sectors', to: '/sectors' }, { label: sector.short, to: `/sectors/${sector.slug}` }])}
      />

      <PageHero
        eyebrow={`Sector · ${sector.short}`}
        title={sector.title}
        intro={sector.summary}
        image={sector.image}
        trail={[{ label: 'Sectors', to: '/sectors' }, { label: sector.short, to: `/sectors/${sector.slug}` }]}
        stats={sector.stats}
        actions={<>
          <Link className="button button-acid" to="/contact">Discuss a {sector.short.toLowerCase()} project <ArrowUpRight size={16} /></Link>
          <Link className="button button-light" to="/projects">Browse all work</Link>
        </>}
      />

      <section className="shell section">
        <div className="with-sidebar">
          <div>
            <SectionLead eyebrow="Sector perspective" title={sector.summary} />
            <div className="prose">
              <p>{sector.description}</p>
            </div>

            <div style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
              <SectionLead eyebrow="What we deliver" title="Scope coverage in this sector." />
              <div className="grid-2">
                <ul className="check-list">
                  {sector.highlights.slice(0, Math.ceil(sector.highlights.length / 2)).map((item) => <li key={item}><Check size={14} />{item}</li>)}
                </ul>
                <ul className="check-list">
                  {sector.highlights.slice(Math.ceil(sector.highlights.length / 2)).map((item) => <li key={item}><Check size={14} />{item}</li>)}
                </ul>
              </div>
            </div>

            <div style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
              <SectionLead eyebrow="Disciplines applied" title="How this sector is staffed." />
              <div className="grid-2">
                {services.map((service, index) => (
                  <Reveal className="card card-flat" key={service.slug} delay={index * 0.05}>
                    <span className="card-number">{service.number}</span>
                    <h4><Link to={`/services/${service.slug}`} style={{ textDecoration: 'underline', textDecorationColor: 'var(--line-strong)' }}>{service.title}</Link></h4>
                    <p style={{ fontSize: 13.4, color: 'var(--ink-2)' }}>{service.summary}</p>
                  </Reveal>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
              <SectionLead
                eyebrow="Sector metrics"
                title="Measured, not claimed."
              />
              <StatStrip
                stats={[
                  ...sector.stats.map((stat) => ({ value: stat.value, label: stat.label })),
                  { value: sector.projectCount, label: 'projects delivered in this sector' }
                ]}
              />
            </div>
          </div>

          <aside>
            <div className="sidebar-card">
              <h3>All sectors</h3>
              <nav className="sidebar-nav">
                {(site.sectors || []).map((item) => (
                  <Link key={item.slug} to={`/sectors/${item.slug}`} className={item.slug === slug ? 'active' : ''}>{item.short}</Link>
                ))}
              </nav>
              <hr className="divider" />
              <h3>Sector lead</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                Ask to speak to the project lead who delivered our last {sector.short.toLowerCase()} project. We will arrange it.
              </p>
              <Link className="button button-sm" to="/contact">Request a call <ArrowUpRight size={14} /></Link>
              <Link className="text-button" to="/downloads">Download sector case sheets</Link>
            </div>
          </aside>
        </div>
      </section>

      {projects.length ? (
        <section className="shell section-tight">
          <SectionLead
            eyebrow="Selected work"
            title={<>{sector.short} projects<br />we have <em>delivered.</em></>}
            action={<TextLink to="/projects">All projects</TextLink>}
          />
          <div className="projects-grid">
            {projects.map((project, index) => (
              <Reveal key={project.id} delay={(index % 3) * 0.06}><ProjectCard project={project} showFacts /></Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {testimonials.length ? (
        <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
          <div className="shell">
            <SectionLead eyebrow="Client perspective" title="What they said afterwards." />
            <div className="testimonial-grid">
              {testimonials.map((testimonial) => <TestimonialCard key={testimonial.id} testimonial={testimonial} />)}
            </div>
          </div>
        </section>
      ) : null}

      <section className="shell section-tight">
        <SectionLead eyebrow="Other sectors" title="Where else we work." />
        <div className="sector-grid">
          {otherSectors.slice(0, 3).map((item, index) => (
            <Reveal key={item.slug} delay={index * 0.06}><SectorCard sector={item} compact /></Reveal>
          ))}
        </div>
        <div style={{ marginTop: '2rem' }}>
          <Link className="back-link" to="/sectors"><ArrowLeft size={16} /> All sectors</Link>
        </div>
      </section>

      <CtaSlab
        eyebrow="Next step"
        title={<>Planning something in<br /><em>{sector.short.toLowerCase()}?</em></>}
        text="Send us the brief, the site or the problem. We will tell you whether we are the right partner and who else you should speak to."
        image={sector.image}
        primary={{ to: '/contact', label: 'Start a conversation' }}
        secondary={{ to: '/tenders', label: 'Tender & procurement' }}
      />
    </main>
  )
}
