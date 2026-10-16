/**
 * Default site content.
 *
 * The whole public website is driven by this single object. It is composed from
 * the modular files in `./content` so that the admin portal can present clear,
 * separate editors while the API continues to serve one content document.
 *
 * If a stored CMS record is missing a section (for example, a site saved before
 * a new page was added), `mergeWithDefaults` in lib/content.js fills the gap
 * with the values below.
 */
import { meta, company, badges, offices, contact, footer, policies } from './content/company.js'
import { servicesIntro, services, sectorsIntro, sectors, process } from './content/services.js'
import { projectsIntro, projects } from './content/projects.js'
import { leadershipIntro, leadership, teamIntro, teamStats, departments, clients, testimonials, awards, certifications, csr } from './content/people.js'
import {
  home, about, sustainability, hse, equipment, insights, newsroom, tenders,
  downloads, faq, careers, jobs, register, nav, sitemap
} from './content/pages.js'

export const defaultSite = {
  meta,
  company,
  badges,
  offices,
  contact,
  footer,
  policies,

  nav,
  sitemap,

  home,
  about,
  leadershipIntro,
  leadership,
  teamIntro,
  teamStats,
  departments,
  csr,

  servicesIntro,
  services,
  sectorsIntro,
  sectors,
  process,

  projectsIntro,
  projects,

  clients,
  testimonials,
  awards,
  certifications,

  sustainability,
  hse,
  equipment,

  insights,
  newsroom,

  careers,
  jobs,
  register,
  tenders,
  downloads,
  faq
}

export default defaultSite
