import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { SiteProvider, useSite } from './lib/site'
import { Footer, Header, PageLoader, ScrollProgress } from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Capabilities from './pages/Capabilities'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Sustainability from './pages/Sustainability'
import Insights from './pages/Insights'
import Contact from './pages/Contact'
import Careers from './pages/Careers'
import Admin from './pages/Admin'
import './styles.css'

function SiteFrame(){const {loading,error}=useSite();const location=useLocation();const isAdmin=location.pathname.startsWith('/admin');if(loading)return <PageLoader/>;if(error)return <div className="connection-error"><h1>We’re preparing the site.</h1><p>The content service is taking a moment. Please refresh to continue.</p></div>;return <>{!isAdmin&&<><ScrollProgress/><Header/></>}<Routes><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/capabilities" element={<Capabilities/>}/><Route path="/projects" element={<Projects/>}/><Route path="/projects/:id" element={<ProjectDetail/>}/><Route path="/sustainability" element={<Sustainability/>}/><Route path="/insights" element={<Insights/>}/><Route path="/contact" element={<Contact/>}/><Route path="/careers" element={<Careers/>}/><Route path="/admin" element={<Admin/>}/><Route path="*" element={<NotFound/>}/></Routes>{!isAdmin&&<Footer/>}</>}
function NotFound(){return <main className="not-found"><p className="eyebrow"><i/>404</p><h1>That page<br/><em>is not built yet.</em></h1><a className="button" href="/">Return home</a></main>}
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><SiteProvider><SiteFrame/></SiteProvider></BrowserRouter></React.StrictMode>)
