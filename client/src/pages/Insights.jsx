import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Newspaper, Search } from 'lucide-react'
import { useContent } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import { EmptyState, InsightCard, PageHero, Reveal, SectionLead, Tag, TextLink } from '../components/Blocks'

export default function Insights() {
  const site = useContent()
  const insights = site.insights || []
  const base = site.meta?.siteUrl || ''
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  const categories = useMemo(() => ['All', ...new Set(insights.map((item) => item.category).filter(Boolean))], [insights])
  const [featured, ...rest] = insights

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rest.filter((item) => {
      if (category !== 'All' && item.category !== category) return false
      if (!needle) return true
      return [item.title, item.excerpt, item.author, item.category, ...(item.tags || [])]
        .some((field) => String(field || '').toLowerCase().includes(needle))
    })
  }, [rest, category, query])

  return (
    <main>
      <Seo
        title="Insights & perspectives"
        description="Practical writing on construction delivery, programme reality, safety culture and what actually decides whether a project goes well."
        image={featured?.image}
        jsonLd={breadcrumbSchema(base, [{ label: 'Insights', to: '/insights' }])}
      />

      <PageHero
        eyebrow="Insights"
        title="Perspectives from the field."
        intro="Short, practical writing on what actually decides whether a project goes well — written by the people who deliver the work, not by a marketing department."
        image={featured?.image}
        trail={[{ label: 'Insights', to: '/insights' }]}
        stats={[
          { value: `${insights.length}`, label: 'published perspectives' },
          { value: '6', label: 'authors from the delivery team' },
          { value: '4', label: 'themes: projects, people, ideas, innovation' }
        ]}
      />

      {featured ? (
        <section className="shell section">
          <article className="insight-feature">
            <Reveal>
              <Link to={`/insights/${featured.slug}`}>
                <img src={featured.image} alt={featured.title} />
              </Link>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="insight-meta">
                <Tag tone="tag-acid">Latest</Tag>
                <span>{featured.type}</span>
                <span>{featured.date}</span>
                <span>{featured.readingTime}</span>
              </div>
              <h2 style={{ marginTop: '1rem' }}><Link to={`/insights/${featured.slug}`}>{featured.title}</Link></h2>
              <p className="lead">{featured.excerpt}</p>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>{featured.author} · {featured.authorRole}</p>
              <div className="button-row" style={{ marginTop: '1.2rem' }}>
                <Link className="button" to={`/insights/${featured.slug}`}>Read the full piece <ArrowUpRight size={16} /></Link>
              </div>
            </Reveal>
          </article>
        </section>
      ) : null}

      <section className="shell section-tight">
        <div className="filter-tools">
          <label className="search-field">
            <Search size={16} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search insights by title, theme or author…"
              aria-label="Search insights"
            />
          </label>
          <span className="result-count">{filtered.length} of {rest.length} articles</span>
        </div>

        <div className="filter-bar" role="tablist" aria-label="Filter by theme">
          {categories.map((item) => (
            <button key={item} role="tab" aria-selected={category === item} onClick={() => setCategory(item)}>
              {item === 'All' ? 'All themes' : item}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="No articles match that search."
            text="Try a different theme or clear the search box."
            action={<button className="button button-sm" onClick={() => { setQuery(''); setCategory('All') }}>Show everything</button>}
          />
        ) : (
          <div className="insights-grid">
            {filtered.map((insight, index) => (
              <Reveal key={insight.slug} delay={(index % 3) * 0.06}><InsightCard insight={insight} /></Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <SectionLead
            eyebrow="Newsroom"
            title={<>Announcements, awards<br />and <em>project news.</em></>}
            copy="Corporate announcements, project milestones and industry recognition — all in one place."
            action={<TextLink to="/newsroom">Open the newsroom</TextLink>}
          />
          <div className="grid-3">
            {(site.newsroom || []).slice(0, 3).map((item, index) => (
              <Reveal className="card" key={item.title} delay={index * 0.06}>
                <div className="insight-meta"><span>{item.type}</span><time>{item.date}</time></div>
                <h4>{item.title}</h4>
                <p style={{ fontSize: 13.4, color: 'var(--ink-2)' }}>{item.summary}</p>
                <Link className="text-link" to={item.link} style={{ fontSize: 12 }}>Read more <ArrowUpRight size={14} /></Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
