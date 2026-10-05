import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SiteContext = createContext(null)

// Preview mode: the admin panel embeds the site in an iframe named "ananta-preview"
// (loaded with ?preview=1) and streams draft content into it with postMessage.
export const IS_PREVIEW = typeof window !== 'undefined' &&
  (new URLSearchParams(window.location.search).get('preview') === '1' || window.name === 'ananta-preview')

// Build a URL for a sibling app on another port. Works for localhost:7000 style
// hosts as well as proxied hosts like 7000-sandbox.e2b.app.
export const portUrl = (port) => {
  const { protocol, host, hostname } = window.location
  const proxied = host.match(/^\d+(-.+)$/)
  if (proxied) return `${protocol}//${port}${proxied[1]}`
  return `${protocol}//${hostname}:${port}`
}

// Scroll a section into view and flash it so the editor can point at what changed.
function flashSection(selector) {
  let tries = 0
  const attempt = () => {
    const el = document.querySelector(selector)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      document.querySelectorAll('.preview-flash').forEach(node => node.classList.remove('preview-flash'))
      el.classList.add('preview-flash')
      clearTimeout(el._anantaFlash)
      el._anantaFlash = setTimeout(() => el.classList.remove('preview-flash'), 2200)
    } else if (++tries < 25) setTimeout(attempt, 120)
  }
  setTimeout(attempt, 80)
}

export function SiteProvider({ children }) {
  const [site, setSite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const navigate = useNavigate()
  const refresh = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/site')
      if (!response.ok) throw new Error('Site content could not load')
      setSite(await response.json()); setError(false)
    } catch (err) { console.error(err); if (!IS_PREVIEW) setError(true) }
    finally { setLoading(false) }
  }
  useEffect(() => { refresh() }, [])
  useEffect(() => {
    if (!IS_PREVIEW) return
    const onMessage = (event) => {
      const data = event.data
      if (!data || typeof data !== 'object') return
      if (data.type === 'ananta:site' && data.site && typeof data.site === 'object') {
        setSite(data.site); setLoading(false); setError(false)
      }
      if (data.type === 'ananta:locate') {
        if (data.page && window.location.pathname !== data.page) navigate(data.page)
        if (data.selector) flashSection(data.selector)
      }
    }
    window.addEventListener('message', onMessage)
    try { window.parent?.postMessage({ type: 'ananta:ready' }, '*') } catch { /* no parent */ }
    return () => window.removeEventListener('message', onMessage)
  }, [navigate])
  return <SiteContext.Provider value={{ site, setSite, loading, error, refresh }}>{children}</SiteContext.Provider>
}
export const useSite = () => useContext(SiteContext)
