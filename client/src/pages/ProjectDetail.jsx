import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { useContent } from '../lib/site'
import { Seo, breadcrumbSchema } from '../lib/seo'
import {
  CtaSlab, Eyebrow, FactGrid, Gallery, PageHero, ProjectCard, Reveal, SectionLead, Tag, TextLink, Timeline
} from '../components/Blocks'

export default function ProjectDetail() {
  const site = useContent()
  const { id } = useParams()
  const projects = site.projects || []
  const index = projects.findIndex((item) => (item.id || item._id) === id)
  const project = projects[index]
  const base = site.meta?.siteUrl || ''

  if (!project) {
    return (
      <main className="not-found">
        <h1>Project<br /><em>not found.</em></h1>
        <p>The project you are looking for may have been moved or renamed.</p>
        <div className="not-found-actions">
          <Link className="button button-acid" to="/projects">All projects <ArrowUpRight size={16} /></Link>
        </div>
      </main>
    )
  }

  const previous = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  const related = projects.filter((item) => item.id !== project.id && item.sector === project.sector).slice(0, 3)
  const more = related.length ? related : projects.filter((item) => item.id !== project.id).slice(0, 3)

  return (
    <main>
      <Seo
        title={`${project.title} — ${project.category} project`}
        description={project.summary}
        image={project.image}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          description: project.summary,
          locationCreated: { '@type': 'Place', name: project.location },
          dateCreated: project.year,
          creator: { '@type': 'GeneralContractor', name: site.company?.name },
          image: project.image
        }}
        trail={null}
      />

      <PageHero
        eyebrow={`${project.category} · ${project.location}`}
        title={project.title}
        intro={project.summary}
        image={project.image}
        trail={[{ label: 'Projects', to: '/projects' }, { label: project.title, to: `/projects/${project.id}` }]}
        meta={[`Year ${project.year}`, project.status, project.value, project.area].filter(Boolean)}
        actions={<>
          <Link className="button button-acid" to="/contact">Discuss a similar project <ArrowUpRight size={16} /></Link>
          <Link className="button button-light" to="/downloads">Request the case sheet</Link>
        </>}
      />

      <div className="shell project-detail-hero" style={{ paddingTop: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
        <FactGrid
          facts={[
            { label: 'Client', value: project.client },
            { label: 'Value', value: project.value },
            { label: 'Area / extent', value: project.area },
            { label: 'Status', value: project.status },
            ...(project.facts || [])
          ]}
        />
      </div>

      <div className="detail-image">
        <img src={project.image} alt={project.title} />
      </div>

      <section className="shell section">
        <SectionLead
          eyebrow="Project brief"
          title={project.summary}
        />
        <div className="prose stack">
          {project.description ? <p>{project.description}</p> : null}
          <p style={{ fontSize: 13.4, color: 'var(--muted)' }}><b>Scope of appointment:</b> {project.scope}</p>
          <div className="pill-list">
            {(project.services || []).map((service) => <Tag key={service}>{service}</Tag>)}
          </div>
        </div>
      </section>

      <section className="shell case-study">
        <div>
          <Eyebrow>The challenge</Eyebrow>
          <p>{project.challenge}</p>
        </div>
        <div>
          <Eyebrow>What we did</Eyebrow>
          <p>{project.solution}</p>
        </div>
        <div>
          <Eyebrow>The impact</Eyebrow>
          <p>{project.impact}</p>
        </div>
      </section>

      {project.quote ? (
        <section className="case-quote">
          <div className="shell">
            <Reveal>
              <blockquote>“{project.quote.text}”</blockquote>
              <footer>{project.quote.author} · {project.quote.role}</footer>
            </Reveal>
          </div>
        </section>
      ) : null}

      {project.timeline?.length ? (
        <section className="shell section">
          <SectionLead
            number="01 — 03"
            eyebrow="Delivery timeline"
            title={<>How the programme<br /><em>actually ran.</em></>}
            copy="Key milestones as they were recorded against the baseline programme."
          />
          <Timeline items={project.timeline} yearKey="date" />
        </section>
      ) : null}

      {project.gallery?.length ? (
        <section className="shell section-tight">
          <SectionLead
            number="02 — 03"
            eyebrow="Gallery"
            title="On site and in the detail."
          />
          <Gallery images={project.gallery} caption={`${project.title} · ${project.location}`} alt={project.title} />
        </section>
      ) : null}

      {project.facts?.length ? (
        <section className="shell section-tight">
          <SectionLead number="03 — 03" eyebrow="Technical snapshot" title="Numbers behind the build." />
          <FactGrid facts={project.facts} />
        </section>
      ) : null}

      <section className="shell section-tight">
        <SectionLead eyebrow="More work" title="Projects you may also want to see." action={<TextLink to="/projects">All projects</TextLink>} />
        <div className="projects-grid">
          {more.map((item, itemIndex) => (
            <Reveal key={item.id} delay={itemIndex * 0.06}><ProjectCard project={item} showFacts /></Reveal>
          ))}
        </div>

        <nav className="project-nav" aria-label="Project navigation">
          <Link to={`/projects/${previous.id}`}>
            <span><ArrowLeft size={13} style={{ verticalAlign: '-2px' }} /> Previous project</span>
            <b>{previous.title}</b>
          </Link>
          <Link to={`/projects/${next.id}`}>
            <span>Next project <ArrowRight size={13} style={{ verticalAlign: '-2px' }} /></span>
            <b>{next.title}</b>
          </Link>
        </nav>

        <div style={{ marginTop: '1.6rem' }}>
          <Link className="back-link" to="/projects"><ArrowLeft size={16} /> All projects</Link>
        </div>
      </section>

      <CtaSlab
        eyebrow="Similar project in mind?"
        title={<>We will tell you honestly<br />whether we are the right <em>partner.</em></>}
        text="Send us the brief, the site or the challenge. If we are not the right fit we will say so — and point you to someone who is."
        image={project.image}
        primary={{ to: '/contact', label: 'Start a conversation' }}
        secondary={{ to: '/tenders', label: 'Tender & procurement' }}
      />
    </main>
  )
}
