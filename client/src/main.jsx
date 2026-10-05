import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { IS_PREVIEW, SiteProvider, portUrl, useSite } from './lib/site'
import { Footer, Header, PageLoader, ScrollProgress } from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Capabilities from './pages/Capabilities'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Sustainability from './pages/Sustainability'
import Insights from './pages/Insights'
import InsightDetail from './pages/InsightDetail'
import Contact from './pages/Contact'
import Careers from './pages/Careers'
import Admin from './pages/Admin'
import './styles.css'

// Started with `vite --mode admin` (port 7001) this bundle serves ONLY the admin
// panel; the public website runs separately on port 7000. In production builds
// both live in one app, with the panel under /admin.
export const ADMIN_MODE = import.meta.env.MODE === 'admin'

function PublicRoutes() {
  return <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/about" element={<About/>}/>
    <Route path="/capabilities" element={<Capabilities/>}/>
    <Route path="/projects" element={<Projects/>}/>
    <Route path="/projects/:id" element={<ProjectDetail/>}/>
    <Route path="/sustainability" element={<Sustainability/>}/>
    <Route path="/insights" element={<Insights/>}/>
    <Route path="/insights/:slug" element={<InsightDetail/>}/>
    <Route path="/contact" element={<Contact/>}/>
    <Route path="/careers" element={<Careers/>}/>
    <Route path="/admin" element={<AdminGate/>}/>
    <Route path="*" element={<NotFound/>}/>
  </Routes>
}

function SiteFrame() {
  const { loading, error } = useSite()
  const location = useLocation()
  if (loading) return <PageLoader/>
  if (error) return <div className="connection-error"><h1>We’re preparing the site.</h1><p>The content service is taking a moment. Please refresh to continue.</p></div>
  if (ADMIN_MODE && !IS_PREVIEW) return <Routes><Route path="*" element={<Admin/>}/></Routes>
  const isAdmin = location.pathname.startsWith('/admin')
  return <>
    {!isAdmin && <><ScrollProgress/><Header/></>}
    <PublicRoutes/>
    {!isAdmin && <Footer/>}
  </>
}

function AdminGate() {
  // In development the admin panel lives on its own port (7001).
  if (import.meta.env.DEV && !ADMIN_MODE) {
    return <main className="not-found">
      <p className="eyebrow"><i/>Client portal</p>
      <h1>The admin panel<br/><em>runs on port 7001.</em></h1>
      <a className="button" href={portUrl(7001)}>Open the admin panel ↗</a>
    </main>
  }
  return <Admin/>
}

function NotFound() {
  return <main className="not-found"><p className="eyebrow"><i/>404</p><h1>That page<br/><em>is not built yet.</em></h1><a className="button" href="/">Return home</a></main>
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><BrowserRouter><SiteProvider><SiteFrame/></SiteProvider></BrowserRouter></React.StrictMode>
)
