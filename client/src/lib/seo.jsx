import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useContent } from './site'

/** Upserts a <meta> tag in the document head. */
function setMeta(attribute, key, content) {
  if (!content) return
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setLink(rel, href) {
  if (!href) return
  let tag = document.head.querySelector(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

const absolute = (url, base) => {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  return `${base.replace(/\/$/, '')}${url.startsWith('/') ? url : `/${url}`}`
}

/**
 * Per-route document head: title, description, canonical, Open Graph, Twitter card
 * and optional JSON-LD structured data.
 */
export function Seo({ title, description, image, type = 'website', jsonLd, noIndex = false, path }) {
  // const { site } = useContent()
  const site = useContent()
  const location = useLocation()

  useEffect(() => {
    const meta = site.meta || {}
    const base = meta.siteUrl || window.location.origin
    const pageTitle = title
      ? (meta.titleTemplate || '%s').replace('%s', title)
      : meta.defaultTitle || 'Ananta Infratech Solutions'
    const pageDescription = description || meta.description || ''
    const canonicalPath = path || location.pathname
    const canonical = `${base.replace(/\/$/, '')}${canonicalPath}`

    document.title = pageTitle
    setMeta('name', 'description', pageDescription)
    if (meta.keywords?.length) setMeta('name', 'keywords', meta.keywords.join(', '))
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow')
    setMeta('name', 'theme-color', meta.themeColor || '#141d23')

    setLink('canonical', canonical)

    setMeta('property', 'og:title', pageTitle)
    setMeta('property', 'og:description', pageDescription)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:url', canonical)
    setMeta('property', 'og:site_name', site.company?.name || 'Ananta Infratech Solutions')
    setMeta('property', 'og:image', absolute(image || meta.ogImage, base))
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', pageTitle)
    setMeta('name', 'twitter:description', pageDescription)
    setMeta('name', 'twitter:image', absolute(image || meta.ogImage, base))
    if (meta.twitterHandle) setMeta('name', 'twitter:site', meta.twitterHandle)

    const id = 'ananta-route-jsonld'
    document.getElementById(id)?.remove()
    if (jsonLd) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = id
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }
  }, [title, description, image, type, jsonLd, noIndex, path, location.pathname, site])

  return null
}

/** Organisation schema used on the home page and contact page. */
export function organisationSchema(site) {
  const c = site.company || {}
  return {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: c.name,
    legalName: c.legalName,
    description: site.meta?.description,
    url: site.meta?.siteUrl,
    email: c.email,
    telephone: c.phone,
    foundingDate: c.founded,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Juhu Tara Road, Juhu',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400049',
      addressCountry: 'IN'
    },
    areaServed: ['Maharashtra', 'Delhi NCR', 'Gujarat', 'Karnataka', 'Telangana'],
    sameAs: [c.linkedin, c.instagram, c.facebook, c.youtube].filter(Boolean)
  }
}

export function breadcrumbSchema(base, trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${base.replace(/\/$/, '')}${item.to}`
    }))
  }
}
