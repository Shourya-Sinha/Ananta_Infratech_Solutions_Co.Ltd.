import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight, Briefcase, HardHat, MapPin, Search } from 'lucide-react'
import { useContent } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import {
  CtaSlab, EmptyState, Eyebrow, PageHero, Reveal, SectionLead, StatStrip, Stepper, Tag, TextLink
} from '../components/Blocks'
import { CareerForm } from '../components/Forms'

const APPLICATION_ANCHOR = 'application'

export default function Careers() {
  const site = useContent()
  const careers = site.careers || {}
  const register = site.register || {}
  const jobs = site.jobs || []
  const base = site.meta?.siteUrl || ''
  const location = useLocation()

  const [applyingFor, setApplyingFor] = useState({ title: '', id: '', department: '' })
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('All')

  const departments = useMemo(() => ['All', ...new Set(jobs.map((job) => job.department).filter(Boolean))], [jobs])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return jobs.filter((job) => {
      if (department !== 'All' && job.department !== department) return false
      if (!needle) return true
      return [job.title, job.department, job.location, job.summary, ...(job.requirements || [])]
        .some((field) => String(field || '').toLowerCase().includes(needle))
    })
  }, [jobs, query, department])

  useEffect(() => {
    if (location.hash === `#${APPLICATION_ANCHOR}`) {
      const target = document.getElementById(APPLICATION_ANCHOR)
      if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
    }
  }, [location.hash])

  const apply = (job = {}) => {
    setApplyingFor({ title: job.title || '', id: job.id || '', department: job.department || '' })
    setTimeout(() => document.getElementById(APPLICATION_ANCHOR)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40)
  }

  return (
    <main>
      <Seo
        title="Careers"
        description={careers.intro}
        image={careers.image}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Careers at Ananta Infratech Solutions',
          description: careers.intro,
          hasPart: jobs.map((job) => ({
            '@context': 'https://schema.org',
            '@type': 'JobPosting',
            title: job.title,
            description: job.summary,
            datePosted: job.posted,
            employmentType: 'FULL_TIME',
            hiringOrganization: { '@type': 'Organization', name: site.company?.name, sameAs: base },
            jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: job.location, addressCountry: 'IN' } },
            experienceRequirements: job.experience,
            industry: 'Construction',
            occupationalCategory: job.department
          }))
        }}
      />

      <PageHero
        eyebrow={careers.eyebrow}
        title={careers.title}
        intro={careers.intro}
        image={careers.image}
        trail={[{ label: 'Careers', to: '/careers' }]}
        stats={careers.heroStats}
        actions={<>
          <a className="button button-acid" href="#open-roles">See {jobs.length} open roles <ArrowUpRight size={16} /></a>
          <Link className="button button-light" to="/register">Worker &amp; contractor registration</Link>
        </>}
      />

      {/* Why join */}
      <section className="shell section">
        <SectionLead
          number="01 — 05"
          eyebrow="Why people stay"
          title={<>Real responsibility,<br />early and <em>permanently.</em></>}
          copy="Ananta is deliberately mid-sized. That means engineers run packages within a year rather than a decade, directors are on site weekly, and the person who solves a problem is usually the person who is standing next to it."
        />
        <div className="grid-3">
          {(careers.whyJoin || []).map((item, index) => (
            <Reveal className="card" key={item.title} delay={index * 0.05}>
              <span className="card-index">{String(index + 1).padStart(2, '0')}</span>
              <h4>{item.title}</h4>
              <p style={{ fontSize: 13.6, color: 'var(--ink-2)' }}>{item.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="careers-image">
        <img src={careers.image} alt="Ananta site team at work" loading="lazy" />
      </section>

      {/* Open roles */}
      <section id="open-roles" className="shell roles-section" style={{ scrollMarginTop: 'calc(var(--header-h) + 1rem)' }}>
        <div>
          <Eyebrow>02 — 05 Open roles</Eyebrow>
          <h2 style={{ margin: '1rem 0 0.9rem' }}>Bring your point<br />of <em>view.</em></h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 14 }}>
            {jobs.length} live vacancies across engineering, planning, commercial, safety and delivery.
            Do not see your role? Send a speculative application — we read all of them.
          </p>
          <div className="inline-cta" style={{ marginTop: '1.6rem', flexDirection: 'column', alignItems: 'flex-start' }}>
            <h4>Looking for site work, not a staff role?</h4>
            <p style={{ fontSize: 13 }}>
              Contractors, suppliers and skilled workers should use our dedicated registration route instead.
            </p>
            <Link className="button button-sm" to="/register">Contractor &amp; worker registration <ArrowUpRight size={14} /></Link>
          </div>
        </div>

        <div>
          <div className="filter-tools">
            <label className="search-field">
              <Search size={16} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search roles, locations or skills…"
                aria-label="Search open roles"
              />
            </label>
            <label className="select-field">
              <span className="sr-only">Filter by department</span>
              <select value={department} onChange={(event) => setDepartment(event.target.value)}>
                {departments.map((item) => <option key={item} value={item}>{item === 'All' ? 'All departments' : item}</option>)}
              </select>
            </label>
            <span className="result-count">{filtered.length} roles</span>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No roles match that search."
              text="Try a different department, or send a speculative application and we will keep your details on file."
              action={<button className="button button-sm" onClick={() => { setQuery(''); setDepartment('All') }}>Show all roles</button>}
            />
          ) : (
            <div className="roles-list">
              {filtered.map((job) => (
                <div className="role-row" key={job.id}>
                  <div>
                    <b>{job.title}</b>
                    <small><MapPin size={11} style={{ verticalAlign: '-1px' }} /> {job.location} · {job.type} · {job.experience}</small>
                    <div className="role-tags">
                      <Tag>{job.department}</Tag>
                      {job.salary ? <Tag>{job.salary}</Tag> : null}
                      {job.urgency === 'Urgent' ? <Tag tone="tag-clay">Urgent hire</Tag> : null}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Link className="button button-sm button-ghost" to={`/careers/${job.id}`}>Role detail</Link>
                    <button className="button button-sm" onClick={() => apply(job)}>Apply <ArrowUpRight size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Worker & contractor registration call-out */}
      <section className="section-dark section">
        <div className="shell">
          <SectionLead
            number="03 — 05"
            eyebrow={register.eyebrow}
            title={<>Site workers, technicians,<br />contractors and <em>suppliers.</em></>}
            copy={register.intro}
            action={<TextLink light to="/register">Open the registration page</TextLink>}
            dark
          />
          <div className="register-switch" style={{ marginBottom: 0 }}>
            <div className="register-track" style={{ background: 'var(--ink-2)', borderColor: 'var(--line-inverse)' }}>
              <span style={{ color: 'var(--acid)' }}>Track one</span>
              <h2 style={{ color: 'var(--white)' }}>Contractor / supplier</h2>
              <p style={{ color: 'var(--muted-inverse)' }}>{register.contractor?.text}</p>
              <div className="pill-list" style={{ marginTop: '0.4rem' }}>
                {(register.contractor?.types || []).slice(0, 4).map((item) => <span className="tag tag-inverse" key={item}>{item}</span>)}
              </div>
              <Link className="register-track-cta" to="/register" style={{ color: 'var(--acid)' }}>
                Register your company <ArrowUpRight size={15} />
              </Link>
            </div>
            <div className="register-track" style={{ background: 'var(--ink-2)', borderColor: 'var(--line-inverse)' }}>
              <span style={{ color: 'var(--acid)' }}>Track two</span>
              <h2 style={{ color: 'var(--white)' }}>Worker / technician</h2>
              <p style={{ color: 'var(--muted-inverse)' }}>{register.worker?.text}</p>
              <div className="pill-list" style={{ marginTop: '0.4rem' }}>
                <span className="tag tag-inverse"><HardHat size={12} /> Site execution</span>
                <span className="tag tag-inverse">Equipment operation</span>
                <span className="tag tag-inverse">Technical trades</span>
                <span className="tag tag-inverse">Supervision</span>
              </div>
              <Link className="register-track-cta" to="/register" style={{ color: 'var(--acid)' }}>
                Register your interest <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
          <div className="notice" style={{ marginTop: '1.4rem', background: 'var(--ink-2)', borderColor: 'var(--line-inverse)', color: 'var(--muted-inverse)' }}>
            <span><b style={{ color: 'var(--acid)' }}>{register.launch?.status}.</b> {register.launch?.note}</span>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <SectionLead
            number="04 — 05"
            eyebrow="What you get"
            title={<>Pay, protection and<br />things that <em>actually help.</em></>}
            copy="Benchmarked salaries, statutory benefits honoured on time, funded certification and a written career path — not vague promises about culture."
          />
          <div className="benefit-grid">
            {(careers.benefits || []).map((benefit) => (
              <div key={benefit.label}>
                <span>Benefit</span>
                <b>{benefit.label}</b>
                <small style={{ color: 'var(--muted)', fontSize: 12.4 }}>{benefit.detail}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring process + growth */}
      <section className="shell section">
        <SectionLead
          number="05 — 05"
          eyebrow="Hiring process"
          title={<>Five steps, and you<br />always get an <em>answer.</em></>}
          copy={careers.contact?.note}
        />
        <Stepper steps={careers.hiringProcess} />

        <div style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
          <SectionLead
            eyebrow="Growth programmes"
            title={<>Structured ways to<br />get <em>better</em> here.</>}
          />
          <div className="grid-2">
            {(careers.growthProgrammes || []).map((programme, index) => (
              <Reveal className="card card-flat" key={programme.title} delay={index * 0.05}>
                <div className="insight-meta"><span>{programme.duration}</span></div>
                <h4>{programme.title}</h4>
                <p style={{ fontSize: 13.6, color: 'var(--ink-2)' }}>{programme.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="shell section-tight" style={{ paddingTop: 0 }}>
        <StatStrip stats={site.teamStats} withDetail />
      </div>

      {/* Application form */}
      <section id={APPLICATION_ANCHOR} className="section-tight" style={{ background: 'var(--sand-2)', scrollMarginTop: 'calc(var(--header-h) + 1rem)' }}>
        <div className="shell">
          <div className="with-sidebar">
            <div className="form-panel">
              <div className="form-panel-head">
                <Eyebrow>Application</Eyebrow>
                <h2>{applyingFor.title ? `Apply for ${applyingFor.title}` : 'Introduce yourself.'}</h2>
                <p>
                  {applyingFor.title
                    ? `You are applying for the ${applyingFor.title} role in ${applyingFor.department}. Complete the form and our recruitment team will review it within five working days.`
                    : 'Complete the form below. We read every application and respond to all of them — including when the answer is no.'}
                </p>
              </div>
              <CareerForm
                role={applyingFor.title}
                jobId={applyingFor.id}
                department={applyingFor.department}
                roles={jobs}
              />
            </div>
            <aside>
              <div className="sidebar-card">
                <h3>Talent team</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                  {careers.contact?.name}<br />
                  <b style={{ color: 'var(--ink)' }}>{careers.contact?.email}</b><br />
                  {careers.contact?.phone}
                </p>
                <hr className="divider" />
                <p style={{ fontSize: 12.6, color: 'var(--muted)', margin: 0 }}>
                  Not a staff role? Use the <Link to="/register" style={{ textDecoration: 'underline' }}>contractor &amp; worker registration</Link> page instead.
                </p>
              </div>
              <div className="sidebar-card" style={{ marginTop: '1.2rem' }}>
                <h3>Application tips</h3>
                <ul className="check-list">
                  <li>Name the projects and package values you have personally run.</li>
                  <li>Tell us what went wrong and what you did about it.</li>
                  <li>Share a CV link that does not require access approval.</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CtaSlab
        eyebrow="Questions first?"
        title={<>Talk to us before you<br /><em>apply.</em></>}
        text="If you want to understand the role, the site or the team before submitting anything, write to our talent team and ask."
        image={careers.image}
        primary={{ to: '/contact', label: 'Ask a question' }}
        secondary={{ to: '/register', label: 'Contractor & worker registration' }}
      />
    </main>
  )
}
