import { img } from './images.js'

/**
 * Page-level editorial content: home, about, sustainability, HSE, equipment,
 * insights, newsroom, tenders, downloads, FAQ, careers and registration.
 */

export const home = {
  slides: [
    {
      eyebrow: 'Integrated construction partner · Mumbai, India',
      title: 'We make ambitious places possible.',
      text: 'Ananta brings design intelligence, field discipline and accountable delivery to the places where people live, work and move.',
      image: img.hero,
      video: '',
      caption: 'Commercial · Residential · Industrial · Infrastructure'
    },
    {
      eyebrow: '4.2 million safe man-hours',
      title: 'Safety is the first deliverable.',
      text: 'Before programme, before cost, before finish quality — everyone who comes to work goes home. That is the standard we hold the whole business to.',
      image: img.safety,
      caption: 'Zero lost-time incidents across 24 months'
    },
    {
      eyebrow: '1.9 million sq. ft. delivered',
      title: 'Engineered to hold up.',
      text: 'From deep basements to long-span structures, our own civil teams self-deliver the work that everything else depends on.',
      image: img.equipment,
      caption: 'Self-delivered civil, structural and enabling works'
    },
    {
      eyebrow: 'Across eight Indian states',
      title: 'One partner. Total accountability.',
      text: 'Preconstruction to handover under a single appointment — so decisions get made once, by people who live with the consequences.',
      image: img.sectorInfrastructure,
      caption: 'Commercial · Infrastructure · Healthcare · Hospitality'
    },
    {
      eyebrow: 'Digital products, built around people',
      title: 'Technology that moves your business forward.',
      text: 'From websites and custom CMS platforms to mobile apps, client chat and digital growth, we create useful technology shaped around real teams and customers.',
      image: img.drawings,
      video: '',
      caption: 'Web · Android · iOS · CMS · SEO · Cloud'
    }
  ],
  heroStats: [
    { value: '1.9M', label: 'sq. ft. delivered' },
    { value: '480+', label: 'people on site' },
    { value: '4.2M', label: 'safe man-hours' },
    { value: '9', label: 'years, one standard' }
  ],
  trustStrip: ['ISO 9001 aligned', 'ISO 45001 aligned', 'ISO 14001 aligned', 'IGBC accredited professionals', 'BOCW & PF/ESIC compliant'],
  ticker: [
    'Atlas Business Park topped out ahead of baseline',
    'Ganga Medical Centre commissioned without clinical downtime',
    '4.2 million safe man-hours achieved',
    'Northfield Foods in production 19 months from notice to proceed',
    'Two new healthcare mandates secured for 2026'
  ],
  aboutTeaser: {
    eyebrow: 'Who we are',
    title: 'Built on the ground. Connected to what’s next.',
    text: 'Ananta Infratech Solutions brings construction, infrastructure and digital technology together. We deliver real-world projects and build useful digital products with the same focus on clear ownership, practical thinking and dependable outcomes.',
    image: img.aboutStory,
    points: [
      { title: 'Own the outcome', text: 'One accountable team from feasibility to defects liability.' },
      { title: 'Say the difficult thing early', text: 'Honest weekly reporting, including the numbers nobody enjoys.' },
      { title: 'Build it once, build it well', text: 'Quality controlled at source, not snagged at handover.' }
    ]
  },
  servicesSection: {
    eyebrow: 'Construction + technology',
    title: 'Construction, technology. One accountable partner.',
    text: 'We deliver the spaces, infrastructure and digital products people rely on—with practical teams, clear communication and one point of accountability.'
  },
  digitalSection: {
    eyebrow: 'Technology, made useful',
    title: 'Built for the real world. Designed for what’s next.',
    text: 'Alongside construction and infrastructure, Ananta delivers practical digital products—from custom CMS platforms and websites to Android and iOS apps, client chat and connected business systems.',
    serviceSlugs: ['digital-products', 'web-development', 'mobile-app-development', 'client-chat-solutions', 'enterprise-it-solutions', 'content-management', 'seo-growth', 'ui-ux-design', 'cloud-devops', 'cybersecurity']
  },
  stats: [
    { value: '1.9M', label: 'sq. ft. delivered', detail: 'Across 60 completed projects since 2016.' },
    { value: '480+', label: 'people in the field', detail: 'Engineers, planners, supervisors and trade partners.' },
    { value: '4.2M', label: 'safe man-hours', detail: 'Without a single lost-time incident in 24 months.' },
    { value: '97%', label: 'milestones met', detail: 'Measured against baseline across all live projects.' }
  ],
  capabilityBand: {
    eyebrow: 'Integrated delivery',
    title: 'Complexity, connected.',
    text: 'Our specialist teams share one view of the work — from the earliest plan to the final handover. That means fewer hand-offs, faster decisions and a more dependable result.',
    image: img.drawings,
    bullets: ['Single accountable delivery team', 'Federated BIM and clash-free coordination', 'Weekly reporting the client can act on']
  },
  hseTeaser: {
    eyebrow: 'Safety, quality & environment',
    title: 'Everyone goes home. Every single day.',
    text: 'Safety is not a department at Ananta — it is the first item on every agenda, every site meeting and every board review. 4.2 million man-hours without a lost-time incident is the outcome, not the ambition.',
    image: img.hse,
    metrics: [
      { value: '4.2M', label: 'safe man-hours' },
      { value: '0', label: 'lost-time incidents (24 months)' },
      { value: '124', label: 'certified first-aiders' }
    ]
  },
  testimonialsSection: {
    eyebrow: 'Client perspective',
    title: 'What partners say when we are not in the room.'
  },
  processSection: {
    eyebrow: 'How we work',
    title: 'A method the whole team can see.'
  },
  ctaSection: {
    eyebrow: 'Start a conversation',
    title: 'Bring us in early. It is where we make the biggest difference.',
    text: 'Send us a drawing, a site address or a problem you have not solved yet. We will tell you honestly whether we are the right partner.',
    image: img.site
  }
}

export const about = {
  title: 'A grounded ambition for the built world.',
  intro:
    'Ananta Infratech Solutions is an owner-minded construction and engineering partner headquartered in Juhu, Mumbai. We align people, process and technology around the one thing that matters: making better places, reliably.',
  image: img.aboutStory,
  storyTitle: 'Built on accountability. Shaped by possibility.',
  storyText:
    'What began in 2016 as a hands-on contracting practice has grown into an integrated delivery platform across eight Indian states. Our teams bring preconstruction insight, rigorous controls and the confidence to solve in real time — without losing sight of the original idea.',
  storyText2:
    'We deliberately stayed a mid-sized company. It means a director is on your site this week, the person who priced your project is the person who delivers it, and decisions do not have to travel through four layers of management before anyone acts.',
  storyImage: img.site,
  mission: {
    title: 'Our mission',
    text: 'To make construction more predictable, more transparent and more respectful of the people who build it and the people who will use it.'
  },
  vision: {
    title: 'Our vision',
    text: 'To be the partner Indian owners choose when a project genuinely matters — because we say what we will do, and then we do it.'
  },
  values: [
    { number: '01', title: 'Own the outcome', text: 'We take personal responsibility for safety, quality, programme and partner confidence. Nobody at Ananta is allowed to say “that is not my package”.' },
    { number: '02', title: 'Build with intent', text: 'Every decision is tested against performance, longevity and the people who will use the space. Cheap and quick is not a strategy.' },
    { number: '03', title: 'Say the difficult thing early', text: 'Bad news does not improve with age. We surface problems while there is still time and money to solve them.' },
    { number: '04', title: 'Stay constructively curious', text: 'The best answer is rarely the obvious one. We ask better questions before we build, and we keep asking on site.' },
    { number: '05', title: 'Respect everyone in the chain', text: 'A welder, a client and a director are entitled to the same courtesy. It is also how you get quality work.' },
    { number: '06', title: 'Leave the place better', text: 'A finished building is not enough. The neighbourhood, the environment and the people who worked on it should be better off.' }
  ],
  timeline: [
    { year: '2016', title: 'Founded in Mumbai', text: 'Ananta starts as a hands-on contracting practice with twelve people and one residential project in Juhu.' },
    { year: '2018', title: 'First million sq. ft.', text: 'Residential and hospitality portfolio crosses one million sq. ft.; the preconstruction team is formed.' },
    { year: '2020', title: 'Healthcare & industrial entry', text: 'Delivered our first industrial facility and entered the healthcare sector with a live-hospital upgrade.' },
    { year: '2021', title: 'Delhi NCR office', text: 'Regional office opens in Noida to serve north India clients and the Manesar logistics corridor.' },
    { year: '2022', title: '1.5 million sq. ft. delivered', text: 'Portfolio passes 1.5M sq. ft. with the Eastern Link Flyover opening to traffic in Nagpur.' },
    { year: '2023', title: 'Infrastructure scale-up', text: 'Appointed delivery partner on a 6.4 km metro viaduct package; plant fleet and survey capability expanded in-house.' },
    { year: '2024', title: 'Safety milestone', text: 'Passed four million safe man-hours with zero lost-time incidents; IGBC Platinum application filed for Capasite House.' },
    { year: '2025', title: 'Eight states, one standard', text: 'Operations across eight states, 480+ people and a ₹ 2,400 Cr cumulative delivered value. Bengaluru project office opens.' },
    { year: '2026', title: 'Digital delivery platform', text: 'Company-wide digital site record, live client dashboards and a contractor & worker registration programme launched.' }
  ],
  differentiators: [
    { title: 'We self-deliver the critical path', text: 'Civil, structural and enabling works are executed by our own crews and plant. When the critical path is ours, we do not have to phone anyone to find out why it moved.' },
    { title: 'The estimator delivers the job', text: 'The person who priced your project stays on it. There is no handover between the team that won the work and the team that has to build it.' },
    { title: 'Reporting with nothing buried', text: 'A fixed weekly report — progress, cost, safety, quality, open risks and decisions required. Clients tell us this is the single biggest reason they return.' },
    { title: 'Directors on site, weekly', text: 'Every project gets a director visit every week. It is on the calendar, it is minuted, and it is not delegated.' },
    { title: 'Trade partners we keep', text: 'Sixty-eight per cent of our subcontract packages go to partners who have worked with us for more than five years. Stability shows up in quality.' },
    { title: 'We plan for the monsoon', text: 'Indian construction is seasonal. Our programmes, procurement and cash flows are built around monsoon reality, not around optimism.' }
  ],
  peopleImage: img.team,
  csrImage: img.training
}

