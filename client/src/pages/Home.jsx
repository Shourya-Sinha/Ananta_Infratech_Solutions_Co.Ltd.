import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Building2, Code2, Mail, MoveDown, Pause, Play } from 'lucide-react'
import { useContent } from '../lib/site'
import { Seo, organisationSchema } from '../lib/seo'
import {
  CheckList, CtaSlab, Eyebrow, InsightCard, Marquee, ProcessGrid, ProjectCard,
  Reveal, SectorCard, SectionLead, ServiceTile, StatStrip, TestimonialCard, TextLink, TickerBar
} from '../components/Blocks'
import { Slider } from '../components/Blocks'
import { ChatPreview, Counter, DigitalGrid, DomainSwitch, StackMarquee } from '../components/Digital'

/* ---------------------------------------------------------------- hero */

function HeroSlider({ slides = [], stats = [] }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const timer = useRef(null)

  useEffect(() => {
    if (!playing || slides.length < 2) return undefined
    timer.current = setInterval(() => setIndex((current) => (current + 1) % slides.length), 7600)
    return () => clearInterval(timer.current)
  }, [playing, slides.length])

  if (!slides.length) return null
  const slide = slides[index]
  const digitalSlide = /digital products/i.test(slide.eyebrow || '')

  return (
    <section className="hero">
      <div className="hero-media" aria-hidden>
        {slides.map((item, slideIndex) => (
          <div className={`hero-media-item ${slideIndex === index ? 'is-active' : ''}`} key={item.title + slideIndex}>
            {item.video && slideIndex === index ? (
              <video autoPlay muted loop playsInline poster={item.image}>
                <source src={item.video} type="video/mp4" />
              </video>
            ) : (
              <img src={item.image} alt="" loading={slideIndex === 0 ? 'eager' : 'lazy'} />
            )}
          </div>
        ))}
      </div>
      <div className="hero-shade" />
      <div className="grid-overlay" />

      <div className="shell hero-inner">
        <div className="hero-topline">
          <span>{slide.eyebrow}</span>
          <span className="hero-scroll-hint">Scroll to explore <MoveDown size={14} /></span>
        </div>

        {/* Two practices, stated before the first headline. A visitor should
            never have to scroll to discover that this is also a software team. */}
        <nav className="hero-practices" aria-label="Choose a practice">
          <Link to="/services"><Building2 size={13} /> Construction &amp; infrastructure</Link>
          <span aria-hidden="true">+</span>
          <Link to="/technology"><Code2 size={13} /> Digital &amp; IT solutions</Link>
        </nav>

        <div className="hero-copy">
          <motion.p className="hero-eyebrow" key={`eyebrow-${index}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {slide.caption}
          </motion.p>
          <motion.h1 key={`title-${index}`} initial={{ opacity: 0, y: 46 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            {slide.title}
          </motion.h1>
        </div>

        <div className="hero-foot">
          <motion.p key={`text-${index}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.15 }}>
            {slide.text}
          </motion.p>
          <div className="hero-actions">
            <Link to={digitalSlide ? '/technology' : '/projects'} className="button button-acid">{digitalSlide ? 'Explore digital services' : 'Explore our work'} <ArrowUpRight size={17} /></Link>
            <Link to="/contact" className="button button-light">Start a conversation</Link>
          </div>
        </div>

        <div className="eyebrow-row">
          <div className="hero-dots">
            {slides.map((item, slideIndex) => (
              <button
                key={item.title + slideIndex}
                className={slideIndex === index ? 'is-active' : ''}
                onClick={() => setIndex(slideIndex)}
                aria-label={`Show slide ${slideIndex + 1}`}
                aria-current={slideIndex === index}
              />
            ))}
          </div>
          <button className="icon-button icon-button-inverse" onClick={() => setPlaying((value) => !value)} aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}>
            {playing ? <Pause size={15} /> : <Play size={15} />}
          </button>
        </div>

        {stats.length ? (
          <div className="hero-stats">
            {stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <a className="sr-only" href="#approach">Skip to approach</a>
      <ArrowDown size={0} style={{ display: 'none' }} />
    </section>
  )
}

/* ----------------------------------------------------------------- page */

export default function Home() {
  const site = useContent()
  const home = site.home || {}
  const projects = (site.projects || []).slice(0, 4)
  const insights = (site.insights || []).slice(0, 3)
  const services = site.services || []
  const testimonials = (site.testimonials || []).slice(0, 5)
  const sectors = (site.sectors || []).slice(0, 6)

  return (
    <main>
      <Seo
        title={site.meta?.defaultTitle ? null : undefined}
        description={home.aboutTeaser?.text || site.meta?.description}
        image={home.slides?.[0]?.image}
        jsonLd={organisationSchema(site)}
      />

      <HeroSlider slides={home.slides} stats={home.heroStats} />

      <TickerBar items={home.ticker} label="Latest" />

      {/* Trust strip */}
      <section className="section-tight" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="shell">
          <div className="eyebrow-row">
            <Eyebrow>Trusted, certified and compliant</Eyebrow>
            <span className="result-count">{(home.trustStrip || []).length} standards maintained</span>
          </div>
          <div className="logo-strip" style={{ marginTop: '1.2rem' }}>
            {(home.trustStrip || []).map((item) => <div key={item}><span>Certification</span><b>{item}</b></div>)}
          </div>
        </div>
      </section>

      {/* Statement */}
      <section id="approach" className="shell statement-section">
        <div className="statement-aside">
          <Eyebrow>{home.aboutTeaser?.eyebrow || 'Who we are'}</Eyebrow>
          <span>01 — 06</span>
        </div>
        <Reveal className="statement-content">
          <h2>{home.aboutTeaser?.title}</h2>
          <p>{home.aboutTeaser?.text}</p>
          <CheckList items={(home.aboutTeaser?.points || []).map((point) => point.title)} />
          <div className="button-row" style={{ marginTop: '1.6rem' }}>
            <Link className="button" to="/about">Discover Ananta <ArrowUpRight size={16} /></Link>
            <Link className="button button-ghost" to="/leadership">Meet the leadership</Link>
          </div>
        </Reveal>
      </section>

      <div className="shell"><StatStrip stats={home.stats} withDetail /></div>

      {/* Signature image */}
      <section className="signature-image">
        <img src={home.aboutTeaser?.image || home.slides?.[0]?.image} alt="Ananta construction team reviewing a high-rise work front" loading="lazy" />
        <div className="signature-caption">
          <span>The detail makes the difference</span>
          <span>{site.company?.addressLines?.[1] || 'Mumbai'} · {site.company?.yearsLabel}</span>
          <span>{site.company?.employees} people</span>
        </div>
      </section>

      {/* Two practices: the bridge between construction and technology */}
      <DomainSwitch block={home.domains} />

      {/* Services */}
      <section className="shell work-section">
        <SectionLead
          number="02 — 06"
          eyebrow={home.servicesSection?.eyebrow || 'What we do'}
          title={home.servicesSection?.title}
          copy={home.servicesSection?.text}
          action={<TextLink to="/services">All services</TextLink>}
        />
        <div className="services-preview">
          {services.slice(0, 6).map((service) => <ServiceTile key={service.slug} service={service} />)}
        </div>
        <div className="button-row" style={{ marginTop: '1.8rem' }}>
          {services.slice(6, 8).map((service) => (
            <Link key={service.slug} className="button button-ghost button-sm" to={`/services/${service.slug}`}>
              {service.short} <ArrowUpRight size={14} />
            </Link>
          ))}
        </div>
      </section>

      {/* Digital solutions */}
      <section className="digital-showcase" id="digital">
        <div className="shell">
          <SectionLead
            number="03 — 06"
            eyebrow={home.digitalSection?.eyebrow || 'Technology, made useful'}
            title={home.digitalSection?.title || <>Built for the real world.<br /><em>Designed for what’s next.</em></>}
            copy={home.digitalSection?.text || 'Alongside construction and infrastructure, Ananta delivers practical digital products—from custom CMS platforms and websites to Android and iOS apps, client chat and connected business systems.'}
            action={<TextLink to="/technology">Explore Ananta Digital</TextLink>}
          />

          <div className="dx-showcase-stats">
            {(home.digitalSection?.stats || []).map((stat) => (
              <div key={stat.label}>
                <strong><Counter value={stat.value} /></strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>

          <DigitalGrid
            services={services.filter((service) => (home.digitalSection?.serviceSlugs || ['digital-products', 'web-development', 'mobile-app-development', 'client-chat-solutions', 'content-management', 'seo-growth', 'erp-crm-systems', 'managed-it-support']).includes(service.slug))}
          />

          <div className="button-row" style={{ marginTop: '1.8rem' }}>
            <Link className="button button-acid" to="/technology">All {services.filter((service) => service.category === 'digital').length} digital services <ArrowUpRight size={16} /></Link>
            <a className="button button-light" href={`mailto:${(site.company?.supportEmail || site.company?.email || 'support@anantainfratechsolutions.com')}?subject=Digital%20project%20enquiry`}>
              Email support@anantainfratechsolutions.com
            </a>
          </div>
        </div>

        <StackMarquee items={home.digitalSection?.chips || ['React', 'React Native', 'Flutter', 'Node.js', 'CMS', 'SEO', 'Cloud', 'QA']} />

        <div className="shell" style={{ position: 'relative', zIndex: 1 }}>
          <ChatPreview
            compact
            eyebrow={home.digitalSection?.chatTeaser?.eyebrow}
            title={home.digitalSection?.chatTeaser?.title}
            text={home.digitalSection?.chatTeaser?.text}
            thread={home.digitalSection?.chatTeaser?.thread}
            features={['Website, app and email in one thread', 'Client portal with files and approvals', 'WhatsApp alerts for field teams']}
          />
          <p className="dx-engage-note">{home.digitalSection?.engagementNote}</p>
        </div>
      </section>

      {/* Projects */}
      <section className="shell work-section" style={{ paddingTop: 0 }}>
        <SectionLead
          number="03 — 06"
          eyebrow="Selected work"
          title={<>Making space for<br /><em>what’s next.</em></>}
          copy="Across sectors and scales, our work is defined by one constant: an uncompromising commitment to the outcome."
          action={<TextLink to="/projects">View all projects</TextLink>}
        />
        <div className="home-project-grid">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.08}>
              <ProjectCard project={project} featured={index === 0} showFacts />
            </Reveal>
          ))}
        </div>
      </section>

      <Marquee text="BUILD WITH INTENT" />

      {/* Capability band */}
      <section className="capability-band">
        <div className="capability-image">
          <img src={home.capabilityBand?.image} alt="Coordinated construction drawings on a work table" loading="lazy" />
        </div>
        <div className="capability-copy">
          <Eyebrow inverse>{home.capabilityBand?.eyebrow || 'Integrated delivery'}</Eyebrow>
          <h2>{home.capabilityBand?.title}</h2>
          <p>{home.capabilityBand?.text}</p>
          <CheckList items={home.capabilityBand?.bullets || []} />
          <div className="button-row">
            <Link to="/services" className="button button-acid">How we deliver <ArrowUpRight size={16} /></Link>
            <Link to="/equipment" className="button button-outline-inverse">Our plant &amp; equipment</Link>
          </div>
        </div>
      </section>

      {/* HSE teaser */}
      <section className="shell hse-teaser">
        <Reveal>
          <Eyebrow>{home.hseTeaser?.eyebrow}</Eyebrow>
          <h2 style={{ margin: '1rem 0 1.1rem' }}>{home.hseTeaser?.title}</h2>
          <p className="lead">{home.hseTeaser?.text}</p>
          <div className="hse-metrics" style={{ borderTopColor: 'var(--line)' }}>
            {(home.hseTeaser?.metrics || []).map((metric) => (
              <div key={metric.label}>
                <strong>{metric.value}</strong>
                <span style={{ color: 'var(--muted)' }}>{metric.label}</span>
              </div>
            ))}
          </div>
          <div className="button-row" style={{ marginTop: '1.6rem' }}>
            <Link className="button" to="/hse">Safety, quality &amp; environment <ArrowUpRight size={16} /></Link>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <img src={home.hseTeaser?.image} alt="Ananta site team during a safety briefing" loading="lazy" />
        </Reveal>
      </section>

      {/* Sectors */}
      {sectors.length ? (
        <section className="section-tight" style={{ background: 'var(--sand-2)' }}>
          <div className="shell">
            <SectionLead
              number="04 — 06"
              eyebrow="Sectors we serve"
              title={<>Deep experience in the places<br />that <em>matter most.</em></>}
              action={<TextLink to="/sectors">Explore all sectors</TextLink>}
            />
            <div className="sector-grid">
              {sectors.slice(0, 3).map((sector, index) => (
                <Reveal key={sector.slug} delay={index * 0.08}><SectorCard sector={sector} /></Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Process */}
      <section className="shell work-section">
        <SectionLead
          number="05 — 06"
          eyebrow={home.processSection?.eyebrow || 'How we work'}
          title={home.processSection?.title}
          copy="A five-stage method the whole team can see, from the first conversation to long-term asset performance."
          action={<TextLink to="/services/construction-management">See how we manage delivery</TextLink>}
        />
        <ProcessGrid steps={(site.process?.steps || []).slice(0, 4)} />
      </section>

      {/* Testimonials */}
      {testimonials.length ? (
        <section className="section-tight" style={{ background: 'var(--ink)', color: 'var(--white)' }}>
          <div className="shell">
            <div className="eyebrow-row" style={{ marginBottom: '1.6rem' }}>
              <div>
                <Eyebrow inverse>{home.testimonialsSection?.eyebrow}</Eyebrow>
                <h2 style={{ marginTop: '0.9rem', maxWidth: '22ch' }}>{home.testimonialsSection?.title}</h2>
              </div>
              <Link className="button button-light" to="/clients">All client feedback <ArrowUpRight size={16} /></Link>
            </div>
            <Slider controlsLabel="client statements">
              {testimonials.map((testimonial) => (
                <div className="quote-card" key={testimonial.id} style={{ background: 'var(--ink-2)', borderColor: 'rgba(249,248,245,0.14)', color: 'var(--white)' }}>
                  <span className="quote-mark" aria-hidden>“</span>
                  <blockquote style={{ color: 'var(--white)' }}>{testimonial.quote}</blockquote>
                  <footer>
                    <b style={{ color: 'var(--white)' }}>{testimonial.author}</b>
                    <span style={{ color: 'var(--muted-inverse)' }}>{testimonial.role}</span>
                  </footer>
                </div>
              ))}
            </Slider>
          </div>
        </section>
      ) : null}

      {/* Insights */}
      <section className="shell work-section">
        <SectionLead
          number="06 — 06"
          eyebrow="Perspectives"
          title={<>Looking ahead,<br /><em>on the ground.</em></>}
          action={<TextLink to="/insights">Read all insights</TextLink>}
        />
        <div className="insights-grid">
          {insights.map((insight, index) => (
            <Reveal key={insight.slug} delay={index * 0.07}><InsightCard insight={insight} /></Reveal>
          ))}
        </div>
      </section>

      <section className="shell support-strip">
        <div>
          <span className="support-strip-icon"><Mail size={18} /></span>
          <div>
            <b>Any question, one inbox.</b>
            <p>Construction, digital, careers, tenders or a general query — write to us and it is routed to the right team the same day.</p>
          </div>
        </div>
        <a className="support-strip-mail" href={`mailto:${site.company?.supportEmail || site.company?.email || 'support@anantainfratechsolutions.com'}`}>
          {site.company?.supportEmail || site.company?.email || 'support@anantainfratechsolutions.com'} <ArrowUpRight size={16} />
        </a>
      </section>

      <CtaSlab
        eyebrow={home.ctaSection?.eyebrow}
        title={home.ctaSection?.title}
        text={home.ctaSection?.text}
        image={home.ctaSection?.image}
        primary={{ to: '/contact', label: 'Start a conversation' }}
        secondary={{ to: '/careers', label: 'Work with us' }}
      />
    </main>
  )
}
