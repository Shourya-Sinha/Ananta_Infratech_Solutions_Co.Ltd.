import { img } from './images.js'

/**
 * Company identity, SEO defaults, global navigation, offices and legal policies.
 * Everything in this object is editable from the admin portal.
 */
export const meta = {
  siteUrl: 'https://anantainfratechsolutions.com',
  titleTemplate: '%s | Ananta Infratech Solutions',
  defaultTitle: 'Ananta Infratech Solutions — Construction, Infrastructure & Digital Technology',
  description:
    'Ananta Infratech Solutions brings construction, infrastructure and digital technology together—delivering projects, custom software, websites, CMS platforms and mobile apps across India.',
  keywords: [
    'construction company India',
    'general contractor Mumbai',
    'infrastructure contractor',
    'EPC contractor India',
    'commercial construction',
    'industrial construction',
    'preconstruction services',
    'construction management',
    'custom software development India',
    'CMS development',
    'web development company',
    'Android and iOS app development',
    'SEO and digital transformation'
  ],
  ogImage: img.hero,
  twitterHandle: '@anantainfra',
  themeColor: '#141d23'
}

export const company = {
  name: 'Ananta Infratech Solutions',
  legalName: 'Ananta Infratech Solutions Pvt. Ltd.',
  shortName: 'ANANTA',
  tagline: 'Building the future, connecting the dots.',
  founded: '2016',
  yearsLabel: 'Since 2016',
  employees: '480+',
  address: 'Sanctuary Co-operative Housing Society, Juhu, Mumbai, Maharashtra 400049, India',
  addressLines: ['Ananta Infratech Solutions', 'Juhu, Mumbai', 'Maharashtra 400049, India'],
  phone: '+91 22 4968 2016',
  phoneAlt: '+91 98200 42016',
  whatsapp: '919820042016',
  email: 'support@anantainfratechsolutions.com',
  technologyEmail: 'support@anantainfratechsolutions.com',
  supportEmail: 'support@anantainfratechsolutions.com',
  careersEmail: 'support@anantainfratechsolutions.com',
  tendersEmail: 'support@anantainfratechsolutions.com',
  vendorEmail: 'support@anantainfratechsolutions.com',
  hrPhone: '+91 22 4968 2020',
  workingHours: 'Monday to Saturday · 09:30 – 18:30 IST',
  linkedin: 'https://www.linkedin.com/company/ananta-infratech-solutions',
  instagram: 'https://www.instagram.com/anantainfratech',
  facebook: 'https://www.facebook.com/anantainfratech',
  youtube: 'https://www.youtube.com/@anantainfratech',
  twitter: 'https://x.com/anantainfra',
  logo: '/assets/logo_bg_remove.png',
  alternateLogo: '/assets/logo_bg_remove.png',
  bio: 'An independent, owner-minded construction, engineering and technology company headquartered in Mumbai, working across eight states with a delivery team of more than 480 engineers, planners, supervisors and trade partners.',
  registrations: [
    { label: 'Registered entity', value: 'Ananta Infratech Solutions Pvt. Ltd.' },
    { label: 'Corporate office', value: 'Juhu, Mumbai — Maharashtra' },
    { label: 'Operating regions', value: 'Maharashtra · Delhi NCR · Gujarat · Karnataka · Telangana' },
    { label: 'Delivery model', value: 'Construction management · General contracting · EPC' }
  ]
}

export const badges = [
  { label: 'Quality management', value: 'ISO 9001:2015 aligned' },
  { label: 'Occupational health & safety', value: 'ISO 45001:2018 aligned' },
  { label: 'Environment', value: 'ISO 14001:2015 aligned' },
  { label: 'Safety record', value: '4.2M+ safe man-hours' }
]

