import { Link } from 'react-router-dom'
import { ArrowUpRight, Award as AwardIcon } from 'lucide-react'
import { useContent } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import { BadgeGrid, CtaSlab, Eyebrow, LogoStrip, PageHero, Reveal, SectionLead, TextLink } from '../components/Blocks'

export default function Awards() {
  const site = useContent()
  const base = site.meta?.siteUrl || ''
  const awards = site.awards || []

  return (
    <main>
      <Seo
        title="Awards & certifications"
        description="Independent recognition, management system certifications and statutory compliance across the Ananta portfolio."
        jsonLd={breadcrumbSchema(base, [{ label: 'Awards & certifications', to: '/awards' }])}
      />

      <PageHero
        eyebrow="Recognition"
        title="Awarded by other people, not by us."
        intro="We do not enter awards for their own sake. The recognition below came from clients, industry bodies and safety councils — usually because somebody inspected the work."
        trail={[{ label: 'Awards & certifications', to: '/awards' }]}
        stats={[
          { value: `${awards.length}`, label: 'awards and recognitions' },
          { value: '2', label: 'consecutive safety excellence awards' },
          { value: '6', label: 'management system certifications' }
        ]}
      />

      <section className="shell section">
        <SectionLead
          number="01 — 03"
          eyebrow="Awards"
          title={<>Recognised where it<br />actually <em>counts.</em></>}
          copy="Safety performance, project delivery and quality audits — judged by people who visited the sites."
        />
        <div className="award-list">
          {awards.map((award, index) => (
            <Reveal className="award-row" key={award.title} delay={index * 0.04}>
              <time>{award.year}</time>
              <div>
                <h3>{award.title}</h3>
                <p>{award.note}</p>
              </div>
              <div className="award-body">{award.body}</div>
              <AwardIcon size={19} style={{ color: 'var(--acid-deep)' }} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <SectionLead
            number="02 — 03"
            eyebrow="Certifications"
            title={<>Audited systems,<br />current <em>cover.</em></>}
            copy="Our management systems align with ISO 9001, 45001 and 14001. Statutory registrations, insurance and financial standing are current and open to audit."
            action={<TextLink to="/downloads">Request the compliance pack</TextLink>}
          />
          <BadgeGrid items={site.certifications} />
        </div>
      </section>

      <section className="shell section">
        <SectionLead
          number="03 — 03"
          eyebrow="Standards maintained"
          title="The badges we actually hold."
          copy="Each of these represents a documented system with internal audit cycles — not a logo bought for a website footer."
        />
        <LogoStrip items={site.badges} />

        <div className="inline-cta" style={{ marginTop: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
          <div>
            <h3>Need to verify something before appointing us?</h3>
            <p>We will send certificates, insurance schedules, audited accounts and references — usually within one working day.</p>
          </div>
          <Link className="button" to="/contact">Request verification documents <ArrowUpRight size={16} /></Link>
        </div>
      </section>

      <CtaSlab
        eyebrow="Due diligence"
        title={<>Appoint us on <em>evidence</em>,<br />not on a pitch.</>}
        text="Ask for our prequalification dossier, safety statistics, audited accounts and client references. We would rather you checked."
        image={site.hse?.image}
        primary={{ to: '/downloads', label: 'Request the dossier' }}
        secondary={{ to: '/clients', label: 'See client feedback' }}
      />
    </main>
  )
}
