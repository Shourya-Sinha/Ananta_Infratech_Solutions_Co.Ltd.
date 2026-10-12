import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useContent } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import {
  BadgeGrid, CtaSlab, Eyebrow, LogoStrip, Marquee, PageHero, Reveal, SectionLead,
  StatStrip, TeamCard, TextLink, Timeline, ValueRow
} from '../components/Blocks'

export default function About() {
  const site = useContent()
  const about = site.about || {}
  const csr = site.csr || {}
  const base = site.meta?.siteUrl || ''

  return (
    <main>
      <Seo
        title="About us"
        description={about.intro}
        image={about.image}
        jsonLd={breadcrumbSchema(base, [{ label: 'About us', to: '/about' }])}
      />

      <PageHero
        eyebrow="About Ananta"
        title={about.title}
        intro={about.intro}
        image={about.image}
        trail={[{ label: 'About us', to: '/about' }]}
        stats={[
          { value: site.company?.founded || '2016', label: 'founded in Mumbai' },
          { value: site.teamStats?.[0]?.value || '480+', label: 'people in the team' },
          { value: '8', label: 'states of operation' },
          { value: '60+', label: 'projects delivered' }
        ]}
        actions={<>
          <Link className="button button-acid" to="/leadership">Meet the leadership <ArrowUpRight size={16} /></Link>
          <Link className="button button-light" to="/projects">See our work</Link>
        </>}
      />

      <BadgeGrid items={site.badges} />

      {/* Story */}
      <section className="shell about-story">
        <Reveal>
          <span className="giant-number">{site.company?.founded || '2016'}</span>
          <p className="eyebrow" style={{ marginTop: '1.2rem' }}><i />The year it started</p>
        </Reveal>
        <div>
          <Eyebrow>Our story</Eyebrow>
          <h2 style={{ margin: '1rem 0 1.2rem' }}>{about.storyTitle}</h2>
          <p className="lead">{about.storyText}</p>
          <p style={{ color: 'var(--ink-2)', marginTop: '1.1rem' }}>{about.storyText2}</p>
          <div className="button-row" style={{ marginTop: '1.6rem' }}>
            <Link className="button" to="/services">Explore our capabilities <ArrowUpRight size={16} /></Link>
            <Link className="button button-ghost" to="/clients">Who we work for</Link>
          </div>
        </div>
      </section>

      <Marquee text="ENGINEERING POSSIBILITY" inverse />

      {/* Mission & vision */}
      <section className="shell section">
        <div className="mission-grid">
          <div>
            <Eyebrow>Mission</Eyebrow>
            <h3>{about.mission?.title}</h3>
            <p>{about.mission?.text}</p>
          </div>
          <div>
            <Eyebrow>Vision</Eyebrow>
            <h3>{about.vision?.title}</h3>
            <p>{about.vision?.text}</p>
          </div>
          <div>
            <Eyebrow>Operating model</Eyebrow>
            <h3>Integrated delivery, one accountability</h3>
            <p>Preconstruction, civil works, MEP, fit-out and handover under a single appointment — so decisions are made once, by the people who live with them.</p>
          </div>
        </div>
        {about.storyImage ? (
          <Reveal className="figure" style={{ marginTop: 'clamp(1.6rem, 4vw, 3rem)' }}>
            <img src={about.storyImage} alt="Ananta construction site" loading="lazy" style={{ aspectRatio: '21 / 9' }} />
            <div className="figure-caption">
              <span>On site, in the detail</span>
              <span>{site.company?.addressLines?.[1]} · {site.company?.yearsLabel}</span>
            </div>
          </Reveal>
        ) : null}
      </section>

      {/* Values */}
      <section className="shell value-section">
        <SectionLead
          number="01 — 06"
          eyebrow="What guides us"
          title={<>The principles<br />beneath the <em>progress.</em></>}
          copy="Six commitments that decide how we behave when a project gets difficult — which is when principles actually matter."
        />
        <div className="values-list">
          {(about.values || []).map((value) => <ValueRow key={value.number} value={value} />)}
        </div>
      </section>

      {/* Differentiators */}
      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <SectionLead
            eyebrow="Why clients stay"
            title={<>Six things that are<br />genuinely <em>different.</em></>}
            copy="Not differentiators written for a brochure — the six things clients tell us in project reviews and reappoint us for."
          />
          <div className="grid-3">
            {(about.differentiators || []).map((item, index) => (
              <Reveal className="card" key={item.title} delay={index * 0.05}>
                <span className="card-index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p style={{ fontSize: 13.8, color: 'var(--ink-2)' }}>{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="shell section">
        <SectionLead
          number="02 — 06"
          eyebrow="Our journey"
          title={<>Ten years, one<br /><em>standard.</em></>}
          copy="From a twelve-person practice in Juhu to a delivery platform across eight states — without changing what we refuse to compromise on."
        />
        <Timeline items={about.timeline} />
      </section>

      {/* Team snapshot */}
      <section className="section-dark section">
        <div className="shell">
          <SectionLead
            number="03 — 06"
            eyebrow={site.teamIntro?.eyebrow}
            title={site.teamIntro?.title}
            copy={site.teamIntro?.intro}
            action={<TextLink light to="/leadership">Meet our leadership</TextLink>}
          />
          <StatStrip stats={site.teamStats} dark />
          <div className="dept-list" style={{ marginTop: 'clamp(1.6rem, 3vw, 2.6rem)', borderColor: 'var(--line-inverse)', background: 'var(--line-inverse)' }}>
            {(site.departments || []).map((department) => (
              <div key={department.name} style={{ background: 'var(--ink-2)' }}>
                <span>{department.count}</span>
                <b style={{ color: 'var(--white)' }}>{department.name}</b>
                <p style={{ color: 'var(--muted-inverse)' }}>{department.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership preview */}
      <section className="shell section">
        <SectionLead
          number="04 — 06"
          eyebrow={site.leadershipIntro?.eyebrow}
          title={site.leadershipIntro?.title}
          copy={site.leadershipIntro?.intro}
          action={<TextLink to="/leadership">Full leadership profiles</TextLink>}
        />
        <div className="team-grid">
          {(site.leadership || []).slice(0, 4).map((person, index) => (
            <Reveal key={person.id} delay={index * 0.06}><TeamCard person={person} /></Reveal>
          ))}
        </div>
      </section>

      {/* CSR */}
      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <div className="media-split">
            <Reveal>
              <img src={about.csrImage} alt="Ananta skill training centre" loading="lazy" />
            </Reveal>
            <Reveal delay={0.1}>
              <Eyebrow>{csr.eyebrow}</Eyebrow>
              <h2 style={{ margin: '1rem 0 1.1rem' }}>{csr.title}</h2>
              <p className="lead">{csr.intro}</p>
              <div className="button-row" style={{ marginTop: '1.5rem' }}>
                <Link className="button" to="/tenders">Work with us <ArrowUpRight size={16} /></Link>
              </div>
            </Reveal>
          </div>
          <div className="grid-4" style={{ marginTop: 'clamp(1.8rem, 4vw, 3rem)' }}>
            {(csr.initiatives || []).map((initiative, index) => (
              <Reveal className="card" key={initiative.title} delay={index * 0.05}>
                <span className="card-number">{initiative.metric}</span>
                <h4>{initiative.title}</h4>
                <p style={{ fontSize: 13.4, color: 'var(--ink-2)' }}>{initiative.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="shell section">
        <SectionLead
          number="05 — 06"
          eyebrow="Certifications & compliance"
          title={<>Audited, insured<br />and <em>accountable.</em></>}
          copy="Our management systems, statutory registrations and insurance position are open to audit by any client at any time."
          action={<TextLink to="/downloads">Request our compliance pack</TextLink>}
        />
        <BadgeGrid items={site.certifications} />
      </section>

      <LogoStrip items={site.badges} />

      <CtaSlab
        eyebrow="01 — 06"
        title={<>Come and see a site.<br />That is the best reference.</>}
        text="We would rather you judged us on a live project than on a brochure. Ask us for a site visit and we will arrange it."
        image={site.about?.peopleImage}
        primary={{ to: '/contact', label: 'Arrange a site visit' }}
        secondary={{ to: '/projects', label: 'See our projects' }}
      />
    </main>
  )
}