export const offices = [
  {
    id: 'mumbai',
    name: 'Mumbai — Corporate office',
    type: 'Head office',
    address: 'Ananta House, Juhu Tara Road, Juhu, Mumbai, Maharashtra 400049',
    city: 'Mumbai',
    phone: '+91 22 4968 2016',
    email: 'support@anantainfratechsolutions.com',
    hours: 'Mon – Sat · 09:30 – 18:30 IST',
    mapUrl: 'https://www.google.com/maps?q=Juhu,Mumbai&output=embed',
    image: img.hero
  },
  {
    id: 'noida',
    name: 'Delhi NCR — Regional office',
    type: 'Regional office',
    address: 'Tower B, Sector 62, Noida, Gautam Buddha Nagar, Uttar Pradesh 201301',
    city: 'Noida',
    phone: '+91 120 496 2016',
    email: 'support@anantainfratechsolutions.com',
    hours: 'Mon – Sat · 09:30 – 18:30 IST',
    mapUrl: 'https://www.google.com/maps?q=Sector+62+Noida&output=embed',
    image: img.sectorCommercial
  },
  {
    id: 'pune',
    name: 'Pune — Project office',
    type: 'Project office',
    address: 'Baner Road, Pune, Maharashtra 411045',
    city: 'Pune',
    phone: '+91 20 4968 2016',
    email: 'support@anantainfratechsolutions.com',
    hours: 'Mon – Sat · 09:00 – 18:00 IST',
    mapUrl: 'https://www.google.com/maps?q=Baner+Pune&output=embed',
    image: img.sectorIndustrial
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru — Project office',
    type: 'Project office',
    address: 'Outer Ring Road, Bengaluru, Karnataka 560103',
    city: 'Bengaluru',
    phone: '+91 80 4968 2016',
    email: 'support@anantainfratechsolutions.com',
    hours: 'Mon – Sat · 09:00 – 18:00 IST',
    mapUrl: 'https://www.google.com/maps?q=Outer+Ring+Road+Bengaluru&output=embed',
    image: img.sectorHealthcare
  }
]

export const contact = {
  title: 'Let’s create what’s next.',
  intro:
    'Bring us a site, a brief or a problem worth solving. Our Mumbai team responds to every enquiry within one working day.',
  responseNote: 'Every enquiry is acknowledged within 24 working hours and routed to a named project lead.',
  mapUrl: 'https://www.google.com/maps?q=Juhu,Mumbai&output=embed',
  departments: [
    { id: 'new-business', label: 'New business & proposals', email: 'support@anantainfratechsolutions.com', phone: '+91 22 4968 2016', note: 'New projects, joint ventures and developer partnerships.' },
    { id: 'careers', label: 'Careers & recruitment', email: 'support@anantainfratechsolutions.com', phone: '+91 22 4968 2020', note: 'Engineering, planning, HSE, survey and site leadership roles.' },
    { id: 'tenders', label: 'Tenders & procurement', email: 'support@anantainfratechsolutions.com', phone: '+91 22 4968 2031', note: 'Tender invitations, RFP clarifications and prequalification.' },
    { id: 'vendors', label: 'Vendor & subcontractor onboarding', email: 'support@anantainfratechsolutions.com', phone: '+91 22 4968 2044', note: 'Contractor, supplier and specialist trade registration.' },
    { id: 'technology', label: 'Digital & IT services', email: 'support@anantainfratechsolutions.com', phone: '+91 22 4968 2016', note: 'Websites, CMS, apps, custom chat, ERP/CRM, SEO and IT support.' },
    { id: 'media', label: 'Media & communications', email: 'support@anantainfratechsolutions.com', phone: '+91 22 4968 2016', note: 'Press, brand assets and speaking engagements.' },
    { id: 'accounts', label: 'Accounts & compliance', email: 'support@anantainfratechsolutions.com', phone: '+91 22 4968 2050', note: 'Invoices, GST documentation and vendor payments.' }
  ]
}

