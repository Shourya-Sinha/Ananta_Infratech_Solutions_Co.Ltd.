import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Mail, Printer, Share2 } from 'lucide-react'
import { useContent } from '../lib/site'
import { Seo } from '../lib/seo'
import { CtaSlab, Eyebrow, InsightCard, Reveal, SectionLead, Tag } from '../components/Blocks'

export default function InsightDetail() {
  const site = useContent()
  const { slug } = useParams()
  const insights = site.insights || []
  const insight = insights.find((item) => item.slug === slug)

  if (!insight) {
    return (
      <main className="not-found">
        <h1>That article<br /><em>has moved.</em></h1>
        <p>It may have been renamed. Everything we have published is listed on the insights page.</p>
        <div className="not-found-actions">
          <Link className="button button-acid" to="/insights">All insights <ArrowUpRight size={16} /></Link>
        </div>
      </main>
    )
  }

  const related = insights.filter((item) => item.slug !== slug && item.category === insight.category).slice(0, 3)
  const fallback = insights.filter((item) => item.slug !== slug).slice(0, 3)
  const suggestions = related.length ? related : fallback
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const base = site.meta?.siteUrl || ''

  return (
    <main>
      <Seo
        title={insight.title}
        description={insight.excerpt}
        image={insight.image}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: insight.title,
          description: insight.excerpt,
          image: [insight.image],
          datePublished: insight.dateISO,
          author: { '@type': 'Person', name: insight.author, jobTitle: insight.authorRole },
          publisher: { '@type': 'Organization', name: site.company?.name, logo: { '@type': 'ImageObject', url: `${base}/assets/logo_bg_remove.png` } },
          mainEntityOfPage: `${base}/insights/${insight.slug}`
        }}
      />

      <section className="shell article-header">
        <nav className="breadcrumbs">
          <Link to="/">Home</Link>
          <span aria-hidden>/</span>
          <Link to="/insights">Insights</Link>
          <span aria-hidden>/</span>
          <span style={{ opacity: 1 }}>{insight.category}</span>
        </nav>
        <div className="insight-meta" style={{ marginTop: '1.4rem' }}>
          <Tag tone="tag-acid">{insight.type}</Tag>
          <span>{insight.category}</span>
          <span>{insight.readingTime}</span>
        </div>
        <h1>{insight.title}</h1>
        <div className="article-meta">
          <span>By {insight.author}</span>
          <span>{insight.authorRole}</span>
          <time dateTime={insight.dateISO}>{insight.date}</time>
        </div>
      </section>

      <div className="shell" style={{ paddingBottom: '1.5rem' }}>
        <img src={insight.image} alt={insight.title} style={{ aspectRatio: '21 / 9', objectFit: 'cover' }} />
      </div>

      <section className="shell article-body">
        <article className="prose">
          {insight.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}

          <div className="pull-quote">
            “{insight.excerpt}
          </div>

          {insight.tags?.length ? (
            <div style={{ marginTop: '2.4rem', paddingTop: '1.4rem', borderTop: '1px solid var(--line)' }}>
              <Eyebrow>Tagged</Eyebrow>
              <div className="pill-list" style={{ marginTop: '0.8rem' }}>
                {insight.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
              </div>
            </div>
          ) : null}
        </article>

        <aside className="article-aside">
          <div className="aside-block">
            <h4>Written by</h4>
            <b style={{ fontSize: 15 }}>{insight.author}</b>
            <span style={{ fontSize: 12.4, color: 'var(--muted)' }}>{insight.authorRole}</span>
            <Link className="text-button" to="/leadership">More from our team</Link>
          </div>

          <div className="aside-block">
            <h4>Share this piece</h4>
            <div className="share-row">
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer"><Share2 size={13} /> Share</a>
              <a href={`mailto:?subject=${encodeURIComponent(insight.title)}&body=${encodeURIComponent(shareUrl)}`}><Mail size={13} /> Email</a>
              <button onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
          </div>

          <div className="aside-block">
            <h4>In this series</h4>
            <nav className="sidebar-nav">
              {suggestions.map((item) => <Link key={item.slug} to={`/insights/${item.slug}`}>{item.title.slice(0, 62)}{item.title.length > 62 ? '…' : ''}</Link>)}
            </nav>
          </div>

          <div className="aside-block" style={{ background: 'var(--ink)', borderColor: 'var(--ink)', color: 'var(--white)' }}>
            <h4 style={{ color: 'var(--muted-inverse)' }}>Work with us</h4>
            <p style={{ fontSize: 13.2, color: 'rgba(249,248,245,0.8)', margin: 0 }}>
              Bring us a brief, a site or a problem worth solving. You will talk to someone who can commit the company.
            </p>
            <Link className="button button-acid button-sm" to="/contact">Start a conversation <ArrowUpRight size={14} /></Link>
          </div>
        </aside>
      </section>

      <section className="shell section-tight">
        <SectionLead eyebrow="Keep reading" title="More perspectives." action={<Link className="text-link" to="/insights">All insights <ArrowUpRight size={15} /></Link>} />
        <div className="insights-grid">
          {suggestions.map((item, index) => (
            <Reveal key={item.slug} delay={index * 0.06}><InsightCard insight={item} /></Reveal>
          ))}
        </div>
        <div style={{ marginTop: '2rem' }}>
          <Link className="back-link" to="/insights"><ArrowLeft size={16} /> All insights</Link>
        </div>
      </section>

      <CtaSlab
        eyebrow="Subscribe"
        title={<>A quarterly brief,<br />nothing else.</>}
        text="Project notes, delivery lessons and industry perspective — sent four times a year. Unsubscribe any time."
        image={insight.image}
        primary={{ to: '/contact', label: 'Talk to our team' }}
        secondary={{ to: '/newsroom', label: 'Visit the newsroom' }}
      />
    </main>
  )
}
