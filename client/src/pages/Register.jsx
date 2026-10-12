import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import {
  ArrowUpRight, BadgeCheck, Bell, Building2, CalendarClock, Check, HardHat, Info,
  ShieldCheck, Wallet, Wrench
} from 'lucide-react'
import { useContent } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import {
  Accordion, CtaSlab, Eyebrow, PageHero, Reveal, SectionLead, StatStrip, Tag, TextLink
} from '../components/Blocks'
import { RegisterForm } from '../components/Forms'

export default function Register() {
  const site = useContent()
  const config = site.register || {}
  const base = site.meta?.siteUrl || ''
  const [params, setParams] = useSearchParams()
  const location = useLocation()

  const initialTrack = params.get('track') === 'worker' ? 'worker' : 'contractor'
  const [track, setTrack] = useState(initialTrack)

  useEffect(() => {
    const next = params.get('track') === 'worker' ? 'worker' : params.get('track') === 'contractor' ? 'contractor' : null
    if (next && next !== track) setTrack(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  useEffect(() => {
    if (location.hash === '#form') {
      setTimeout(() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
    }
  }, [location.hash])

  const selectTrack = (next) => {
    setTrack(next)
    setParams({ track: next }, { replace: true })
    setTimeout(() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }

  const isContractor = track === 'contractor'
  const active = isContractor ? config.contractor : config.worker

  const faqs = [
    { question: 'When exactly does registration open?', answer: `${config.launch?.date || 'Registration opens in phases'}. Contractor and supplier registration opens first, followed by worker registration. Registering your interest now means you are contacted before the public launch — nothing is lost in the meantime.` },
    { question: 'Does it cost anything to register?', answer: 'No. Registration, prequalification and tender participation are all free, and we never work through agents who charge candidates or contractors a fee. If anyone asks you for money to register or to be placed on an Ananta project, report it to integrity@anantainfratech.com.' },
    { question: 'What happens to the details I submit today?', answer: 'Your details go directly into our procurement and HR systems with a reference number, and you receive an acknowledgement. As registration opens you are contacted directly by the team responsible — by phone and SMS for workers, by email for contractors and suppliers.' },
    { question: 'What documents will I need when registration opens?', answer: 'For contractors and suppliers: PAN, GST registration, applicable trade licences, BOCW/PF/ESIC registration if you employ labour, workmen compensation insurance, audited financials for three years and three comparable project references. Workers do not need documents to register — we verify trade experience and certification with you directly.' },
    { question: 'Do I need a contact inside Ananta to be considered?', answer: 'No. Registration is the only entry point, evaluation criteria are published on our tenders page, and every prequalified partner receives the same documents and the same written clarifications.' },
    { question: 'I am a worker without formal certification. Can I still register?', answer: 'Yes. Many of our best tradespeople learned on site rather than in a classroom. We verify experience with you, and where certification is missing we offer free training and certification through our skill centre — with a stipend during training.' }
  ]

  return (
    <main>
      <Seo
        title="Contractor & worker registration"
        description={`${config.intro} Applications are launching soon — register your interest as a contractor, supplier or skilled worker and be contacted first when registration opens.`}
        image={config.image}
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            breadcrumbSchema(base, [{ label: 'Contractor & worker registration', to: '/register' }]),
            {
              '@type': 'FAQPage',
              mainEntity: faqs.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: { '@type': 'Answer', text: item.answer }
              }))
            }
          ]
        }}
      />

      <PageHero
        eyebrow={config.eyebrow}
        title={config.title}
        intro={config.intro}
        image={config.image}
        trail={[{ label: 'Careers', to: '/careers' }, { label: 'Contractor & worker registration', to: '/register' }]}
        actions={<>
          <button className="button button-acid" onClick={() => selectTrack('contractor')}>Register as a contractor <ArrowUpRight size={16} /></button>
          <button className="button button-light" onClick={() => selectTrack('worker')}>Register as a worker</button>
        </>}
        note={(
          <div className="register-hero-note" style={{ background: 'rgba(213,223,86,0.18)' }}>
            <Bell size={18} />
            <div>
              <b>{config.launch?.status}</b>
              <p>{config.launch?.headline} {config.launch?.date}.</p>
            </div>
          </div>
        )}
        stats={[
          { value: '2', label: 'separate registration tracks' },
          { value: '0', label: 'fees, agents or intermediaries' },
          { value: '10 days', label: 'contractor prequalification review' },
          { value: '640', label: 'workers trained and certified so far' }
        ]}
      />

      {/* Trust points */}
      <section className="section-tight" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="shell">
          <div className="grid-4">
            {(config.trustPoints || []).map((point, index) => (
              <Reveal key={point.label} delay={index * 0.05}>
                <Eyebrow>{String(index + 1).padStart(2, '0')} {point.label}</Eyebrow>
                <p style={{ fontSize: 13.4, color: 'var(--ink-2)', marginTop: '0.7rem' }}>{point.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Launch banner */}
      <section className="shell section">
        <div className="launch-banner">
          <div>
            <Tag tone="tag-acid">{config.launch?.status}</Tag>
            <h2 style={{ marginTop: '1rem' }}>{config.launch?.headline}</h2>
            <p>{config.launch?.note}</p>
            <div className="button-row" style={{ marginTop: '1.3rem' }}>
              <a className="button button-acid" href="#form">Register your interest now <ArrowUpRight size={16} /></a>
              <Link className="button button-light" to="/tenders">See procurement process</Link>
            </div>
          </div>
          <div>
            <div className="launch-countdown">
              {[
                { label: 'Contractor track', value: 'Q1 2027' },
                { label: 'Supplier track', value: 'Q1 2027' },
                { label: 'Worker track', value: 'Q2 2027' },
                { label: 'Documents', value: 'PDF upload' }
              ].map((item) => (
                <div key={item.label}>
                  <b>{item.value}</b>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="notice" style={{ marginTop: '1rem', background: 'var(--ink-2)', borderColor: 'var(--line-inverse)', color: 'var(--muted-inverse)' }}>
              <CalendarClock size={16} />
              <span style={{ fontSize: 12.6 }}>
                Registering interest now does not commit you to anything, and nothing is charged at any stage.
              </span>
            </div>
          </div>
        </div>

        {/* Two tracks */}
        <SectionLead
          number="01 — 03"
          eyebrow="Two separate registrations"
          title={<>Contractors and workers are<br />registered, reviewed and contacted <em>separately.</em></>}
          copy="The two processes are genuinely different. Contractors go through a formal prequalification review against published criteria. Workers are verified on trade and experience, and supported into certification where it is missing. Choose the correct track below."
        />

        <div className="register-switch">
          <button
            className={`register-track ${isContractor ? 'is-active' : ''}`}
            onClick={() => selectTrack('contractor')}
            aria-pressed={isContractor}
          >
            <span>Track one · Contractors &amp; suppliers</span>
            <h2><Building2 size={20} style={{ verticalAlign: '-3px', marginRight: 8 }} />{config.contractor?.title}</h2>
            <p>{config.contractor?.text}</p>
            <ul>
              {(config.contractor?.requirements || []).slice(0, 4).map((item) => <li key={item}><Check size={13} />{item}</li>)}
            </ul>
            <span className="register-track-cta">
              {isContractor ? 'Selected — complete the form below' : 'Select this track'} <ArrowUpRight size={15} />
            </span>
          </button>

          <button
            className={`register-track ${!isContractor ? 'is-active' : ''}`}
            onClick={() => selectTrack('worker')}
            aria-pressed={!isContractor}
          >
            <span>Track two · Workers &amp; technicians</span>
            <h2><HardHat size={20} style={{ verticalAlign: '-3px', marginRight: 8 }} />{config.worker?.title}</h2>
            <p>{config.worker?.text}</p>
            <ul>
              {(config.worker?.trades || []).map((group) => (
                <li key={group.group}><Wrench size={13} />{group.group}: {group.items.slice(0, 3).join(', ')}{group.items.length > 3 ? '…' : ''}</li>
              ))}
            </ul>
            <span className="register-track-cta">
              {!isContractor ? 'Selected — complete the form below' : 'Select this track'} <ArrowUpRight size={15} />
            </span>
          </button>
        </div>

        {/* Steps for the active track */}
        <div className="register-steps">
          {(active?.steps || []).map((step, index) => (
            <div key={step.title}>
              <span>Step {String(index + 1).padStart(2, '0')}</span>
              <b>{step.title}</b>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Registration form */}
      <section id="form" className="section-tight" style={{ background: 'var(--sand-2)', scrollMarginTop: 'calc(var(--header-h) + 1rem)' }}>
        <div className="shell">
          <div className="with-sidebar">
            <div className="form-panel">
              <div className="form-panel-head">
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                  <Tag tone="tag-acid">{config.launch?.status}</Tag>
                  <Tag tone={isContractor ? 'tag-info' : 'tag-warning'}>{isContractor ? 'Contractor / supplier track' : 'Worker / technician track'}</Tag>
                </div>
                <h2>{active?.title}</h2>
                <p>
                  {active?.text} Complete this form to be added to the interest list and contacted directly when
                  registration opens. {active?.processNote}
                </p>
              </div>

              <RegisterForm key={track} type={track} config={isContractor ? config.contractor : config.worker} sources={['referral']} />
            </div>

            <aside>
              <div className="sidebar-card">
                <h3>Choose the right track</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                  Registering in the wrong track delays your review. As a quick rule: if you contract work to others
                  or supply materials, you are a contractor. If you personally perform a trade on site, you are a worker.
                </p>
                <button className="button button-sm button-ghost" onClick={() => selectTrack(isContractor ? 'worker' : 'contractor')}>
                  Switch to {isContractor ? 'worker' : 'contractor'} track <ArrowUpRight size={14} />
                </button>
              </div>

              <div className="sidebar-card" style={{ marginTop: '1.2rem' }}>
                <h3>What we ask in return</h3>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 0 }}>{config.employerNote?.text}</p>
                <hr className="divider" />
                <div style={{ display: 'grid', gap: '0.5rem', fontSize: 12.8 }}>
                  <span><ShieldCheck size={13} style={{ verticalAlign: '-2px', marginRight: 7, color: 'var(--acid-deep)' }} />Work to our safety standards</span>
                  <span><BadgeCheck size={13} style={{ verticalAlign: '-2px', marginRight: 7, color: 'var(--acid-deep)' }} />Give us accurate information</span>
                  <span><Wallet size={13} style={{ verticalAlign: '-2px', marginRight: 7, color: 'var(--acid-deep)' }} />Never pay anyone a fee</span>
                </div>
              </div>

              <div className="sidebar-card" style={{ marginTop: '1.2rem' }}>
                <h3>Already registered?</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                  Use the reference from your acknowledgement to check the status of your registration.
                </p>
                <Link className="button button-sm" to="/track">Track my registration <ArrowUpRight size={14} /></Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Worker benefits */}
      <section className="shell section">
        <SectionLead
          number="02 — 03"
          eyebrow="For workers"
          title={<>What registering<br />actually <em>gets you.</em></>}
          copy="Registration is not just a database entry. Every worker who registers and verifies gets access to the support below at no cost."
        />
        <div className="grid-3">
          {(config.worker?.benefits || []).map((benefit, index) => (
            <Reveal className="card" key={benefit.title} delay={index * 0.05}>
              <span className="card-index">{String(index + 1).padStart(2, '0')}</span>
              <h4>{benefit.title}</h4>
              <p style={{ fontSize: 13.6, color: 'var(--ink-2)' }}>{benefit.text}</p>
            </Reveal>
          ))}
        </div>

        <div className="notice" style={{ marginTop: 'clamp(1.4rem, 3vw, 2.2rem)' }}>
          <Info size={18} />
          <div>
            <b>Beware of anyone charging a fee.</b>
            <p style={{ margin: '0.3rem 0 0', fontSize: 13 }}>
              Ananta does not work through agents who charge workers or contractors for registration, verification or placement.
              If somebody asks you for money in our name, tell us immediately at{' '}
              <a href="mailto:integrity@anantainfratech.com" style={{ textDecoration: 'underline' }}>integrity@anantainfratech.com</a>.
            </p>
          </div>
        </div>
      </section>

      <div className="shell section-tight" style={{ paddingTop: 0 }}>
        <StatStrip
          stats={[
            { value: '480+', label: 'people currently in the Ananta team', detail: 'Across engineering, planning, commercial, safety and site delivery.' },
            { value: '640', label: 'workers trained in our skill centre', detail: 'Free certification for masons, bar benders, shuttering carpenters and electricians.' },
            { value: '71%', label: 'of trainees placed into paid work', detail: 'With Ananta projects or with our prequalified trade partners.' },
            { value: '68', label: 'workers absorbed into permanent roles', detail: 'From our trained worker pool into a full-time Ananta position.' }
          ]}
          withDetail
        />
      </div>

      {/* FAQs */}
      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <SectionLead
            number="03 — 03"
            eyebrow="Registration questions"
            title={<>The things people ask<br />before they <em>register.</em></>}
            action={<TextLink to="/faq">All frequently asked questions</TextLink>}
          />
          <Accordion items={faqs} />
        </div>
      </section>

      <CtaSlab
        eyebrow="Still deciding?"
        title={<>Register your interest.<br />There is <em>nothing to lose.</em></>}
        text="Your details sit on an interest list with a reference number. You will be contacted first when registration opens, and you can ask us to remove your details at any time."
        image={config.image}
        primary={{ to: '/tenders', label: 'Read the procurement process' }}
        secondary={{ to: '/faq', label: 'Browse all FAQs' }}
      />
    </main>
  )
}
