import { Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { SiteProvider, useSite } from './lib/site'
import { useImageFallback } from './lib/images'
import { ToastProvider } from './components/Toast'
import ErrorBoundary from './components/ErrorBoundary'
import { ConnectionError, CookieNotice, Footer, Header, PageLoader, PreviewBanner, ScrollProgress, ToTop } from './components/Layout'

/* Public pages are code-split so the first paint stays fast. */
import Home from './pages/Home'
const About = lazy(() => import('./pages/About'))
const Leadership = lazy(() => import('./pages/Leadership'))
const HSE = lazy(() => import('./pages/HSE'))
const Sustainability = lazy(() => import('./pages/Sustainability'))
const Awards = lazy(() => import('./pages/Awards'))
const Clients = lazy(() => import('./pages/Clients'))
const Equipment = lazy(() => import('./pages/Equipment'))
const Newsroom = lazy(() => import('./pages/Newsroom'))
const Services = lazy(() => import('./pages/Services'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const Sectors = lazy(() => import('./pages/Sectors'))
const SectorDetail = lazy(() => import('./pages/SectorDetail'))
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Insights = lazy(() => import('./pages/Insights'))
const InsightDetail = lazy(() => import('./pages/InsightDetail'))
const Careers = lazy(() => import('./pages/Careers'))
const JobDetail = lazy(() => import('./pages/JobDetail'))
const Register = lazy(() => import('./pages/Register'))
const Tenders = lazy(() => import('./pages/Tenders'))
const Downloads = lazy(() => import('./pages/Downloads'))
const Faq = lazy(() => import('./pages/Faq'))
const Track = lazy(() => import('./pages/Track'))
const SitemapPage = lazy(() => import('./pages/SitemapPage'))
const Policy = lazy(() => import('./pages/Policy'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

/* The CMS is a much larger bundle and is only needed at /admin. */
const AdminApp = lazy(() => import('./pages/admin/AdminApp'))

function RouteFallback() {
  return (
    <div className="shell" style={{ paddingTop: 'calc(var(--header-h) + 3rem)', paddingBottom: '4rem' }}>
      <div className="skeleton" style={{ height: 420, marginBottom: '1.5rem' }} />
      <div className="skeleton" style={{ height: 16, width: '42%', marginBottom: '0.7rem' }} />
      <div className="skeleton" style={{ height: 16, width: '64%' }} />
    </div>
  )
}

function SiteFrame() {
  const { loading, error, refresh } = useSite()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  // Any image that fails to load degrades to an on-brand placeholder instead of
  // leaving a broken box in the layout.
  useImageFallback()

  if (isAdmin) {
    return (
      <Suspense fallback={<PageLoader label="Opening the content portal" />}>
        <AdminApp />
      </Suspense>
    )
  }

  if (loading) return <PageLoader />
  if (error) return <ConnectionError onRetry={refresh} message={error} />

  return (
    <div className="page-shell">
      <ScrollProgress />
      <Header />
      <ErrorBoundary>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/leadership" element={<Leadership />} />
            <Route path="/hse" element={<HSE />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/awards" element={<Awards />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/newsroom" element={<Newsroom />} />

            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/sectors" element={<Sectors />} />
            <Route path="/sectors/:slug" element={<SectorDetail />} />

            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />

            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/:slug" element={<InsightDetail />} />

            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/:id" element={<JobDetail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tenders" element={<Tenders />} />

            <Route path="/downloads" element={<Downloads />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/track" element={<Track />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            <Route path="/policy/:slug" element={<Policy />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Footer />
      <ToTop />
      <CookieNotice />
      <PreviewBanner />
    </div>
  )
}

export default function App({ initialSite = null }) {
  return (
    <SiteProvider initialSite={initialSite}>
      <ToastProvider>
        <ErrorBoundary>
          <SiteFrame />
        </ErrorBoundary>
      </ToastProvider>
    </SiteProvider>
  )
}
