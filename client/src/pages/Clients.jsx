import { Link } from 'react-router-dom'
import { ArrowUpRight, Check } from 'lucide-react'
import { useContent } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import {
  CtaSlab, Eyebrow, InsightCard, PageHero, Reveal, SectionLead, StatStrip, TestimonialCard, TextLink
} from '../components/Blocks'

export default function Clients() {
  const site = useContent()
  const clients = site.clients || []
  const testimonials = site.testimonials || []
  const base = site.meta?.siteUrl || ''

  return (
    <main>
      <Seo
        title="Clients & testimonials"
        description="The owners, developers, institutions and industry clients who appoint Ananta — and what they say about the experience."
        image={testimonials[0] ? site.projects?.find((project) => project.title === testimonials[0].project)?.image : undefined}
        jsonLd={breadcrumbSchema(base, [{ label: 'Clients & testimonials', to: '/clients' }])}
      />

      <PageHero
        eyebrow="Client relationships"
        title="Ninety-seven per cent of our work comes from partners we have already delivered for."
        intro="We are not the cheapest contractor in the market and we do not try to be. Clients reappoint us because the reporting is honest, the programme holds and the finish quality survives occupation."
        image={site.projects?.[0]?.image}
        trail={[{ label: 'Clients & testimonials', to: '/clients' }]}
        stats={[
          { value: '97%', label: 'of work from repeat clients' },
          { value: `${clients.length}`, label: 'long-term client relationships' },
          { value: '4.6/5', label: 'average post-project client rating' },
          { value: '11', label: 'clients with 3+ projects together' }
        ]}
      />

      <section className="shell section">
        <SectionLead
          number="01 — 03"
          eyebrow="Who we work for"
          title={<>Owners, developers and<br />institutions who <em>appoint us again.</em></>}
          copy="Our client base is deliberately concentrated. We would rather do four projects for one client than one project for four, because the second project is always better than the first."
        />
        <div className="client-grid">
          {clients.map((client) => (
            <Reveal className="client-card" key={client.name}>
              <b>{client.name}</b>
              <span>{client.sector}</span>
              <small>Client since {client.since} · {client.projects} project{client.projects > 1 ? 's' : ''} together</small>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <SectionLead
            number="02 — 03"
            eyebrow="In their words"
            title={<>What partners say when<br />we are not in the <em>room.</em></>}
            copy="These are direct quotes from project reviews, handover meetings and reference calls — used with client permission."
          />
          <div className="testimonial-grid">
            {testimonials.map((testimonial) => <TestimonialCard key={testimonial.id} testimonial={testimonial} />)}
          </div>
        </div>
      </section>

      <section className="shell section">
        <div className="media-split">
          <Reveal>
            <Eyebrow>03 — 03 Why clients stay</Eyebrow>
            <h2 style={{ margin: '1rem 0 1.1rem' }}>The five reasons we hear most often.</h2>
            <ul className="check-list" style={{ marginTop: '1.2rem' }}>
              <li><Check size={14} />“Your weekly report is the only one I read without having to chase anything.”</li>
              <li><Check size={14} />“You told us about the problem while we could still do something about it.”</li>
              <li><Check size={14} />“The person who priced the job is the person who delivered it.”</li>
              <li><Check size={14} />“Handover was clean. We did not inherit a snag list.”</li>
              <li><Check size={14} />“Your site was the tidiest one on our campus.”</li>
            </ul>
            <div className="button-row" style={{ marginTop: '1.6rem' }}>
              <Link className="button" to="/contact">Ask for references <ArrowUpRight size={16} /></Link>
              <Link className="button button-ghost" to="/projects">See the work</Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <img src={site.about?.peopleImage} alt="Ananta client and site team meeting" loading="lazy" style={{ aspectRatio: '4 / 3' }} />
          </Reveal>
        </div>
      </section>

      <div className="shell section-tight" style={{ paddingTop: 0 }}>
        <StatStrip
          stats={[
            { value: '97%', label: 'work from repeat clients', detail: 'Measured over the last three financial years.' },
            { value: '4.6/5', label: 'average client rating', detail: 'Post-project review across the last twelve handovers.' },
            { value: '9 of 10', label: 'projects handed over on or before date', detail: 'Against the contracted completion date.' },
            { value: '100%', label: 'clients given a named director', detail: 'Available directly, without an account manager in between.' }
          ]}
          withDetail
        />
      </div>

      <section className="shell section-tight">
        <SectionLead
          eyebrow="Perspectives"
          title="How those relationships actually work."
          action={<TextLink to="/insights">All insights</TextLink>}
        />
        <div className="insights-grid">
          {(site.insights || []).slice(0, 3).map((insight, index) => (
            <Reveal key={insight.slug} delay={index * 0.06}><InsightCard insight={insight} /></Reveal>
          ))}
        </div>
      </section>

      <CtaSlab
        eyebrow="New partnership"
        title={<>Speak to a client of ours<br />before you speak to <em>us.</em></>}
        text="We will put you in touch with a client who delivered a project similar to yours — and tell you which ones not to call."
        image={site.about?.peopleImage}
        primary={{ to: '/contact', label: 'Request a reference' }}
        secondary={{ to: '/projects', label: 'See our projects' }}
      />
    </main>
  )
}
