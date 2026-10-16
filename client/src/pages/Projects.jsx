import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, LayoutGrid, List, Search, SlidersHorizontal } from 'lucide-react'
import { useContent } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import { EmptyState, PageHero, Pagination, ProjectCard, Reveal, SectionLead, StatStrip, Tag } from '../components/Blocks'

const PER_PAGE = 9

export default function Projects() {
  const site = useContent()
  const intro = site.projectsIntro || {}
  const projects = site.projects || []
  const base = site.meta?.siteUrl || ''

  const [sector, setSector] = useState('All')
  const [status, setStatus] = useState('All')
  const [city, setCity] = useState('All')
  const [query, setQuery] = useState('')
  const [view, setView] = useState('grid')
  const [page, setPage] = useState(1)

  const sectors = useMemo(() => ['All', ...new Set(projects.map((project) => project.category).filter(Boolean))], [projects])
  const statuses = useMemo(() => ['All', ...new Set(projects.map((project) => project.status).filter(Boolean))], [projects])
  const cities = useMemo(() => ['All', ...new Set(projects.map((project) => project.city).filter(Boolean))], [projects])

  const counts = useMemo(() => projects.reduce((acc, project) => {
    acc[project.category] = (acc[project.category] || 0) + 1
    return acc
  }, {}), [projects])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return projects.filter((project) => {
      if (sector !== 'All' && project.category !== sector) return false
      if (status !== 'All' && project.status !== status) return false
      if (city !== 'All' && project.city !== city) return false
      if (!needle) return true
      return [project.title, project.location, project.summary, project.scope, project.client, project.category]
        .some((field) => String(field || '').toLowerCase().includes(needle))
    })
  }, [projects, sector, status, city, query])

  const resetFilters = () => { setSector('All'); setStatus('All'); setCity('All'); setQuery(''); setPage(1) }
  const changeFilter = (setter) => (value) => { setter(value); setPage(1) }

  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <main>
      <Seo
        title="Projects"
        description={intro.intro}
        image={projects[0]?.image}
        jsonLd={breadcrumbSchema(base, [{ label: 'Projects', to: '/projects' }])}
      />

      <PageHero
        eyebrow={intro.eyebrow}
        title={intro.title}
        intro={intro.intro}
        image={projects[0]?.image}
        trail={[{ label: 'Projects', to: '/projects' }]}
        stats={[
          { value: `${projects.length}`, label: 'projects in this portfolio' },
          { value: `${projects.filter((project) => project.status === 'In progress').length}`, label: 'currently under construction' },
          { value: '1.9M', label: 'sq. ft. delivered' },
          { value: '6', label: 'sectors represented' }
        ]}
      />

      <section className="shell section-tight">
        <div className="filter-tools">
          <label className="search-field">
            <Search size={16} />
            <input
              type="search"
              value={query}
              onChange={(event) => changeFilter(setQuery)(event.target.value)}
              placeholder="Search by project, client, location or scope…"
              aria-label="Search projects"
            />
          </label>

          <label className="select-field">
            <span className="sr-only">Filter by status</span>
            <select value={status} onChange={(event) => changeFilter(setStatus)(event.target.value)}>
              {statuses.map((item) => <option key={item} value={item}>{item === 'All' ? 'Any status' : item}</option>)}
            </select>
          </label>

          <label className="select-field">
            <span className="sr-only">Filter by city</span>
            <select value={city} onChange={(event) => changeFilter(setCity)(event.target.value)}>
              {cities.map((item) => <option key={item} value={item}>{item === 'All' ? 'Any location' : item}</option>)}
            </select>
          </label>

          <div className="slider-controls">
            <button className={`icon-button ${view === 'grid' ? 'is-active' : ''}`} onClick={() => setView('grid')} aria-label="Grid view" style={view === 'grid' ? { background: 'var(--ink)', color: 'var(--white)', borderColor: 'var(--ink)' } : undefined}>
              <LayoutGrid size={16} />
            </button>
            <button className={`icon-button`} onClick={() => setView('list')} aria-label="List view" style={view === 'list' ? { background: 'var(--ink)', color: 'var(--white)', borderColor: 'var(--ink)' } : undefined}>
              <List size={16} />
            </button>
          </div>

          <span className="result-count">{filtered.length} of {projects.length} projects</span>
        </div>

        <div className="filter-bar" role="tablist" aria-label="Filter by sector">
          {sectors.map((item) => (
            <button
              key={item}
              role="tab"
              aria-selected={sector === item}
              onClick={() => changeFilter(setSector)(item)}
            >
              {item === 'All' ? 'All sectors' : item}
              <small>{item === 'All' ? projects.length : counts[item] || 0}</small>
            </button>
          ))}
          {(sector !== 'All' || status !== 'All' || city !== 'All' || query) ? (
            <button onClick={resetFilters} style={{ color: 'var(--danger)' }}>Clear filters</button>
          ) : null}
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={SlidersHorizontal}
            title="No projects match those filters."
            text="Try clearing the filters, or search for a different location, client or scope."
            action={<button className="button button-sm" onClick={resetFilters}>Reset filters</button>}
          />
        ) : view === 'grid' ? (
          <div className="projects-grid">
            {visible.map((project, index) => (
              <Reveal key={project.id} delay={(index % 3) * 0.06}><ProjectCard project={project} showFacts /></Reveal>
            ))}
          </div>
        ) : (
          <div className="row-list">
            {visible.map((project) => (
              <Link className="row-list-item" key={project.id} to={`/projects/${project.id}`}>
                <span className="card-index">{project.year?.slice(2) || '—'}</span>
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.location} · {project.scope}</p>
                </div>
                <div className="pill-list">
                  <Tag>{project.category}</Tag>
                  <Tag tone={project.status === 'In progress' ? 'tag-warning' : 'tag-success'}>{project.status}</Tag>
                  {project.area ? <Tag>{project.area}</Tag> : null}
                </div>
                <ArrowUpRight size={19} />
              </Link>
            ))}
          </div>
        )}

        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </section>

      <div className="shell section-tight" style={{ paddingTop: 0 }}>
        <StatStrip
          stats={[
            { value: '60+', label: 'projects delivered since 2016', detail: 'Across commercial, residential, industrial, healthcare, hospitality and infrastructure.' },
            { value: '97%', label: 'milestones met or bettered', detail: 'Measured against baseline programme across all live projects.' },
            { value: '0.4', label: 'snags per 100 sq. m. at handover', detail: 'Our last three fit-out handovers, against a benchmark of roughly 1.6.' },
            { value: '68%', label: 'packages to long-term partners', detail: 'Trade partners who have worked with us for more than five years.' }
          ]}
          withDetail
        />
      </div>

      <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
        <div className="shell">
          <SectionLead
            eyebrow="Portfolio notes"
            title={<>Every project here was<br />delivered by an <em>Ananta team.</em></>}
            copy={intro.note}
            action={<Link className="button" to="/downloads">Download portfolio case sheets <ArrowUpRight size={16} /></Link>}
          />
        </div>
      </section>
    </main>
  )
}
