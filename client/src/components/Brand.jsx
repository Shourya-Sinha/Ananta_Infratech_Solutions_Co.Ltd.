import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../lib/site'

export const PRIMARY_LOGO = '/assets/logo_bg_remove.png'

export default function Brand({ inverse = false, compact = false }) {
  const { site } = useSite()
  const name = site?.company?.name || 'Ananta Infratech Solutions'
  const cmsLogo = typeof site?.company?.logo === 'string' ? site.company.logo.trim() : ''
  // Try the CMS logo first, then always fall back to the bundled brand PNG
  // before dropping to the typographic mark.
  const sources = [...new Set([cmsLogo, PRIMARY_LOGO].filter(Boolean))]
  const [index, setIndex] = useState(0)

  useEffect(() => { setIndex(0) }, [cmsLogo])

  const source = sources[index]
  return <Link className={`brand ${inverse ? 'brand-inverse' : ''} ${compact ? 'brand-compact' : ''}`} to="/" aria-label={`${name} home`}>
    {source
      ? <img className="brand-image" src={source} alt={`${name} logo`} onError={() => setIndex((current) => current + 1)} />
      : <span className="brand-mark">A</span>}
    <span className="brand-type"><b>ANANTA</b><small>INFRATECH SOLUTIONS</small></span>
  </Link>
}
