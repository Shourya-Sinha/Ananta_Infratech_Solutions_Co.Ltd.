import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, ShieldCheck } from 'lucide-react'
import { useContent, useRegistration } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import { CtaSlab, Eyebrow, PageHero, ProgressBar, Reveal, SectionLead, Stepper, Tag, TextLink } from '../components/Blocks'
import { TenderForm } from '../components/Forms'

export default function Tenders() {
  const site = useContent()
  const registration = useRegistration()
  const tenders = site.tenders || {}
  const base = site.meta?.siteUrl || ''
  const company = site.company || {}
  const [tab, setTab] = useState('criteria')

  return (
    <main>
      <Seo
        title="Tenders & e-procurement"
        description={tenders.intro}
        image={tenders.image}
        jsonLd={breadcrumbSchema(base, [{ label: 'Tenders & e-procurement', to: '/tenders' }])}
      />

      <PageHero
        eyebrow={tenders.eyebrow}
        title={tenders.title}
        intro={tenders.intro}
        image={tenders.image}
        trail={[{ label: 'Tenders & e-procurement', to: '/tenders' }]}
        stats={[
          { value: '10 days', label: 'prequalification review time' },
          { value: '94%', label: 'packages to prequalified partners' },
          { value: '30 days', label: 'payment on certified bills' },
          { value: '0', label: 'fees to register or bid' }
        ]}
        actions={<>
          <Link className="button button-acid" to="/register">Register your company{registration.suffix} <ArrowUpRight size={16} /></Link>
          <a className="button button-light" href={`mailto:${company.tendersEmail}`}>Email the procurement team</a>
        </>}
      />

      <section className="shell section">
        <SectionLead
          number="01 — 04"
          eyebrow="How it works"
          title={<>Five steps, and none of<br />them require a <em>relationship.</em></>}
          copy="Registration is the only entry point. Evaluation criteria are published, all bidders receive the same documents and the same written clarifications, and every applicant gets a written response."
        />
        <Stepper steps={tenders.process} />

        <div className="notice notice-acid" style={{ marginTop: 'clamp(1.4rem, 3vw, 2.2rem)' }}>
          <ShieldCheck size={18} />
          <div>
            <b>We never charge for registration, prequalification or tender participation.</b>
            <p style={{ margin: '0.3rem 0 0', fontSize: 13 }}>
              If anyone asks you for a fee, deposit or inducement to be considered for Ananta work, report it immediately to{' '}
              <a href="mailto:integrity@anantainfratech.com" style={{ textDecoration: 'underline' }}>integrity@anantainfratech.com</a>. Reports are confidential and protected.
            </p>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <SectionLead
            number="02 — 04"
            eyebrow="Open packages"
            title={<>What we are buying<br />and <em>when.</em></>}
            copy="The categories below are open for registration continuously. Specialist packages are invited from the prequalified pool as projects mobilise."
          />
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Type</th>
                  <th>Typical value</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {(tenders.packages || []).map((item) => (
                  <tr key={item.name}>
                    <td><b>{item.name}</b></td>
                    <td>{item.type}</td>
                    <td>{item.scale}</td>
                    <td><Tag tone={item.status === 'Always open' ? 'tag-success' : 'tag-info'}>{item.status}</Tag></td>
                    <td><Link className="text-button" to="/register">{registration.open ? 'Register' : registration.label} <ArrowUpRight size={13} /></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="field-hint" style={{ marginTop: '0.9rem' }}>{tenders.note}</p>
        </div>
      </section>

      <section className="shell section">
        <SectionLead
          number="03 — 04"
          eyebrow="Evaluation"
          title={<>How bids are<br /><em>actually scored.</em></>}
          copy="Price matters, but it is not the only thing that decides whether a partner is worth appointing. These are the published weightings."
        />
        <div className="editor-tabs" style={{ marginBottom: '1.6rem' }}>
          <button className={tab === 'criteria' ? 'active' : ''} onClick={() => setTab('criteria')}>Evaluation criteria</button>
          <button className={tab === 'requirements' ? 'active' : ''} onClick={() => setTab('requirements')}>Prequalification requirements</button>
        </div>

        {tab === 'criteria' ? (
          <div className="grid-2">
            <div>
              {(tenders.criteria || []).map((item) => (
                <div key={item.label} style={{ marginBottom: '1.3rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem' }}>
                    <b style={{ fontSize: 14.4 }}>{item.label}</b>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>{item.weight}</span>
                  </div>
                  <ProgressBar value={parseInt(item.weight, 10) * 2.5} />
                </div>
              ))}
            </div>
            <div className="card">
              <Eyebrow>Fair process commitments</Eyebrow>
              <ul className="check-list" style={{ marginTop: '0.8rem' }}>
                <li><Check size={14} />Every prequalified bidder receives identical documents.</li>
                <li><Check size={14} />All clarifications are issued in writing to every bidder.</li>
                <li><Check size={14} />No fee, deposit or inducement is ever required.</li>
                <li><Check size={14} />Unsuccessful bidders receive a written outcome.</li>
                <li><Check size={14} />Certified bills are processed within 30 days of measurement sign-off.</li>
                <li><Check size={14} />Conflicts of interest must be declared and are managed.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="grid-2">
            <ul className="requirement-list">
              {(tenders.requirements || []).map((item) => <li key={item}><Check size={14} />{item}</li>)}
            </ul>
            <div className="card">
              <Eyebrow>Documents to have ready</Eyebrow>
              <p style={{ fontSize: 13.4, color: 'var(--ink-2)', marginTop: '0.7rem' }}>
                You do not need to upload anything to register interest today. When registration opens, the portal will accept
                these as PDF uploads. Until then, our procurement team will request them by email.
              </p>
              <div className="pill-list" style={{ marginTop: '0.9rem' }}>
                {['PAN', 'GST certificate', 'Trade licence', 'BOCW registration', 'PF & ESIC', 'Workmen compensation policy', 'Audited financials', 'Project references', 'Plant & manpower schedule'].map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
              <Link className="button button-sm" style={{ marginTop: '1.1rem' }} to="/downloads">Request the prequalification pack</Link>
            </div>
          </div>
        )}
      </section>

      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <div className="with-sidebar">
            <div className="form-panel">
              <div className="form-panel-head">
                <Eyebrow>04 — 04 Tender enquiries</Eyebrow>
                <h2>Ask us anything about a package.</h2>
                <p>
                  RFP clarifications, prequalification queries, bid submission questions or general procurement enquiries.
                  Every enquiry receives a written response from the procurement team.
                </p>
              </div>
              <TenderForm packages={tenders.packages} />
            </div>
            <aside>
              <div className="sidebar-card">
                <h3>Procurement contacts</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                  <b style={{ display: 'block', color: 'var(--ink)' }}>{company.tendersEmail}</b>
                  {company.phone}
                </p>
                <hr className="divider" />
                <h3>Vendor onboarding</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>{company.vendorEmail}</p>
                <hr className="divider" />
                <h3>Integrity line</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                  Report any request for a fee or inducement confidentially:<br />
                  <b style={{ color: 'var(--ink)' }}>integrity@anantainfratech.com</b>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CtaSlab
        eyebrow="Register today"
        title={<>Register once.<br />Be considered for <em>every package</em> that fits.</>}
        text="Contractor and supplier registration is launching shortly. Register your interest now and our procurement team will contact you directly as registration opens."
        image={tenders.image}
        primary={{ to: '/register', label: `Register your company${registration.suffix}` }}
        secondary={{ to: '/faq', label: 'Read the FAQs' }}
      />
    </main>
  )
}
