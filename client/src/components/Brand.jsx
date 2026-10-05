import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../lib/site'

export default function Brand({ inverse = false, compact = false }) {
  const { site } = useSite()
  const [broken, setBroken] = useState(false)
  const name = site?.company?.name || 'Ananta Infratech Solutions'
  const logo = site?.company?.logo || '/assets/logo_bg_remove.png'
  return <Link className={`brand ${inverse ? 'brand-inverse' : ''} ${compact ? 'brand-compact' : ''}`} to="/" aria-label={`${name} home`}>
    {!broken ? <img className="brand-image" src={logo} alt={`${name} logo`} onError={() => setBroken(true)} /> : <span className="brand-mark">A</span>}
    <span className="brand-type"><b>ANANTA</b><small>INFRATECH SOLUTIONS</small></span>
  </Link>
}
