import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Check, Clock, IndianRupee, MapPin } from 'lucide-react'
import { useContent } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import { CtaSlab, Eyebrow, FactGrid, PageHero, Reveal, SectionLead, Tag } from '../components/Blocks'
import { CareerForm } from '../components/Forms'

export default function JobDetail() {
  const site = useContent()
  const { id } = useParams()
  const jobs = site.jobs || []
  const job = jobs.find((item) => item.id === id)
  const base = site.meta?.siteUrl || ''

  if (!job) {
    return (
      <main className="not-found">
        <h1>That role<br /><em>has closed.</em></h1>
        <p>It may have been filled. All current vacancies are listed on the careers page.</p>
        <div className="not-found-actions">
          <Link className="button button-acid" to="/careers#open-roles">All open roles <ArrowUpRight size={16} /></Link>
        </div>
      </main>
    )
  }

  const others = jobs.filter((item) => item.id !== id).slice(0, 3)

  return (
    <main>
      <Seo
        title={job.title}
        description={job.summary}
        image={site.careers?.image}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'JobPosting',
          title: job.title,
          description: `${job.summary}\n\nResponsibilities:\n${job.responsibilities.join('\n')}\n\nRequirements:\n${job.requirements.join('\n')}`,
          datePosted: job.posted,
          employmentType: 'FULL_TIME',
          hiringOrganization: { '@type': 'Organization', name: site.company?.name, sameAs: base },
          jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: job.location, addressCountry: 'IN' } },
          experienceRequirements: job.experience,
          industry: 'Construction',
          occupationalCategory: job.department,
          jobBenefits: (site.careers?.benefits || []).map((benefit) => benefit.label).join(', ')
        }}
      />

      <PageHero
        eyebrow={job.department}
        title={job.title}
        intro={job.summary}
        trail={[{ label: 'Careers', to: '/careers' }, { label: job.title, to: `/careers/${job.id}` }]}
        meta={[job.location, job.type, job.experience, job.salary].filter(Boolean)}
        actions={<>
          <a className="button button-acid" href="#apply">Apply for this role <ArrowUpRight size={16} /></a>
          <Link className="button button-light" to="/careers#open-roles">All open roles</Link>
        </>}
      />

      <section className="shell" style={{ paddingTop: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
        <FactGrid
          facts={[
            { label: 'Department', value: job.department },
            { label: 'Location', value: job.location },
            { label: 'Experience', value: job.experience },
            { label: 'Compensation', value: job.salary },
            { label: 'Posted', value: job.posted },
            { label: 'Status', value: job.urgency }
          ]}
        />
      </section>

      <section className="shell job-detail-grid">
        <div>
          <div className="job-section">
            <SectionLead eyebrow="The role" title={job.summary} />
          </div>

          <div className="job-section">
            <Eyebrow>What you will do</Eyebrow>
            <h2>Responsibilities</h2>
            <ul>
              {job.responsibilities.map((item) => <li key={item}><Check size={14} />{item}</li>)}
            </ul>
          </div>

          <div className="job-section">
            <Eyebrow>What we need</Eyebrow>
            <h2>Requirements</h2>
            <ul>
              {job.requirements.map((item) => <li key={item}><Check size={14} />{item}</li>)}
            </ul>
          </div>

          {job.nice?.length ? (
            <div className="job-section">
              <Eyebrow>Additional</Eyebrow>
              <h2>Nice to have</h2>
              <ul>
                {job.nice.map((item) => <li key={item}><Check size={14} />{item}</li>)}
              </ul>
            </div>
          ) : null}

          <div className="job-section">
            <Eyebrow>What we offer</Eyebrow>
            <h2>Benefits and working conditions</h2>
            <div className="benefit-grid">
              {(site.careers?.benefits || []).slice(0, 6).map((benefit) => (
                <div key={benefit.label}>
                  <span>Benefit</span>
                  <b>{benefit.label}</b>
                  <small style={{ color: 'var(--muted)', fontSize: 12.4 }}>{benefit.detail}</small>
                </div>
              ))}
            </div>
          </div>

          <div id="apply" className="form-panel" style={{ scrollMarginTop: 'calc(var(--header-h) + 1rem)', marginTop: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            <div className="form-panel-head">
              <Eyebrow>Application</Eyebrow>
              <h2>Apply for {job.title}</h2>
              <p>Complete the form below. Our recruitment team reviews every application within five working days and responds either way.</p>
            </div>
            <CareerForm role={job.title} jobId={job.id} department={job.department} compact />
          </div>
        </div>

        <aside>
          <div className="sidebar-card">
            <h3>Role summary</h3>
            <ul style={{ display: 'grid', gap: '0.6rem', fontSize: 13.2, listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}><MapPin size={14} style={{ marginTop: 3, color: 'var(--acid-deep)' }} />{job.location}</li>
              <li style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}><Clock size={14} style={{ marginTop: 3, color: 'var(--acid-deep)' }} />{job.type} · {job.experience}</li>
              <li style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}><IndianRupee size={14} style={{ marginTop: 3, color: 'var(--acid-deep)' }} />{job.salary}</li>
            </ul>
            <hr className="divider" />
            <p style={{ fontSize: 12.8, color: 'var(--muted)', margin: 0 }}>
              Posted {job.posted}. Reference this role as <b>{job.id}</b> if you contact us directly.
            </p>
            <a className="button button-sm" href="#apply">Apply now <ArrowUpRight size={14} /></a>
          </div>

          {others.length ? (
            <div className="sidebar-card" style={{ marginTop: '1.2rem' }}>
              <h3>Other open roles</h3>
              <nav className="sidebar-nav">
                {others.map((item) => <Link key={item.id} to={`/careers/${item.id}`}>{item.title}</Link>)}
              </nav>
              <Link className="text-button" to="/careers#open-roles">All {jobs.length} vacancies</Link>
            </div>
          ) : null}

          <div className="sidebar-card" style={{ marginTop: '1.2rem' }}>
            <h3>Not a staff role?</h3>
            <p style={{ fontSize: 12.8, color: 'var(--muted)', margin: 0 }}>
              Skilled workers, contractors and suppliers should use our registration route instead.
            </p>
            <Link className="button button-sm button-ghost" to="/register">Registration <ArrowUpRight size={14} /></Link>
          </div>
        </aside>
      </section>

      <section className="shell section-tight">
        <SectionLead eyebrow="Similar roles" title="You may also be suited to these." />
        <div className="roles-list">
          {others.map((item) => (
            <Reveal className="role-row" key={item.id}>
              <div>
                <b>{item.title}</b>
                <small>{item.location} · {item.experience}</small>
                <div className="role-tags"><Tag>{item.department}</Tag></div>
              </div>
              <Link className="button button-sm button-ghost" to={`/careers/${item.id}`}>View role <ArrowUpRight size={14} /></Link>
            </Reveal>
          ))}
        </div>
        <div style={{ marginTop: '2rem' }}>
          <Link className="back-link" to="/careers#open-roles"><ArrowLeft size={16} /> All open roles</Link>
        </div>
      </section>

      <CtaSlab
        eyebrow="Speculative applications welcome"
        title={<>Nothing here fits?<br />Tell us what <em>does.</em></>}
        text="We keep speculative applications on file and revisit them when a matching role opens. Send us what you are good at."
        image={site.careers?.image}
        primary={{ to: '/careers#application', label: 'Send a speculative application' }}
        secondary={{ to: '/register', label: 'Worker registration' }}
      />
    </main>
  )
}
