import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../lib/site'

export const PRIMARY_LOGO = '/assets/logo_bg_remove.png'

/**
 * Brand lockup: the CMS logo if it loads, the bundled PNG as a guaranteed
 * fallback, and only then the typographic "A" mark.
 */
export default function Brand({ inverse = false, compact = false }) {
  const { site } = useSite()
  const name = site?.company?.name || 'Ananta Infratech Solutions'
  const cmsLogo = typeof site?.company?.logo === 'string' ? site.company.logo.trim() : ''
  const sources = [...new Set([cmsLogo, PRIMARY_LOGO].filter(Boolean))]
  const [index, setIndex] = useState(0)

  useEffect(() => { setIndex(0) }, [cmsLogo])

  const source = sources[index]
  const classes = `brand ${inverse ? 'brand-inverse' : ''} ${compact ? 'brand-compact' : ''}`.trim()

  return (
    <Link className={classes} to="/" aria-label={`${name} — home`}>
      {source
        ? <img className="brand-image" src={source} alt={`${name} logo`} onError={() => setIndex((current) => current + 1)} />
        : <span className="brand-mark">A</span>}
      <span className="brand-type">
        <b>{site?.company?.shortName || 'ANANTA'}</b>
        <small>INFRATECH SOLUTIONS</small>
      </span>
    </Link>
  )
}
