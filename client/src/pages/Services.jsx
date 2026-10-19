import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, Code2, Mail } from 'lucide-react'
import { useContent } from '../lib/site'
import { ServiceIcon } from '../components/Layout'
import { Seo, breadcrumbSchema } from '../lib/seo'
import {
  BadgeGrid, CtaSlab, Eyebrow, Marquee, PageHero, ProcessGrid, Reveal, SectionLead, StatStrip, TextLink
} from '../components/Blocks'

export default function Services() {
  const site = useContent()
  const intro = site.servicesIntro || {}
  const base = site.meta?.siteUrl || ''

  return (
    <main>
      <Seo
        title="Services"
        description={intro.intro}
        image={intro.image}
        jsonLd={breadcrumbSchema(base, [{ label: 'Services', to: '/services' }])}
      />

      <PageHero
        eyebrow={intro.eyebrow}
        title={intro.title}
        intro={intro.intro}
        image={intro.image}
        trail={[{ label: 'Services', to: '/services' }]}
        stats={intro.stats}
        actions={<>
          <Link className="button button-acid" to="/contact">Discuss a project <ArrowUpRight size={16} /></Link>
          <Link className="button button-light" to="/projects">See the work</Link>
        </>}
      />

      {/* Service list */}
      <section className="shell section">
        <SectionLead
          number="01 — 03"
          eyebrow="Built environment + digital"
          title={<>Grounded in delivery.<br />Ready for <em>what’s next.</em></>}
          copy="From construction and infrastructure to custom software, CMS platforms, websites, mobile apps and client communication tools—we bring practical teams together around your outcome."
        />
        {[
          { title: 'Construction & infrastructure', note: 'Spaces, assets and infrastructure delivered with practical field expertise.', items: (site.services || []).filter((service) => service.category !== 'digital') },
          { title: 'Digital & IT solutions', note: 'Digital products, platforms and services designed around people and business goals.', items: (site.services || []).filter((service) => service.category === 'digital') }
        ].map((group) => group.items.length ? (
          <div className="service-group" key={group.title}>
            <div className="service-group-heading"><div><span>{group.items.length} capabilities</span><h2>{group.title}</h2></div><p>{group.note}</p></div>
            <div className="services-list">
              {group.items.map((service) => (
                <Reveal className="service-row" key={service.slug}>
                  <div className="service-count">
                    {service.icon ? <span className="service-row-icon"><ServiceIcon name={service.icon} size={15} /></span> : null}
                    {service.number}
                  </div>
                  <div>
                    <h2><Link to={`/services/${service.slug}`}>{service.title}</Link></h2>
                    <p>{service.summary}</p>
                  </div>
                  <ul>
                    {service.capabilities.slice(0, 4).map((item) => <li key={item}><Check size={13} />{item}</li>)}
                  </ul>
                  <ArrowUpRight className="service-arrow" size={20} />
                </Reveal>
              ))}
            </div>
          </div>
        ) : null)}
      </section>

      <div className="shell" style={{ paddingTop: 'clamp(1.5rem, 3vw, 2.4rem)' }}>
        <div className="support-strip">
          <div>
            <span className="support-strip-icon"><Code2 size={18} /></span>
            <div>
              <b>{site.services.filter((item) => item.category === 'digital').length} digital services, one team.</b>
              <p>Websites, CMS platforms, Android and iOS apps, custom chat, ERP/CRM, SEO, cloud and ongoing support — with written scope, two-week demos and a named lead.</p>
            </div>
          </div>
          <a className="support-strip-mail" href="mailto:support@anantainfratechsolutions.com">
            <Mail size={15} /> support@anantainfratechsolutions.com
          </a>
        </div>
      </div>

      <Marquee text="CONSTRUCTION · INFRASTRUCTURE · SOFTWARE · WEB · MOBILE · DIGITAL GROWTH" />

      {/* Delivery model */}
      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <SectionLead
            number="02 — 03"
            eyebrow={site.process?.eyebrow}
            title={site.process?.title}
            copy={site.process?.intro}
          />
          <ProcessGrid steps={site.process?.steps} />
        </div>
      </section>

      {/* Delivery models */}
      <section className="shell section">
        <SectionLead
          number="03 — 03"
          eyebrow="Contracting models"
          title={<>Appointed the way<br />that suits your <em>risk.</em></>}
          copy="Different projects need different commercial structures. We are comfortable with all three of the models below and will tell you which one we think your brief actually needs."
        />
        <div className="grid-3">
          {[
            { title: 'Lump sum', text: 'For fully designed, well-documented work where the scope is clear and price certainty matters most. We build the estimate from measured quantities, not from a rate per square foot.', best: 'Best when: design is complete and changes are unlikely.' },
            { title: 'Guaranteed maximum price', text: 'For projects where the design is still developing but the client needs a ceiling. Open-book costs with a shared saving mechanism and a fixed maximum.', best: 'Best when: design is 60–80% complete and programme is fixed.' },
            { title: 'Cost plus with open book', text: 'For refurbishment, live-environment and unknown-scope work. Every invoice is auditable, and measured work is priced transparently rather than padded into a contingency.', best: 'Best when: scope cannot be fully defined at the outset.' }
          ].map((model, index) => (
            <Reveal className="card" key={model.title} delay={index * 0.06}>
              <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{model.title}</h3>
              <p style={{ fontSize: 13.8, color: 'var(--ink-2)' }}>{model.text}</p>
              <p style={{ fontSize: 12.6, color: 'var(--muted)', margin: 0 }}>{model.best}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="shell section-tight" style={{ paddingTop: 0 }}>
        <StatStrip
          stats={[
            { value: '94%', label: 'packages awarded to prequalified partners', detail: 'Every bidder receives the same documents and the same clarifications.' },
            { value: '68%', label: 'packages to partners of 5+ years', detail: 'Stability in the supply chain shows up directly in finish quality.' },
            { value: '97%', label: 'milestones met or bettered', detail: 'Measured against baseline across all live projects.' },
            { value: '100%', label: 'projects with a named delivery lead', detail: 'One accountable person from mobilisation to defects close-out.' }
          ]}
          withDetail
        />
      </div>

      <section className="section-tight">
        <div className="shell">
          <SectionLead
            eyebrow="Certifications"
            title="Standards we are audited against."
            action={<TextLink to="/hse">How we manage safety and quality</TextLink>}
          />
          <BadgeGrid items={site.certifications} />
        </div>
      </section>

      <CtaSlab
        eyebrow="Bring us in early"
        title={<>The best time to solve a construction challenge is <em>before it starts.</em></>}
        text="Send us a drawing, a site address or a problem you have not solved yet. We will tell you honestly whether we are the right partner."
        image={site.home?.ctaSection?.image}
        primary={{ to: '/contact', label: 'Talk to our team' }}
        secondary={{ to: '/downloads', label: 'Download our capability statement' }}
      />
    </main>
  )
}