export const sustainability = {
  eyebrow: 'Sustainability & ESG',
  title: 'Progress should leave more possibility behind.',
  intro:
    'We are reducing the impact of the work we do while increasing the resilience and value of what we create — measured, reported and independently verified.',
  image: img.green,
  secondaryImage: img.site,
  headlineStats: [
    { value: '30%', label: 'target reduction in project waste intensity by 2028', baseline: 'Baseline: 2022 measurement' },
    { value: '100%', label: 'sites monitored for water, energy and diversion', baseline: 'Reported monthly since 2023' },
    { value: '94%', label: 'of spoil and demolition material reused', baseline: 'Achieved at Alibaug and Hillview' },
    { value: '22%', label: 'better energy performance than benchmark', baseline: 'Measured at Capasite House' }
  ],
  commitments: [
    { number: '01', title: 'Carbon & energy', text: 'Site energy monitoring, efficient plant, diesel reduction and low-carbon concrete trials. Our 2030 target is a 40% reduction in construction-stage intensity against a 2022 baseline.', progress: 45 },
    { number: '02', title: 'Waste & materials', text: 'Segregation at source, take-back agreements with suppliers, and reuse of spoil and demolition material before any disposal is considered.', progress: 72 },
    { number: '03', title: 'Water', text: 'Rainwater harvesting, treated-water reuse for curing and dust suppression, and metered consumption reporting on every site.', progress: 58 },
    { number: '04', title: 'Biodiversity & land', text: 'Tree protection before mobilisation, topsoil conservation, and native planting reinstated wherever our work touches open land.', progress: 80 },
    { number: '05', title: 'People & community', text: 'Fair wages, statutory benefits, free skill training, safe accommodation and local hiring preference at every site.', progress: 88 }
  ],
  practices: [
    { title: 'Low-carbon concrete', text: 'Fly-ash and slag replacement trials across structural mixes, with strength verification at the same intervals as conventional mixes.' },
    { title: 'Construction-stage energy', text: 'Diesel consumption per square metre is metered monthly and reported alongside progress — one number, published with the other project data.' },
    { title: 'Waste segregation at source', text: 'Every site has segregated collection for concrete, steel, timber, packaging and mixed waste, with an audited disposal trail.' },
    { title: 'Water clarity', text: 'Treated water is used for curing and dust control; fresh water consumption is capped and reported.' },
    { title: 'Air quality and dust', text: 'Wheel washes, water bowsers, covered transport and real-time monitors at site boundaries on urban projects.' },
    { title: 'Noise and neighbourhood', text: 'Noise-limiting plant, acoustic screens, restricted hours and a named liaison officer for every neighbour.' }
  ],
  certifications: [
    { label: 'Green building delivery', value: 'IGBC Gold (Atlas Business Park — design stage)' },
    { label: 'Green building delivery', value: 'IGBC Platinum applied (Capasite House)' },
    { label: 'Environmental management', value: 'ISO 14001:2015 aligned system' },
    { label: 'Material diversion', value: '94% achieved — Alibaug Retreat' }
  ],
  reports: [
    { title: 'Sustainability performance summary 2025', year: '2025', size: 'PDF · 1.2 MB', to: '/downloads' },
    { title: 'Environmental monitoring protocol', year: '2024', size: 'PDF · 640 KB', to: '/downloads' },
    { title: 'Community & skill training impact note', year: '2025', size: 'PDF · 820 KB', to: '/downloads' }
  ]
}

export const hse = {
  eyebrow: 'Safety, quality & environment',
  title: 'Everyone goes home. Every single day.',
  intro:
    'Safety is the first deliverable on every Ananta project and the final measure of whether we had a good week. Our quality and environmental systems answer to the same discipline.',
  image: img.hse,
  secondaryImage: img.quality,
  headlineStats: [
    { value: '4.2M', label: 'safe man-hours' },
    { value: '0', label: 'lost-time incidents in 24 months' },
    { value: '124', label: 'certified first-aiders on site' },
    { value: '100%', label: 'sites with a qualified HSE officer' }
  ],
  pillars: [
    {
      number: '01',
      title: 'Occupational health & safety',
      image: img.hse,
      text: 'A safety system is only as strong as the youngest person on site. Our approach is designed for the sharp end: clear briefings, visible leadership, permit control and the unquestioned authority to stop work.',
      points: ['Daily toolbox talks and weekly safety reviews', 'Permit-to-work for all high-risk activities', 'Independent behavioural safety audits', 'Stop-work authority for every individual on site', 'Free PPE, health checks and medical insurance for all workers']
    },
    {
      number: '02',
      title: 'Quality management',
      image: img.quality,
      text: 'Quality is built at the source, not snagged at the end. Every element has an inspection and test plan, a named inspector and a record that ends up in the handover dossier.',
      points: ['Inspection & test plans per work package', 'Material approval and traceability register', 'Independent third-party testing on critical elements', 'Two-stage handover inspection protocol', 'Post-handover defect liability with a single point of contact']
    },
    {
      number: '03',
      title: 'Environmental management',
      image: img.green,
      text: 'Dust, noise, water and waste are managed against limits we publish to our clients at mobilisation — with monthly monitoring evidence rather than good intentions.',
      points: ['Boundary air-quality and noise monitoring', 'Dust suppression and wheel-wash facilities', 'Segregated waste with an audited disposal trail', 'Treated-water reuse for curing and dust control', 'Spill prevention and emergency response drills']
    }
  ],
  safetyProgrammes: [
    { title: 'Ananta Home Safe', text: 'A programme built around the fact that most site fatalities involve falls, vehicles and lifting. Weekly verification of edge protection, gangways, traffic routes and lifting plans.' },
    { title: 'Visible leadership', text: 'Every director performs a documented safety inspection each month, and every project holds a weekly safety walk led by the project manager — minuted and closed out.' },
    { title: 'Worker welfare charter', text: 'Safe accommodation, potable water, sanitation, rest areas, canteen and statutory benefits verified by audit at every site. Absent welfare is treated as a safety failure.' },
    { title: 'Training academy', text: '240 training hours delivered every month across scaffolding, working at height, lifting, confined space, excavation and first aid.' },
    { title: 'Emergency preparedness', text: 'Site-specific emergency plans, trained response teams, monthly drills and a documented mutual-aid arrangement with nearby hospitals.' },
    { title: 'Incident learning', text: 'Every near-miss is reported, investigated and shared company-wide within 72 hours. We learn from the incidents that did not hurt anyone.' }
  ],
  certificates: [
    { label: 'ISO 45001:2018', value: 'Aligned OHS management system' },
    { label: 'ISO 9001:2015', value: 'Aligned quality management system' },
    { label: 'ISO 14001:2015', value: 'Aligned environmental system' },
    { label: 'BOCW registration', value: 'Building & Other Construction Workers Act' },
    { label: 'PF & ESIC', value: 'Full statutory coverage for every worker' },
    { label: 'Workmen compensation', value: 'Policy cover maintained site-wide' }
  ]
}

