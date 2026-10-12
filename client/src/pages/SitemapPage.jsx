import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useContent } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import { CtaSlab, Eyebrow, PageHero, SectionLead } from '../components/Blocks'

export default function SitemapPage() {
  const site = useContent()
  const base = site.meta?.siteUrl || ''
  const groups = site.sitemap || []

  return (
    <main>
      <Seo
        title="Sitemap"
        description="Every page on the Ananta Infratech Solutions website, grouped by section."
        jsonLd={breadcrumbSchema(base, [{ label: 'Sitemap', to: '/sitemap' }])}
      />

      <PageHero
        eyebrow="Site index"
        title="Everything on this site, in one place."
        intro="A complete index of the Ananta website. If you cannot find what you need here, the fastest route is usually to call us."
        trail={[{ label: 'Sitemap', to: '/sitemap' }]}
        actions={<>
          <a className="button button-acid" href="/sitemap.xml">Open the XML sitemap <ArrowUpRight size={16} /></a>
          <Link className="button button-light" to="/contact">Contact us</Link>
        </>}
      />

      <section className="shell sitemap-grid">
        {groups.map((group) => (
          <div key={group.group}>
            <h3>{group.group}</h3>
            {group.links.map((link) => <Link key={link.to + link.label} to={link.to}>{link.label}</Link>)}
          </div>
        ))}

        <div>
          <h3>Services — detail pages</h3>
          {(site.services || []).map((service) => (
            <Link key={service.slug} to={`/services/${service.slug}`}>{service.short}</Link>
          ))}
        </div>

        <div>
          <h3>Sectors — detail pages</h3>
          {(site.sectors || []).map((sector) => (
            <Link key={sector.slug} to={`/sectors/${sector.slug}`}>{sector.short}</Link>
          ))}
        </div>

        <div>
          <h3>Projects</h3>
          {(site.projects || []).map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`}>{project.title}</Link>
          ))}
        </div>

        <div>
          <h3>Insights</h3>
          {(site.insights || []).map((insight) => (
            <Link key={insight.slug} to={`/insights/${insight.slug}`}>{insight.title.length > 58 ? `${insight.title.slice(0, 58)}…` : insight.title}</Link>
          ))}
        </div>

        <div>
          <h3>Open roles</h3>
          {(site.jobs || []).map((job) => (
            <Link key={job.id} to={`/careers/${job.id}`}>{job.title}</Link>
          ))}
        </div>

        <div>
          <h3>Legal &amp; compliance</h3>
          {(site.policies || []).map((policy) => (
            <Link key={policy.slug} to={`/policy/${policy.slug}`}>{policy.title}</Link>
          ))}
        </div>
      </section>

      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <SectionLead
            eyebrow="For search engines"
            title="Machine-readable indexes."
            copy="Search engines, aggregators and research tools can use the structured endpoints below. They are generated from live CMS content and update whenever the site is published."
          />
          <div className="grid-3">
            {[
              { title: '/sitemap.xml', text: 'Complete XML sitemap with every public URL, priority and change frequency.', href: '/sitemap.xml' },
              { title: '/robots.txt', text: 'Crawler directives, with the admin portal and API excluded.', href: '/robots.txt' },
              { title: '/api/site/index', text: 'JSON index of services, sectors, projects, insights and open roles.', href: '/api/site/index' },
              { title: '/api/health', text: 'Service status and active storage backend for monitoring.', href: '/api/health' }
            ].map((item) => (
              <div className="card" key={item.title}>
                <Eyebrow>Endpoint</Eyebrow>
                <h4 style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>{item.title}</h4>
                <p style={{ fontSize: 13, color: 'var(--ink-2)' }}>{item.text}</p>
                <a className="text-button" href={item.href} target="_blank" rel="noreferrer">Open <ArrowUpRight size={13} /></a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSlab
        eyebrow="Not finding it?"
        title={<>Tell us what you were<br />looking for and could not <em>find.</em></>}
        text="If a question on this site was hard to answer, that is a content problem worth fixing — tell us and we will."
        image={site.projects?.[0]?.image}
        primary={{ to: '/contact', label: 'Tell us what is missing' }}
        secondary={{ to: '/faq', label: 'Read the FAQs' }}
      />
    </main>
  )
}
