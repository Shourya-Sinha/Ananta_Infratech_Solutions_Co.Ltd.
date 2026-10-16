import { img } from './images.js'

/**
 * Project portfolio. `id` is the URL slug and must remain stable once published.
 */
export const projects = [
  {
    id: 'atlas-business-park',
    title: 'Atlas Business Park',
    category: 'Commercial',
    sector: 'commercial',
    location: 'Andheri East, Mumbai',
    city: 'Mumbai',
    year: '2025',
    status: 'In progress',
    value: '₹ 412 Cr',
    area: '1,180,000 sq. ft.',
    client: 'Atlas Realty Partners',
    services: ['Construction management', 'RCC works', 'MEP coordination'],
    scope: 'Construction management · RCC works · MEP coordination',
    image: img.project1,
    gallery: [img.project1, img.sectorCommercial, img.site, img.workplace],
    summary: 'A high-performance workplace campus designed for a new generation of enterprise.',
    description:
      'Atlas Business Park is a twelve-storey commercial campus with a landscaped podium, double-height lobby and a triple-height workplace atrium. The project is being delivered while an adjacent tower remains occupied and trading.',
    challenge:
      'A constrained urban site required a precise logistics plan, a single-entry gate strategy and uninterrupted neighbouring operations across a monsoon-affected programme.',
    solution:
      'We mobilised a digital site model to sequence 34 trade packages, pre-assembled MEP modules off site to reduce crane demand, and ran a materials call-off system timed to a 40-minute delivery window. A dedicated neighbour liaison officer manages all access and noise communication.',
    impact:
      'The structure topped out eight days ahead of baseline with a façade milestone achieved through coordinated parallel work fronts. Zero reportable safety incidents across 1.9 million man-hours.',
    facts: [
      { label: 'Floors', value: '12 + 2 basement' },
      { label: 'Structure', value: 'RCC flat slab' },
      { label: 'Façade', value: 'Unitised DGU curtain wall' },
      { label: 'Certification target', value: 'IGBC Gold' }
    ],
    timeline: [
      { date: 'Q1 2023', title: 'Appointment & preconstruction', text: 'Feasibility review, cost plan and constructability study completed.' },
      { date: 'Q3 2023', title: 'Enabling & foundations', text: 'Shoring, excavation and piling across a constrained plot boundary.' },
      { date: 'Q2 2024', title: 'Structure topped out', text: 'RCC frame completed eight days ahead of baseline programme.' },
      { date: 'Q4 2024', title: 'Façade milestone', text: 'Unitised curtain wall complete on the northern elevation.' },
      { date: 'Q4 2025', title: 'Commissioning & handover', text: 'MEP commissioning, tenant fit-out interfaces and phased possession.' }
    ],
    quote: {
      text: 'Ananta have been the most transparent contractor we have engaged. The weekly report tells us the truth, and the team solves problems before we hear about them.',
      author: 'Programme Director',
      role: 'Atlas Realty Partners'
    },
    featured: true
  },
  {
    id: 'keens-urban-district',
    title: 'Keen’s Urban District',
    category: 'Residential',
    sector: 'residential',
    location: 'Powai, Mumbai',
    city: 'Mumbai',
    year: '2024',
    status: 'Completed',
    value: '₹ 286 Cr',
    area: '410,000 sq. ft.',
    client: 'Keen Developments LLP',
    services: ['Preconstruction', 'Structure', 'Fit-out'],
    scope: 'Preconstruction · Structure · Fit-out',
    image: img.project2,
    gallery: [img.project2, img.sectorResidential, img.heroAlt, img.team],
    summary: 'A connected residential and retail address shaped around public life.',
    description:
      'Two residential towers of 21 and 24 storeys sit above a shared retail podium and landscaped deck. The design opens the ground plane to the neighbourhood and gives every home a private outdoor room.',
    challenge:
      'Multiple stakeholder packages — structure, façade, retail shell, landscape and amenity fit-out — had to arrive together on a compressed 30-month programme without one trade waiting on another.',
    solution:
      'We built a single integrated schedule with a two-week look-ahead shared by every package manager, and pre-purchased long-lead façade and lift packages during preconstruction to protect the critical path.',
    impact:
      '410,000 sq. ft. of mixed-use development handed over on programme, with a people-first ground plane, 610 homes and an amenity deck that opened with the first possession.',
    facts: [
      { label: 'Towers', value: '2 (21 & 24 storeys)' },
      { label: 'Homes', value: '610 residences' },
      { label: 'Amenities', value: 'Deck, club, pools, courts' },
      { label: 'Handover', value: 'On programme' }
    ],
    timeline: [
      { date: 'Q2 2021', title: 'Preconstruction', text: 'Value engineering review delivered an 11% cost saving against first estimate.' },
      { date: 'Q1 2022', title: 'Podium & basement', text: 'Three-level basement completed with top-down sequencing.' },
      { date: 'Q3 2023', title: 'Tower structure', text: 'Both towers completed with slipform core and aluminium formwork.' },
      { date: 'Q4 2024', title: 'Handover', text: 'Phased possession commenced with amenity deck complete.' }
    ],
    quote: {
      text: 'They treated our sales calendar as their own critical path. That is rare in this market.',
      author: 'Managing Director',
      role: 'Keen Developments LLP'
    },
    featured: true
  },
  {
    id: 'capasite-house',
    title: 'Capasite House',
    category: 'Commercial',
    sector: 'commercial',
    location: 'BKC, Mumbai',
    city: 'Mumbai',
    year: '2024',
    status: 'Completed',
    value: '₹ 68 Cr',
    area: '58,000 sq. ft.',
    client: 'Capasite Technologies',
    services: ['Turnkey interiors', 'MEP', 'Technology'],
    scope: 'Turnkey interiors · MEP · Technology',
    image: img.project3,
    gallery: [img.project3, img.workplace, img.quality, img.drawings],
    summary: 'A flexible, low-carbon headquarters built around teams and ideas.',
    description:
      'A headquarters for 480 people across four floors, designed as a series of neighbourhoods around a central collaboration stair. The building runs on a high-efficiency plant with workplace sensors throughout.',
    challenge:
      'The live building environment demanded careful sequencing, night-shift deliveries and zero disruption to the eleven other tenants in the tower.',
    solution:
      'All noisy work was scheduled inside a 20:00–06:00 window with acoustic screening, materials delivered by goods lift bookings, and a full mock-up floor approved before bulk procurement of joinery and partitions.',
    impact:
      '58,000 sq. ft. handed over three weeks ahead of programme with 0.3 snags per 100 sq. m. and a measured 22% better energy performance than the base-building benchmark.',
    facts: [
      { label: 'Floors', value: '4 floors' },
      { label: 'Capacity', value: '480 workstations' },
      { label: 'Plant', value: 'VRF + dedicated AHU' },
      { label: 'Certification', value: 'IGBC Platinum (applied)' }
    ],
    timeline: [
      { date: 'Q1 2023', title: 'Design coordination', text: 'Federated BIM model completed with full clash resolution.' },
      { date: 'Q2 2023', title: 'Mock-up approval', text: 'Full mock-up floor signed off by the client and brand team.' },
      { date: 'Q1 2024', title: 'Handover', text: 'Delivered three weeks early with operator training complete.' }
    ],
    quote: {
      text: 'The finish quality is the best we have had in any of our offices — and the building performs exactly as modelled.',
      author: 'Head of Workplace',
      role: 'Capasite Technologies'
    },
    featured: true
  },
  {
    id: 'harbour-logistics-hub',
    title: 'Harbour Logistics Hub',
    category: 'Industrial',
    sector: 'industrial',
    location: 'Navi Mumbai',
    city: 'Navi Mumbai',
    year: '2023',
    status: 'Completed',
    value: '₹ 174 Cr',
    area: '280,000 sq. ft.',
    client: 'Harbour Freight Terminals',
    services: ['Civil works', 'Steel', 'External development'],
    scope: 'Civil works · Steel · External development',
    image: img.project4,
    gallery: [img.project4, img.sectorIndustrial, img.equipment, img.equipment2],
    summary: 'A resilient distribution facility built for round-the-clock movement.',
    description:
      'A 24×7 distribution and transhipment facility with a 12 m clear-height warehouse, 44 dock levellers, heavy-duty hardstanding and an independent power and water backbone.',
    challenge:
      'Complex soft ground conditions and continuous operational access drove a compressed foundation strategy alongside a 22-week steel programme.',
    solution:
      'We ran a ground improvement programme with stone columns and a monitored settlement regime, erected steel in four independently sequenced zones, and poured jointless post-tensioned floors without interrupting the yard.',
    impact:
      '280,000 sq. ft. logistics asset completed with an exemplary safety record: 640,000 man-hours, zero lost-time incidents and zero reportable environmental events.',
    facts: [
      { label: 'Clear height', value: '12 m' },
      { label: 'Docks', value: '44 levellers' },
      { label: 'Floor', value: 'Post-tensioned jointless' },
      { label: 'Yard', value: '9 acres hardstanding' }
    ],
    timeline: [
      { date: 'Q4 2021', title: 'Ground improvement', text: 'Stone columns and settlement monitoring across the full footprint.' },
      { date: 'Q2 2022', title: 'Steel erection', text: '1,900 MT erected in four sequenced zones.' },
      { date: 'Q3 2023', title: 'Commissioning', text: 'Docks, power and 24×7 operations handed over.' }
    ],
    quote: {
      text: 'They understood that our business cannot pause. Every phase was planned around throughput.',
      author: 'Chief Operating Officer',
      role: 'Harbour Freight Terminals'
    },
    featured: false
  },
  {
    id: 'the-alibaug-retreat',
    title: 'The Alibaug Retreat',
    category: 'Hospitality',
    sector: 'hospitality',
    location: 'Alibaug, Maharashtra',
    city: 'Alibaug',
    year: '2023',
    status: 'Completed',
    value: '₹ 96 Cr',
    area: '140,000 sq. ft.',
    client: 'Terra Hospitality Ventures',
    services: ['Construction management', 'Finishes', 'Landscape'],
    scope: 'Construction management · Finishes',
    image: img.project5,
    gallery: [img.project5, img.sectorHospitality, img.training],
    summary: 'A landscape-led hospitality destination with a distinctly local material language.',
    description:
      'Forty keys, twelve private villas and a collection of shared pavilions arranged around existing trees and a natural storm-water channel.',
    challenge:
      'Coastal humidity, monsoon access and craft-led detailing placed exacting demands on material control, waterproofing and quality assurance.',
    solution:
      'Materials were mock-up approved in coastal conditions, waterproofing was independently tested before finishes, and hand-worked stone and timber were supplied by a retained artisan group working to a single approved prototype.',
    impact:
      'Forty keys and villas delivered with minimal site waste, 94% of excavated material reused on site, and a design language drawn entirely from the surrounding Konkan palette.',
    facts: [
      { label: 'Keys', value: '40 rooms + 12 villas' },
      { label: 'Waste reuse', value: '94% spoil reused on site' },
      { label: 'Water', value: 'Rainwater harvesting + STP reuse' },
      { label: 'Craft', value: 'Local stone & reclaimed teak' }
    ],
    timeline: [
      { date: 'Q3 2020', title: 'Mobilisation', text: 'Monsoon-window access planning and haul-road construction.' },
      { date: 'Q2 2022', title: 'Structure & envelope', text: 'Low-rise RCC pavilions with stone-clad envelope.' },
      { date: 'Q4 2023', title: 'Finishes & opening', text: 'Artisan finishes completed and the property opened to guests.' }
    ],
    quote: {
      text: 'The craft quality is extraordinary, and they protected the trees and water channel exactly as we asked.',
      author: 'Founder',
      role: 'Terra Hospitality Ventures'
    },
    featured: false
  },
  {
    id: 'juhu-residences',
    title: 'Juhu Residences',
    category: 'Residential',
    sector: 'residential',
    location: 'Juhu, Mumbai',
    city: 'Mumbai',
    year: '2022',
    status: 'Completed',
    value: '₹ 128 Cr',
    area: '186,000 sq. ft.',
    client: 'Private developer consortium',
    services: ['RCC', 'Façade', 'Premium fit-out'],
    scope: 'RCC · Façade · Premium fit-out',
    image: img.project6,
    gallery: [img.project6, img.sectorResidential, img.heroAlt],
    summary: 'A considered collection of homes balancing privacy, light and city access.',
    description:
      'Eighteen full-floor and duplex residences, each with a private lift lobby and two-sided ventilation, above a quiet service podium in the heart of Juhu.',
    challenge:
      'Detailed façade systems had to meet tight urban boundaries while the programme ran straight through two monsoons.',
    solution:
      'A unitised façade was fabricated off site and installed to a sealed-line start point, while an independent weather-tightness test was conducted on the first completed bay before the system went into production.',
    impact:
      'Eighteen premium residences created at the heart of our home neighbourhood, finished with zero water-ingress reports across four subsequent monsoons.',
    facts: [
      { label: 'Residences', value: '18 (full-floor & duplex)' },
      { label: 'Façade', value: 'Unitised, tested in situ' },
      { label: 'Water ingress', value: 'Zero over 4 monsoons' },
      { label: 'Acoustics', value: 'Upgraded glazing throughout' }
    ],
    timeline: [
      { date: 'Q1 2019', title: 'Structure', text: 'RCC frame delivered through two monsoon seasons.' },
      { date: 'Q4 2021', title: 'Façade', text: 'Unitised façade installed and tested ahead of finishes.' },
      { date: 'Q2 2022', title: 'Possession', text: 'Handed over to all eighteen owners.' }
    ],
    quote: { text: 'Four monsoons later, not one complaint of water ingress. That says everything.', author: 'Project Director', role: 'Client consortium' },
    featured: false
  },
  {
    id: 'ganga-medical-centre',
    title: 'Ganga Medical Centre',
    category: 'Healthcare',
    sector: 'healthcare',
    location: 'Noida, Uttar Pradesh',
    city: 'Noida',
    year: '2024',
    status: 'Completed',
    value: '₹ 152 Cr',
    area: '210,000 sq. ft.',
    client: 'Ganga Healthcare Trust',
    services: ['Construction', 'Healthcare MEP', 'Medical fit-out'],
    scope: 'Construction · Healthcare MEP · Medical fit-out',
    image: img.sectorHealthcare,
    gallery: [img.sectorHealthcare, img.quality, img.workplace],
    summary: 'A 220-bed multi-speciality hospital delivered without closing the existing wing.',
    description:
      'A nine-storey hospital block with six operating theatres, a 32-bed ICU, imaging suite with radiation shielding and a central sterile services department.',
    challenge:
      'The new block shares a boundary wall, a gas manifold and a canteen corridor with a functioning 140-bed hospital that could never stop operating.',
    solution:
      'A phased corridor strategy kept patient movement uninterrupted; a temporary medical gas header was installed with dual redundancy; and all noisy work was confined to a 21:00–05:00 window with clinical-grade dust control.',
    impact:
      '220 new beds commissioned, radiation shielding verified by independent survey, and no interruption to clinical services throughout 26 months of construction.',
    facts: [
      { label: 'Beds', value: '220 new + 140 existing' },
      { label: 'Theatres', value: '6 OT + 32-bed ICU' },
      { label: 'Services', value: 'Medical gas, shielding, CSSD' },
      { label: 'Clinical downtime', value: 'None' }
    ],
    timeline: [
      { date: 'Q1 2022', title: 'Enabling works', text: 'Foundation adjacent to a live wing with vibration monitoring.' },
      { date: 'Q3 2023', title: 'Healthcare MEP', text: 'Medical gas, pressure regimes and shielding installed and tested.' },
      { date: 'Q2 2024', title: 'Commissioning', text: 'Clinical commissioning, training and handover to the hospital team.' }
    ],
    quote: {
      text: 'Not a single theatre list was cancelled because of the construction. That was the whole brief, and they delivered it.',
      author: 'Medical Director',
      role: 'Ganga Healthcare Trust'
    },
    featured: true
  },
  {
    id: 'northfield-food-plant',
    title: 'Northfield Food Processing Plant',
    category: 'Industrial',
    sector: 'industrial',
    location: 'Sanand, Gujarat',
    city: 'Sanand',
    year: '2023',
    status: 'Completed',
    value: '₹ 210 Cr',
    area: '340,000 sq. ft.',
    client: 'Northfield Foods Pvt. Ltd.',
    services: ['EPC', 'Process utilities', 'Commissioning'],
    scope: 'EPC · Process utilities · Commissioning',
    image: img.equipment2,
    gallery: [img.equipment2, img.sectorIndustrial, img.equipment],
    summary: 'A food-safe processing facility delivered to production-ready condition in 19 months.',
    description:
      'A single-point EPC mandate covering the process building, utility block, effluent treatment plant, cold storage and administration wing for a packaged-food manufacturer.',
    challenge:
      'Fast-track mandate with eight equipment vendors providing late datasheets, and a hygienic construction standard demanding food-safety compliance at handover.',
    solution:
      'We ran a vendor datasheet register with weekly interface reviews, built a hygiene zoning plan into the construction sequence, and pre-commissioned utilities before process equipment landing.',
    impact:
      'Production commenced 19 months from notice to proceed. Mechanical completion achieved with a 96% first-pass punch-list closure rate and zero contamination incidents during commissioning.',
    facts: [
      { label: 'Scope', value: 'Single-point EPC' },
      { label: 'Vendors coordinated', value: '8 process vendors' },
      { label: 'ETP', value: '600 KLD with ZLD' },
      { label: 'Hygiene', value: 'Food-safe zoning throughout' }
    ],
    timeline: [
      { date: 'Q1 2022', title: 'Notice to proceed', text: 'Design, procurement and construction mobilised in parallel.' },
      { date: 'Q2 2023', title: 'Mechanical completion', text: 'Utilities commissioned and process equipment landed.' },
      { date: 'Q3 2023', title: 'Trial production', text: 'Performance trials completed and production handed over.' }
    ],
    quote: { text: 'Nineteen months from contract to first production line. We did not think that was possible.', author: 'Plant Head', role: 'Northfield Foods' },
    featured: false
  },
  {
    id: 'metro-viaduct-package',
    title: 'Metro Viaduct Package — Phase III',
    category: 'Infrastructure',
    sector: 'infrastructure',
    location: 'Pune, Maharashtra',
    city: 'Pune',
    year: 'In progress',
    status: 'In progress',
    value: '₹ 318 Cr',
    area: '6.4 km viaduct',
    client: 'Prime infrastructure contractor',
    services: ['Segmental viaduct', 'Piling', 'Traffic staging'],
    scope: 'Segmental viaduct · Piling · Traffic staging',
    image: img.sectorInfrastructure,
    gallery: [img.sectorInfrastructure, img.equipment, img.site],
    summary: 'A 6.4 km elevated corridor built over live arterial traffic in central Pune.',
    description:
      'A delivery-partner mandate for piling, pier construction and segmental superstructure erection on a 6.4 km elevated metro corridor, including traffic staging on two arterial junctions.',
    challenge:
      'Live arterial traffic that could never fully stop, uncharted utilities under the alignment, and a monsoon window that constricts the erection calendar.',
    solution:
      'Utility diversion was preceded by GPR survey and trial pits; segment erection was planned with a launch-gantry sequence that never required a full road closure; and pier caps were pre-cast to compress the critical path.',
    impact:
      'Erection maintained at an average of 22 segments per week, zero unplanned lane closures in 24 months, and uninterrupted peak-hour traffic throughout.',
    facts: [
      { label: 'Viaduct', value: '6.4 km elevated' },
      { label: 'Segments', value: '1,840 precast segments' },
      { label: 'Traffic', value: 'Zero unplanned closures' },
      { label: 'Utilities', value: '42 diversions completed' }
    ],
    timeline: [
      { date: 'Q2 2023', title: 'Utility survey', text: 'GPR survey and trial pits across the full alignment.' },
      { date: 'Q1 2024', title: 'Pier construction', text: 'Piling and pier columns progressed along the corridor.' },
      { date: 'Q3 2025', title: 'Segment erection', text: 'Launch-gantry erection maintaining 22 segments per week.' }
    ],
    quote: { text: 'They kept the city moving while building over it. The traffic record speaks for itself.', author: 'Project Manager', role: 'Prime contractor' },
    featured: false
  },
  {
    id: 'eastern-link-flyover',
    title: 'Eastern Link Flyover',
    category: 'Infrastructure',
    sector: 'infrastructure',
    location: 'Nagpur, Maharashtra',
    city: 'Nagpur',
    year: '2022',
    status: 'Completed',
    value: '₹ 86 Cr',
    area: '2.1 km',
    client: 'Municipal corporation',
    services: ['Bridges', 'Roads', 'Public realm'],
    scope: 'Bridges · Roads · Public realm',
    image: img.heroAlt,
    gallery: [img.heroAlt, img.sectorInfrastructure, img.equipment],
    summary: 'A four-lane flyover that removed a notorious bottleneck from a city artery.',
    description:
      'A 2.1 km four-lane flyover with approach embankments, a pedestrian underpass and landscaped public realm beneath the deck.',
    challenge:
      'A groundwater table within two metres of formation level, plus a requirement to keep the existing road and a temple access route open at all times.',
    solution:
      'Dewatering was designed with recharge wells to protect neighbouring borewells, access was maintained through a temporary diversion deck, and foundation works were scheduled around festival traffic surges.',
    impact:
      'Journey time across the corridor reduced from 22 to 6 minutes, with existing access routes undisturbed and recharge wells protecting local groundwater.',
    facts: [
      { label: 'Length', value: '2.1 km, 4 lanes' },
      { label: 'Water table', value: '2 m below formation' },
      { label: 'Access', value: 'Maintained throughout' },
      { label: 'Public realm', value: 'Landscaped urban plaza' }
    ],
    timeline: [
      { date: 'Q1 2020', title: 'Mobilisation', text: 'Diversion deck and dewatering with recharge wells installed.' },
      { date: 'Q4 2021', title: 'Deck construction', text: 'Segmental deck and approach embankments completed.' },
      { date: 'Q2 2022', title: 'Open to traffic', text: 'Corridor opened with public realm landscaped.' }
    ],
    quote: { text: 'Journey times fell by three quarters. The city noticed immediately.', author: 'Chief Engineer', role: 'Municipal corporation' },
    featured: false
  },
  {
    id: 'sunridge-township',
    title: 'Sunridge Township — Phase I',
    category: 'Residential',
    sector: 'residential',
    location: 'Nashik, Maharashtra',
    city: 'Nashik',
    year: 'In progress',
    status: 'In progress',
    value: '₹ 340 Cr',
    area: '1,050,000 sq. ft.',
    client: 'Sunridge Estates',
    services: ['Township infrastructure', 'Residential blocks', 'Amenities'],
    scope: 'Township infrastructure · Residential blocks · Amenities',
    image: img.sectorResidential,
    gallery: [img.sectorResidential, img.heroAlt, img.green],
    summary: 'A 42-acre township phase with 780 homes, a clubhouse and complete infrastructure.',
    description:
      'Phase I of a master-planned township comprising eleven residential blocks, a 60,000 sq. ft. clubhouse, a school block, and the internal roads, water and power infrastructure that serve them.',
    challenge:
      'Village access roads crossed the site, monsoonal drainage had to be preserved, and possession had to begin before the last block finished.',
    solution:
      'Infrastructure was front-loaded ahead of vertical construction so services were available at each block on completion, and possessions ran in a phased sequence tied to road and utility readiness.',
    impact:
      'First 180 homes handed over while construction continues on the balance, with village access maintained and drainage capacity improved over the pre-development condition.',
    facts: [
      { label: 'Site', value: '42 acres, Phase I' },
      { label: 'Homes', value: '780 across 11 blocks' },
      { label: 'Amenities', value: 'Clubhouse, pools, courts, school' },
      { label: 'Drainage', value: 'Capacity improved 30%' }
    ],
    timeline: [
      { date: 'Q2 2023', title: 'Infrastructure first', text: 'Roads, water and power backbone delivered ahead of blocks.' },
      { date: 'Q4 2024', title: 'Rising blocks', text: 'Six blocks structurally complete in parallel.' },
      { date: 'Q2 2025', title: 'First possession', text: 'First 180 homes handed over with amenities operational.' }
    ],
    quote: { text: 'They sequenced the work so that buyers never had to wait for infrastructure.', author: 'Director', role: 'Sunridge Estates' },
    featured: false
  },
  {
    id: 'central-square-retail',
    title: 'Central Square Retail Centre',
    category: 'Commercial',
    sector: 'commercial',
    location: 'Thane, Maharashtra',
    city: 'Thane',
    year: '2021',
    status: 'Completed',
    value: '₹ 142 Cr',
    area: '320,000 sq. ft.',
    client: 'Central Square Retail Pvt. Ltd.',
    services: ['Shell & core', 'Tenant coordination', 'Public realm'],
    scope: 'Shell & core · Tenant coordination · Public realm',
    image: img.project1,
    gallery: [img.project1, img.workplace, img.heroAlt],
    summary: 'An urban retail centre with 92 tenants handed over ready to trade.',
    description:
      'A four-level retail centre with two basement levels, a food court, multiplex shell and a public plaza that has become the neighbourhood’s meeting point.',
    challenge:
      'Ninety-two tenant fit-outs of wildly differing capability all needed to open on the same trading day.',
    solution:
      'We ran a tenant coordination office on site for nine months, issuing base-build readiness certificates, managing independent fit-out contractors and controlling deliveries through a slot-booking system.',
    impact:
      'All 92 tenants opened on the committed trading day, with a tenant satisfaction score of 4.5/5 and zero disputes on base-build readiness.',
    facts: [
      { label: 'Tenants', value: '92 shops + multiplex' },
      { label: 'Basements', value: '2 levels, 480 cars' },
      { label: 'Base-build readiness', value: 'All 92 certified' },
      { label: 'Trading day', value: 'Zero tenant slippage' }
    ],
    timeline: [
      { date: 'Q1 2019', title: 'Shell & core', text: 'Structure and envelope completed with basement waterproofing.' },
      { date: 'Q2 2021', title: 'Tenant fit-out', text: '92 fit-outs coordinated from an on-site tenant office.' },
      { date: 'Q4 2021', title: 'Trading day', text: 'Centre opened with every tenant trading.' }
    ],
    quote: { text: 'Ninety-two tenants, one opening date, no slippage. That was a coordination exercise as much as a build.', author: 'Head of Leasing', role: 'Central Square Retail' },
    featured: false
  },
  {
    id: 'manesar-warehouse-park',
    title: 'Manesar Warehouse Park',
    category: 'Industrial',
    sector: 'industrial',
    location: 'Manesar, Haryana',
    city: 'Manesar',
    year: '2024',
    status: 'Completed',
    value: '₹ 118 Cr',
    area: '420,000 sq. ft.',
    client: 'Logistics platform developer',
    services: ['Design & build', 'Pre-engineered steel', 'Yard works'],
    scope: 'Design & build · Pre-engineered steel · Yard works',
    image: img.equipment,
    gallery: [img.equipment, img.sectorIndustrial, img.project4],
    summary: 'Three grade-A warehouse units delivered in eleven months from greenfield.',
    description:
      'Three independent warehouse units with mezzanine offices, 96 dock positions and a shared 11-acre circulation and parking yard.',
    challenge:
      'Three separate tenant leasing schedules meant each unit had to be independently completable while sharing one boundary and one gate.',
    solution:
      'The site was zoned with independent access routes per unit, PEB steel was pre-ordered against a fixed design freeze date, and each unit had its own snag and handover protocol.',
    impact:
      'All three units delivered inside eleven months — the fastest completion in the developer’s portfolio to date — with unit one leased before practical completion.',
    facts: [
      { label: 'Units', value: '3 independent warehouses' },
      { label: 'Docks', value: '96 dock positions' },
      { label: 'Programme', value: '11 months greenfield to handover' },
      { label: 'Steel', value: 'Pre-engineered, 2,400 MT' }
    ],
    timeline: [
      { date: 'Q3 2023', title: 'Design freeze', text: 'PEB design frozen and steel pre-ordered to protect lead time.' },
      { date: 'Q2 2024', title: 'Steel & envelope', text: 'All three units erected with independent access sequencing.' },
      { date: 'Q3 2024', title: 'Handover', text: 'Units handed over separately as leases were signed.' }
    ],
    quote: { text: 'Eleven months greenfield is our portfolio record. We are using them again.', author: 'Development Director', role: 'Logistics platform' },
    featured: false
  },
  {
    id: 'hillview-wellness-resort',
    title: 'Hillview Wellness Resort',
    category: 'Hospitality',
    sector: 'hospitality',
    location: 'Lonavala, Maharashtra',
    city: 'Lonavala',
    year: '2025',
    status: 'In progress',
    value: '₹ 134 Cr',
    area: '160,000 sq. ft.',
    client: 'Hillview Leisure Group',
    services: ['Construction', 'Spa & wellness fit-out', 'Landscape'],
    scope: 'Construction · Spa & wellness fit-out · Landscape',
    image: img.sectorHospitality,
    gallery: [img.sectorHospitality, img.project5, img.green2].filter(Boolean),
    summary: 'A 92-key wellness resort built into a hillside without cutting a single mature tree.',
    description:
      'A terraced resort of 92 keys, a destination spa, thermal pools and a wellness pavilion arranged across a 14-degree slope.',
    challenge:
      'A steep slope, a mature tree canopy to be preserved, and no practical road access for heavy equipment at the upper terraces.',
    solution:
      'Foundations were built on a stepped pad-and-raft system using a temporary cable-hoist material line; tree protection zones were fenced before mobilisation and independently audited monthly.',
    impact:
      'Ninety-two keys under construction with all 210 mature trees preserved, an estimated 30% reduction in excavation volume, and a construction carbon footprint below the design target.',
    facts: [
      { label: 'Keys', value: '92 rooms, spa, pools' },
      { label: 'Slope', value: '14-degree average grade' },
      { label: 'Trees preserved', value: '210 mature specimens' },
      { label: 'Excavation saved', value: '30% vs. conventional cut' }
    ],
    timeline: [
      { date: 'Q1 2024', title: 'Tree protection', text: 'Protection zones fenced and audited before excavation.' },
      { date: 'Q4 2024', title: 'Terrace foundations', text: 'Stepped raft foundations using cable-hoist material access.' },
      { date: 'Q4 2025', title: 'Fit-out & spa', text: 'Spa, thermal pools and guest rooms reaching completion.' }
    ],
    quote: { text: 'Not one mature tree was lost. Our landscape architect could not believe it.', author: 'Owner', role: 'Hillview Leisure Group' },
    featured: false
  }
]

export const projectsIntro = {
  eyebrow: 'Our work',
  title: 'Work that moves things forward.',
  intro:
    'We work across the places that shape everyday life — from ambitious commercial campuses to considered homes, essential infrastructure and facilities built for production.',
  note: 'Every project below was delivered or is being delivered by an Ananta team. Filter by sector, status or city, or search the portfolio.'
}