export const equipment = {
  eyebrow: 'Plant & equipment',
  title: 'The right machine, on site, before it is needed.',
  intro:
    'We own and maintain the core fleet that keeps critical-path work moving: earthmoving, lifting, concreting, compaction and survey. Owned plant means we do not queue behind another contractor’s programme.',
  image: img.equipment,
  secondaryImage: img.equipment2,
  stats: [
    { value: '186', label: 'owned plant units' },
    { value: '98.2%', label: 'fleet availability in 2025' },
    { value: '24', label: 'in-house mechanics and technicians' },
    { value: '7', label: 'regional plant yards' }
  ],
  categories: [
    {
      name: 'Earthmoving & excavation',
      image: img.equipment,
      items: ['Hydraulic excavators — 20T to 45T', 'Mini excavators for restricted access', 'Backhoe loaders', 'Bulldozers and rippers', 'Tippers and articulated dumpers', 'Compaction rollers — soil and asphalt'],
      note: 'Owned fleet of 54 units with telematics on all excavators for utilisation and idle-time reporting.'
    },
    {
      name: 'Lifting & hoisting',
      image: img.site,
      items: ['Tower cranes — 8T to 16T capacity', 'Mobile cranes up to 100T', 'Passenger and material hoists', 'Telehandlers and boom lifts', 'Scissor lifts and aluminium towers', 'Cable-hoist systems for restricted sites'],
      note: 'Third-party examination of every lifting appliance at six-month intervals with documented statutory records.'
    },
    {
      name: 'Concrete & production',
      image: img.quality,
      items: ['Concrete pumps — line and boom', 'Batching plant (in-situ on large projects)', 'Transit mixers', 'Vibrators, screeds and power floats', 'Batching and curing equipment', 'Admixture dosing systems'],
      note: 'Concrete is placed to an approved pour card with slump, temperature and cube sampling recorded for every element.'
    },
    {
      name: 'Survey & digital site',
      image: img.drawings,
      items: ['Total stations and GNSS survey equipment', 'Automatic and digital levels', 'Drone survey and progress capture', 'Ground penetration radar (utility survey)', 'Laser scanning for as-built verification', 'Digital site record hardware and tablets'],
      note: 'Digital progress capture at every site with verified drone surveys issued monthly alongside progress reporting.'
    },
    {
      name: 'Compaction & infrastructure',
      image: img.sectorInfrastructure,
      items: ['Tandem and pneumatic rollers', 'Plate compactors and rammers', 'Asphalt pavers', 'Trenchers and utility equipment', 'Dewatering pumps and generators', 'Shotcrete and grouting equipment'],
      note: 'Deployed on road, water network and municipal works packages with full statutory compliance records.'
    },
    {
      name: 'Temporary works & support',
      image: img.equipment2,
      items: ['Cuplock, frame and aluminium formwork', 'Table and tunnel formwork systems', 'Tower crane bases and tie systems', 'Edge protection and safety systems', 'Site offices, stores and welfare units', 'Temporary power distribution'],
      note: 'Temporary works are designed, checked and signed off by a qualified temporary works coordinator on every project.'
    }
  ],
  maintenance: [
    { title: 'Planned preventive maintenance', text: 'Every unit follows a manufacturer-schedule service plan logged in a fleet register, with compliance reported monthly.' },
    { title: 'Owned workshops', text: 'Seven regional yards with in-house mechanics, parts stock and mobile service vehicles for site breakdown response.' },
    { title: 'Utilisation reporting', text: 'Monthly utilisation and idle-time reporting drives hire-or-own decisions — no idling plant billed to a client.' },
    { title: 'Statutory compliance', text: 'Form 11, third-party inspections, DGMS and road permits maintained and auditable for every machine.' },
    { title: 'Operators & training', text: 'Certified operators only, with annual refresher training and documented authorisation to operate.' },
    { title: 'Hired-plant vetting', text: 'Hired plant is inspected, verified and permitted before it enters any Ananta site.' }
  ]
}

export const insights = [
  {
    slug: 'preconstruction-matters',
    date: '08 June 2026',
    dateISO: '2026-06-08',
    type: 'Perspective',
    category: 'Preconstruction',
    title: 'Why preconstruction is the most important part of building well.',
    image: img.drawings,
    excerpt:
      'A better project does not start with site mobilisation. It starts with the conversations that make the right decisions possible.',
    author: 'Arjun Deshpande',
    authorRole: 'Director — Commercial & Preconstruction',
    readingTime: '6 min read',
    featured: true,
    body: [
      'The decisions made before a site mobilises have an outsized impact on what follows. They shape safety, cost, programme and, ultimately, the experience of everyone who will use the finished place.',
      'Preconstruction is where a delivery team turns a design ambition into a shared, buildable plan. It is a disciplined period of listening, testing and aligning — not a box to be checked before the real work begins.',
      'Three questions decide most of the outcome. Can this geometry be built within the boundary and access actually available? Does the cost model survive a live market rate check rather than a published index? And is the programme monsoon-realistic? Owners who get honest answers to those three questions in month one avoid the three most expensive conversations of their project.',
      'At Ananta we bring construction thinking to the table early. We map constraints, challenge assumptions constructively and build clear accountability around each decision. The result is fewer surprises and more space for the ideas that make a project distinctive.',
      'The commercial argument is straightforward: on the projects where we were engaged before design freeze, the average value-engineering saving identified was 18% of the initial cost plan. On projects where we inherited a locked design, it was 4%.'
    ],
    tags: ['Preconstruction', 'Cost planning', 'Risk']
  },
  {
    slug: 'atlas-milestone',
    date: '21 May 2026',
    dateISO: '2026-05-21',
    type: 'Project note',
    category: 'Projects',
    title: 'Atlas Business Park reaches a new milestone in Andheri East.',
    image: img.project1,
    excerpt:
      'The commercial campus has reached its façade completion milestone through a coordinated programme of specialist work fronts.',
    author: 'Atlas project team',
    authorRole: 'Project delivery',
    readingTime: '4 min read',
    featured: true,
    body: [
      'This month the Atlas team completed a major façade milestone at the Andheri East campus. The achievement reflects careful planning across structure, façade and MEP teams working to a single coordinated sequence.',
      'With the envelope now advancing floor by floor, our attention turns to the interior systems and public-realm work that will bring the workplace campus to life.',
      'The project remains a case study in urban coordination: a constrained site, live neighbouring operations and an ambition for a high-performing future workplace. Thirty-four trade packages are being sequenced through a digital site model, with materials called off to a forty-minute delivery window because the site simply has no space to store them.',
      'Topping out happened eight days ahead of baseline. That margin came from two decisions made in preconstruction: pre-assembling MEP modules off site to reduce crane demand, and pre-purchasing the unitised façade before the structure reached level six.'
    ],
    tags: ['Projects', 'Commercial', 'Digital delivery']
  },
  {
    slug: 'site-leaders-safety',
    date: '03 April 2026',
    dateISO: '2026-04-03',
    type: 'People',
    category: 'Safety',
    title: 'Meet the site leaders shaping a stronger safety culture.',
    image: img.hse,
    excerpt:
      'The best safety cultures are visible in the questions people ask and the care they bring to the smallest detail.',
    author: 'Fatima Qureshi',
    authorRole: 'Head — Safety, Quality & Environment',
    readingTime: '5 min read',
    featured: false,
    body: [
      'Safety is not a poster or a once-a-week conversation. It is a habit built through consistent leadership and an environment where everyone can speak up.',
      'Our site leaders create the conditions for that habit every day: clear briefings, thoughtful planning, regular checks and genuine respect for the people doing the work.',
      'The single behavioural change that has mattered most is also the simplest: supervisors now ask “what could hurt you today?” instead of “are you being safe?”. The first question produces a list; the second produces a nod.',
      'That daily discipline protects our teams and gives every project a stronger foundation for quality and progress. Four million man-hours without a lost-time incident is the evidence.'
    ],
    tags: ['Safety', 'People', 'Culture']
  },
  {
    slug: 'handover-performance',
    date: '18 March 2026',
    dateISO: '2026-03-18',
    type: 'Ideas',
    category: 'Delivery',
    title: 'From handover to high performance: building for the long term.',
    image: img.workplace,
    excerpt: 'A considered handover protects building performance long after the construction programme ends.',
    author: 'Meera Sathe',
    authorRole: 'Director — Operations',
    readingTime: '5 min read',
    featured: false,
    body: [
      'Handover is a moment of transition, not an end point. The most valuable projects equip operators with the knowledge and clarity they need to make a place perform from day one.',
      'We plan commissioning, training and documentation as connected parts of delivery — ensuring systems and people are ready together.',
      'Two practices make the difference. First, commissioning criteria are written at design stage, so testing measures something the client actually cares about. Second, operator training happens before beneficial occupation, not after the contractor has demobilised and the site knowledge has left the building.',
      'This approach makes the value of thoughtful construction visible over the lifetime of the asset, not just at practical completion.'
    ],
    tags: ['Commissioning', 'Facility performance']
  },
  {
    slug: 'exceptional-project-controls',
    date: '27 February 2026',
    dateISO: '2026-02-27',
    type: 'People',
    category: 'Project controls',
    title: 'The quiet discipline behind an exceptional project control team.',
    image: img.team,
    excerpt: 'Good project control gives teams the confidence to move decisively.',
    author: 'Ananta Editorial',
    authorRole: 'Editorial team',
    readingTime: '4 min read',
    featured: false,
    body: [
      'Behind every reliable programme is a team making data useful to people — turning information into timely, practical choices.',
      'Our controls teams connect the fine detail of a work front with the wider picture of cost, sequence and risk.',
      'The metric we watch most closely is not schedule variance. It is the number of open decisions older than seven days. A project with twelve ageing decisions is a project that is about to slip, no matter what the float chart says.',
      'The discipline may be quiet, but its impact is felt by every partner around the table.'
    ],
    tags: ['Project controls', 'Programme', 'Risk']
  },
  {
    slug: 'mumbai-workplaces',
    date: '11 January 2026',
    dateISO: '2026-01-11',
    type: 'Perspective',
    category: 'Sectors',
    title: 'What Mumbai’s changing workplace landscape asks of builders.',
    image: img.sectorCommercial,
    excerpt: 'Today’s workplace needs to work harder for people, operations and the city around it.',
    author: 'R. Krishnan',
    authorRole: 'Managing Director',
    readingTime: '7 min read',
    featured: false,
    body: [
      'The workplace is changing from a destination for desks into an ecosystem for connection, concentration and culture.',
      'For builders, that means coordinating more flexible systems, richer material experiences and higher expectations for environmental performance — usually inside a live, dense urban environment with neighbours on three sides.',
      'Three things are being asked of us repeatedly. Acoustic separation between collaboration and focus zones, because open floors failed at exactly that. Flexibility in the base build so a floor can change tenancy without demolition. And honest energy performance, measured after occupation rather than modelled before.',
      'It also means delivering with care inside dense urban environments — something Mumbai teams know deeply, and something no amount of digital coordination replaces.'
    ],
    tags: ['Sectors', 'Workplace', 'Mumbai']
  },
  {
    slug: 'monsoon-programming',
    date: '05 December 2025',
    dateISO: '2025-12-05',
    type: 'Ideas',
    category: 'Programme',
    title: 'Programming for the monsoon instead of apologising for it.',
    image: img.heroAlt,
    excerpt: 'Every Indian project plan has a weather problem. Most of them pretend otherwise.',
    author: 'Meera Sathe',
    authorRole: 'Director — Operations',
    readingTime: '6 min read',
    featured: false,
    body: [
      'We have never reviewed a baseline programme that accounted honestly for a Mumbai or Konkan monsoon. The rainfall is not a surprise; it arrives every year, in roughly the same months, with roughly the same volume.',
      'A monsoon-realistic programme front-loads excavation, foundations, water-tight envelopes and external works, and it reserves genuinely weather-independent activities — MEP rough-ins, joinery, commissioning, documentation — for the wet months.',
      'It also changes procurement. Steel, façade units and long-lead imports are ordered against an erection calendar that respects the season, not against a generic lead time.',
      'The result is not a plan that beats the weather. It is a plan where the weather was already counted.'
    ],
    tags: ['Programme', 'Planning', 'Risk']
  },
  {
    slug: 'digital-site-record',
    date: '14 November 2025',
    dateISO: '2025-11-14',
    type: 'Innovation',
    category: 'Digital delivery',
    title: 'What a digital site record actually changes on a construction project.',
    image: img.quality,
    excerpt: 'Paper records tell you what someone wrote. A digital record tells you what is true right now.',
    author: 'Ananta Editorial',
    authorRole: 'Editorial team',
    readingTime: '5 min read',
    featured: false,
    body: [
      'A digital site record is not a tablet instead of a clipboard. It is a live, indexed view of the same information the whole team is working from — drawings, inspections, snags, photographs, approvals and progress.',
      'The practical change is dispute resolution. When a client questions whether a pour was inspected before the next lift, the answer is a timestamped record with a photograph, not a search through a site register.',
      'The second change is speed. A snag raised in the morning appears on the trade partner’s device within minutes, with the location, the standard and the photograph attached.',
      'We now publish a verified drone progress survey monthly alongside our written report, so progress percentages can be checked rather than believed.'
    ],
    tags: ['Digital delivery', 'Quality', 'Innovation']
  }
]

