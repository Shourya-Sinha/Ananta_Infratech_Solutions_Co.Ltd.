import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, Clock, Mail, MapPin, MessageSquare, Phone } from 'lucide-react'
import { useContent } from '../lib/site'
import { Seo, organisationSchema } from '../lib/seo'
import { CtaSlab, Eyebrow, PageHero, Reveal, SectionLead, Tag, TextLink } from '../components/Blocks'
import { ContactForm } from '../components/Forms'

export default function Contact() {
  const site = useContent()
  const contact = site.contact || {}
  const company = site.company || {}
  const offices = site.offices || []
  const [params] = useSearchParams()
  const [activeOffice, setActiveOffice] = useState(offices[0]?.id || '')

  const office = offices.find((item) => item.id === activeOffice) || offices[0]

  const socials = [
    { href: company.linkedin, label: 'LinkedIn' },
    { href: company.instagram, label: 'Instagram' },
    { href: company.facebook, label: 'Facebook' },
    { href: company.youtube, label: 'YouTube' }
  ].filter((item) => item.href)

  return (
    <main>
      <Seo
        title="Contact us"
        description={contact.intro}
        image={site.projects?.[0]?.image}
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            organisationSchema(site),
            ...offices.map((item) => ({
              '@type': 'LocalBusiness',
              name: `${company.name} — ${item.name}`,
              telephone: item.phone,
              email: item.email,
              address: { '@type': 'PostalAddress', streetAddress: item.address, addressCountry: 'IN' },
              openingHours: item.hours
            }))
          ]
        }}
      />

      <PageHero
        eyebrow="Contact"
        title={contact.title}
        intro={contact.intro}
        image={site.projects?.[1]?.image}
        trail={[{ label: 'Contact', to: '/contact' }]}
        note={<div className="notice notice-dark" style={{ alignItems: 'center' }}><MessageSquare size={17} /><span style={{ fontSize: 13.4 }}>{contact.responseNote}</span></div>}
        actions={<>
          <a className="button button-acid" href={`mailto:${company.email}`}>Email us <ArrowUpRight size={16} /></a>
          <a className="button button-light" href={`tel:${(company.phone || '').replace(/\s/g, '')}`}>Call {company.phone}</a>
        </>}
      />

      <section className="shell contact-grid">
        <Reveal>
          <Eyebrow>01 — 03 Visit or call</Eyebrow>
          <h2 style={{ margin: '1rem 0 1.1rem' }}>Come by and<br /><em>say hello.</em></h2>
          <div className="contact-card">
            <address>{company.address}</address>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <a href={`tel:${(company.phone || '').replace(/\s/g, '')}`}><Phone size={14} style={{ verticalAlign: '-2px', marginRight: 8, color: 'var(--acid-deep)' }} />{company.phone}</a>
              {company.phoneAlt ? <a href={`tel:${company.phoneAlt.replace(/\s/g, '')}`}><Phone size={14} style={{ verticalAlign: '-2px', marginRight: 8, color: 'var(--acid-deep)' }} />{company.phoneAlt}</a> : null}
              <a href={`mailto:${company.email}`}><Mail size={14} style={{ verticalAlign: '-2px', marginRight: 8, color: 'var(--acid-deep)' }} />{company.email}</a>
              <span style={{ fontSize: 13.4, color: 'var(--muted)' }}><Clock size={14} style={{ verticalAlign: '-2px', marginRight: 8 }} />{company.workingHours}</span>
            </div>
            {socials.length ? (
              <div className="socials">
                {socials.map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label} <ArrowUpRight size={14} /></a>
                ))}
              </div>
            ) : null}
          </div>

          <div style={{ marginTop: '1.6rem' }}>
            <Eyebrow>02 — 03 Our offices</Eyebrow>
            <div className="office-list" style={{ marginTop: '1rem' }}>
              {offices.map((item) => (
                <button
                  key={item.id}
                  className="office-card"
                  onClick={() => setActiveOffice(item.id)}
                  style={{
                    textAlign: 'left',
                    borderLeft: item.id === office?.id ? '3px solid var(--acid-deep)' : '3px solid transparent',
                    cursor: 'pointer'
                  }}
                >
                  <span className="office-tag">{item.type}</span>
                  <h3>{item.name}</h3>
                  <p>{item.address}</p>
                  <div className="office-links">
                    <a href={`tel:${item.phone.replace(/\s/g, '')}`} onClick={(event) => event.stopPropagation()}>{item.phone}</a>
                    <a href={`mailto:${item.email}`} onClick={(event) => event.stopPropagation()}>{item.email}</a>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Eyebrow>03 — 03 Tell us what you’re thinking</Eyebrow>
          <h2 style={{ margin: '1rem 0 1.1rem', fontSize: 'clamp(1.5rem, 2.6vw, 2.2rem)' }}>Start a conversation.</h2>
          <div className="contact-card" style={{ padding: 'clamp(1.2rem, 2.4vw, 1.9rem)' }}>
            <ContactForm departments={contact.departments} defaultDepartment={params.get('department') || ''} />
          </div>
          <p className="field-hint" style={{ marginTop: '1rem' }}>
            Prefer to go straight to a department? Use the routing list below, or write to{' '}
            <a href={`mailto:${company.email}`} style={{ textDecoration: 'underline' }}>{company.email}</a> and we will forward it internally.
          </p>
        </Reveal>
      </section>

      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <SectionLead
            eyebrow="Departments"
            title={<>The right team<br />for your <em>question.</em></>}
            copy="Every enquiry is acknowledged within one working day and routed to a named lead. These are the direct lines if you already know who you need."
          />
          <div className="dept-grid">
            {(contact.departments || []).map((department) => (
              <div key={department.id}>
                <b>{department.label}</b>
                <a href={`mailto:${department.email}`}>{department.email}</a>
                <a href={`tel:${department.phone.replace(/\s/g, '')}`}>{department.phone}</a>
                <p>{department.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="map-section">
        <iframe
          title={`${office?.name || company.name} location`}
          src={office?.mapUrl || contact.mapUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <section className="shell section-tight">
        <SectionLead
          eyebrow="Before you write"
          title={<>Things that help us<br />respond <em>properly.</em></>}
        />
        <div className="grid-3">
          {[
            { title: 'For a new project', text: 'Tell us the location, approximate area, intended use and where you are in design. Even a rough brief gets a useful first response.', to: '/contact?department=new-business', label: 'New business' },
            { title: 'For procurement', text: 'Name the package, the value band and the region. We will tell you which of our projects the package relates to.', to: '/tenders', label: 'Tender enquiries' },
            { title: 'For jobs & site work', text: 'Staff applications go to our talent team. Site workers, technicians and contractors should use the registration route.', to: '/register', label: 'Registration' }
          ].map((item, index) => (
            <Reveal className="card" key={item.title} delay={index * 0.05}>
              <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
              <h4>{item.title}</h4>
              <p style={{ fontSize: 13.4, color: 'var(--ink-2)' }}>{item.text}</p>
              <Link className="text-button" to={item.to}>{item.label} <ArrowUpRight size={13} /></Link>
            </Reveal>
          ))}
        </div>

        <div className="fact-grid" style={{ marginTop: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
          {[
            { label: 'Head office', value: 'Juhu, Mumbai' },
            { label: 'Regional office', value: 'Noida, Delhi NCR' },
            { label: 'Project offices', value: 'Pune · Bengaluru' },
            { label: 'Working hours', value: 'Mon – Sat · 09:30 – 18:30 IST' },
            { label: 'Response time', value: 'Within 24 working hours' },
            { label: 'Languages', value: 'English · Hindi · Marathi' }
          ].map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <b>{item.value}</b>
            </div>
          ))}
        </div>
      </section>

      <CtaSlab
        eyebrow="Careers"
        title={<>Looking for work rather<br />than a <em>contract?</em></>}
        text="Staff vacancies are on our careers page. Site workers, technicians, contractors and suppliers should register their interest instead."
        image={site.careers?.image}
        primary={{ to: '/careers', label: 'See open roles' }}
        secondary={{ to: '/register', label: 'Contractor & worker registration' }}
      />
    </main>
  )
}
