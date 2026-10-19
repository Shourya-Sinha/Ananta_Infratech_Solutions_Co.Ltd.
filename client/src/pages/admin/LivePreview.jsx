import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ExternalLink, Loader2, Maximize2, Minimize2, Monitor, RefreshCw, Smartphone, Tablet, Upload, X
} from 'lucide-react'
import { writeLocalPreview, clearLocalPreview } from '../../lib/site'

/**
 * Live preview.
 *
 * The real public site is rendered in an iframe, with the *unsaved* editor
 * content streamed into it. Nothing is written to the server: the draft lives in
 * localStorage and in a postMessage channel between this window and the frame.
 * Publishing is still the only action that changes what visitors see.
 */
const PATHS = [
  { label: 'Home', path: '/' },
  { label: 'Technology & IT', path: '/technology' },
  { label: 'All services', path: '/services' },
  { label: 'Projects', path: '/projects' },
  { label: 'Sectors', path: '/sectors' },
  { label: 'About', path: '/about' },
  { label: 'Leadership', path: '/leadership' },
  { label: 'Careers', path: '/careers' },
  { label: 'Contact', path: '/contact' },
  { label: 'Tenders', path: '/tenders' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Safety & quality', path: '/hse' },
  { label: 'Sustainability', path: '/sustainability' },
  { label: 'Clients', path: '/clients' },
  { label: 'Insights', path: '/insights' }
]

const DEVICES = [
  { id: 'desktop', label: 'Desktop', icon: Monitor, width: '100%' },
  { id: 'tablet', label: 'Tablet', icon: Tablet, width: 834 },
  { id: 'mobile', label: 'Mobile', icon: Smartphone, width: 390 }
]

/** Suggested preview route for a CMS section. */
export function previewPathFor(section) {
  if (!section) return '/'
  if (section.id === 'services' || section.id === 'sectors' || section.id === 'projects') return `/${section.id}`
  if (section.id === 'jobs' || section.id === 'register') return '/careers'
  if (section.id === 'clientsTestimonials' || section.id === 'awards') return '/clients'
  if (section.id === 'policies') return '/policy/privacy'
  return '/'
}

export default function LivePreview({ content, section, dirty, onPublish, saving, onClose, focus, onFocusChange }) {
  const frameRef = useRef(null)
  const [device, setDevice] = useState('desktop')
  const [path, setPath] = useState(() => (section?.id === 'technology' ? '/technology' : '/'))
  const [loaded, setLoaded] = useState(false)
  const [nonce, setNonce] = useState(0)
  const [lastSync, setLastSync] = useState('')

  /* Follow the section being edited, unless the user has picked a page. */
  useEffect(() => {
    if (section?.id === 'technology') setPath('/technology')
    else if (section?.id === 'services') setPath('/services')
    else if (section?.id === 'home') setPath('/')
  }, [section?.id])

  const push = useCallback(() => {
    if (!content) return
    writeLocalPreview(content)
    const frame = frameRef.current
    try {
      frame?.contentWindow?.postMessage(
        { type: 'ananta:preview', content, dirty, at: Date.now() },
        window.location.origin
      )
    } catch { /* the frame may not be ready yet; it reads localStorage on load */ }
    setLastSync(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
  }, [content, dirty])

  /* Debounced streaming keeps typing smooth while the preview stays current. */
  useEffect(() => {
    if (!loaded) return undefined
    const timer = setTimeout(push, 450)
    return () => clearTimeout(timer)
  }, [content, dirty, loaded, push])

  const src = `${path}${path.includes('?') ? '&' : '?'}cmsPreview=1`

  const reload = () => {
    setLoaded(false)
    setNonce((value) => value + 1)
  }

  const openTab = () => {
    writeLocalPreview(content)
    window.open(src, '_blank', 'noopener')
  }

  const currentDevice = DEVICES.find((item) => item.id === device) || DEVICES[0]

  return (
    <aside className={`admin-preview ${focus ? 'is-focus' : ''}`} aria-label="Live website preview">
      <div className="admin-preview-bar">
        <span className="admin-preview-live"><i /> Live preview</span>
        <div className="admin-preview-devices">
          {DEVICES.map((item) => (
            <button
              key={item.id}
              type="button"
              title={item.label}
              aria-label={item.label}
              aria-pressed={device === item.id}
              className={device === item.id ? 'is-active' : ''}
              onClick={() => setDevice(item.id)}
            >
              <item.icon size={14} />
            </button>
          ))}
        </div>
        <button
          type="button"
          title={focus ? 'Give the form more room' : 'Expand the preview'}
          aria-label={focus ? 'Shrink preview' : 'Expand preview'}
          aria-pressed={Boolean(focus)}
          className={focus ? 'is-active' : ''}
          onClick={() => onFocusChange?.(!focus)}
        >
          {focus ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
        <button type="button" title="Reload preview" onClick={reload}><RefreshCw size={14} /></button>
        <button type="button" title="Open in a new tab" onClick={openTab}><ExternalLink size={14} /></button>
        <button type="button" title="Hide preview" onClick={() => { clearLocalPreview(); onClose?.() }}><X size={14} /></button>
      </div>

      <div className="admin-preview-toolbar">
        <select value={path} onChange={(event) => { setPath(event.target.value); setLoaded(false) }} aria-label="Page to preview">
          {PATHS.map((item) => <option key={item.path} value={item.path}>{item.label}</option>)}
          {(content?.services || []).map((service) => (
            <option key={service.slug} value={`/services/${service.slug}`}>{service.short || service.title}</option>
          ))}
        </select>
        <span className={`admin-preview-state ${dirty ? 'is-dirty' : ''}`}>
          {dirty ? 'Unsaved changes' : 'All saved'}{lastSync ? ` · synced ${lastSync}` : ''}
        </span>
      </div>

      <div className="admin-preview-stage" data-device={device}>
        <div className="admin-preview-frame" style={{ width: currentDevice.width === '100%' ? '100%' : `${currentDevice.width}px` }}>
          {!loaded ? <div className="admin-preview-loading"><Loader2 size={16} className="spin" /> Rendering the live site…</div> : null}
          <iframe
            key={`${path}-${nonce}`}
            ref={frameRef}
            src={src}
            title="Website preview"
            onLoad={() => { setLoaded(true); setTimeout(push, 120) }}
          />
        </div>
      </div>

      <div className="admin-preview-foot">
        <span>Preview only — visitors still see the published site.</span>
        <button type="button" className="button button-sm button-acid" disabled={saving} onClick={onPublish}>
          {saving ? <><Loader2 size={13} className="spin" /> Publishing…</> : <><Upload size={13} /> Publish live</>}
        </button>
      </div>
    </aside>
  )
}