export const newsroom = [
  { date: '02 September 2026', dateISO: '2026-09-02', type: 'Company', title: 'Ananta opens Bengaluru project office to serve southern clients.', summary: 'The new Outer Ring Road office supports growing healthcare and workplace mandates in Karnataka and Tamil Nadu.', link: '/contact' },
  { date: '18 August 2026', dateISO: '2026-08-18', type: 'Award', title: 'Safety Excellence Award for the second consecutive year.', summary: 'Regional construction safety council recognises 4.2 million man-hours across the Ananta site portfolio without a lost-time incident.', link: '/awards' },
  { date: '27 July 2026', dateISO: '2026-07-27', type: 'Project', title: 'Sunridge Township Phase I hands over its first 180 homes.', summary: 'Possession began ahead of the committed date with internal roads, water and power infrastructure already operational.', link: '/projects/sunridge-township' },
  { date: '09 June 2026', dateISO: '2026-06-09', type: 'Project', title: 'Atlas Business Park tops out eight days ahead of baseline.', summary: 'The twelve-storey Andheri East campus completed its structure ahead of programme with zero reportable safety incidents.', link: '/projects/atlas-business-park' },
  { date: '22 April 2026', dateISO: '2026-04-22', type: 'Company', title: 'Contractor and worker registration programme announced.', summary: 'A new digital route for trade partners, subcontractors and site workers to register their capability and interest with Ananta.', link: '/register' },
  { date: '15 March 2026', dateISO: '2026-03-15', type: 'Certification', title: 'IGBC Platinum application filed for Capasite House.', summary: 'Design and as-built performance data submitted for the 58,000 sq. ft. low-carbon workplace headquarters.', link: '/projects/capasite-house' },
  { date: '30 January 2026', dateISO: '2026-01-30', type: 'People', title: 'Skill training centre passes 640 certifications.', summary: 'Free training for masons, bar benders, shuttering carpenters and electricians, with 71% of graduates placed.', link: '/about' }
]

export const tenders = {
  eyebrow: 'Tenders & e-procurement',
  title: 'A fair, documented route to working with us.',
  intro:
    'We publish our tender and prequalification requirements openly and evaluate every submission against the same published criteria. No relationship is required to be considered.',
  image: img.drawings,
  process: [
    { number: '01', title: 'Register', text: 'Complete the contractor registration form with your trades, licences, capacity and past performance.' },
    { number: '02', title: 'Prequalification', text: 'We verify statutory registration, financial standing, safety record and technical capability against the package requirements.' },
    { number: '03', title: 'Invitation & clarification', text: 'Prequalified partners receive the enquiry documents. All clarifications are issued to every bidder in writing.' },
    { number: '04', title: 'Commercial evaluation', text: 'Bids are opened and evaluated on price, programme, safety performance, quality plan and capability — published weightings.' },
    { number: '05', title: 'Award & onboarding', text: 'Successful bidders complete documented onboarding, including safety induction and site-specific permits.' }
  ],
  criteria: [
    { label: 'Commercial competitiveness', weight: '35%' },
    { label: 'Technical capability & resources', weight: '25%' },
    { label: 'Safety performance record', weight: '20%' },
    { label: 'Quality plan & methodology', weight: '12%' },
    { label: 'Programme reliability', weight: '8%' }
  ],
  requirements: [
    'Registered legal entity with PAN, GST and applicable trade licences',
    'Statutory labour registration (BOCW, PF, ESIC) where labour is employed',
    'Workmen compensation and third-party liability insurance in force',
    'Documented safety policy and trained HSE supervisor for site works',
    'Minimum three comparable projects completed in the last five years',
    'Audited financial statements for the last three financial years',
    'Machinery and manpower schedule for the packages applied for',
    'Clean record on statutory dues and labour disputes'
  ],
  packages: [
    { name: 'Civil & structural works', type: 'Subcontract', scale: '₹ 2 Cr – ₹ 60 Cr', status: 'Always open' },
    { name: 'MEP & building services', type: 'Subcontract', scale: '₹ 1 Cr – ₹ 45 Cr', status: 'Always open' },
    { name: 'Interior fit-out & joinery', type: 'Subcontract', scale: '₹ 50 L – ₹ 25 Cr', status: 'Always open' },
    { name: 'Façade & glazing systems', type: 'Specialist', scale: '₹ 2 Cr – ₹ 35 Cr', status: 'Specialist packages' },
    { name: 'Piling & foundation works', type: 'Specialist', scale: '₹ 1 Cr – ₹ 30 Cr', status: 'Specialist packages' },
    { name: 'Equipment & plant hire', type: 'Supply', scale: 'Per schedule', status: 'Always open' },
    { name: 'Materials & bulk supply', type: 'Supply', scale: 'Per schedule', status: 'Always open' },
    { name: 'Professional services', type: 'Consultancy', scale: 'Per assignment', status: 'By invitation' }
  ],
  note: 'Tender enquiries, RFP clarifications and bid submission queries: support@anantainfratechsolutions.com · +91 22 4968 2031'
}

