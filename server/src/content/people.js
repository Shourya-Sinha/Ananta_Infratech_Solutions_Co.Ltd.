import { img } from './images.js'

/**
 * People, clients, testimonials, awards and certification content.
 */

export const leadershipIntro = {
  eyebrow: 'Leadership',
  title: 'Accountable at the top, present on site.',
  intro:
    'Our leadership team is small by design. Every director carries project responsibility, visits sites weekly and answers directly for delivery — which is why decisions get made quickly.'
}

export const leadership = [
  {
    id: 'ananta-director-delivery',
    name: 'R. Krishnan',
    role: 'Managing Director',
    focus: 'Delivery strategy · Client relationships',
    image: img.team,
    years: '22 years in construction',
    bio: 'Krishnan founded Ananta in 2016 after two decades leading large commercial and infrastructure programmes. He is on site every Tuesday and Thursday, without exception.',
    highlights: ['1.8M+ sq. ft. personally delivered', 'IGBC accredited professional', 'IIT Madras — Civil Engineering']
  },
  {
    id: 'ananta-director-operations',
    name: 'Meera Sathe',
    role: 'Director — Operations',
    focus: 'Programme · Site leadership · Quality',
    image: img.people,
    years: '18 years in construction',
    bio: 'Meera runs the operations function across all live projects and owns our quality management system. She chairs the weekly delivery review for every project without fail.',
    highlights: ['Led 3 of our largest campus projects', 'Certified Lead Auditor, ISO 9001', 'VJTI Mumbai — Civil Engineering']
  },
  {
    id: 'ananta-director-commercial',
    name: 'Arjun Deshpande',
    role: 'Director — Commercial & Preconstruction',
    focus: 'Estimating · Contracts · Risk',
    image: img.drawings,
    years: '16 years in construction',
    bio: 'Arjun builds the cost models our projects are delivered against and negotiates the contracts behind them. He has never let a project start without a signed risk register.',
    highlights: ['₹ 2,400 Cr of cost plans prepared', 'RICS accredited', 'COEP Pune — Civil Engineering']
  },
  {
    id: 'ananta-director-hse',
    name: 'Fatima Qureshi',
    role: 'Head — Safety, Quality & Environment',
    focus: 'HSE · Compliance · Training',
    image: img.safety,
    years: '14 years in construction',
    bio: 'Fatima owns the safety culture that has taken us past 4.2 million man-hours without a lost-time incident. She has the authority to stop any site, and has used it.',
    highlights: ['NEBOSH International Diploma', '4.2M safe man-hours achieved', 'Trainer for 480+ staff']
  }
]

export const teamIntro = {
  eyebrow: 'Our people',
  title: 'Built by people who care deeply.',
  intro:
    'Ananta is 480 people: engineers, planners, quantity surveyors, supervisors, safety officers, surveyors and trade partners. Most of our site leadership has been with us for over five years.',
  image: img.team
}

export const teamStats = [
  { value: '480+', label: 'people in the delivery team' },
  { value: '68', label: 'engineers and planners' },
  { value: '5.2 yrs', label: 'average site-leadership tenure' },
  { value: '124', label: 'certified first-aiders on site' }
]

export const departments = [
  { name: 'Project delivery & site leadership', count: '210 people', text: 'Project managers, site engineers, supervisors and foremen who run the work every day.' },
  { name: 'Planning & project controls', count: '34 people', text: 'Programme, cost, risk and reporting specialists who keep the plan honest and current.' },
  { name: 'Engineering & technical services', count: '48 people', text: 'Structural, MEP, temporary works and BIM engineers who solve problems on paper first.' },
  { name: 'Safety, quality & environment', count: '26 people', text: 'HSE officers, quality inspectors and environmental coordinators at site and company level.' },
  { name: 'Commercial & procurement', count: '29 people', text: 'Quantity surveyors, buyers and contract administrators managing cost and supply chain.' },
  { name: 'Survey, plant & logistics', count: '62 people', text: 'Surveyors, plant operators, mechanics and storekeepers who keep production moving.' }
]

export const clients = [
  { name: 'Atlas Realty Partners', sector: 'Commercial development', since: '2019', projects: 4 },
  { name: 'Keen Developments', sector: 'Residential development', since: '2018', projects: 6 },
  { name: 'Capasite Technologies', sector: 'Technology', since: '2021', projects: 3 },
  { name: 'Harbour Freight Terminals', sector: 'Logistics & ports', since: '2020', projects: 5 },
  { name: 'Terra Hospitality Ventures', sector: 'Hospitality', since: '2018', projects: 3 },
  { name: 'Ganga Healthcare Trust', sector: 'Healthcare', since: '2021', projects: 2 },
  { name: 'Northfield Foods', sector: 'Food manufacturing', since: '2022', projects: 2 },
  { name: 'Sunridge Estates', sector: 'Township development', since: '2023', projects: 1 },
  { name: 'Central Square Retail', sector: 'Retail', since: '2018', projects: 2 },
  { name: 'Hillview Leisure Group', sector: 'Hospitality', since: '2024', projects: 1 },
  { name: 'Municipal corporation, Nagpur', sector: 'Public infrastructure', since: '2019', projects: 3 },
  { name: 'Prime infrastructure contractor', sector: 'Metro & rail', since: '2023', projects: 1 }
]

