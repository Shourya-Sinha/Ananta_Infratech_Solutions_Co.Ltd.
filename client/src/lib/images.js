import { useEffect } from 'react'

/**
 * A neutral, on-brand placeholder used whenever an image cannot be loaded —
 * a deleted upload, a mistyped URL entered in the CMS, or a slow connection
 * that gives up. Keeping it inline means it is always available, even offline.
 */
export const FALLBACK_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="Image unavailable">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#efece5"/>
      <stop offset="100%" stop-color="#dedad0"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g)"/>
  <g fill="none" stroke="#b9b3a5" stroke-width="3">
    <rect x="300" y="250" width="200" height="140"/>
    <path d="M300 300h200M370 250v140M430 300v90"/>
  </g>
  <text x="400" y="440" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="22" fill="#8d8878">Image unavailable</text>
</svg>`)}`

/**
 * Global safety net for images.
 *
 * Any `<img>` on the site that fails to load is swapped for the placeholder
 * above, once. A per-element `data-fallback` attribute (set when the CMS knows
 * a sensible second choice) takes priority. This keeps a broken photograph from
 * ever collapsing a page layout, and works for images the CMS user adds later.
 */
export function useImageFallback() {
  useEffect(() => {
    const handler = (event) => {
      const element = event.target
      if (!element || element.tagName !== 'IMG' || element.dataset.fallbackApplied) return
      element.dataset.fallbackApplied = '1'
      const preferred = element.dataset.fallback
      if (preferred && preferred !== element.getAttribute('src')) {
        element.src = preferred
        delete element.dataset.fallbackApplied
        return
      }
      element.src = FALLBACK_IMAGE
      element.classList.add('image-fallback')
    }
    document.addEventListener('error', handler, true)
    return () => document.removeEventListener('error', handler, true)
  }, [])
}

/** True for URLs we know point somewhere else on the internet. */
export const isRemoteImage = (value) => /^https?:\/\//i.test(String(value || ''))
