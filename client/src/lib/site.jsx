import { createContext, useContext, useEffect, useState } from 'react'

const SiteContext = createContext(null)

// Preview mode: the admin panel embeds the site in an iframe named "ananta-preview"
// (loaded with ?preview=1) and streams draft content into it with postMessage.
export const IS_PREVIEW = typeof window !== 'undefined' &&
  (new URLSearchParams(window.location.search).get('preview') === '1' || window.name === 'ananta-preview')

export function SiteProvider({ children }) {
  const [site, setSite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
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
      if (data && data.type === 'ananta:site' && data.site && typeof data.site === 'object') {
        setSite(data.site); setLoading(false); setError(false)
      }
    }
    window.addEventListener('message', onMessage)
    try { window.parent?.postMessage({ type: 'ananta:ready' }, '*') } catch { /* no parent */ }
    return () => window.removeEventListener('message', onMessage)
  }, [])
  return <SiteContext.Provider value={{ site, setSite, loading, error, refresh }}>{children}</SiteContext.Provider>
}
export const useSite = () => useContext(SiteContext)
