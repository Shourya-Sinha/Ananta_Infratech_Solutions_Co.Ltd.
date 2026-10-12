import { Link } from 'react-router-dom'
import { ArrowUpRight, Download } from 'lucide-react'
import { useContent } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import {
  BadgeGrid, CtaSlab, Eyebrow, MetricGrid, PageHero, ProgressBar, Reveal,
  SectionLead, StatStrip, TextLink
} from '../components/Blocks'

export default function Sustainability() {
  const site = useContent()
  const esg = site.sustainability || {}
  const base = site.meta?.siteUrl || ''

  return (
    <main>
      <Seo
        title="Sustainability & ESG"
        description={esg.intro}
        image={esg.image}
        jsonLd={breadcrumbSchema(base, [{ label: 'Sustainability & ESG', to: '/sustainability' }])}
      />

      <PageHero
        eyebrow={esg.eyebrow}
        title={esg.title}
        intro={esg.intro}
        image={esg.image}
        trail={[{ label: 'Sustainability & ESG', to: '/sustainability' }]}
        stats={[
          { value: '30%', label: 'waste intensity reduction target by 2028' },
          { value: '94%', label: 'of spoil and demolition material reused' },
          { value: '22%', label: 'better energy performance than benchmark' },
          { value: '100%', label: 'sites monitored monthly' }
        ]}
        actions={<>
          <Link className="button button-acid" to="/downloads">Request the ESG report <Download size={16} /></Link>
          <Link className="button button-light" to="/hse">Safety, quality &amp; environment</Link>
        </>}
      />

      <section className="shell section">
        <SectionLead
          number="01 — 04"
          eyebrow="Position"
          title={<>Measured performance,<br />not <em>aspiration.</em></>}
          copy="Every number on this page comes from a site record, a meter reading or an audited disposal trail. Where we are behind target, we say so."
        />
        <MetricGrid items={esg.headlineStats} />
      </section>

      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <SectionLead
            number="02 — 04"
            eyebrow="Five commitments"
            title={<>What we have<br />committed <em>to.</em></>}
            copy="Each commitment has an owner, a measurement method and a reporting frequency. None of them are aspirational statements without a number attached."
          />
          {(esg.commitments || []).map((commitment, index) => (
            <Reveal className="commitment-row" key={commitment.number} delay={index * 0.05}>
              <span className="card-number">{commitment.number}</span>
              <div>
                <h3>{commitment.title}</h3>
                <p>{commitment.text}</p>
              </div>
              <div className="commitment-progress">
                <span>Progress toward target — {commitment.progress}%</span>
                <ProgressBar value={commitment.progress} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell section">
        <div className="media-split">
          <Reveal>
            <img src={esg.image} alt="Sustainable construction practice" loading="lazy" style={{ aspectRatio: '4 / 3' }} />
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow>03 — 04 Six practices</Eyebrow>
            <h2 style={{ margin: '1rem 0 1.1rem' }}>The routine work behind the numbers.</h2>
            <p className="lead">
              Sustainability on a construction site is unglamorous: segregated skips, metered diesel, washed wheels,
              capped water use and a monitored noise boundary. We do it because it is measurable, and because
              unmeasured environmental impact is just pollution nobody is counting.
            </p>
          </Reveal>
        </div>
        <div className="grid-3" style={{ marginTop: 'clamp(1.8rem, 4vw, 3rem)' }}>
          {(esg.practices || []).map((practice, index) => (
            <Reveal className="card" key={practice.title} delay={index * 0.05}>
              <span className="card-index">{String(index + 1).padStart(2, '0')}</span>
              <h4>{practice.title}</h4>
              <p style={{ fontSize: 13.4, color: 'var(--ink-2)' }}>{practice.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell section-tight">
        <SectionLead
          number="04 — 04"
          eyebrow="Second image block"
          title="Certification and verification."
          copy="Green building credentials, environmental management systems and independently verified diversion rates."
          action={<TextLink to="/awards">Awards &amp; certifications</TextLink>}
        />
        <BadgeGrid items={(esg.certifications || []).map((item) => ({ label: item.label, value: item.value }))} />
        <div style={{ marginTop: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
          <img src={esg.secondaryImage} alt="Ananta environmental monitoring" loading="lazy" style={{ aspectRatio: '21 / 9', objectFit: 'cover' }} />
        </div>
      </section>

      <div className="shell section-tight" style={{ paddingTop: 0 }}>
        <StatStrip
          stats={[
            { value: '40%', label: 'construction carbon intensity reduction target by 2030', detail: 'Measured against a 2022 baseline, reported annually.' },
            { value: '94%', label: 'spoil and demolition material reused', detail: 'Achieved at The Alibaug Retreat and Hillview Wellness Resort.' },
            { value: '100%', label: 'sites with an environmental coordinator', detail: 'Boundary monitoring reported monthly to the client.' },
            { value: '640', label: 'people trained in our skills centre', detail: 'Free certification with 71% placement into paid work.' }
          ]}
          withDetail
        />
      </div>

      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <SectionLead
            eyebrow="Reports"
            title="Read the detail."
            copy="Our sustainability performance summary sets out the metrics, the methodology and where we fell short."
            action={<TextLink to="/downloads">All downloads</TextLink>}
          />
          <div className="grid-3">
            {(esg.reports || []).map((report, index) => (
              <Reveal className="card" key={report.title} delay={index * 0.05}>
                <span className="card-number">{report.year}</span>
                <h4>{report.title}</h4>
                <p style={{ fontSize: 13.2, color: 'var(--muted)' }}>{report.size}</p>
                <Link className="button button-sm button-ghost" to={report.to}>Request a copy <Download size={14} /></Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSlab
        eyebrow="Client ESG requirements"
        title={<>If your project carries an<br />ESG <em>mandate</em>, we can report against it.</>}
        text="Bring us your reporting framework — IGBC, GRI, client-specific or internal — and we will tell you what we can measure from site."
        image={esg.image}
        primary={{ to: '/contact', label: 'Discuss ESG reporting' }}
        secondary={{ to: '/downloads', label: 'Request our ESG pack' }}
      />
    </main>
  )
}
