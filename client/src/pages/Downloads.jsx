import { Link } from 'react-router-dom'
import { ArrowUpRight, Download, FileText } from 'lucide-react'
import { useContent } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import { CtaSlab, Eyebrow, PageHero, Reveal, SectionLead, Tag, TextLink } from '../components/Blocks'
import { DownloadForm } from '../components/Forms'

export default function Downloads() {
  const site = useContent()
  const downloads = site.downloads || {}
  const documents = downloads.documents || []
  const base = site.meta?.siteUrl || ''

  const tags = [...new Set(documents.map((document) => document.tag))]

  return (
    <main>
      <Seo
        title="Downloads & brochures"
        description={downloads.intro}
        jsonLd={breadcrumbSchema(base, [{ label: 'Downloads & brochures', to: '/downloads' }])}
      />

      <PageHero
        eyebrow={downloads.eyebrow}
        title={downloads.title}
        intro={downloads.intro}
        trail={[{ label: 'Downloads', to: '/downloads' }]}
        stats={[
          { value: `${documents.length}`, label: 'documents available' },
          { value: `${tags.length}`, label: 'categories' },
          { value: '1 day', label: 'typical delivery time' }
        ]}
      />

      <section className="shell section">
        <SectionLead
          number="01 — 02"
          eyebrow="Document library"
          title={<>Everything a client, contractor<br />or consultant <em>needs.</em></>}
          copy="Select the documents you want and we will email them to you. We ask for your details so we know who we are sending technical documentation to — nothing is added to a marketing list."
          action={<TextLink to="/awards">See our certifications</TextLink>}
        />
        <div className="grid-3">
          {documents.map((document, index) => (
            <Reveal className="card" key={document.id} delay={(index % 3) * 0.05}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <FileText size={20} style={{ color: 'var(--acid-deep)' }} />
                <Tag>{document.tag}</Tag>
              </div>
              <h4>{document.title}</h4>
              <p style={{ fontSize: 13.4, color: 'var(--ink-2)' }}>{document.text}</p>
              <p style={{ fontSize: 12.2, color: 'var(--muted)', margin: 0 }}>{document.meta}</p>
              <a className="text-button" href="#request">Request this document <ArrowUpRight size={13} /></a>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="request" className="section-tight" style={{ background: 'var(--sand-2)', scrollMarginTop: 'calc(var(--header-h) + 1rem)' }}>
        <div className="shell">
          <div className="with-sidebar">
            <div className="form-panel">
              <div className="form-panel-head">
                <Eyebrow>02 — 02 Request documents</Eyebrow>
                <h2>Which documents should we send?</h2>
                <p>
                  Tick everything you need. If you are compiling a prequalification file, select the prequalification dossier,
                  quality management summary, HSE records and plant schedule together — those four are usually the full pack.
                </p>
              </div>
              <DownloadForm documents={documents} />
            </div>
            <aside>
              <div className="sidebar-card">
                <h3>Full prequalification pack</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                  Most contractors, consultants and public agencies need the same four documents. Select these in the form:
                </p>
                <ul className="check-list">
                  <li>Prequalification dossier</li>
                  <li>Quality management summary</li>
                  <li>HSE records &amp; safety statistics</li>
                  <li>Plant &amp; equipment schedule</li>
                </ul>
                <hr className="divider" />
                <h3>Need something specific?</h3>
                <p style={{ fontSize: 12.8, color: 'var(--muted)', margin: 0 }}>
                  Insurance certificates, audited financials, single-project references or drawing sets can be requested by email.
                </p>
                <a className="button button-sm button-ghost" href="mailto:tenders@anantainfratech.com">Email the team <Download size={14} /></a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="shell section-tight">
        <SectionLead
          eyebrow="Also useful"
          title="Pages people read before requesting documents."
        />
        <div className="grid-3">
          {[
            { title: 'Certifications & compliance', text: 'Management systems, statutory registrations and insurance position.', to: '/awards' },
            { title: 'Safety, quality & environment', text: 'Our HSE approach, statistics and programme details.', to: '/hse' },
            { title: 'Tenders & e-procurement', text: 'Packages, evaluation criteria and prequalification requirements.', to: '/tenders' },
            { title: 'Plant & equipment', text: 'Full owned-fleet capability across six categories.', to: '/equipment' },
            { title: 'Projects', text: 'Fourteen case studies with scope, challenge, solution and impact.', to: '/projects' },
            { title: 'Clients & testimonials', text: 'Who we work for and what they say afterwards.', to: '/clients' }
          ].map((item, index) => (
            <Reveal className="card card-flat" key={item.title} delay={(index % 3) * 0.05}>
              <h4><Link to={item.to} style={{ textDecoration: 'underline', textDecorationColor: 'var(--line-strong)' }}>{item.title}</Link></h4>
              <p style={{ fontSize: 13.2, color: 'var(--ink-2)' }}>{item.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaSlab
        eyebrow="Due diligence"
        title={<>Verifying a contractor<br />should not be <em>difficult.</em></>}
        text="If you need something that is not in this library — an audited account, an insurance schedule or a reference call — just ask."
        image={site.about?.storyImage}
        primary={{ to: '/contact', label: 'Request something specific' }}
        secondary={{ to: '/faq', label: 'Read the FAQs' }}
      />
    </main>
  )
}