export const footer = {
  blurb:
    'An integrated construction, engineering and digital technology partner — from physical infrastructure to digital products.',
  cta: {
    eyebrow: 'Ready when you are',
    title: 'Let’s make a lasting difference.',
    linkLabel: 'Contact Ananta',
    linkTo: '/contact'
  },
  /* These are overrides. Empty means "use the Company profile", so editing the
     phone or inbox once updates the whole site instead of two places. */
  contact: {
    label: 'Contact',
    email: '',
    phone: '',
    address: ''
  },
  columns: [
    {
      title: 'Company',
      links: [
        { label: 'About us', to: '/about' },
        { label: 'Leadership', to: '/leadership' },
        { label: 'Awards & certifications', to: '/awards' },
        { label: 'Clients & testimonials', to: '/clients' },
        { label: 'Newsroom', to: '/newsroom' },
        { label: 'Careers', to: '/careers' }
      ]
    },
    {
      title: 'What we do',
      links: [
        { label: 'All services', to: '/services' },
        { label: 'Digital & IT solutions', to: '/technology' },
        { label: 'Websites, CMS & SEO', to: '/services/web-development' },
        { label: 'Android & iOS apps', to: '/services/mobile-app-development' },
        { label: 'Client chat solutions', to: '/services/client-chat-solutions' },
        { label: 'Sectors we serve', to: '/sectors' },
        { label: 'Our projects', to: '/projects' },
        { label: 'Plant & equipment', to: '/equipment' },
        { label: 'Safety, quality & environment', to: '/hse' },
        { label: 'Sustainability & ESG', to: '/sustainability' }
      ]
    },
    {
      title: 'Work with us',
      links: [
        { label: 'Open roles', to: '/careers#open-roles' },
        { label: 'Contractor & worker registration', to: '/register' },
        { label: 'Tenders & e-procurement', to: '/tenders' },
        { label: 'Downloads & brochures', to: '/downloads' },
        { label: 'Frequently asked questions', to: '/faq' },
        { label: 'Track an application', to: '/track' }
      ]
    }
  ],
  legalLinks: [
    { label: 'Privacy policy', to: '/policy/privacy' },
    { label: 'Terms of use', to: '/policy/terms' },
    { label: 'Code of conduct', to: '/policy/code-of-conduct' },
    { label: 'Anti-bribery & integrity', to: '/policy/anti-bribery' },
    { label: 'Whistleblower policy', to: '/policy/whistleblower' },
    { label: 'Sitemap', to: '/sitemap' }
  ],
  inboxEyebrow: 'Any question — construction, technology, careers or procurement',
  supportNote: 'One inbox, routed internally',
  copyright: 'All rights reserved.',
  newsletter: {
    title: 'Project notes & industry perspectives',
    text: 'A short quarterly brief on what we are building, learning and testing. No noise.',
    note: 'By subscribing you agree to our privacy policy. Unsubscribe any time.'
  },
  credit: 'Designed and built in-house by the Ananta digital team.'
}

