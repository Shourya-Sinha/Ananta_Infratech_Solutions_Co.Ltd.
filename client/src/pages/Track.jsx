import { Link } from 'react-router-dom'
import { ArrowUpRight, Search } from 'lucide-react'
import { useContent, useRegistration } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import { CtaSlab, Eyebrow, PageHero, SectionLead, StatStrip } from '../components/Blocks'
import { TrackForm } from '../components/Forms'

export default function Track() {
  const site = useContent()
  const registration = useRegistration()
  const base = site.meta?.siteUrl || ''

  return (
    <main>
      <Seo
        title="Track an application"
        description="Check the status of an Ananta enquiry, job application, tender enquiry or contractor and worker registration using your reference number."
        jsonLd={breadcrumbSchema(base, [{ label: 'Track an application', to: '/track' }])}
        noIndex
      />

      <PageHero
        eyebrow="Application tracking"
        title="Where is my submission?"
        intro="Enter the reference number from your acknowledgement — or the email address you used — and we will show you exactly where your enquiry, application or registration currently sits."
        trail={[{ label: 'Track', to: '/track' }]}
      />

      <section className="shell track-panel">
        <div className="form-panel">
          <div className="form-panel-head">
            <Eyebrow><Search size={12} style={{ verticalAlign: '-1px', marginRight: 6 }} />Look up your reference</Eyebrow>
            <h2>Check the status of a submission</h2>
            <p>
              Reference numbers look like <b>ANC-261012-6DED</b> (contractor), <b>ANW-…</b> (worker),
              <b> ANH-…</b> (job application), <b>ANQ-…</b> (project enquiry), <b>ANT-…</b> (tender) or <b>AND-…</b> (documents).
              They were shown on screen and included in your acknowledgement.
            </p>
          </div>
          <TrackForm />
        </div>

        <div className="grid-3">
          {[
            { status: 'new', tone: 'tag-acid', text: 'Received and logged. Nobody forgets about it — it sits in the relevant team’s queue with your reference.' },
            { status: 'reviewing', tone: 'tag-info', text: 'A named person is looking at it: reading your application, checking your registration documents or reviewing the tender enquiry.' },
            { status: 'shortlisted / contacted', tone: 'tag-success', text: 'You will be hearing from us directly. For recruitments this means an interview request; for contractors, a prequalification or tender invitation.' }
          ].map((item) => (
            <div className="card" key={item.status}>
              <span className={`tag ${item.tone}`}>{item.status}</span>
              <p style={{ fontSize: 13.4, color: 'var(--ink-2)', marginTop: '0.6rem' }}>{item.text}</p>
            </div>
          ))}
        </div>

        <div className="notice notice-acid">
          <span>
            <b>Cannot find your reference?</b> Write to the team handling your submission — recruitment, procurement or new business —
            and quote your name and the date you submitted. We will find it and reply the same day.
          </span>
        </div>

        <StatStrip
          stats={[
            { value: '24 hrs', label: 'acknowledgement time', detail: 'Every submission receives an acknowledgement with a reference number.' },
            { value: '5 days', label: 'job application review', detail: 'Our recruitment team reviews and responds to every application.' },
            { value: '10 days', label: 'prequalification review', detail: 'Contractor and supplier registrations are assessed against published criteria.' }
          ]}
          withDetail
        />
      </section>

      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <SectionLead
            eyebrow="Related"
            title="Where to go next."
          />
          <div className="grid-3">
            {[
              { title: 'Open roles', text: 'Current staff and engineering vacancies across all our project regions.', to: '/careers#open-roles' },
              { title: 'Contractor & worker registration', text: registration.open
                ? 'Register your interest as a contractor, supplier, technician or skilled worker.'
                : 'Coming soon — see what is being built for contractors, suppliers, technicians and skilled workers.', to: '/register' },
              { title: 'Contact the right team', text: 'Direct lines for recruitment, procurement, vendor onboarding and new business.', to: '/contact' }
            ].map((item) => (
              <div className="card card-flat" key={item.title}>
                <h4><Link to={item.to} style={{ textDecoration: 'underline', textDecorationColor: 'var(--line-strong)' }}>{item.title}</Link></h4>
                <p style={{ fontSize: 13.4, color: 'var(--ink-2)' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSlab
        eyebrow="Privacy"
        title={<>Your submission stays<br />your <em>business.</em></>}
        text="Status lookups are rate-limited and only return records matching the reference or email you provide. We never list submissions publicly."
        image={site.about?.storyImage}
        primary={{ to: '/policy/privacy', label: 'Read our privacy policy' }}
        secondary={{ to: '/contact', label: 'Contact the team' }}
      />
    </main>
  )
}
