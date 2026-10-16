import { Link } from 'react-router-dom'
import { ArrowUpRight, Compass, Search } from 'lucide-react'
import { useContent, useRegistration } from '../lib/site'
import { Seo } from '../lib/seo'

const POPULAR = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Projects', to: '/projects' },
  { label: 'Careers', to: '/careers' },
  { label: 'Registration', to: '/register' },
  { label: 'Tenders', to: '/tenders' },
  { label: 'Contact', to: '/contact' },
  { label: 'Sitemap', to: '/sitemap' }
]

export default function NotFound() {
  const site = useContent()
  const registration = useRegistration()
  const projects = (site.projects || []).slice(0, 3)

  return (
    <>
      <Seo title="Page not found" description="That page does not exist. Browse our services, projects, careers and registration pages instead." noIndex />

      <main className="not-found">
        <p className="eyebrow eyebrow-light"><i />Error 404</p>
        <h1>That page is<br /><em>not built yet.</em></h1>
        <p>
          The page you asked for does not exist, or it has moved. If you followed a link from somewhere on this site,
          tell us and we will fix it.
        </p>

        <div className="not-found-actions">
          <Link className="button button-acid" to="/">Return home <ArrowUpRight size={16} /></Link>
          <Link className="button button-light" to="/sitemap"><Compass size={16} /> Open the sitemap</Link>
        </div>

        <div className="not-found-links">
          {POPULAR.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.to === '/register' && !registration.open ? `${item.label} · ${registration.label}` : item.label}
            </Link>
          ))}
        </div>

        {projects.length ? (
          <div style={{ marginTop: 'clamp(2rem, 5vw, 4rem)', width: 'min(1000px, 100%)', textAlign: 'left' }}>
            <p className="eyebrow eyebrow-light" style={{ marginBottom: '1rem' }}><i />While you are here — recent work</p>
            <div className="grid-3">
              {projects.map((project) => (
                <Link className="project-card" key={project.id} to={`/projects/${project.id}`} style={{ color: 'var(--white)' }}>
                  <div className="project-image">
                    <img src={project.image} alt={project.title} loading="lazy" />
                    <span className="project-arrow" aria-hidden><ArrowUpRight size={18} /></span>
                  </div>
                  <div className="project-meta" style={{ color: 'var(--muted-inverse)' }}>
                    <span>{project.category}</span>
                    <span>{project.location}</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--white)' }}>{project.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <p style={{ marginTop: '2.4rem', color: 'var(--muted-inverse)' }}>
          <Search size={13} style={{ verticalAlign: '-2px', marginRight: 6 }} />
          Looking for something specific? Write to <a href="mailto:support@anantainfratechsolutions.com" style={{ color: 'var(--acid)' }}>support@anantainfratechsolutions.com</a>
        </p>
      </main>
    </>
  )
}
