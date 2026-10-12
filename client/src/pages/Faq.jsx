import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, HelpCircle, Search } from 'lucide-react'
import { useContent, useRegistration } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import { Accordion, CtaSlab, EmptyState, Eyebrow, PageHero, SectionLead, TextLink } from '../components/Blocks'

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-')

export default function Faq() {
  const site = useContent()
  const registration = useRegistration()
  const faq = site.faq || {}
  const categories = faq.categories || []
  const base = site.meta?.siteUrl || ''
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const activeCategory = params.get('category') || categories[0]?.name || ''

  const allItems = useMemo(() => categories.flatMap((category) => category.items.map((item) => ({ ...item, category: category.name }))), [categories])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return null
    return allItems.filter((item) => `${item.question} ${item.answer} ${item.category}`.toLowerCase().includes(needle))
  }, [allItems, query])

  return (
    <main>
      <Seo
        title="Frequently asked questions"
        description={faq.intro}
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            breadcrumbSchema(base, [{ label: 'FAQ', to: '/faq' }]),
            {
              '@type': 'FAQPage',
              mainEntity: allItems.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: { '@type': 'Answer', text: item.answer }
              }))
            }
          ]
        }}
      />

      <PageHero
        eyebrow={faq.eyebrow}
        title={faq.title}
        intro={faq.intro}
        trail={[{ label: 'FAQ', to: '/faq' }]}
        stats={[
          { value: `${allItems.length}`, label: 'questions answered' },
          { value: `${categories.length}`, label: 'topics covered' },
          { value: '1 day', label: 'response time for anything missing' }
        ]}
        actions={<>
          <Link className="button button-acid" to="/contact">Ask us something else <ArrowUpRight size={16} /></Link>
          <Link className="button button-light" to="/register">Registration questions{registration.suffix}</Link>
        </>}
      />

      <section className="shell" style={{ paddingTop: 'clamp(2rem, 4vw, 3.4rem)' }}>
        <div className="filter-tools">
          <label className="search-field">
            <Search size={16} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search all questions…"
              aria-label="Search frequently asked questions"
            />
          </label>
          <span className="result-count">{filtered ? `${filtered.length} matching` : `${allItems.length} questions`}</span>
        </div>
      </section>

      {filtered ? (
        <section className="shell section-tight" style={{ paddingTop: 0 }}>
          {filtered.length === 0 ? (
            <EmptyState
              icon={HelpCircle}
              title="No answers match that search."
              text="Try a different phrase, or write to us — every enquiry is answered within one working day."
              action={<Link className="button button-sm" to="/contact">Ask the team</Link>}
            />
          ) : (
            <Accordion items={filtered} bodyKey="answer" />
          )}
        </section>
      ) : (
        <section className="shell faq-layout" style={{ paddingTop: '1rem' }}>
          <nav className="faq-nav" aria-label="FAQ categories">
            {categories.map((category) => (
              <a
                key={category.name}
                href={`#${slug(category.name)}`}
                className={activeCategory === category.name ? 'active' : ''}
                onClick={() => setParams({ category: category.name }, { replace: true })}
              >
                {category.name}
              </a>
            ))}
            <hr className="divider" style={{ margin: '0.8rem 0' }} />
            <Link className="text-button" to="/register">Registration FAQs{registration.suffix} <ArrowUpRight size={13} /></Link>
          </nav>

          <div>
            {categories.map((category) => (
              <div className="faq-group" id={slug(category.name)} key={category.name}>
                <Eyebrow>{category.items.length} questions</Eyebrow>
                <h2 style={{ marginTop: '0.8rem' }}>{category.name}</h2>
                <Accordion items={category.items} bodyKey="answer" />
              </div>
            ))}

            <div className="inline-cta">
              <div>
                <h3>Not answered here?</h3>
                <p>Write to us with the question and we will answer it directly — and consider adding it to this page.</p>
              </div>
              <Link className="button" to="/contact">Ask a question <ArrowUpRight size={16} /></Link>
            </div>
          </div>
        </section>
      )}

      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <SectionLead
            eyebrow="Still deciding"
            title={<>Three pages that answer<br />most of the <em>rest.</em></>}
          />
          <div className="grid-3">
            {[
              { title: 'Services & capability', text: 'What we actually do, discipline by discipline, with deliverables listed.', to: '/services' },
              { title: 'How we deliver', text: 'Our five-stage method from first conversation to asset performance.', to: '/services/construction-management' },
              { title: 'Contractor registration', text: 'How contractors, suppliers and skilled workers will register when the portal opens.', to: '/register' }
            ].map((item, index) => (
              <div className="card" key={item.title}>
                <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
                <h4><Link to={item.to} style={{ textDecoration: 'underline', textDecorationColor: 'var(--line-strong)' }}>{item.title}</Link></h4>
                <p style={{ fontSize: 13.4, color: 'var(--ink-2)' }}>{item.text}</p>
                <TextLink to={item.to}>Open</TextLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSlab
        eyebrow="Direct line"
        title={<>One question is usually<br />easier than <em>reading a page.</em></>}
        text="Call or write. Our team answers enquiries within one working day, and you will be talking to someone who can actually answer."
        image={site.about?.peopleImage}
        primary={{ to: '/contact', label: 'Contact the team' }}
        secondary={{ to: '/downloads', label: 'Request documents' }}
      />
    </main>
  )
}