export const testimonials = [
  {
    id: 'atlas-pd',
    quote:
      'Ananta have been the most transparent contractor we have engaged. The weekly report tells us the truth — including the things we would rather not read — and the team solves problems before we hear about them.',
    author: 'Programme Director',
    role: 'Atlas Realty Partners',
    project: 'Atlas Business Park',
    year: '2025'
  },
  {
    id: 'ganga-md',
    quote:
      'Not a single theatre list was cancelled because of construction. That was the whole brief, and they delivered it while building nine storeys beside our operating wing.',
    author: 'Medical Director',
    role: 'Ganga Healthcare Trust',
    project: 'Ganga Medical Centre',
    year: '2024'
  },
  {
    id: 'keens-md',
    quote:
      'They treated our sales calendar as their own critical path. Handover happened when they said it would, and our buyers noticed.',
    author: 'Managing Director',
    role: 'Keen Developments LLP',
    project: 'Keen’s Urban District',
    year: '2024'
  },
  {
    id: 'northfield-plant',
    quote:
      'Nineteen months from contract signature to first production line. We genuinely did not believe that was achievable in India before this project.',
    author: 'Plant Head',
    role: 'Northfield Foods Pvt. Ltd.',
    project: 'Northfield Food Processing Plant',
    year: '2023'
  },
  {
    id: 'capasite-workplace',
    quote:
      'The finish quality is the best we have had in any of our offices, and the building performs exactly as the model predicted. Three weeks early was a bonus.',
    author: 'Head of Workplace',
    role: 'Capasite Technologies',
    project: 'Capasite House',
    year: '2024'
  },
  {
    id: 'harbour-coo',
    quote:
      'They understood that a logistics business cannot pause. Every single phase was planned around our throughput, not around their convenience.',
    author: 'Chief Operating Officer',
    role: 'Harbour Freight Terminals',
    project: 'Harbour Logistics Hub',
    year: '2023'
  }
]

export const awards = [
  { year: '2025', title: 'Safety Excellence Award — Large Contractor', body: 'Regional construction safety council', note: 'For 4.2 million man-hours without a lost-time incident.' },
  { year: '2025', title: 'IGBC Gold — Atlas Business Park', body: 'Indian Green Building Council', note: 'Design-stage certification for a 1.18M sq. ft. workplace campus.' },
  { year: '2024', title: 'Project of the Year — Healthcare', body: 'Industry infrastructure awards', note: 'Ganga Medical Centre, delivered without clinical downtime.' },
  { year: '2024', title: 'Quality Benchmark Award', body: 'Client audit programme', note: 'Highest audit score across the developer’s national contractor panel.' },
  { year: '2023', title: 'Safety Innovation Award', body: 'National construction safety forum', note: 'For the cable-hoist material access system at Hillview Resort.' },
  { year: '2022', title: 'Emerging Contractor of the Year', body: 'State builders association', note: 'Recognised for delivery record and apprentice training programme.' }
]

export const certifications = [
  { label: 'Quality management', value: 'ISO 9001:2015 aligned QMS', detail: 'Documented procedures, internal audit cycle and corrective action tracking on every project.' },
  { label: 'Occupational health & safety', value: 'ISO 45001:2018 aligned', detail: 'Hazard identification, permit-to-work and incident investigation across all sites.' },
  { label: 'Environment', value: 'ISO 14001:2015 aligned', detail: 'Waste, water, dust and noise controls with monthly environmental monitoring.' },
  { label: 'Green building capability', value: 'IGBC & GRIHA experience', detail: 'Accredited professionals in-house with certified projects delivered and in progress.' },
  { label: 'Labour compliance', value: 'BOCW & PF/ESIC registered', detail: 'Statutory registration, insurance and wage compliance verified at every project.' },
  { label: 'Financial standing', value: 'Audited, bankable, insured', detail: 'Audited accounts, performance bank guarantees and project-specific insurance cover.' }
]

export const csr = {
  eyebrow: 'Community',
  title: 'What we put back into the places we build.',
  intro:
    'Construction touches neighbourhoods whether they asked for it or not. We try to leave each one better equipped than we found it.',
  initiatives: [
    { title: 'Skill training centre', text: 'A free training centre for masons, bar benders, shuttering carpenters and electricians — 640 people trained and certified to date, with 71% placed.', metric: '640 trained' },
    { title: 'Site-neighbourhood support', text: 'Local hiring preference, water tankers and road repair at every site boundary, plus a named liaison officer for neighbours.', metric: '100% of sites' },
    { title: 'Safety for the wider public', text: 'Public protection planning, signage, school-route safety and night-time illumination around all active sites.', metric: 'Zero public incidents' },
    { title: 'Education & scholarships', text: 'Annual scholarships for the children of site workers and a paid internship programme for diploma and engineering students.', metric: '48 scholars' }
  ]
}