export const downloads = {
  eyebrow: 'Downloads',
  title: 'Company documents & capability statements.',
  intro: 'Request our brochures, capability statements, compliance documentation and safety records. Complete the form and we will email the documents you select.',
  documents: [
    { id: 'company-profile', title: 'Company profile', text: 'An overview of Ananta: capability, sectors, plant, people and portfolio.', meta: 'PDF · 4.2 MB', tag: 'Corporate' },
    { id: 'capability-statement', title: 'Capability statement', text: 'Detailed service capability, delivery method, team structure and coverage.', meta: 'PDF · 2.8 MB', tag: 'Corporate' },
    { id: 'hse-records', title: 'HSE records & safety statistics', text: 'Safety performance statistics, incident rates and management system summary.', meta: 'PDF · 1.6 MB', tag: 'Compliance' },
    { id: 'quality-manual', title: 'Quality management summary', text: 'Quality policy, ITP approach, testing regime and handover protocol.', meta: 'PDF · 1.1 MB', tag: 'Compliance' },
    { id: 'sustainability-report', title: 'Sustainability performance summary', text: 'Environmental metrics, targets and progress against our 2030 commitments.', meta: 'PDF · 1.2 MB', tag: 'ESG' },
    { id: 'equipment-schedule', title: 'Plant & equipment schedule', text: 'Owned fleet inventory with capacity, specification and availability.', meta: 'PDF · 880 KB', tag: 'Technical' },
    { id: 'prequalification', title: 'Prequalification dossier', text: 'Statutory registrations, financials, references and technical capability.', meta: 'PDF · 3.4 MB', tag: 'Procurement' },
    { id: 'portfolio-sheets', title: 'Project portfolio sheets', text: 'One-page case sheets for sixteen representative Ananta projects.', meta: 'PDF · 6.1 MB', tag: 'Portfolio' }
  ]
}

export const faq = {
  eyebrow: 'Questions',
  title: 'Answers before you ask.',
  intro: 'The questions we are asked most often by clients, contractors, suppliers and candidates. If yours is not here, write to us — we answer within one working day.',
  categories: [
    {
      name: 'Working with Ananta',
      items: [
        { question: 'What size of project do you take on?', answer: 'Our delivery model suits mandates between roughly ₹ 15 Cr and ₹ 450 Cr. Below that range we occasionally take on work where we have an existing site and team nearby; above it we partner rather than lead alone.' },
        { question: 'Which regions do you cover?', answer: 'We are headquartered in Mumbai with project offices in Pune and Bengaluru and a regional office in Noida. We work across Maharashtra, Delhi NCR, Gujarat, Karnataka and Telangana, and will mobilise to other states for the right long-term client.' },
        { question: 'Can we appoint you for preconstruction only?', answer: 'Yes. Roughly a quarter of our preconstruction commissions are advisory-only, with no obligation to appoint us for delivery. We are comfortable being measured on the advice, not the contract.' },
        { question: 'Do you work with the client’s existing consultants and architects?', answer: 'Almost always. We join existing teams far more often than we assemble new ones and we do not require the replacement of any consultant.' },
        { question: 'How do you price work — lump sum, GMP or cost plus?', answer: 'All three. Lump sum for fully designed work, guaranteed maximum price where the design is developing, and cost-plus with an open-book audit where scope is genuinely uncertain, such as refurbishment.' },
        { question: 'What does your weekly reporting include?', answer: 'Progress against baseline, cost committed and forecast, safety statistics, quality and inspection status, open risks with owners, decisions required from the client, and photographs with a verified progress measure.' },
        { question: 'How quickly do you respond to an enquiry?', answer: 'Every enquiry is acknowledged within one working day and routed to a named lead. If we are not the right partner for your project we will say so directly rather than leave you waiting.' }
      ]
    },
    {
      name: 'Contractors & suppliers',
      items: [
        { question: 'How do I register as a contractor or supplier?', answer: 'Complete the contractor registration form on our registration page. It captures your trades, statutory registrations, capacity, machinery and past performance. Prequalification review takes up to ten working days.' },
        { question: 'What documents do I need to submit?', answer: 'PAN, GST registration, applicable trade licences, BOCW/PF/ESIC registration if you employ labour, workmen compensation insurance, audited financials for three years, and details of three comparable completed projects.' },
        { question: 'Do I need a relationship with someone at Ananta to be invited?', answer: 'No. Registration is the only entry point, evaluation criteria are published, and every prequalified partner receives the same enquiry documents and clarifications.' },
        { question: 'How long does payment take?', answer: 'Certified bills are processed within 30 days of measurement sign-off. We do not hold retention beyond the contractual defect liability period, and payment terms are stated in every subcontract.' },
        { question: 'Do you pay for prequalification or tender participation?', answer: 'No, and we do not charge for it either. We never ask for a fee, deposit or inducement to be considered for work, and any such request should be reported immediately.' }
      ]
    },
    {
      name: 'Workers & candidates',
      items: [
        { question: 'When does worker registration open?', answer: 'Worker registration is launching soon. Register your interest now and you will be among the first to be contacted when registration opens. There is no cost and no obligation.' },
        { question: 'What kinds of roles will be available?', answer: 'Site execution (masonry, bar bending, shuttering, finishing), equipment operation and maintenance (excavator, crane, hoist, plant), technical trades (electrician, plumber, welder, fabricator, HVAC, fire), safety and quality, stores and logistics, and supervision.' },
        { question: 'Do I need prior experience or certification?', answer: 'Many roles require verified experience and, for equipment operation, statutory certification. We also run a free skill training centre and actively hire people who complete it, so lack of certification is not necessarily a barrier.' },
        { question: 'Will you help with training and certification?', answer: 'Yes. Our training centre certifies masons, bar benders, shuttering carpenters and electricians at no cost, and we support workers in obtaining safety and equipment certifications.' },
        { question: 'How do I apply for a staff or engineering job?', answer: 'Use the careers page for current staff vacancies. Roles are listed with location, experience and responsibilities, and applications go directly to our recruitment team.' }
      ]
    },
    {
      name: 'Safety, quality & compliance',
      items: [
        { question: 'What are your statutory registrations?', answer: 'Building and Other Construction Workers (BOCW) registration, PF and ESIC coverage for every worker, workmen compensation insurance site-wide, GST and PAN registration, and quality, safety and environmental management systems aligned to ISO 9001, 45001 and 14001.' },
        { question: 'What is your safety record?', answer: 'Over 4.2 million safe man-hours with zero lost-time incidents in the last 24 months. Every site carries a qualified HSE officer and every individual on site holds documented stop-work authority.' },
        { question: 'How do you verify quality on site?', answer: 'Every work package has an inspection and test plan with named inspectors and recorded sign-offs. Critical structural elements receive independent third-party testing, and all records form part of the handover dossier.' },
        { question: 'Are you insured?', answer: 'Yes — contract works, third-party liability, workmen compensation and plant insurance are maintained for all projects, with certificates provided during onboarding.' }
      ]
    }
  ]
}

