import { Link } from 'react-router-dom'
import { ArrowUpRight, Wrench } from 'lucide-react'
import { useContent, useRegistration } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import { CtaSlab, Eyebrow, PageHero, Reveal, SectionLead, StatStrip, TextLink } from '../components/Blocks'

export default function Equipment() {
  const site = useContent()
  const registration = useRegistration()
  const plant = site.equipment || {}
  const base = site.meta?.siteUrl || ''

  return (
    <main>
      <Seo
        title="Plant & equipment"
        description={plant.intro}
        image={plant.image}
        jsonLd={breadcrumbSchema(base, [{ label: 'Plant & equipment', to: '/equipment' }])}
      />

      <PageHero
        eyebrow={plant.eyebrow}
        title={plant.title}
        intro={plant.intro}
        image={plant.image}
        trail={[{ label: 'Plant & equipment', to: '/equipment' }]}
        stats={plant.stats}
        actions={<>
          <Link className="button button-acid" to="/register">Offer plant for hire{registration.suffix} <ArrowUpRight size={16} /></Link>
          <Link className="button button-light" to="/downloads">Download the fleet schedule</Link>
        </>}
      />

      <section className="shell section">
        <SectionLead
          number="01 — 03"
          eyebrow="Why we own plant"
          title={<>Owned plant means<br />we do not <em>queue.</em></>}
          copy="Hiring plant at the moment you need it means standing behind somebody else's programme. We own and maintain the core fleet that keeps critical-path work moving — earthmoving, lifting, concreting, compaction and survey."
        />
        <div className="card" style={{ padding: 'clamp(1.3rem, 2.6vw, 2rem)' }}>
          <div className="fact-grid">
            {[
              { label: 'Fleet size', value: '186 owned units' },
              { label: 'Availability', value: '98.2% in 2025' },
              { label: 'Workshops', value: '7 regional yards' },
              { label: 'Technicians', value: '24 in-house' },
              { label: 'Operator policy', value: 'Certified only' },
              { label: 'Statutory records', value: 'Audited & current' }
            ].map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <b>{item.value}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shell section-tight">
        <SectionLead
          number="02 — 03"
          eyebrow="Fleet by category"
          title={<>Six categories,<br />one <em>maintenance standard.</em></>}
          copy="Each machine follows a manufacturer-schedule service plan with a documented maintenance log. Plant availability is reported monthly alongside utilisation and idle time."
        />
        {(plant.categories || []).map((category, index) => (
          <Reveal className="equipment-category" key={category.name} delay={index * 0.04}>
            <img src={category.image} alt={category.name} loading="lazy" />
            <div>
              <Eyebrow>{String(index + 1).padStart(2, '0')}</Eyebrow>
              <h2 style={{ marginTop: '0.7rem' }}>{category.name}</h2>
              <ul className="equipment-items" style={{ marginTop: '1rem' }}>
                {category.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className="equipment-note">{category.note}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <SectionLead
            number="03 — 03"
            eyebrow="Maintenance & compliance"
            title={<>Kept, checked and<br />on the <em>record.</em></>}
            copy="An unmaintained machine is a programme risk and a safety risk. Our maintenance regime is deliberately boring."
          />
          <div className="grid-3">
            {(plant.maintenance || []).map((item, index) => (
              <Reveal className="card" key={item.title} delay={index * 0.05}>
                <Wrench size={19} style={{ color: 'var(--acid-deep)' }} />
                <h4>{item.title}</h4>
                <p style={{ fontSize: 13.4, color: 'var(--ink-2)' }}>{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="shell section-tight">
        <div className="media-split">
          <Reveal>
            <img src={plant.secondaryImage} alt="Ananta plant on site" loading="lazy" style={{ aspectRatio: '4 / 3' }} />
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow>Hire and supply</Eyebrow>
            <h2 style={{ margin: '1rem 0 1.1rem' }}>We also hire plant and operators from vetted partners.</h2>
            <p className="lead">
              Our fleet covers the critical path, but projects have spikes we would rather hire than own. If you supply
              excavators, cranes, hoists, pumps or compressors with certified operators, register with us — hired plant
              is inspected, permitted and insured before it enters any Ananta site.
            </p>
            <div className="button-row" style={{ marginTop: '1.5rem' }}>
              <Link className="button" to="/register">Register as a plant supplier{registration.suffix} <ArrowUpRight size={16} /></Link>
              <Link className="button button-ghost" to="/tenders">See current packages</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="shell section-tight" style={{ paddingTop: 0 }}>
        <StatStrip stats={plant.stats} withDetail />
      </div>

      <CtaSlab
        eyebrow="Plant & equipment"
        title={<>Have plant to <em>hire</em>?<br />Register with us.</>}
        text="Certified plant with trained operators, current statutory records and insurance — we prequalify suppliers before the first mobilisation."
        image={plant.image}
        primary={{ to: '/register', label: `Register as a supplier${registration.suffix}` }}
        secondary={{ to: '/tenders', label: 'Tender & procurement' }}
      />
    </main>
  )
}
