import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export const Reveal = ({ children, className = '', delay = 0 }) => <motion.div className={className} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: .7, delay, ease: [0.16,1,0.3,1] }}>{children}</motion.div>
export function Eyebrow({ children }) { return <p className="eyebrow"><i></i>{children}</p> }
export function IntroHero({ eyebrow, title, intro, image }) { return <section className="intro-hero"><div className="intro-hero-copy"><Reveal><Eyebrow>{eyebrow}</Eyebrow></Reveal><Reveal delay={.08}><h1>{title}</h1></Reveal><Reveal delay={.16}><p>{intro}</p></Reveal></div>{image && <Reveal className="intro-hero-image" delay={.14}><img src={image} alt=""/></Reveal>}</section> }
export function TextLink({ to, children, light=false }) { return <Link className={`text-link ${light ? 'light' : ''}`} to={to}>{children}<ArrowUpRight size={17}/></Link> }
export function ProjectCard({ project, featured = false }) { return <Link to={`/projects/${project.id || project._id}`} className={`project-card ${featured ? 'project-featured' : ''}`}><div className="project-image"><img src={project.image} alt={project.title}/><span className="project-arrow"><ArrowUpRight size={19}/></span></div><div className="project-meta"><span>{project.category}</span><span>{project.location}</span></div><h3>{project.title}</h3><p>{project.summary}</p></Link> }
export function Marquee({ text = 'BUILD WITH INTENT', inverse = false }) { return <div className={`marquee ${inverse ? 'marquee-inverse' : ''}`}><div>{Array.from({length:5}).map((_,i)=><span key={i}>{text}<b>✳</b></span>)}</div></div> }
export function SectionLead({ number, eyebrow, title, copy, action }) { return <div className="section-lead"><div><span className="section-number">{number}</span><Eyebrow>{eyebrow}</Eyebrow></div><div><h2>{title}</h2>{copy && <p>{copy}</p>}{action}</div></div> }
export function RoundArrow(){return <span className="round-arrow"><ArrowDownRight size={23}/></span>}
