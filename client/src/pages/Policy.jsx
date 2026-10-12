import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight, Mail } from 'lucide-react'
import { useContent } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import { CtaSlab, Eyebrow, PageHero, SectionLead } from '../components/Blocks'

export default function Policy() {
  const site = useContent()
  const { slug } = useParams()
  const policies = site.policies || []
  const policy = policies.find((item) => item.slug === slug)
  const base = site.meta?.siteUrl || ''
  const company = site.company || ''

  if (!policy) {
    return (
      <main className="not-found">
        <h1>That policy<br /><em>does not exist.</em></h1>
        <div className="not-found-actions">
          <Link className="button button-acid" to="/sitemap">View the sitemap <ArrowUpRight size={16} /></Link>
        </div>
      </main>
    )
  }

  return (
    <main>
      <Seo
        title={policy.title}
        description={policy.intro}
        jsonLd={breadcrumbSchema(base, [{ label: policy.title, to: `/policy/${policy.slug}` }])}
      />

      <PageHero
        eyebrow="Legal & compliance"
        title={policy.title}
        intro={policy.intro}
        trail={[{ label: policy.title, to: `/policy/${policy.slug}` }]}
        meta={[`Last updated ${policy.updated}`, site.company?.legalName]}
      />

      <section className="shell policy-layout">
        <aside>
          <div className="sidebar-card">
            <h3>Policies</h3>
            <nav className="sidebar-nav">
              {policies.map((item) => (
                <Link key={item.slug} to={`/policy/${item.slug}`} className={item.slug === slug ? 'active' : ''}>{item.title}</Link>
              ))}
            </nav>
            <hr className="divider" />
            <Eyebrow>Questions</Eyebrow>
            <p style={{ fontSize: 12.8, color: 'var(--muted)', margin: 0 }}>
              For privacy requests write to <b>privacy@anantainfratech.com</b>. For integrity and conduct concerns write
              to <b>integrity@anantainfratech.com</b>.
            </p>
            <a className="button button-sm button-ghost" href="mailto:privacy@anantainfratech.com">Email us <Mail size={14} /></a>
          </div>

          <div className="sidebar-card" style={{ marginTop: '1.2rem' }}>
            <h3>On this page</h3>
            <nav className="sidebar-nav">
              {policy.sections.map((section, index) => (
                <a key={section.heading} href={`#section-${index}`}>{section.heading}</a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="policy-body">
          <p className="policy-meta">Version — last updated {policy.updated}</p>

          {policy.sections.map((section, index) => (
            <section key={section.heading} id={`section-${index}`} style={{ scrollMarginTop: 'calc(var(--header-h) + 1.5rem)' }}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
            </section>
          ))}

          <div className="inline-cta">
            <div>
              <h3>Exercising a right under this policy</h3>
              <p>Write to us with your request and we will respond within 30 days, as required by our own policy.</p>
            </div>
            <a className="button" href="mailto:privacy@anantainfratech.com">Make a request <ArrowUpRight size={16} /></a>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <SectionLead
            eyebrow="Related policies"
            title="Other documents you may need."
          />
          <div className="grid-3">
            {policies.filter((item) => item.slug !== slug).map((item) => (
              <div className="card card-flat" key={item.slug}>
                <h4><Link to={`/policy/${item.slug}`} style={{ textDecoration: 'underline', textDecorationColor: 'var(--line-strong)' }}>{item.title}</Link></h4>
                <p style={{ fontSize: 13.2, color: 'var(--ink-2)' }}>{item.intro}</p>
                <Link className="text-button" to={`/policy/${item.slug}`}>Read <ArrowUpRight size={13} /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSlab
        eyebrow="Contact"
        title={<>A question about how we<br />handle your <em>information?</em></>}
        text={`Write to our registered office at ${company.addressLines?.[1] || 'Juhu, Mumbai'} or email the team directly.`}
        image={site.about?.storyImage}
        primary={{ to: '/contact', label: 'Contact the team' }}
        secondary={{ to: '/faq', label: 'Read the FAQs' }}
      />
    </main>
  )
}