export const policies = [
  {
    slug: 'privacy',
    title: 'Privacy policy',
    updated: '01 April 2026',
    intro:
      'This policy explains what information Ananta Infratech Solutions collects through this website, why we collect it and how it is protected.',
    sections: [
      { heading: 'Information we collect', body: ['We collect the details you choose to submit through our enquiry, careers, contractor registration and vendor registration forms. This typically includes your name, organisation, email address, telephone number, project information and any document you upload.', 'Our servers also record standard technical information such as browser type, device category and pages visited, used solely to keep the website secure and to understand which information is useful.'] },
      { heading: 'How we use it', body: ['Enquiry and registration data is used to respond to you, to evaluate commercial and employment fit, to meet statutory vendor and labour compliance obligations, and to maintain records of our decisions.', 'We do not sell personal information. We do not use your data for automated decision making.'] },
      { heading: 'Sharing and retention', body: ['Information is accessible only to the Ananta team members who need it for the purpose above. Where a third-party service provider processes data on our behalf — for example document storage or transactional email — they are bound by contract to protect it.', 'Enquiry records are retained for up to 36 months unless a project or statutory obligation requires longer. Contractor and vendor registration records are retained while the registration is active plus the statutory audit period.'] },
      { heading: 'Your rights', body: ['You may request a copy of the information we hold about you, ask for corrections, or ask us to delete records that we are not obliged to retain. Write to support@anantainfratechsolutions.com and we will respond within 30 days.'] }
    ]
  },
  {
    slug: 'terms',
    title: 'Terms of use',
    updated: '01 April 2026',
    intro: 'These terms govern your use of the Ananta Infratech Solutions website and the content published on it.',
    sections: [
      { heading: 'Website content', body: ['Project descriptions, figures, timelines and imagery are published for general information. They describe completed or in-progress work and do not constitute an offer, a warranty or a commitment to deliver a particular scope at a particular price.', 'Any commercial relationship is governed exclusively by a signed contract between Ananta Infratech Solutions and the client.'] },
      { heading: 'Intellectual property', body: ['The Ananta name, wordmark, logo, photography, drawings and written content on this site are owned by or licensed to Ananta Infratech Solutions and may not be reproduced for commercial purposes without written permission.'] },
      { heading: 'Submissions', body: ['By submitting an enquiry, application, tender response or registration you confirm the information is accurate and that you are authorised to share any document you upload.'] },
      { heading: 'Governing law', body: ['These terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts at Mumbai, Maharashtra.'] }
    ]
  },
  {
    slug: 'code-of-conduct',
    title: 'Code of conduct',
    updated: '01 April 2026',
    intro: 'The standard of behaviour we expect from every Ananta employee, trade partner and supplier on every site, every day.',
    sections: [
      { heading: 'Respect on site', body: ['Everyone on an Ananta site is entitled to be treated with dignity. Harassment, discrimination, intimidation and abusive language are grounds for immediate removal from our projects and termination of any contract.'] },
      { heading: 'Safety authority', body: ['Every person — regardless of grade, employer or trade — has the authority and the obligation to stop work they believe is unsafe, and will never be penalised for doing so.'] },
      { heading: 'Fair dealing', body: ['We select trade partners on capability, price and safety performance. We do not accept or offer inducements, and we keep competitive information confidential.'] },
      { heading: 'Community and environment', body: ['We minimise nuisance to neighbours, protect the environment around our work and leave sites in a condition we would want beside our own homes.'] }
    ]
  },
  {
    slug: 'anti-bribery',
    title: 'Anti-bribery & integrity policy',
    updated: '01 April 2026',
    intro: 'Ananta Infratech Solutions operates a zero-tolerance approach to bribery, facilitation payments and corruption in any form.',
    sections: [
      { heading: 'Prohibited conduct', body: ['No employee, agent or trade partner may offer, promise, authorise or accept any financial or other advantage intended to improperly influence a business, regulatory or public decision connected with our work.'] },
      { heading: 'Gifts and hospitality', body: ['Modest, customary hospitality is permitted only where it is transparent, recorded and cannot be construed as an inducement. Cash and cash equivalents may never be given or accepted.'] },
      { heading: 'Third parties', body: ['We apply due diligence to subcontractors, agents and consultants, and we require contractual commitments to the same standards.'] },
      { heading: 'Reporting', body: ['Concerns may be raised confidentially with our compliance officer at support@anantainfratechsolutions.com. Every report is investigated and the reporter is protected from retaliation.'] }
    ]
  },
  {
    slug: 'whistleblower',
    title: 'Whistleblower policy',
    updated: '01 April 2026',
    intro: 'A protected route for employees, trade partners and members of the public to report wrongdoing connected with our operations.',
    sections: [
      { heading: 'What you can report', body: ['Safety violations, bribery, falsified quality records, unlawful labour practices, environmental harm, harassment or any conduct that breaches our code of conduct.'] },
      { heading: 'How to report', body: ['Write to support@anantainfratechsolutions.com or call the confidential integrity line on +91 22 4968 2099. Anonymous reports are accepted and are investigated on their merits.'] },
      { heading: 'Protection', body: ['No one who reports a concern in good faith will suffer detrimental treatment. Retaliation is itself a disciplinary offence.'] },
      { heading: 'Handling', body: ['Reports are logged by the compliance officer, escalated to the audit committee where warranted, and closed with a documented outcome within 60 days.'] }
    ]
  }
]