export const careers = {
  eyebrow: 'Careers at Ananta',
  title: 'Make your mark on what matters.',
  intro:
    'We are builders, planners, engineers and problem-solvers who believe the industry can move forward with more care and more imagination. If you want your work inspected by people who take it personally, you will fit here.',
  image: img.culture,
  heroStats: [
    { value: '480+', label: 'people in the team' },
    { value: '5.2 yrs', label: 'average site-leadership tenure' },
    { value: '640', label: 'workers trained in our centre' },
    { value: '8', label: 'states of operation' }
  ],
  whyJoin: [
    { title: 'Real responsibility, early', text: 'We are mid-sized on purpose. Engineers run packages within a year, not a decade, and directors are on site weekly rather than on a chart.' },
    { title: 'Safety you can rely on', text: 'Four million man-hours without a lost-time incident is not a slogan — it is the reason you can go home and say you worked safely today.' },
    { title: 'Learning that is funded', text: 'Certification, professional membership and statutory training are paid for. Structured mentoring pairs every new engineer with a site leader.' },
    { title: 'Pay and benefits that are real', text: 'Benchmarked salaries, performance bonus, medical insurance for you and dependants, PF and gratuity, and timely settlement of every claim.' },
    { title: 'A career path, written down', text: 'Clear progression bands from graduate engineer to project manager, with the criteria published so you know exactly what the next step requires.' },
    { title: 'Work that is worth the effort', text: 'Hospitals that stayed open during construction. Homes people waited years for. Infrastructure a city uses daily. It matters.' }
  ],
  benefits: [
    { label: 'Medical insurance', detail: 'Self, spouse, children and parents' },
    { label: 'Performance bonus', detail: 'Linked to project and personal delivery' },
    { label: 'Accommodation or HRA', detail: 'Site and relocation support where posted' },
    { label: 'Certification support', detail: 'Fees and study leave funded' },
    { label: 'Structured mentoring', detail: 'Paired with a site leader for 12 months' },
    { label: 'Provident fund & gratuity', detail: 'Statutory, settled on time' },
    { label: 'Annual health check', detail: 'For all site-based staff' },
    { label: 'Leave that is respected', detail: 'You will actually get to take it' }
  ],
  hiringProcess: [
    { number: '01', title: 'Application', text: 'Submit your details against the role. Every application receives an acknowledgement.' },
    { number: '02', title: 'Screening call', text: 'A 20-minute conversation with our recruitment team about your experience and expectations.' },
    { number: '03', title: 'Technical interview', text: 'A discussion with the hiring manager covering your technical work and how you solve problems.' },
    { number: '04', title: 'Site or panel round', text: 'Where relevant, a site visit or a panel conversation with a director.' },
    { number: '05', title: 'Offer & onboarding', text: 'Written offer with a documented structure, followed by structured onboarding.' }
  ],
  growthProgrammes: [
    { title: 'Graduate engineer programme', text: 'A two-year structured rotation across site execution, planning and commercial — with a mentor, quarterly reviews and a project of your own in year two.', duration: '24 months' },
    { title: 'Site leadership track', text: 'For supervisors and engineers moving into site management: temporary works, programme control, trade management and people leadership.', duration: '12 months' },
    { title: 'Skill certification centre', text: 'Free certification for masons, bar benders, shuttering carpenters and electricians, with placement support across our projects.', duration: '6–12 weeks' },
    { title: 'Professional membership support', text: 'Sponsored membership and exam support for ICE, IEI, RICS and NEBOSH qualifications.', duration: 'As required' }
  ],
  contact: { name: 'Talent team', email: 'support@anantainfratechsolutions.com', phone: '+91 22 4968 2020', note: 'Applications are reviewed within five working days. If you have not heard back in two weeks, write to us — we will tell you where your application stands.' }
}

export const jobs = [
  {
    id: 'senior-project-manager',
    title: 'Senior Project Manager',
    department: 'Project Delivery',
    location: 'Mumbai, Maharashtra',
    type: 'Full-time',
    experience: '12–18 years',
    salary: '₹ 28 – 38 LPA',
    posted: '12 September 2026',
    urgency: 'Urgent',
    summary:
      'Lead delivery of large commercial and mixed-use projects from preconstruction through handover, with full accountability for programme, cost, quality and safety.',
    responsibilities: [
      'Own the project programme, cost position and quality outcomes end to end',
      'Lead and develop a site team of 40–80 people across all disciplines',
      'Chair client meetings and issue the weekly delivery report',
      'Manage trade package procurement, award and administration with the commercial team',
      'Drive the safety agenda on site with the project HSE officer',
      'Manage client relationships and resolve issues before they escalate'
    ],
    requirements: [
      'B.E. / B.Tech in Civil Engineering (M.E./M.Tech preferred)',
      '12–18 years with at least 5 years as a project manager on projects above ₹ 100 Cr',
      'Proven experience in RCC high-rise and complex urban sites',
      'Working knowledge of planning software (Primavera / MS Project) and digital site systems',
      'Strong commercial literacy — valuations, variations, claims and cash flow',
      'Demonstrable safety leadership record'
    ],
    nice: ['PMP or equivalent certification', 'Experience with IGBC / GRIHA certified projects', 'Exposure to design-and-build contracts']
  },
  {
    id: 'planning-engineer',
    title: 'Planning Engineer',
    department: 'Planning & Project Controls',
    location: 'Mumbai / Pune',
    type: 'Full-time',
    experience: '4–8 years',
    salary: '₹ 10 – 18 LPA',
    posted: '05 September 2026',
    urgency: 'Open',
    summary:
      'Build and maintain the programmes our projects are delivered against, and keep the reporting honest, current and genuinely useful to the site team.',
    responsibilities: [
      'Prepare and maintain baseline and resource-loaded programmes',
      'Produce weekly and monthly progress reports with earned value analysis',
      'Run critical path and delay analysis, and flag slippage early',
      'Coordinate with trade partners on look-ahead programmes',
      'Support tender planning and methodology submissions',
      'Maintain the project risk register alongside the project manager'
    ],
    requirements: [
      'B.E. Civil Engineering or equivalent',
      '4–8 years in planning on construction projects above ₹ 50 Cr',
      'Advanced Primavera P6 and MS Project skills',
      'Understanding of earned value, S-curves and delay analysis',
      'Excellent written English and disciplined documentation habits'
    ],
    nice: ['Exposure to 4D BIM / Synchro', 'Experience in claims and extension-of-time submissions']
  },
  {
    id: 'quantity-surveyor',
    title: 'Quantity Surveyor',
    department: 'Commercial & Contracts',
    location: 'Mumbai, Maharashtra',
    type: 'Full-time',
    experience: '3–7 years',
    salary: '₹ 8 – 15 LPA',
    posted: '28 August 2026',
    urgency: 'Open',
    summary:
      'Own measurement, valuation, variations and subcontract commercial administration so that our projects stay financially honest.',
    responsibilities: [
      'Prepare and certify interim valuations and final accounts',
      'Measure and price variations, and maintain the variation register',
      'Administer subcontract packages from enquiry to final account',
      'Reconcile materials, wastage and consumption against the estimate',
      'Support monthly cost reporting and cash-flow forecasting',
      'Assist with claims documentation and substantiation'
    ],
    requirements: [
      'B.E. Civil or B.Arch with a quantity surveying diploma',
      '3–7 years of quantity surveying on building or infrastructure projects',
      'Strong knowledge of CESMM / IS measurement standards',
      'Proficiency in AutoCAD, Excel-based measurement and ERP systems',
      'Commercial acumen with a documented eye for detail'
    ],
    nice: ['RICS or AIQS membership / progress toward it', 'Experience in dispute and claim substantiation']
  },
  {
    id: 'safety-officer',
    title: 'Safety Officer',
    department: 'Safety, Quality & Environment',
    location: 'Multiple sites — Maharashtra',
    type: 'Full-time',
    experience: '3–8 years',
    salary: '₹ 6 – 12 LPA',
    posted: '22 August 2026',
    urgency: 'Urgent',
    summary:
      'Own safety on a live construction site: the briefings, the permits, the audits and the culture that keeps 200 people safe every day.',
    responsibilities: [
      'Conduct daily toolbox talks, inductions and safety briefings',
      'Issue, monitor and audit permit-to-work systems for high-risk activities',
      'Perform daily site inspections and close out observations',
      'Investigate and report incidents and near-misses within 24 hours',
      'Verify statutory compliance, PPE, welfare and worker documentation',
      'Lead emergency drills and maintain response readiness'
    ],
    requirements: [
      'Diploma or degree in engineering with a recognised safety qualification',
      'Advanced Diploma in Industrial Safety or equivalent (mandatory)',
      '3–8 years as a safety officer on construction sites above ₹ 30 Cr',
      'Working knowledge of BOCW, Factories Act and construction safety standards',
      'The confidence to stop work when it is unsafe, and the judgement to know when'
    ],
    nice: ['NEBOSH IGC or IOSH certification', 'Behavioural safety programme experience']
  },
  {
    id: 'site-engineer-civil',
    title: 'Site Engineer — Civil',
    department: 'Project Delivery',
    location: 'Pune / Bengaluru / Noida',
    type: 'Full-time',
    experience: '2–6 years',
    salary: '₹ 5 – 10 LPA',
    posted: '14 August 2026',
    urgency: 'Open',
    summary:
      'Run a work front: setting out, sequencing the trades, controlling quality and getting the work done right the first time.',
    responsibilities: [
      'Execute assigned work fronts to drawing, specification and programme',
      'Set out works and verify levels and alignments against drawings',
      'Raise and close RFIs with the design team',
      'Control concrete quality, reinforcement, shuttering and finishes',
      'Maintain daily progress records, pour cards and inspection sign-offs',
      'Coordinate trade partners, labour and plant on your front'
    ],
    requirements: [
      'B.E. / B.Tech in Civil Engineering or a diploma with strong site experience',
      '2–6 years of site execution on building projects',
      'Strong working knowledge of RCC construction and quality control',
      'Ability to read structural and architectural drawings in detail',
      'Comfortable with site digital tools, measurement and reporting'
    ],
    nice: ['Exposure to high-rise or hospital projects', 'Temporary works awareness']
  },
  {
    id: 'mep-engineer',
    title: 'MEP Engineer',
    department: 'Engineering & Technical Services',
    location: 'Noida / Mumbai',
    type: 'Full-time',
    experience: '5–10 years',
    salary: '₹ 12 – 20 LPA',
    posted: '06 August 2026',
    urgency: 'Open',
    summary:
      'Coordinate and deliver building services — HVAC, electrical, plumbing and fire — with clash-free drawings and evidence-based commissioning.',
    responsibilities: [
      'Review consultant designs for buildability, capacity and code compliance',
      'Coordinate shop drawings and federated BIM models across disciplines',
      'Manage MEP subcontractors on programme, quality and commercial matters',
      'Witness testing, balancing and commissioning and verify results',
      'Compile O&M documentation, warranties and operator training records',
      'Support the client at handover with system performance evidence'
    ],
    requirements: [
      'B.E. / B.Tech in Mechanical or Electrical Engineering',
      '5–10 years of MEP coordination on commercial or healthcare projects',
      'Working knowledge of AutoCAD, Revit MEP and Navisworks',
      'Understanding of IS, NBC and NBC-linked fire codes',
      'Experience commissioning HVAC and electrical systems on live sites'
    ],
    nice: ['Healthcare or cleanroom MEP experience', 'Energy modelling exposure']
  },
  {
    id: 'bim-coordinator',
    title: 'BIM Coordinator',
    department: 'Engineering & Technical Services',
    location: 'Mumbai, Maharashtra',
    type: 'Full-time',
    experience: '3–7 years',
    salary: '₹ 8 – 16 LPA',
    posted: '30 July 2026',
    urgency: 'Open',
    summary:
      'Own the federated model. Resolve clashes on screen so that nobody has to resolve them in a ceiling void.',
    responsibilities: [
      'Maintain and federate multidisciplinary BIM models',
      'Run clash detection cycles and drive resolution with each discipline',
      'Produce coordinated shop drawings, schedules and quantity take-offs',
      'Manage the common data environment and model version control',
      'Support site teams with model-based progress and as-built verification',
      'Train project staff on model use and digital site workflows'
    ],
    requirements: [
      'Degree in engineering, architecture or a BIM specialisation',
      '3–7 years in BIM coordination on construction projects',
      'Advanced Revit, Navisworks and AutoCAD skills',
      'Understanding of ISO 19650 and model exchange standards',
      'Clear communication — the role is coordination, not just software'
    ],
    nice: ['4D/5D BIM experience with Synchro or similar', 'Digital twin or laser-scanning exposure']
  },
  {
    id: 'contracts-manager',
    title: 'Contracts & Claims Manager',
    department: 'Commercial & Contracts',
    location: 'Mumbai, Maharashtra',
    type: 'Full-time',
    experience: '10–16 years',
    salary: '₹ 22 – 34 LPA',
    posted: '18 July 2026',
    urgency: 'Open',
    summary:
      'Own the contractual position across our portfolio: risk allocation at tender, administration during delivery and resolution when positions diverge.',
    responsibilities: [
      'Review and negotiate contract terms and conditions at tender stage',
      'Advise project teams on contractual entitlement and obligation',
      'Prepare, substantiate and negotiate claims and extension of time',
      'Manage dispute resolution and arbitration with external counsel',
      'Maintain the contract risk register and insurance position',
      'Train delivery teams on contractual awareness and record keeping'
    ],
    requirements: [
      'Law degree with construction experience, or a civil engineering degree with a construction law qualification',
      '10–16 years in construction contracts, with claims exposure',
      'Deep knowledge of FIDIC, CPWD and Indian contract frameworks',
      'Proven arbitration and dispute resolution experience',
      'Exceptional written substantiation'
    ],
    nice: ['Membership of a professional contracts or arbitration body', 'Experience across both client-side and contractor-side roles']
  }
]

