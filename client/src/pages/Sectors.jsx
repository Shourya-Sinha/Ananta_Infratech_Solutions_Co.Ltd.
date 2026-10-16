import { Link } from 'react-router-dom'
import { ArrowUpRight, Check } from 'lucide-react'
import { useContent } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import { CtaSlab, Eyebrow, PageHero, Reveal, SectionLead, SectorCard, StatStrip, TextLink } from '../components/Blocks'

export default function Sectors() {
  const site = useContent()
  const intro = site.sectorsIntro || {}
  const base = site.meta?.siteUrl || ''

  return (
    <main>
      <Seo
        title="Sectors"
        description={intro.intro}
        image={intro.image}
        jsonLd={breadcrumbSchema(base, [{ label: 'Sectors', to: '/sectors' }])}
      />

      <PageHero
        eyebrow={intro.eyebrow}
        title={intro.title}
        intro={intro.intro}
        image={intro.image}
        trail={[{ label: 'Sectors', to: '/sectors' }]}
        stats={[
          { value: '60+', label: 'projects delivered since 2016' },
          { value: '1.9M', label: 'sq. ft. built' },
          { value: '8', label: 'states of operation' },
          { value: '₹2,400 Cr', label: 'cumulative value delivered' }
        ]}
        actions={<>
          <Link className="button button-acid" to="/projects">Browse projects <ArrowUpRight size={16} /></Link>
          <Link className="button button-light" to="/contact">Discuss your sector</Link>
        </>}
      />

      <section className="shell section">
        <SectionLead
          number="01 — 03"
          eyebrow="Where we work"
          title={<>Six sectors, each with<br />its own <em>logic.</em></>}
          copy="A hospital and a warehouse have almost nothing in common except that both must be built precisely. We staff project teams who have delivered in that environment before — with the codes, the programme constraints and the standard of finish that sector demands."
        />
        <div className="sector-grid">
          {(site.sectors || []).map((sector, index) => (
            <Reveal key={sector.slug} delay={(index % 3) * 0.08}>
              <SectorCard sector={sector} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <SectionLead
            number="02 — 03"
            eyebrow="Sector detail"
            title={<>What each sector<br />actually <em>asks of us.</em></>}
          />
          <div className="accordion">
            {(site.sectors || []).map((sector) => (
              <div className="accordion-item" key={sector.slug}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.4fr)', gap: 'clamp(1rem, 3vw, 3rem)', padding: 'clamp(1.2rem, 2.4vw, 1.9rem) 0', alignItems: 'start' }}>
                  <div>
                    <div className="project-meta" style={{ margin: '0 0 0.5rem' }}>
                      <span>{sector.projectCount} projects</span>
                      <span>{sector.short}</span>
                    </div>
                    <h3><Link to={`/sectors/${sector.slug}`}>{sector.title}</Link></h3>
                    <p style={{ fontSize: 13.8, color: 'var(--ink-2)', marginTop: '0.6rem' }}>{sector.summary}</p>
                    <div style={{ marginTop: '1rem' }}>
                      <TextLink to={`/sectors/${sector.slug}`}>Explore this sector</TextLink>
                    </div>
                  </div>
                  <div>
                    <div className="grid-2" style={{ gap: '0.5rem 1.5rem' }}>
                      {sector.highlights.map((highlight) => (
                        <span key={highlight} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 13.4, color: 'var(--ink-2)' }}>
                          <Check size={14} style={{ flex: 'none', marginTop: 3, color: 'var(--acid-deep)' }} />{highlight}
                        </span>
                      ))}
                    </div>
                    <div className="fact-grid" style={{ marginTop: '1.2rem' }}>
                      {sector.stats.map((stat) => (
                        <div key={stat.label}>
                          <b>{stat.value}</b>
                          <span>{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shell section">
        <SectionLead
          number="03 — 03"
          eyebrow="Cross-sector capability"
          title={<>The same eight disciplines,<br />applied to your <em>sector.</em></>}
          copy="Whatever the sector, the disciplines behind a good outcome are the same. What changes is the emphasis, the codes and the tolerance."
          action={<TextLink to="/services">See all services</TextLink>}
        />
        <div className="grid-4">
          {(site.services || []).map((service, index) => (
            <Reveal key={service.slug} delay={index * 0.04}>
              <Link className="card card-flat" to={`/services/${service.slug}`} style={{ height: '100%' }}>
                <span className="card-number">{service.number}</span>
                <h4>{service.short}</h4>
                <span className="text-link" style={{ fontSize: 12 }}>Read more <ArrowUpRight size={14} /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="shell section-tight" style={{ paddingTop: 0 }}>
        <StatStrip
          stats={[
            { value: '38', label: 'commercial projects', detail: 'Office campuses, business parks and mixed-use developments.' },
            { value: '26', label: 'residential projects', detail: 'Premium residences, gated communities and townships.' },
            { value: '14', label: 'industrial facilities', detail: 'Plants, warehouses, cold stores and distribution centres.' },
            { value: '7', label: 'healthcare projects', detail: 'Hospitals, diagnostics, cleanrooms and live-hospital upgrades.' }
          ]}
          withDetail
        />
      </div>

      <CtaSlab
        eyebrow="Sector experience"
        title={<>Bring us a brief in your<br />sector and we will tell you <em>honestly.</em></>}
        text="If we have not delivered in your sector before, we will say so — and tell you who has."
        image={site.sectors?.[2]?.image}
        primary={{ to: '/contact', label: 'Discuss your project' }}
        secondary={{ to: '/projects', label: 'See our projects' }}
      />
    </main>
  )
}
