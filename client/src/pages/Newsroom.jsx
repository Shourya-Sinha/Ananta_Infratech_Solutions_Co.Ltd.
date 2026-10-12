import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail, Newspaper } from 'lucide-react'
import { useContent } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import { CtaSlab, Eyebrow, InsightCard, PageHero, Reveal, SectionLead, Tag, TextLink } from '../components/Blocks'

export default function Newsroom() {
  const site = useContent()
  const news = site.newsroom || []
  const base = site.meta?.siteUrl || ''
  const company = site.company || {}

  const grouped = news.reduce((acc, item) => {
    const year = String(item.dateISO || '').slice(0, 4) || 'Recent'
    acc[year] = acc[year] || []
    acc[year].push(item)
    return acc
  }, {})

  return (
    <main>
      <Seo
        title="Newsroom"
        description="Company announcements, project milestones, awards and certifications from Ananta Infratech Solutions."
        jsonLd={breadcrumbSchema(base, [{ label: 'Newsroom', to: '/newsroom' }])}
      />

      <PageHero
        eyebrow="Newsroom"
        title="What we have announced, and when."
        intro="Corporate developments, project milestones and independent recognition. Media enquiries are answered the same working day."
        trail={[{ label: 'Newsroom', to: '/newsroom' }]}
        stats={[
          { value: `${news.length}`, label: 'announcements published' },
          { value: '4', label: 'categories: company, project, award, certification' },
          { value: '24 hrs', label: 'media enquiry response time' }
        ]}
        actions={<>
          <a className="button button-acid" href={`mailto:${company.email}`}>Media enquiries <Mail size={16} /></a>
          <Link className="button button-light" to="/insights">Read our perspectives</Link>
        </>}
      />

      <section className="shell section">
        <SectionLead
          number="01 — 03"
          eyebrow="Latest"
          title={<>Company and project<br /><em>announcements.</em></>}
          copy="Everything published in reverse chronological order, grouped by year."
        />

        {Object.entries(grouped).map(([year, items]) => (
          <div key={year} style={{ marginBottom: 'clamp(1.8rem, 4vw, 3rem)' }}>
            <div className="eyebrow-row" style={{ marginBottom: '1rem' }}>
              <Eyebrow>{year}</Eyebrow>
              <span className="result-count">{items.length} announcement{items.length > 1 ? 's' : ''}</span>
            </div>
            <div className="press-list">
              {items.map((item, index) => (
                <Reveal className="press-row" key={item.title} delay={index * 0.04}>
                  <time dateTime={item.dateISO}>{item.date}</time>
                  <span className="tag tag-acid">{item.type}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                  </div>
                  <Link className="icon-button" to={item.link} aria-label={`Read: ${item.title}`}><ArrowUpRight size={17} /></Link>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <div className="media-split">
            <Reveal>
              <Newspaper size={30} style={{ color: 'var(--acid-deep)', marginBottom: '0.8rem' }} />
              <Eyebrow>02 — 03 Media &amp; press</Eyebrow>
              <h2 style={{ margin: '1rem 0 1.1rem' }}>Press, brand assets and speaking requests.</h2>
              <p className="lead">
                Our logo pack, leadership biographies, project imagery and company fact sheet are available on request.
                For interviews, conference participation or site filming, contact our communications team and we will
                respond within one working day.
              </p>
              <div className="button-row" style={{ marginTop: '1.5rem' }}>
                <a className="button" href="mailto:media@anantainfratech.com">Contact communications <Mail size={16} /></a>
                <Link className="button button-ghost" to="/downloads">Request brand assets</Link>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="card" style={{ height: '100%' }}>
                <h3>Company facts for editors</h3>
                <ul className="panel-list" style={{ display: 'grid', gap: '0.55rem', listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    ['Registered name', company.legalName],
                    ['Founded', company.founded],
                    ['Headquarters', 'Juhu, Mumbai, Maharashtra'],
                    ['Operating regions', 'Maharashtra, Delhi NCR, Gujarat, Karnataka, Telangana'],
                    ['Team size', company.employees],
                    ['Delivery model', 'Construction management, general contracting, EPC'],
                    ['Safety record', '4.2 million safe man-hours, zero LTI in 24 months'],
                    ['Portfolio', '60+ projects, 1.9 million sq. ft.']
                  ].map(([label, value]) => (
                    <li key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: 13, borderBottom: '1px dotted var(--line)', paddingBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--muted)' }}>{label}</span>
                      <b style={{ textAlign: 'right' }}>{value}</b>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="shell section-tight">
        <SectionLead
          number="03 — 03"
          eyebrow="Longer reads"
          title="Perspectives for context."
          action={<TextLink to="/insights">All insights</TextLink>}
        />
        <div className="insights-grid">
          {(site.insights || []).slice(0, 3).map((insight, index) => (
            <Reveal key={insight.slug} delay={index * 0.06}><InsightCard insight={insight} /></Reveal>
          ))}
        </div>
      </section>

      <CtaSlab
        eyebrow="Media contact"
        title={<>Writing about construction<br />in India? We are happy to <em>help.</em></>}
        text="Data, project references, photography and leadership interviews are available to journalists and researchers."
        image={site.projects?.[0]?.image}
        primary={{ to: '/contact', label: 'Contact communications' }}
        secondary={{ to: '/downloads', label: 'Download company profile' }}
      />
    </main>
  )
}