export const register = {
  /**
   * Applications switch.
   *
   * `enabled: false` keeps the whole registration section on the website but
   * closed: every link is labelled "Coming soon", the page explains what is
   * being built, and the API refuses submissions so nobody is left expecting a
   * reply that cannot come yet. Set it to true from Admin → Careers &
   * registration when the portal is ready to accept applications.
   */
  enabled: false,
  status: 'Coming soon',
  eyebrow: 'Contractor & worker registration',
  title: 'Register your interest with Ananta.',
  intro:
    'We are building a verified network of contractors, suppliers and skilled workers across our project regions. Registration opens shortly — here is exactly what is coming, and how to reach the team in the meantime.',
  image: img.team,
  launch: {
    status: 'Coming soon',
    headline: 'Our registration portal opens shortly.',
    note: 'The full registration portal — with document upload, licence verification and automatic prequalification scoring — is in final build. Applications are not open yet: nothing you send today would be processed. Use the contact routes below and our procurement and HR teams will reach you first when opening dates are confirmed.',
    date: 'Registration opens in phases from Q1 2027'
  },
  comingSoon: {
    headline: 'Two registration tracks are being built.',
    text: 'When the portal opens, contractors and workers will register on separate tracks, each with its own verification and its own team looking after it. Both are described below so you know exactly what to prepare.',
    whatsComing: [
      { title: 'Document upload', text: 'Licences, GST, PAN, insurance and financial statements uploaded and stored against your profile.' },
      { title: 'Licence & registration checks', text: 'Automated validation of GST, EPF, ESIC and BOCW registration numbers as you type them.' },
      { title: 'Prequalification scoring', text: 'Transparent scoring against published criteria, with the weighting shown to you at the end.' },
      { title: 'Worker verification & training', text: 'Trade verification, certification support and free training placement for site workers.' },
      { title: 'Applications tracking', text: 'Track your registration status by reference number, exactly as our other submissions work today.' },
      { title: 'Direct notifications', text: 'Email and SMS updates when a package matches your trade, scale and region.' }
    ],
    meanwhile: [
      { label: 'Contractors & suppliers', text: 'For subcontract packages, plant hire and material supply.', email: 'support@anantainfratechsolutions.com', phone: '+91 98200 42016' },
      { label: 'Workers & technicians', text: 'For site work, equipment operation and technical trades.', email: 'support@anantainfratechsolutions.com', phone: '+91 98200 42016' }
    ]
  },
  trustPoints: [
    { label: 'No fee, ever', text: 'We never charge for registration, prequalification or tender participation. Report any request for payment immediately.' },
    { label: 'Direct and documented', text: 'Your details go straight into our procurement and HR systems — not through an agent or middleman.' },
    { label: 'Published criteria', text: 'Evaluation criteria and weightings are published. Registration is the only entry point you need.' },
    { label: 'Payments in 30 days', text: 'Certified bills are processed within 30 days of measurement sign-off, on the terms stated in every subcontract.' }
  ],
  contractor: {
    id: 'contractor',
    label: 'Contractor / Supplier',
    short: 'Contractor',
    title: 'Register as a contractor or supplier',
    text: 'For subcontractors, specialist trades and material or equipment suppliers who want to be invited to prequalify for our packages.',
    icon: 'hardhat',
    steps: [
      { title: 'Register your capability', text: 'Trades, scale of work, regions and team strength — this takes about five minutes.' },
      { title: 'Prequalification review', text: 'We verify registrations, financial standing and past performance against our published criteria.' },
      { title: 'Invitation to tender', text: 'Prequalified partners receive enquiry documents for matching packages with equal clarification for all bidders.' }
    ],
    fields: ['Company name', 'Contact person', 'Email', 'Phone', 'Trades', 'Scale', 'GST', 'Regions', 'Licences', 'Past performance'],
    types: [
      'Civil & structural works',
      'MEP & building services',
      'Interior fit-out & joinery',
      'Façade & glazing systems',
      'Piling & foundation works',
      'Equipment & plant hire',
      'Materials & bulk supply',
      'Professional & consultancy services',
      'Other specialist works'
    ],
    scaleOptions: ['Up to ₹ 1 Cr', '₹ 1 Cr – ₹ 5 Cr', '₹ 5 Cr – ₹ 20 Cr', '₹ 20 Cr – ₹ 50 Cr', 'Above ₹ 50 Cr'],
    requirements: ['Legal entity with PAN & GST', 'Trade licence where applicable', 'BOCW/PF/ESIC if employing labour', 'Workmen compensation insurance', 'Three comparable projects in 5 years', 'Audited financials — 3 years'],
    processNote: 'Prequalification review takes up to ten working days. You will receive a written response whether or not your application is successful.'
  },
  worker: {
    id: 'worker',
    label: 'Worker / Technician',
    short: 'Worker',
    title: 'Register as a skilled worker or technician',
    text: 'For site workers, equipment operators and technical trades who want to be considered for our projects and our free training programmes.',
    icon: 'worker',
    steps: [
      { title: 'Register your trade & experience', text: 'Tell us what you do, how long you have done it and where you are available.' },
      { title: 'Verification & training', text: 'We verify experience and certification, and offer free training where certification is missing.' },
      { title: 'Deployment to a project', text: 'Verified workers are placed with our site teams and paid directly through compliant payroll.' }
    ],
    fields: ['Full name', 'Email', 'Phone', 'Trade', 'Experience', 'Certification', 'Preferred location'],
    trades: [
      { group: 'Site execution', items: ['Mason / Bricklayer', 'Bar bender (Steel fixer)', 'Shuttering carpenter', 'Plasterer / Plumber-finisher', 'Tiler / Stone fixer', 'Painter', 'Waterproofing applicator'] },
      { group: 'Equipment operation', items: ['Excavator operator', 'Tower crane operator', 'Mobile crane operator', 'Hoist / lift operator', 'Plant mechanic', 'Driver — heavy vehicle'] },
      { group: 'Technical trades', items: ['Electrician', 'Plumber / Pipefitter', 'Welder / Fabricator', 'HVAC technician', 'Fire system technician', 'Aluminium & glazing fitter'] },
      { group: 'Support & supervision', items: ['Safety steward / first aider', 'Store keeper', 'Survey helper', 'Rigger / Signal man', 'Foreman / Supervisor', 'Quality inspector'] }
    ],
    experienceOptions: ['Less than 1 year', '1 – 3 years', '3 – 5 years', '5 – 10 years', 'More than 10 years'],
    benefits: [
      { title: 'Free skill training', text: 'Our training centre certifies trades at no cost, with a stipend during training and placement support afterwards.' },
      { title: 'Direct, compliant payment', text: 'Wages paid directly through our verified payroll with PF and ESIC coverage — no contractor deduction games.' },
      { title: 'Safety equipment provided', text: 'PPE, health checks and medical insurance provided free of cost to every registered worker.' },
      { title: 'Clean accommodation', text: 'Safe, audited site accommodation with potable water, sanitation, rest areas and canteen facilities.' },
      { title: 'Certification support', text: 'We fund certification for equipment operation, scaffolding, working at height and first aid.' },
      { title: 'A path to permanence', text: 'High performers are absorbed into our permanent workforce — 68 people have made that transition.' }
    ],
    processNote: 'Verification begins when registration opens. You will be contacted by phone and SMS — never by any agent requesting payment.'
  },
  employerNote: {
    title: 'What we ask in return',
    text: 'That you register with the intention of working to our safety and quality standards, that the information you give us is accurate, and that you tell us immediately if anyone attempts to charge you a fee for registration or placement.'
  }
}

