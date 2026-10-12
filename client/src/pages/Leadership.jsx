import { Link } from 'react-router-dom'
import { ArrowUpRight, Quote } from 'lucide-react'
import { useContent, useRegistration } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import {
  CtaSlab, Eyebrow, PageHero, Reveal, SectionLead, StatStrip, TeamCard, TextLink
} from '../components/Blocks'

export default function Leadership() {
  const site = useContent()
  const registration = useRegistration()
  const intro = site.leadershipIntro || {}
  const base = site.meta?.siteUrl || ''

  return (
    <main>
      <Seo
        title="Leadership"
        description={intro.intro}
        image={site.leadership?.[0]?.image}
        jsonLd={breadcrumbSchema(base, [{ label: 'Leadership', to: '/leadership' }])}
      />

      <PageHero
        eyebrow={intro.eyebrow}
        title={intro.title}
        intro={intro.intro}
        trail={[{ label: 'Leadership', to: '/leadership' }]}
        stats={[
          { value: '4', label: 'directors, all project-accountable' },
          { value: '70 yrs', label: 'combined construction experience' },
          { value: '52', label: 'site visits by directors each year' },
          { value: '0', label: 'delegated accountability' }
        ]}
      />

      <section className="shell section">
        <SectionLead
          eyebrow="The leadership team"
          title={<>Small on purpose.<br />Present by <em>habit.</em></>}
          copy="Every director at Ananta carries project responsibility. That means weekly site visits, direct availability to clients and decisions that do not have to travel through four layers of management."
        />
        <div className="team-grid">
          {(site.leadership || []).map((person, index) => (
            <Reveal key={person.id} delay={index * 0.06}><TeamCard person={person} /></Reveal>
          ))}
        </div>
      </section>

      <section className="section-dark section-tight">
        <div className="shell">
          <div className="media-split">
            <Reveal>
              <Quote size={34} style={{ color: 'var(--acid)', marginBottom: '0.7rem' }} />
              <blockquote style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.3rem, 2.4vw, 2rem)', lineHeight: 1.35, margin: 0, letterSpacing: '-0.03em' }}>
                “We deliberately stayed a mid-sized company. It means the person who priced your project is the person who delivers it,
                and a director is on your site this week — not on a chart.”
              </blockquote>
              <footer style={{ marginTop: '1.4rem', font: '500 10.6px var(--mono)', letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--muted-inverse)' }}>
                {site.leadership?.[0]?.name} · {site.leadership?.[0]?.role}
              </footer>
            </Reveal>
            <Reveal delay={0.1}>
              <img src={intro.image || site.leadership?.[0]?.image} alt="Ananta leadership on site" loading="lazy" style={{ aspectRatio: '4 / 3' }} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="shell section">
        <SectionLead
          number="01 — 03"
          eyebrow="How we are organised"
          title={<>Six functions,<br />one delivery <em>chain.</em></>}
          copy="Everyone at Ananta either builds the work, plans it, prices it, checks it or supports the people who do. There is no layer whose purpose is unclear."
          action={<TextLink to="/careers">See where you would fit</TextLink>}
        />
        <div className="dept-list">
          {(site.departments || []).map((department) => (
            <div key={department.name}>
              <span>{department.count}</span>
              <b>{department.name}</b>
              <p>{department.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="shell section-tight" style={{ paddingTop: 0 }}>
        <StatStrip stats={site.teamStats} withDetail />
      </div>

      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <SectionLead
            number="02 — 03"
            eyebrow="Governance"
            title={<>Accountable,<br />and <em>auditable.</em></>}
            copy="Our governance framework is deliberately simple, so that responsibility is always traceable to a named person."
          />
          <div className="grid-3">
            {[
              { title: 'Board review', text: 'Monthly review of delivery performance, safety statistics, financial position and open risk across the portfolio.' },
              { title: 'Project governance', text: 'Weekly project reviews chaired by the operations director, with the client report issued the same day.' },
              { title: 'Audit committee', text: 'Independent review of financial controls, compliance and whistleblower reports, meeting quarterly.' },
              { title: 'Safety committee', text: 'Site-level safety committees with worker representation and a standing agenda item for every near-miss.' },
              { title: 'Quality assurance', text: 'Internal audit cycle covering inspection records, testing regimes and handover documentation.' },
              { title: 'Risk management', text: 'A live risk register on every project, quantified against cost and programme and reviewed monthly.' }
            ].map((item, index) => (
              <Reveal className="card" key={item.title} delay={index * 0.05}>
                <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
                <h4>{item.title}</h4>
                <p style={{ fontSize: 13.4, color: 'var(--ink-2)' }}>{item.text}</p>
              </Reveal>
            ))}
          </div>
          <div className="inline-cta" style={{ marginTop: 'clamp(1.4rem, 3vw, 2.4rem)' }}>
            <div>
              <h3>Want to speak to a director directly?</h3>
              <p>Bring us a brief, a site or a problem. You will be talking to someone who can actually commit the company.</p>
            </div>
            <Link className="button" to="/contact">Request a conversation <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>

      <CtaSlab
        eyebrow="03 — 03"
        title={<>Build your career with the<br />people who <em>build.</em></>}
        text="Engineers, planners, quantity surveyors, safety officers and site leaders — we are hiring across all our project regions."
        image={site.teamIntro?.image}
        primary={{ to: '/careers', label: 'See open roles' }}
        secondary={{ to: '/register', label: `Register as a worker${registration.suffix}` }}
      />
    </main>
  )
}
