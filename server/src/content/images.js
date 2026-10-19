/**
 * Central image registry.
 *
 * Every default image ships inside `client/public/assets`, so the site is fully
 * self-contained: it renders identically on a laptop with no internet, inside a
 * sandboxed preview, and on the live server. Nothing here depends on a third
 * party CDN, which also removes an external point of failure on load time.
 *
 * Any value can be overridden from Admin → Content (or by uploading a
 * replacement in the media library) without touching this file.
 */
export const img = {
  /* --- site & brand photography --- */
  hero: '/assets/hero-site.jpg',
  heroAlt: '/assets/hero-site-2.jpg',
  signature: '/assets/ananta-signature-structure.jpg',
  equipment: '/assets/equipment-fleet.jpg',
  equipment2: '/assets/equipment-plant.jpg',

  /* --- sectors --- */
  sectorCommercial: '/assets/sector-commercial.jpg',
  sectorResidential: '/assets/sector-residential.jpg',
  sectorIndustrial: '/assets/sector-industrial.jpg',
  sectorHospitality: '/assets/sector-hospitality.jpg',
  sectorHealthcare: '/assets/sector-healthcare.jpg',
  sectorInfrastructure: '/assets/sector-infrastructure.jpg',

  /* --- people, safety and quality --- */
  aboutStory: '/assets/hero-site.jpg',
  team: '/assets/hero-site-2.jpg',
  safety: '/assets/sector-industrial.jpg',
  hse: '/assets/sector-industrial.jpg',
  quality: '/assets/ananta-signature-structure.jpg',
  culture: '/assets/hero-site-2.jpg',
  training: '/assets/sector-commercial.jpg',

  /* --- projects --- */
  project1: '/assets/sector-commercial.jpg',
  project2: '/assets/sector-residential.jpg',
  project3: '/assets/ananta-signature-structure.jpg',
  project4: '/assets/sector-industrial.jpg',
  project5: '/assets/sector-hospitality.jpg',
  project6: '/assets/hero-site-2.jpg',

  /* --- digital & technology --- */
  digitalHero: '/assets/digital-hero.jpg',
  digitalCms: '/assets/digital-work-cms.jpg',
  digitalChat: '/assets/digital-work-chat.jpg',

  /* --- editorial supporting imagery --- */
  site: '/assets/hero-site.jpg',
  drawings: '/assets/ananta-signature-structure.jpg',
  workplace: '/assets/sector-commercial.jpg',
  people: '/assets/hero-site-2.jpg',
  green: '/assets/sector-residential.jpg',
  green2: '/assets/sector-infrastructure.jpg'
}