export const nav = [
  {
    label: 'Company',
    to: '/about',
    blurb: 'Who we are, how we work and the standards we hold ourselves to on every project.',
    children: [
      { label: 'About us', to: '/about', description: 'Who we are, our values and how we deliver' },
      { label: 'Leadership', to: '/leadership', description: 'The people accountable for delivery' },
      { label: 'Safety, quality & environment', to: '/hse', description: 'Our first deliverable on every project' },
      { label: 'Sustainability & ESG', to: '/sustainability', description: 'Measured environmental performance' },
      { label: 'Awards & certifications', to: '/awards', description: 'Independent recognition and compliance' },
      { label: 'Clients & testimonials', to: '/clients', description: 'What our partners say' },
      { label: 'Plant & equipment', to: '/equipment', description: 'The fleet that keeps work moving' },
      { label: 'Newsroom', to: '/newsroom', description: 'Announcements and press' }
    ]
  },
  {
    label: 'Services',
    to: '/services',
    blurb: 'Eight integrated disciplines covering the whole journey from feasibility to handover and beyond.',
    children: [
      { label: 'All services', to: '/services', description: 'Eight disciplines, one delivery engine' },
      { label: 'Preconstruction & advisory', to: '/services/preconstruction', description: 'Feasibility, estimating, value engineering' },
      { label: 'Construction management', to: '/services/construction-management', description: 'Programme, cost and trade leadership' },
      { label: 'Civil & structural works', to: '/services/civil-structural', description: 'Foundations, RCC frames, steel' },
      { label: 'MEP & building systems', to: '/services/mep-systems', description: 'HVAC, electrical, plumbing, fire' },
      { label: 'Interiors & fit-out', to: '/services/interiors-fitout', description: 'Workplace, hospitality, healthcare' },
      { label: 'Industrial & EPC delivery', to: '/services/industrial-epc', description: 'Plants, warehouses, cold stores' },
      { label: 'Infrastructure & civil engineering', to: '/services/infrastructure', description: 'Bridges, roads, water networks' },
      { label: 'Refurbishment & upgrades', to: '/services/facility-upgrades', description: 'New performance from existing assets' }
    ]
  },
  {
    label: 'Sectors',
    to: '/sectors',
    blurb: 'Each sector carries its own codes, programme logic and definition of quality. We staff for that.',
    children: [
      { label: 'All sectors', to: '/sectors', description: 'Where our experience is deepest' },
      { label: 'Commercial & workplace', to: '/sectors/commercial', description: 'Office campuses and business parks' },
      { label: 'Residential & township', to: '/sectors/residential', description: 'Homes and communities' },
      { label: 'Industrial & logistics', to: '/sectors/industrial', description: 'Plants, warehouses, cold stores' },
      { label: 'Healthcare & life sciences', to: '/sectors/healthcare', description: 'Hospitals and laboratories' },
      { label: 'Hospitality & leisure', to: '/sectors/hospitality', description: 'Hotels, resorts and wellness' },
      { label: 'Infrastructure & public works', to: '/sectors/infrastructure', description: 'Bridges, roads and public realm' }
    ]
  },
  { label: 'Projects', to: '/projects' },
  { label: 'Insights', to: '/insights' },
  {
    label: 'Careers',
    to: '/careers',
    blurb: 'Staff vacancies, contractor and worker registration, and how to supply or tender with us.',
    children: [
      { label: 'Life at Ananta', to: '/careers', description: 'Culture, benefits and open roles' },
      { label: 'Open roles', to: '/careers#open-roles', description: 'Current staff and engineering vacancies' },
      { label: 'Contractor & worker registration', to: '/register', description: 'Coming soon — see what is being built' },
      { label: 'Tenders & e-procurement', to: '/tenders', description: 'Packages, criteria and process' }
    ]
  }
]

export const sitemap = [
  { group: 'Company', links: [
    { label: 'Home', to: '/' }, { label: 'About us', to: '/about' }, { label: 'Leadership', to: '/leadership' },
    { label: 'Safety, quality & environment', to: '/hse' }, { label: 'Sustainability & ESG', to: '/sustainability' },
    { label: 'Awards & certifications', to: '/awards' }, { label: 'Clients & testimonials', to: '/clients' },
    { label: 'Plant & equipment', to: '/equipment' }, { label: 'Newsroom', to: '/newsroom' }
  ] },
  { group: 'Services', links: [
    { label: 'All services', to: '/services' },
    { label: 'Preconstruction & advisory', to: '/services/preconstruction' },
    { label: 'Construction management', to: '/services/construction-management' },
    { label: 'Civil & structural works', to: '/services/civil-structural' },
    { label: 'MEP & building systems', to: '/services/mep-systems' },
    { label: 'Interiors & fit-out', to: '/services/interiors-fitout' },
    { label: 'Industrial & EPC delivery', to: '/services/industrial-epc' },
    { label: 'Infrastructure & civil engineering', to: '/services/infrastructure' },
    { label: 'Refurbishment & facility upgrades', to: '/services/facility-upgrades' }
  ] },
  { group: 'Sectors', links: [
    { label: 'All sectors', to: '/sectors' },
    { label: 'Commercial & workplace', to: '/sectors/commercial' },
    { label: 'Residential & township', to: '/sectors/residential' },
    { label: 'Industrial & logistics', to: '/sectors/industrial' },
    { label: 'Healthcare & life sciences', to: '/sectors/healthcare' },
    { label: 'Hospitality & leisure', to: '/sectors/hospitality' },
    { label: 'Infrastructure & public works', to: '/sectors/infrastructure' }
  ] },
  { group: 'Work', links: [
    { label: 'Projects', to: '/projects' }, { label: 'Insights & perspectives', to: '/insights' },
    { label: 'Downloads & brochures', to: '/downloads' }, { label: 'Frequently asked questions', to: '/faq' }
  ] },
  { group: 'Work with us', links: [
    { label: 'Careers', to: '/careers' }, { label: 'Open roles', to: '/careers#open-roles' },
    { label: 'Contractor & worker registration', to: '/register' }, { label: 'Tenders & e-procurement', to: '/tenders' },
    { label: 'Track an application', to: '/track' }, { label: 'Contact us', to: '/contact' }
  ] },
  { group: 'Legal & compliance', links: [
    { label: 'Privacy policy', to: '/policy/privacy' }, { label: 'Terms of use', to: '/policy/terms' },
    { label: 'Code of conduct', to: '/policy/code-of-conduct' }, { label: 'Anti-bribery & integrity', to: '/policy/anti-bribery' },
    { label: 'Whistleblower policy', to: '/policy/whistleblower' }
  ] }
]
