import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { readToken } from './api'

const SiteContext = createContext(null)

/**
 * Loads the whole website content document once and shares it through context.
 *
 * `preview` switches every page to the admin working draft, which is what powers
 * the "Preview draft" mode inside the CMS. Preview state is remembered in
 * sessionStorage so a reload keeps you in preview.
 */
export function SiteProvider({ children, initialSite = null }) {
  const [site, setSite] = useState(initialSite)
  const [loading, setLoading] = useState(!initialSite)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(() => {
    try { return sessionStorage.getItem('ananta-preview') === '1' } catch { return false }
  })

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = readToken()
      const usePreview = preview && token
      const response = await fetch(usePreview ? '/api/site?preview=1' : '/api/site', {
        headers: usePreview ? { Authorization: `Bearer ${token}` } : undefined
      })
      if (!response.ok) throw new Error('Content service unavailable')
      const data = await response.json()
      setSite(data)
      setPreview(Boolean(data.__preview))
    } catch (err) {
      console.error(err)
      setError(err.message || 'Content could not be loaded')
    } finally {
      setLoading(false)
    }
  }, [preview])

  // `initialSite` lets tests and server rendering mount the tree with content
  // already resolved instead of waiting for the network round-trip.
  useEffect(() => { if (!initialSite) load() }, [load, initialSite])

  const togglePreview = useCallback((next) => {
    setPreview((current) => {
      const value = typeof next === 'boolean' ? next : !current
      try { sessionStorage.setItem('ananta-preview', value ? '1' : '0') } catch { /* ignore */ }
      return value
    })
  }, [])

  const value = useMemo(
    () => ({ site, setSite, loading, error, refresh: load, preview, togglePreview }),
    [site, loading, error, load, preview, togglePreview]
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export const useSite = () => useContext(SiteContext)

/** Returns the published content or a safe empty shell while loading. */
export function useContent() {
  const { site } = useSite()
  return site || {}
}

/** Scrolls to the top on route change, and honours #hash deep links. */
export function useRouteFocus(pathname, hash) {
  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); return }
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, hash])
}

/**
 * Registration gate.
 *
 * The contractor and worker registration section ships switched off while the
 * portal is being built. Every link, badge and CTA reads its state from here, so
 * opening it is a single CMS toggle rather than a code change — and the site
 * never claims a form is live when it is not.
 */
export function useRegistration() {
  const site = useContent()
  const config = site.register || {}
  const open = config.enabled === true
  const label = config.status || config.launch?.status || 'Coming soon'
  return {
    open,
    closed: !open,
    label,
    config,
    /** Appends the status to a call-to-action label: "Register … (Coming soon)". */
    suffix: open ? '' : ` · ${label}`
  }
}
