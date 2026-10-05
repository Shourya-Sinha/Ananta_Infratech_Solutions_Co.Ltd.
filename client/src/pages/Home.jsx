import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, MoveDown } from 'lucide-react'
import { useSite } from '../lib/site'
import { Eyebrow, Marquee, ProjectCard, Reveal, Rich, SectionLead, TextLink } from '../components/Blocks'

export default function Home() {
  const { site } = useSite(); const h = site.home; const projects = site.projects.slice(0,3)
  return <main>
    <section className="home-hero">
      <div className="hero-media">
        {h.heroVideo && <video autoPlay muted loop playsInline poster={h.heroImage}><source src={h.heroVideo} type="video/mp4"/></video>}
        <img className={h.heroVideo ? 'hero-poster' : ''} src={h.heroImage} alt="Construction site at dusk"/>
      </div><div className="hero-shade"></div><div className="grid-overlay"></div>
      <div className="hero-topline"><span>{h.eyebrow}</span><span>Scroll to explore <MoveDown size={15}/></span></div>
      <div className="hero-copy"><motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.2}}>Ananta Infratech Solutions</motion.p><motion.h1 initial={{opacity:0,y:65}} animate={{opacity:1,y:0}} transition={{duration:1,delay:.1,ease:[.16,1,.3,1]}}><Rich text={h.heroTitle || 'We make\n*ambitious* places\npossible.'}/></motion.h1><motion.div className="hero-bottom" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.75}}><p>{h.heroText}</p><Link to="/projects" className="hero-button">Explore our work <ArrowUpRight size={20}/></Link></motion.div></div>
      <a className="hero-scroll" href="#approach"><ArrowDown size={17}/><span>Scroll to discover</span></a>
    </section>
    <section id="approach" className="statement-section"><div className="statement-aside"><Eyebrow>{h.manifestoLabel}</Eyebrow><span>01 — 05</span></div><Reveal className="statement-content"><h2>{h.manifestoTitle}</h2><p>{h.manifestoText}</p><TextLink to="/about">Discover Ananta</TextLink></Reveal></section>
    <section className="stats-strip">{h.stats.map((stat,i)=><Reveal key={stat.label} delay={i*.08}><strong>{stat.value}</strong><span>{stat.label}</span></Reveal>)}</section>
    <section className="signature-image"><img src={h.signatureImage} alt="Ananta construction team reviewing a high-rise workfront"/><div className="signature-caption"><span>{h.signatureCaptionLeft}</span><span>{h.signatureCaptionRight}</span></div></section>
    <section className="work-section"><SectionLead number="02 — 05" eyebrow="Selected work" title={<>Making space for<br/><em>what’s next.</em></>} copy="Across sectors and scales, our work is defined by one constant: an uncompromising commitment to the outcome." action={<TextLink to="/projects">View all projects</TextLink>}/><div className="home-project-grid">{projects.map((p,i)=><Reveal key={p.id} delay={i*.1}><ProjectCard project={p} featured={i===0}/></Reveal>)}</div></section>
    <Marquee text="BUILD WITH INTENT" />
    <section className="quote-section"><div><Eyebrow>How we think</Eyebrow><span className="quote-index">03 / 05</span></div><Reveal><blockquote>“{h.beliefQuote}”</blockquote><p>— The Ananta delivery promise</p></Reveal></section>
    <section className="capability-band"><div className="capability-image"><img src={h.capabilityImage} alt="Architectural plans on a worktable"/></div><div className="capability-copy"><Eyebrow>Integrated delivery</Eyebrow><h2>Complexity, <em>connected.</em></h2><p>Our specialist teams share one view of the work—from the earliest plan to the final handover. That means fewer hand-offs, faster decisions and a more dependable result.</p><Link to="/capabilities" className="button button-light">How we deliver <ArrowUpRight size={17}/></Link></div></section>
    <section className="home-news"><SectionLead number="04 — 05" eyebrow="Perspectives" title={<>Looking ahead,<br/><em>on the ground.</em></>} action={<TextLink to="/insights">Read all insights</TextLink>}/><div className="news-list">{site.news.map((item,i)=><Link to={`/insights/${item.slug}`} className="news-row" key={item.title}><span>{item.date}</span><span>{item.type}</span><strong>{item.title}</strong><ArrowUpRight size={21}/></Link>)}</div></section>
  </main>
}
