import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Brand from './Brand'
import { useSite } from '../lib/site'

const navigation = [
  ['About us', '/about'], ['Capabilities', '/capabilities'], ['Projects', '/projects'], ['Sustainability', '/sustainability'], ['Insights', '/insights']
]
export function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  useEffect(() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'instant' }) }, [location.pathname])
  return <header className="site-header">
    <Brand />
    <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(([label, to]) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav>
    <div className="header-actions"><Link to="/contact" className="header-contact">Start a conversation <ArrowUpRight size={15}/></Link><button className="menu-toggle" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={24}/></button></div>
    <AnimatePresence>{open && <motion.div className="mobile-menu" initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }} animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }} exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: .42, ease: [0.76,0,0.24,1] }}>
      <div className="mobile-menu-top"><Brand inverse/><button onClick={() => setOpen(false)} aria-label="Close menu"><X size={27}/></button></div>
      <nav>{navigation.map(([label, to], index) => <Link style={{ '--i': index }} key={to} to={to}><span>0{index + 1}</span>{label}<ArrowUpRight size={20}/></Link>)}<Link to="/contact"><span>06</span>Contact<ArrowUpRight size={20}/></Link></nav>
      <div className="mobile-menu-bottom"><p>Juhu, Mumbai<br/>Maharashtra 400049</p><Link to="/admin">Client portal</Link></div>
    </motion.div>}</AnimatePresence>
  </header>
}
export function Footer() {
  const { site } = useSite(); const c = site?.company || {}
  return <footer className="site-footer">
    <div className="footer-top"><p className="eyebrow">Ready when you are</p><h2>Let’s make a <em>lasting</em><br/>difference.</h2><Link to="/contact" className="circle-link" aria-label="Contact Ananta"><ArrowUpRight size={29}/></Link></div>
    <div className="footer-grid"><div><Brand inverse/><p className="footer-tagline">{c.tagline}</p></div><div><span>Explore</span><Link to="/about">About us</Link><Link to="/capabilities">Capabilities</Link><Link to="/projects">Projects</Link><Link to="/sustainability">Sustainability</Link></div><div><span>Connect</span><a href={`mailto:${c.email || ''}`}>{c.email || 'hello@anantainfratech.com'}</a><a href={`tel:${(c.phone || '').replace(/\s/g,'')}`}>{c.phone || '+91 22 4968 2016'}</a><p>{c.address || 'Juhu, Mumbai, Maharashtra'}</p></div><div><span>Follow</span><a target="_blank" rel="noreferrer" href={c.linkedin || '#'}><span className="social-glyph">in</span> LinkedIn</a><a target="_blank" rel="noreferrer" href={c.instagram || '#'}><span className="social-glyph">◎</span> Instagram</a><Link to="/admin">Client portal</Link></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Ananta Infratech Solutions</span><span>Building the future, connecting the dots.</span><a href="#top">Back to top ↑</a></div>
  </footer>
}
export function PageLoader(){ return <div className="page-loader"><div className="loader-mark">A</div><p>Building clarity</p></div> }
export function ScrollProgress(){ const [progress,setProgress]=useState(0); useEffect(()=>{const update=()=>setProgress(window.scrollY / Math.max(document.body.scrollHeight-window.innerHeight, 1)*100); update(); addEventListener('scroll',update,{passive:true});return()=>removeEventListener('scroll',update)},[]);return <div className="scroll-progress" style={{transform:`scaleX(${progress/100})`}}/> }
