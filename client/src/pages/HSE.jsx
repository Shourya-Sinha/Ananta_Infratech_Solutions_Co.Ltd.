import { Link } from 'react-router-dom'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import { useContent, useRegistration } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import {
  Accordion, CtaSlab, Eyebrow, LogoStrip, PageHero, Reveal, SectionLead, StatStrip, TextLink
} from '../components/Blocks'

export default function HSE() {
  const site = useContent()
  const registration = useRegistration()
  const hse = site.hse || {}
  const base = site.meta?.siteUrl || ''

  const faqs = [
    { question: 'What happens when someone raises a safety concern?', answer: 'Work stops. Every individual on an Ananta site holds documented stop-work authority, and there is no penalty for using it — including where the concern turns out to be unfounded. The concern is logged, investigated and closed out in writing.' },
    { question: 'How are near-misses handled?', answer: 'Every near-miss is reported and investigated within 24 hours, with the learning circulated company-wide within 72 hours. We treat the incidents that did not hurt anyone as the most valuable information we get.' },
    { question: 'What welfare provision do workers get?', answer: 'Safe audited accommodation, potable water, sanitation, rest areas, a canteen, free PPE, periodic health checks, medical insurance and full statutory benefits including PF and ESIC. We treat absent welfare as a safety failure, not a facilities issue.' },
    { question: 'How do you verify quality on site?', answer: 'Every work package has an inspection and test plan with named inspectors. Critical structural elements receive independent third-party testing, and all records are indexed into the handover dossier for the operator.' },
    { question: 'Are your management systems certified?', answer: 'Our quality, occupational health and safety, and environmental management systems are aligned with ISO 9001:2015, ISO 45001:2018 and ISO 14001:2015 respectively, and are open to client audit at any time.' }
  ]

  return (
    <main>
      <Seo
        title="Safety, quality & environment"
        description={hse.intro}
        image={hse.image}
        jsonLd={breadcrumbSchema(base, [{ label: 'Safety, quality & environment', to: '/hse' }])}
      />

      <PageHero
        eyebrow={hse.eyebrow}
        title={hse.title}
        intro={hse.intro}
        image={hse.image}
        trail={[{ label: 'Safety, quality & environment', to: '/hse' }]}
        stats={hse.headlineStats}
        actions={<>
          <Link className="button button-acid" to="/downloads">Request our HSE records <ArrowUpRight size={16} /></Link>
          <Link className="button button-light" to="/careers">Join our safety team</Link>
        </>}
      />

      <section className="shell section">
        <SectionLead
          number="01 — 04"
          eyebrow="Three systems, one discipline"
          title={<>Safety, quality and environment<br />are one <em>conversation.</em></>}
          copy="A site that is unsafe is rarely producing quality work, and a site that is careless with waste is usually careless with tolerances. We manage all three together, under one accountable leader."
        />
        <div className="grid-3">
          {(hse.pillars || []).map((pillar, index) => (
            <Reveal className="card" key={pillar.title} delay={index * 0.07}>
              <span className="card-index">{pillar.number}</span>
              <img src={pillar.image} alt={pillar.title} loading="lazy" style={{ aspectRatio: '16 / 10', marginBlock: '0.4rem' }} />
              <h3>{pillar.title}</h3>
              <p style={{ fontSize: 13.8, color: 'var(--ink-2)' }}>{pillar.text}</p>
              <ul className="check-list" style={{ marginTop: '0.4rem' }}>
                {pillar.points.map((point) => <li key={point}><ShieldCheck size={13} />{point}</li>)}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-dark section-tight">
        <div className="shell">
          <SectionLead
            number="02 — 04"
            eyebrow="Six programmes"
            title={<>The safety work<br />nobody <em>sees.</em></>}
            copy="Cultures are built in the unglamorous routines: the briefing at 7:30am, the inspection that closes an observation, the drill nobody wanted to run."
          />
          <div className="grid-3">
            {(hse.safetyProgrammes || []).map((programme, index) => (
              <Reveal key={programme.title} delay={index * 0.05} className="card card-dark">
                <span className="card-index" style={{ borderColor: 'var(--line-inverse)', color: 'var(--acid)' }}>{String(index + 1).padStart(2, '0')}</span>
                <h3 style={{ color: 'var(--white)' }}>{programme.title}</h3>
                <p>{programme.text}</p>
              </Reveal>
            ))}
          </div>
          <div style={{ marginTop: 'clamp(1.8rem, 4vw, 3rem)' }}>
            <StatStrip stats={hse.headlineStats} dark />
          </div>
        </div>
      </section>

      <section className="shell section">
        <div className="media-split">
          <Reveal>
            <img src={hse.secondaryImage} alt="Ananta quality inspection" loading="lazy" style={{ aspectRatio: '4 / 3' }} />
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow number="03 — 04">Quality assurance</Eyebrow>
            <h2 style={{ margin: '1rem 0 1.1rem' }}>Quality controlled at source, not snagged at the end.</h2>
            <p className="lead">
              Every element on an Ananta project has an inspection and test plan, a named inspector and a record that
              ends up in your handover dossier. When a client asks whether a pour was inspected before the next lift,
              we answer with a timestamped record and a photograph — not a search through a site register.
            </p>
            <div className="inline-cta" style={{ marginTop: '1.6rem' }}>
              <div>
                <h3>Snag rates at handover</h3>
                <p>0.4 snags per 100 sq. m. on our last three fit-out handovers — roughly a quarter of the industry benchmark we are measured against.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="shell section-tight">
        <SectionLead
          number="04 — 04"
          eyebrow="Certifications & insurance"
          title="Open to audit, any time."
          copy="We would rather you verified our position than trusted it. Ask us for the certificates and we will send the pack."
          action={<TextLink to="/downloads">Request compliance documents</TextLink>}
        />
        <LogoStrip items={hse.certificates} />
      </section>

      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <SectionLead
            eyebrow="Questions we are asked"
            title="Straight answers."
          />
          <Accordion items={faqs} />
        </div>
      </section>

      <CtaSlab
        eyebrow="Work with us safely"
        title={<>Safety is the one thing<br />we will not <em>negotiate.</em></>}
        text="If you are a trade partner, contractor or worker who shares that standard, we want to hear from you."
        image={hse.image}
        primary={{ to: '/register', label: `Register your interest${registration.suffix}` }}
        secondary={{ to: '/tenders', label: 'Supply or tender with us' }}
      />
    </main>
  )
}
