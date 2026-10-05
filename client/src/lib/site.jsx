import { createContext, useContext, useEffect, useState } from 'react'

const SiteContext = createContext(null)
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
    } catch (err) { console.error(err); setError(true) }
    finally { setLoading(false) }
  }
  useEffect(() => { refresh() }, [])
  return <SiteContext.Provider value={{ site, setSite, loading, error, refresh }}>{children}</SiteContext.Provider>
}
export const useSite = () => useContext(SiteContext)
