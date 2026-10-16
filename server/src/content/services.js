import { img } from './images.js'

/**
 * Services, sectors, delivery method and sector-level statistics.
 */

export const servicesIntro = {
  eyebrow: 'Construction + technology',
  title: 'One partner for the built world and the digital one.',
  intro:
    'From construction and infrastructure to custom software, websites and mobile apps, our teams turn ambitious ideas into dependable real-world outcomes.',
  image: img.drawings,
  stats: [
    { value: '02', label: 'connected capability areas' },
    { value: '18', label: 'construction and digital services' },
    { value: '01', label: 'integrated partner from brief to delivery' }
  ]
}

export const services = [
  {
    slug: 'preconstruction',
    number: '01',
    title: 'Preconstruction & advisory',
    short: 'Preconstruction',
    tagline: 'Decisions made early cost the least and matter the most.',
    summary:
      'Feasibility, estimating, value engineering and constructability thinking that protects the brief before a shovel breaks ground.',
    image: img.drawings,
    description: [
      'Preconstruction is where a project is really built. Long before mobilisation we test whether the brief is achievable, whether the budget is honest and whether the sequence can be delivered on the site that actually exists.',
      'Our team works alongside owners, architects, structural engineers and consultants to convert intent into a buildable plan: a cost model that stands up, a procurement strategy that fits the programme, and a risk register the whole team can act on.',
      'We are deliberately commercial without being adversarial. We would rather surface a hard truth in month one than a variation in month eleven.'
    ],
    capabilities: [
      'Feasibility and site due diligence',
      'Order-of-magnitude to GMP cost planning',
      'Value engineering and option analysis',
      'Constructability and buildability reviews',
      'Procurement and package strategy',
      'Programme and phasing development',
      'Risk workshops and registers',
      'Tender documentation and bid levelling'
    ],
    deliverables: [
      { title: 'Cost plan', text: 'An elemental estimate reconciled to a live market rate library, refreshed at each design stage.' },
      { title: 'Constructability report', text: 'Access, logistics, sequencing and tolerance constraints identified with mitigation options.' },
      { title: 'Procurement roadmap', text: 'Package split, prequalification, lead times and award milestones mapped to programme.' },
      { title: 'Risk register', text: 'Owner-owned and contractor-owned risks separated, quantified and assigned to named leads.' }
    ],
    stats: [
      { value: '18%', label: 'average saving identified through value engineering' },
      { value: '100%', label: 'of projects delivered with a preconstruction risk register' }
    ],
    faqs: [
      { question: 'Do you take on preconstruction-only appointments?', answer: 'Yes. Roughly a quarter of our preconstruction commissions are advisory-only, where the owner retains a separate contracting route. There is no obligation to appoint us for delivery.' },
      { question: 'How early can you engage?', answer: 'Ideally at land or lease evaluation. The most valuable constructability decisions are made before a design team is locked to a geometry.' }
    ],
    sectors: ['commercial', 'residential', 'industrial', 'healthcare'],
    relatedProjects: ['atlas-business-park', 'keens-urban-district', 'harbour-logistics-hub']
  },
  {
    slug: 'construction-management',
    number: '02',
    title: 'Construction management',
    short: 'Construction management',
    tagline: 'Disciplined site leadership with nowhere to hide.',
    summary:
      'Disciplined site leadership, transparent reporting and collaborative workflows for complex, live and high-value environments.',
    image: img.site,
    description: [
      'We lead delivery on behalf of the owner: one accountable team coordinating design, trade packages, statutory approvals and handover across a single integrated programme.',
      'Reporting is deliberately plain. Every week our partners receive progress against baseline, cost movement, safety statistics, open risks and the decisions required from them. No buried surprises, no optimistic percentages.',
      'On live campuses, hospitals and operating industrial sites we plan production around the client’s operations and, where necessary, work in low-noise, low-disruption shifts.'
    ],
    capabilities: [
      'Programme control and baseline management',
      'Trade package procurement and administration',
      'Interface and stakeholder coordination',
      'Site logistics and traffic management',
      'Digital site reporting and dashboards',
      'Quality assurance and ITP governance',
      'Cost control, valuations and change management',
      'Commissioning and handover management'
    ],
    deliverables: [
      { title: 'Weekly delivery report', text: 'Progress, cost, safety, quality, risks and required decisions — issued every Friday.' },
      { title: 'Digital site record', text: 'Cloud-hosted drawings, ITPs, snag lists, photographs and inspection sign-offs.' },
      { title: 'Cost report', text: 'Committed versus forecast cost with a rolling variance view and cash-flow forecast.' },
      { title: 'Handover dossier', text: 'As-builts, warranties, O&M manuals, training records and statutory approvals in one indexed package.' }
    ],
    stats: [
      { value: '11', label: 'live work fronts coordinated at peak' },
      { value: '97%', label: 'of milestones met or bettered' }
    ],
    faqs: [
      { question: 'Can you work with the owner’s existing consultants?', answer: 'Always. We join existing teams far more often than we assemble new ones, and we do not require the removal of any consultant.' },
      { question: 'What reporting do we get?', answer: 'A fixed weekly report plus a live dashboard. Both are configured to the client’s own KPI set during mobilisation.' }
    ],
    sectors: ['commercial', 'hospitality', 'healthcare', 'infrastructure'],
    relatedProjects: ['capasite-house', 'keens-urban-district', 'atlas-business-park']
  },
  {
    slug: 'civil-structural',
    number: '03',
    title: 'Civil & structural works',
    short: 'Civil & structural',
    tagline: 'Foundations, frames and tolerances you can build a business on.',
    summary:
      'Foundations, concrete, steel and enabling works delivered with relentless attention to safety, sequence and tolerances.',
    image: img.equipment,
    description: [
      'Our civil and structural teams self-deliver enabling works, excavation, shoring, piling coordination, RCC frames, structural steel and external development.',
      'Indian ground conditions rarely behave as drawn. We carry our own survey, geotechnical interpretation and setting-out capability so that a surprise in the soil becomes a design conversation rather than a delay.',
      'Concrete quality is controlled from batching to curing: mix design trials, temperature and slump records, cube testing at an accredited laboratory and a pour card for every element.'
    ],
    capabilities: [
      'Excavation, shoring and dewatering',
      'Piling and foundation works',
      'RCC frames and precast erection',
      'Structural steel fabrication and erection',
      'Waterproofing and protective systems',
      'Roads, drainage and external development',
      'Industrial floors and heavy-duty hardstanding',
      'Retrofitting and structural strengthening'
    ],
    deliverables: [
      { title: 'Method statements', text: 'Safe systems of work for every high-risk activity, approved before mobilisation.' },
      { title: 'Concrete pour cards', text: 'Element-by-element quality record with mix, temperature, compaction and curing data.' },
      { title: 'As-built survey', text: 'Independent setting-out verification with tolerance deviation reporting.' },
      { title: 'Test register', text: 'Cube results, steel test certificates and NDT records indexed against structure.' }
    ],
    stats: [
      { value: '1.9M', label: 'sq. ft. of RCC frame delivered' },
      { value: '62,000', label: 'cum of concrete placed to date' }
    ],
    faqs: [
      { question: 'Do you self-perform or subcontract civil works?', answer: 'We self-perform core civil and structural works with our own crews and plant, and subcontract only specialist activities such as piling and post-tensioning.' },
      { question: 'How is concrete quality verified?', answer: 'Every pour is recorded against an approved mix and tested at an accredited laboratory, with results indexed to structure in the handover register.' }
    ],
    sectors: ['industrial', 'commercial', 'infrastructure', 'residential'],
    relatedProjects: ['harbour-logistics-hub', 'atlas-business-park', 'metro-viaduct-package']
  },
  {
    slug: 'mep-systems',
    number: '04',
    title: 'MEP & building systems',
    short: 'MEP systems',
    tagline: 'Systems that work quietly, efficiently and for decades.',
    summary:
      'HVAC, electrical, plumbing, fire and building-automation packages coordinated in 3D and commissioned with evidence.',
    image: img.quality,
    description: [
      'We coordinate every building service in a federated BIM environment before a single duct hanger is fixed, resolving clashes on screen rather than in a ceiling void.',
      'Commissioning is planned from day one. Each system is tested against a documented performance criterion, with witnessing and results recorded in the handover dossier so the operator inherits proof, not promises.',
      'Energy performance is treated as a design responsibility: plant selection, controls strategy and envelope detailing are reviewed together for running cost, not separately for first cost.'
    ],
    capabilities: [
      'HVAC design review and installation',
      'HT/LT electrical distribution and substations',
      'Plumbing, sanitary and water treatment',
      'Fire detection, suppression and hydrants',
      'Building management systems and ELV',
      'Lifts, escalators and vertical transport coordination',
      'District cooling and thermal storage interfaces',
      'Testing, balancing and commissioning'
    ],
    deliverables: [
      { title: 'Federated BIM model', text: 'Clash-free coordinated model with approved shop drawings and penetration registers.' },
      { title: 'Commissioning plan', text: 'System-by-system test criteria, witness schedule and acceptance protocol.' },
      { title: 'O&M documentation', text: 'Equipment manuals, warranties, spare-part lists and operating sequences.' },
      { title: 'Training programme', text: 'Operator training delivered and recorded before beneficial occupation.' }
    ],
    stats: [
      { value: '3.4M', label: 'sq. ft. of MEP systems commissioned' },
      { value: '22%', label: 'better-than-baseline energy performance achieved' }
    ],
    faqs: [
      { question: 'Do you carry in-house MEP engineers?', answer: 'Yes. Our MEP team includes mechanical, electrical and controls engineers who sit inside the delivery team rather than in a separate silo.' },
      { question: 'Can you retrofit live buildings?', answer: 'We regularly work inside operating buildings, phasing shutdowns around the client’s calendar and running night or weekend windows where needed.' }
    ],
    sectors: ['commercial', 'healthcare', 'hospitality', 'industrial'],
    relatedProjects: ['capasite-house', 'ganga-medical-centre', 'atlas-business-park']
  },
  {
    slug: 'interiors-fitout',
    number: '05',
    title: 'Interiors & fit-out',
    short: 'Interiors & fit-out',
    tagline: 'Finish quality that survives contact with real life.',
    summary:
      'Workplaces, retail, hospitality and healthcare environments delivered with exceptional finish, pace and operational sensitivity.',
    image: img.workplace,
    description: [
      'Fit-out is judged in the last five per cent: the shadow gap that lines up, the joinery that closes cleanly, the door that feels right. We resource for that standard from the first day, not as a snagging exercise at the end.',
      'Because most fit-outs happen in occupied buildings, our teams are trained for low-noise, low-dust work in live environments with strict segregation, out-of-hours deliveries and neighbour liaison.',
      'We hold mock-ups and finish benchmarks before bulk installation, so the client signs off a physical sample rather than an intention.'
    ],
    capabilities: [
      'Corporate workplace and campus interiors',
      'Hospitality, F&B and retail rollouts',
      'Healthcare and laboratory interiors',
      'Custom joinery, veneers and metalwork',
      'Drywall, ceiling and acoustic systems',
      'Specialist finishes, terrazzo and stone',
      'FF&E procurement and installation',
      'Turnkey handover with snag-free sign-off'
    ],
    deliverables: [
      { title: 'Finish benchmark', text: 'A physical mock-up room approved before bulk installation begins.' },
      { title: 'Room data sheets', text: 'Every room type documented with finishes, services, fittings and quality criteria.' },
      { title: 'Snag-free protocol', text: 'Two-stage inspection with a client walkthrough before formal handover.' },
      { title: 'FF&E register', text: 'Item-level record with serial numbers, warranties and installation sign-offs.' }
    ],
    stats: [
      { value: '0.4', label: 'average snags per 100 sq. m. at handover' },
      { value: '100%', label: 'of fit-out projects phased around live operations' }
    ],
    faqs: [
      { question: 'Can you deliver a nationwide retail rollout?', answer: 'Yes — we run programme-standardised rollouts with a central proto store, shared details and repeat site teams for consistency.' },
      { question: 'Do you take design-and-build fit-out?', answer: 'We do, either with our own design partners or alongside the client’s appointed architect.' }
    ],
    sectors: ['commercial', 'hospitality', 'healthcare'],
    relatedProjects: ['capasite-house', 'the-alibaug-retreat', 'ganga-medical-centre']
  },
  {
    slug: 'industrial-epc',
    number: '06',
    title: 'Industrial & EPC delivery',
    short: 'Industrial & EPC',
    tagline: 'Capacity, commissioning and ramp-up without drama.',
    summary:
      'Manufacturing plants, warehouses, cold stores and process facilities delivered to production-ready condition.',
    image: img.sectorIndustrial,
    description: [
      'Industrial work is measured in output, not appearances. We build for operations: equipment access, maintenance clearances, power quality, floor flatness and the process integration that decides whether a facility ramps up on schedule.',
      'Our EPC teams coordinate process equipment vendors, structural steel fabricators and utility contractors under a single schedule, so that vendor data arrives in time to build rather than after.',
      'We are comfortable with fast-track mandates, staged handovers and production trials that start before every last document is closed out.'
    ],
    capabilities: [
      'Industrial buildings, PEB and steel structures',
      'Process and utility piping',
      'Cold storage and controlled environments',
      'Warehouse and distribution facilities',
      'Power distribution, DG and substations',
      'Effluent treatment and water systems',
      'Equipment foundations and grouting',
      'Pre-commissioning and trial production support'
    ],
    deliverables: [
      { title: 'Vendor datasheet matrix', text: 'Equipment interfaces, loads, anchoring and clearances tracked to a single register.' },
      { title: 'Mechanical completion list', text: 'Punch-listed completion by system with a discipline-wise sign-off trail.' },
      { title: 'Trial run protocol', text: 'Documented trial production with performance measurement against guarantee values.' },
      { title: 'Asset register', text: 'Commissioned assets tagged, catalogued and handed over with maintenance schedules.' }
    ],
    stats: [
      { value: '14', label: 'industrial facilities delivered to production' },
      { value: '9 of 10', label: 'handed over on or before the committed date' }
    ],
    faqs: [
      { question: 'Can you deliver a brownfield expansion?', answer: 'Yes. We are experienced in expanding live plants with phased shutdowns, temporary utilities and strict permit-to-work discipline.' },
      { question: 'Do you take single-point EPC responsibility?', answer: 'For industrial mandates we regularly contract for design, procurement, construction and commissioning under one scope.' }
    ],
    sectors: ['industrial', 'infrastructure'],
    relatedProjects: ['harbour-logistics-hub', 'northfield-food-plant', 'metro-viaduct-package']
  },
  {
    slug: 'infrastructure',
    number: '07',
    title: 'Infrastructure & civil engineering',
    short: 'Infrastructure',
    tagline: 'Public-facing work that has to be right the first time.',
    summary:
      'Bridges, viaducts, urban roads, water systems and public-realm works built under live traffic and public scrutiny.',
    image: img.sectorInfrastructure,
    description: [
      'Infrastructure projects are conspicuous: the city watches, traffic must keep moving and utilities are rarely where the drawings say. We plan for that reality with relentless utility surveys, traffic management staging and independent quality verification.',
      'Our structures team delivers segmental viaducts, bridges, retaining structures and urban road packages, working within municipal and metro-agency requirements.',
      'Public realm is designed to be maintained. We detail for durability, drainage and repairability rather than for the day of inauguration.'
    ],
    capabilities: [
      'Bridges, viaducts and elevated corridors',
      'Urban roads, junctions and footways',
      'Water supply, drainage and sewerage',
      'Retaining structures and earthworks',
      'Public realm, plazas and landscaping',
      'Traffic management and utility diversion',
      'Independent quality and NDT testing',
      'Municipal and metro agency coordination'
    ],
    deliverables: [
      { title: 'Traffic management plan', text: 'Stage-wise diversion plan approved by the authority before mobilisation.' },
      { title: 'Utility mapping', text: 'Ground-penetrating radar survey reconciled with records and trial pits.' },
      { title: 'Independent verification', text: 'Third-party inspection of critical structural elements and load tests.' },
      { title: 'Durability plan', text: 'Cover, admixture and curing regime documented for design-life performance.' }
    ],
    stats: [
      { value: '38 km', label: 'of roads and viaduct structures delivered' },
      { value: '0', label: 'unplanned lane closures in the last 24 months' }
    ],
    faqs: [
      { question: 'Are you prequalified with public agencies?', answer: 'We work as a delivery partner to prime contractors and directly for municipal bodies where the registration band permits. Our prequalification dossier is available on request.' },
      { question: 'How do you manage utilities?', answer: 'GPR survey, trial pits and stakeholder mapping, followed by a diversion schedule agreed before the first excavation.' }
    ],
    sectors: ['infrastructure', 'industrial'],
    relatedProjects: ['metro-viaduct-package', 'eastern-link-flyover', 'harbour-logistics-hub']
  },
  {
    slug: 'facility-upgrades',
    number: '08',
    title: 'Refurbishment & facility upgrades',
    short: 'Refurbishment',
    tagline: 'New performance from existing assets.',
    summary:
      'Repairs, retrofits, façade renewal, capacity upgrades and asset performance improvement with minimum operational disruption.',
    image: img.equipment2,
    description: [
      'Most of India’s building stock will be upgraded rather than replaced. We extend asset life through structural repair, envelope renewal, MEP replacement and space reconfiguration.',
      'Scope is never fully known at the outset, so we price risk transparently and work in defined packages, keeping an open-book view of measured work.',
      'Occupants stay in place. We plan noise, vibration, dust and access around their operating hours and communicate in advance of every intrusive activity.'
    ],
    capabilities: [
      'Structural repair and strengthening',
      'Waterproofing and leak remediation',
      'Façade cleaning, sealing and replacement',
      'MEP replacement and capacity upgrades',
      'Energy performance retrofits',
      'Space reconfiguration and core works',
      'Heritage-sensitive restoration',
      'Planned preventive maintenance partnerships'
    ],
    deliverables: [
      { title: 'Condition survey', text: 'Dilapidation and defect survey with photographic evidence and priority scoring.' },
      { title: 'Package pricing', text: 'Defined packages with open-book measurement where scope is uncertain.' },
      { title: 'Occupant plan', text: 'Notification, access and noise protocol agreed with facilities teams.' },
      { title: 'Performance verification', text: 'Before-and-after measurement of the asset performance improvement.' }
    ],
    stats: [
      { value: '24', label: 'buildings upgraded while remaining occupied' },
      { value: '15 yrs', label: 'longest maintained asset partnership' }
    ],
    faqs: [
      { question: 'Can you work without closing the building?', answer: 'Yes. The majority of our upgrade work happens in occupied buildings, including hospitals and operating offices.' },
      { question: 'How do you handle unknown scope?', answer: 'We investigate before pricing, package the works, and price the residual risk openly rather than padding a contingency.' }
    ],
    sectors: ['residential', 'commercial', 'healthcare', 'hospitality'],
    relatedProjects: ['juhu-residences', 'ganga-medical-centre', 'capasite-house']
  }
,
  {
    slug: 'digital-products', number: '09', category: 'digital', title: 'Digital products & custom software', short: 'Digital products',
    tagline: 'From product strategy to launch, we design and build custom software that makes complex work feel simple.', summary: 'From product strategy to launch, we design and build custom software that makes complex work feel simple.', image: img.drawings,
    description: [
      'From product strategy to launch, we design and build custom software that makes complex work feel simple.',
      'We work collaboratively from discovery through delivery, making scope, timelines and trade-offs clear. The solution is shaped around your users and business rather than forcing your process into an off-the-shelf template.',
      'From launch onward, we can help with iteration, monitoring and support so your digital product continues to serve your customers as needs evolve.'
    ],
    capabilities: ['Product discovery and technical architecture', 'Custom web applications and portals', 'CMS and headless content platforms', 'API design and system integrations', 'Cloud deployment and ongoing support'], deliverables: [
      { title: 'Product roadmap', text: 'A prioritised plan aligned to user needs, business outcomes and a realistic delivery sequence.' },
      { title: 'Working solution', text: 'A tested, production-ready digital product with clear handover documentation.' },
      { title: 'Technical handover', text: 'Architecture notes, deployment guidance and knowledge transfer for your team.' },
      { title: 'Ongoing support', text: 'Options for maintenance, improvements and support after launch.' }
    ], stats: [], faqs: [
      { question: 'Can you work with our existing systems?', answer: 'Yes. We can assess your current tools and design integrations or a phased migration around them.' },
      { question: 'How do you start a project?', answer: 'We begin with a discovery conversation to understand the users, goals, constraints and best-fit scope before proposing a delivery plan.' }
    ], sectors: []
  },
  {
    slug: 'web-development', number: '10', category: 'digital', title: 'Web development & e-commerce', short: 'Web development',
    tagline: 'Fast, accessible websites and web applications engineered around your customers, content and business goals.', summary: 'Fast, accessible websites and web applications engineered around your customers, content and business goals.', image: img.drawings,
    description: [
      'Fast, accessible websites and web applications engineered around your customers, content and business goals.',
      'We work collaboratively from discovery through delivery, making scope, timelines and trade-offs clear. The solution is shaped around your users and business rather than forcing your process into an off-the-shelf template.',
      'From launch onward, we can help with iteration, monitoring and support so your digital product continues to serve your customers as needs evolve.'
    ],
    capabilities: ['Corporate and marketing websites', 'Responsive web applications', 'E-commerce and payment integration', 'Search, performance and accessibility', 'CMS implementation and migration'], deliverables: [
      { title: 'Product roadmap', text: 'A prioritised plan aligned to user needs, business outcomes and a realistic delivery sequence.' },
      { title: 'Working solution', text: 'A tested, production-ready digital product with clear handover documentation.' },
      { title: 'Technical handover', text: 'Architecture notes, deployment guidance and knowledge transfer for your team.' },
      { title: 'Ongoing support', text: 'Options for maintenance, improvements and support after launch.' }
    ], stats: [], faqs: [
      { question: 'Can you work with our existing systems?', answer: 'Yes. We can assess your current tools and design integrations or a phased migration around them.' },
      { question: 'How do you start a project?', answer: 'We begin with a discovery conversation to understand the users, goals, constraints and best-fit scope before proposing a delivery plan.' }
    ], sectors: []
  },
  {
    slug: 'mobile-app-development', number: '11', category: 'digital', title: 'Android & iOS app development', short: 'Mobile apps',
    tagline: 'Native-feeling mobile experiences for Android and iOS, built with React Native or Expo and Flutter to fit the product.', summary: 'Native-feeling mobile experiences for Android and iOS, built with React Native or Expo and Flutter to fit the product.', image: img.drawings,
    description: [
      'Native-feeling mobile experiences for Android and iOS, built with React Native or Expo and Flutter to fit the product.',
      'We work collaboratively from discovery through delivery, making scope, timelines and trade-offs clear. The solution is shaped around your users and business rather than forcing your process into an off-the-shelf template.',
      'From launch onward, we can help with iteration, monitoring and support so your digital product continues to serve your customers as needs evolve.'
    ],
    capabilities: ['Android app development', 'iOS app development', 'React Native and Expo applications', 'Flutter cross-platform applications', 'App Store and Play Store release support'], deliverables: [
      { title: 'Product roadmap', text: 'A prioritised plan aligned to user needs, business outcomes and a realistic delivery sequence.' },
      { title: 'Working solution', text: 'A tested, production-ready digital product with clear handover documentation.' },
      { title: 'Technical handover', text: 'Architecture notes, deployment guidance and knowledge transfer for your team.' },
      { title: 'Ongoing support', text: 'Options for maintenance, improvements and support after launch.' }
    ], stats: [], faqs: [
      { question: 'Can you work with our existing systems?', answer: 'Yes. We can assess your current tools and design integrations or a phased migration around them.' },
      { question: 'How do you start a project?', answer: 'We begin with a discovery conversation to understand the users, goals, constraints and best-fit scope before proposing a delivery plan.' }
    ], sectors: []
  },
  {
    slug: 'client-chat-solutions', number: '12', category: 'digital', title: 'Messaging & client communication', short: 'Chat solutions',
    tagline: 'Secure, purpose-built chat experiences that connect your customers, teams and support operations.', summary: 'Secure, purpose-built chat experiences that connect your customers, teams and support operations.', image: img.drawings,
    description: [
      'Secure, purpose-built chat experiences that connect your customers, teams and support operations.',
      'We work collaboratively from discovery through delivery, making scope, timelines and trade-offs clear. The solution is shaped around your users and business rather than forcing your process into an off-the-shelf template.',
      'From launch onward, we can help with iteration, monitoring and support so your digital product continues to serve your customers as needs evolve.'
    ],
    capabilities: ['In-app client and support chat', 'Real-time messaging and notifications', 'Conversation dashboards for teams', 'File sharing and message history', 'Integration with your existing systems'], deliverables: [
      { title: 'Product roadmap', text: 'A prioritised plan aligned to user needs, business outcomes and a realistic delivery sequence.' },
      { title: 'Working solution', text: 'A tested, production-ready digital product with clear handover documentation.' },
      { title: 'Technical handover', text: 'Architecture notes, deployment guidance and knowledge transfer for your team.' },
      { title: 'Ongoing support', text: 'Options for maintenance, improvements and support after launch.' }
    ], stats: [], faqs: [
      { question: 'Can you work with our existing systems?', answer: 'Yes. We can assess your current tools and design integrations or a phased migration around them.' },
      { question: 'How do you start a project?', answer: 'We begin with a discovery conversation to understand the users, goals, constraints and best-fit scope before proposing a delivery plan.' }
    ], sectors: []
  },
  {
    slug: 'enterprise-it-solutions', number: '13', category: 'digital', title: 'IT consulting & digital transformation', short: 'IT solutions',
    tagline: 'Practical technology consulting and dependable implementation for organisations ready to modernise how they work.', summary: 'Practical technology consulting and dependable implementation for organisations ready to modernise how they work.', image: img.drawings,
    description: [
      'Practical technology consulting and dependable implementation for organisations ready to modernise how they work.',
      'We work collaboratively from discovery through delivery, making scope, timelines and trade-offs clear. The solution is shaped around your users and business rather than forcing your process into an off-the-shelf template.',
      'From launch onward, we can help with iteration, monitoring and support so your digital product continues to serve your customers as needs evolve.'
    ],
    capabilities: ['Technology strategy and solution design', 'Workflow automation and integrations', 'Cloud setup and application modernisation', 'Quality assurance and security reviews', 'Maintenance, monitoring and support'], deliverables: [
      { title: 'Product roadmap', text: 'A prioritised plan aligned to user needs, business outcomes and a realistic delivery sequence.' },
      { title: 'Working solution', text: 'A tested, production-ready digital product with clear handover documentation.' },
      { title: 'Technical handover', text: 'Architecture notes, deployment guidance and knowledge transfer for your team.' },
      { title: 'Ongoing support', text: 'Options for maintenance, improvements and support after launch.' }
    ], stats: [], faqs: [
      { question: 'Can you work with our existing systems?', answer: 'Yes. We can assess your current tools and design integrations or a phased migration around them.' },
      { question: 'How do you start a project?', answer: 'We begin with a discovery conversation to understand the users, goals, constraints and best-fit scope before proposing a delivery plan.' }
    ], sectors: []
  },
  {
    slug: 'content-management', number: '14', category: 'digital', title: 'Content management & strategy', short: 'Content & CMS', tagline: 'Organise your content, empower your team and keep every digital touchpoint accurate, useful and on-brand.', summary: 'Organise your content, empower your team and keep every digital touchpoint accurate, useful and on-brand.', image: img.drawings,
    description: [
      'Organise your content, empower your team and keep every digital touchpoint accurate, useful and on-brand.',
      'Our approach is collaborative and measurable: we agree on the audience, constraints and desired outcome first, then shape a practical plan with clear priorities and ownership.',
      'We can work alongside your in-house team or provide an end-to-end service, with straightforward handover and ongoing support options.'
    ],
    capabilities: ['CMS selection and implementation', 'Content modelling and migration', 'Editorial workflows and permissions', 'Headless and traditional CMS', 'Training and content governance'],
    deliverables: [
      { title: 'Discovery & recommendations', text: 'A clear assessment of your current position, opportunities and recommended priorities.' },
      { title: 'Delivery plan', text: 'A sequenced plan with scope, owners, measures and realistic milestones.' },
      { title: 'Implementation', text: 'Practical changes delivered with review points and transparent progress.' },
      { title: 'Measurement & handover', text: 'Documented outcomes, reporting and next-step guidance for your team.' }
    ],
    stats: [], faqs: [
      { question: 'Can this be combined with your website or app work?', answer: 'Yes. These capabilities can be delivered independently or as part of a joined-up website, product or digital transformation engagement.' },
      { question: 'Do you support our team after delivery?', answer: 'Yes. We can agree ongoing guidance, optimisation or maintenance based on your team and priorities.' }
    ], sectors: []
  },
  {
    slug: 'seo-growth', number: '15', category: 'digital', title: 'SEO & organic growth', short: 'SEO & growth', tagline: 'Improve discoverability with a sustainable search strategy grounded in technical health, useful content and measurable progress.', summary: 'Improve discoverability with a sustainable search strategy grounded in technical health, useful content and measurable progress.', image: img.drawings,
    description: [
      'Improve discoverability with a sustainable search strategy grounded in technical health, useful content and measurable progress.',
      'Our approach is collaborative and measurable: we agree on the audience, constraints and desired outcome first, then shape a practical plan with clear priorities and ownership.',
      'We can work alongside your in-house team or provide an end-to-end service, with straightforward handover and ongoing support options.'
    ],
    capabilities: ['Technical SEO audits and fixes', 'Keyword and content strategy', 'On-page optimisation', 'Local and multi-location SEO', 'Analytics, reporting and iteration'],
    deliverables: [
      { title: 'Discovery & recommendations', text: 'A clear assessment of your current position, opportunities and recommended priorities.' },
      { title: 'Delivery plan', text: 'A sequenced plan with scope, owners, measures and realistic milestones.' },
      { title: 'Implementation', text: 'Practical changes delivered with review points and transparent progress.' },
      { title: 'Measurement & handover', text: 'Documented outcomes, reporting and next-step guidance for your team.' }
    ],
    stats: [], faqs: [
      { question: 'Can this be combined with your website or app work?', answer: 'Yes. These capabilities can be delivered independently or as part of a joined-up website, product or digital transformation engagement.' },
      { question: 'Do you support our team after delivery?', answer: 'Yes. We can agree ongoing guidance, optimisation or maintenance based on your team and priorities.' }
    ], sectors: []
  },
  {
    slug: 'ui-ux-design', number: '16', category: 'digital', title: 'UI/UX & product design', short: 'UI/UX design', tagline: 'Turn customer needs into clear, accessible digital experiences through research, interface design and iterative prototyping.', summary: 'Turn customer needs into clear, accessible digital experiences through research, interface design and iterative prototyping.', image: img.drawings,
    description: [
      'Turn customer needs into clear, accessible digital experiences through research, interface design and iterative prototyping.',
      'Our approach is collaborative and measurable: we agree on the audience, constraints and desired outcome first, then shape a practical plan with clear priorities and ownership.',
      'We can work alongside your in-house team or provide an end-to-end service, with straightforward handover and ongoing support options.'
    ],
    capabilities: ['User research and journey mapping', 'Wireframes and interactive prototypes', 'Visual design systems', 'Responsive and accessible interfaces', 'Usability testing and design iteration'],
    deliverables: [
      { title: 'Discovery & recommendations', text: 'A clear assessment of your current position, opportunities and recommended priorities.' },
      { title: 'Delivery plan', text: 'A sequenced plan with scope, owners, measures and realistic milestones.' },
      { title: 'Implementation', text: 'Practical changes delivered with review points and transparent progress.' },
      { title: 'Measurement & handover', text: 'Documented outcomes, reporting and next-step guidance for your team.' }
    ],
    stats: [], faqs: [
      { question: 'Can this be combined with your website or app work?', answer: 'Yes. These capabilities can be delivered independently or as part of a joined-up website, product or digital transformation engagement.' },
      { question: 'Do you support our team after delivery?', answer: 'Yes. We can agree ongoing guidance, optimisation or maintenance based on your team and priorities.' }
    ], sectors: []
  },
  {
    slug: 'cloud-devops', number: '17', category: 'digital', title: 'Cloud, DevOps & integrations', short: 'Cloud & DevOps', tagline: 'Build a reliable foundation for your digital products with thoughtful cloud architecture, automation and system integrations.', summary: 'Build a reliable foundation for your digital products with thoughtful cloud architecture, automation and system integrations.', image: img.drawings,
    description: [
      'Build a reliable foundation for your digital products with thoughtful cloud architecture, automation and system integrations.',
      'Our approach is collaborative and measurable: we agree on the audience, constraints and desired outcome first, then shape a practical plan with clear priorities and ownership.',
      'We can work alongside your in-house team or provide an end-to-end service, with straightforward handover and ongoing support options.'
    ],
    capabilities: ['Cloud architecture and migration planning', 'CI/CD and release automation', 'API and third-party integrations', 'Monitoring, reliability and backups', 'Infrastructure documentation and handover'],
    deliverables: [
      { title: 'Discovery & recommendations', text: 'A clear assessment of your current position, opportunities and recommended priorities.' },
      { title: 'Delivery plan', text: 'A sequenced plan with scope, owners, measures and realistic milestones.' },
      { title: 'Implementation', text: 'Practical changes delivered with review points and transparent progress.' },
      { title: 'Measurement & handover', text: 'Documented outcomes, reporting and next-step guidance for your team.' }
    ],
    stats: [], faqs: [
      { question: 'Can this be combined with your website or app work?', answer: 'Yes. These capabilities can be delivered independently or as part of a joined-up website, product or digital transformation engagement.' },
      { question: 'Do you support our team after delivery?', answer: 'Yes. We can agree ongoing guidance, optimisation or maintenance based on your team and priorities.' }
    ], sectors: []
  },
  {
    slug: 'cybersecurity', number: '18', category: 'digital', title: 'Security & quality assurance', short: 'Security & QA', tagline: 'Reduce avoidable risk with practical application security reviews, testing and quality assurance built into delivery.', summary: 'Reduce avoidable risk with practical application security reviews, testing and quality assurance built into delivery.', image: img.drawings,
    description: [
      'Reduce avoidable risk with practical application security reviews, testing and quality assurance built into delivery.',
      'Our approach is collaborative and measurable: we agree on the audience, constraints and desired outcome first, then shape a practical plan with clear priorities and ownership.',
      'We can work alongside your in-house team or provide an end-to-end service, with straightforward handover and ongoing support options.'
    ],
    capabilities: ['Application security review', 'Functional and regression testing', 'Performance and compatibility testing', 'Secure development practices', 'Release readiness and defect tracking'],
    deliverables: [
      { title: 'Discovery & recommendations', text: 'A clear assessment of your current position, opportunities and recommended priorities.' },
      { title: 'Delivery plan', text: 'A sequenced plan with scope, owners, measures and realistic milestones.' },
      { title: 'Implementation', text: 'Practical changes delivered with review points and transparent progress.' },
      { title: 'Measurement & handover', text: 'Documented outcomes, reporting and next-step guidance for your team.' }
    ],
    stats: [], faqs: [
      { question: 'Can this be combined with your website or app work?', answer: 'Yes. These capabilities can be delivered independently or as part of a joined-up website, product or digital transformation engagement.' },
      { question: 'Do you support our team after delivery?', answer: 'Yes. We can agree ongoing guidance, optimisation or maintenance based on your team and priorities.' }
    ], sectors: []
  }
]

export const sectorsIntro = {
  eyebrow: 'Sectors',
  title: 'Sector knowledge, applied to your brief.',
  intro:
    'Each sector carries its own codes, its own programme logic and its own definition of quality. We staff project teams who have delivered in that environment before.',
  image: img.sectorCommercial
}

export const sectors = [
  {
    slug: 'commercial',
    title: 'Commercial & workplace',
    short: 'Commercial',
    summary: 'Office campuses, business parks, workplaces and mixed-use developments built for occupancy, efficiency and long-term value.',
    description:
      'Commercial projects succeed or fail on programme discipline: every week of delay is rent not earned. Our commercial teams plan procurement against a leasing calendar, coordinate tenant fit-out interfaces and deliver facilities that meet their energy targets — verified by measurement, not by intent.',
    image: img.sectorCommercial,
    projectCount: '38',
    highlights: ['Grade-A office campuses', 'Business parks and SEZ facilities', 'Mixed-use podiums and retail', 'Tenant fit-out coordination', 'High-performance façades'],
    stats: [
      { value: '1.4M', label: 'sq. ft. commercial delivered' },
      { value: '9', label: 'large workplaces handed over' }
    ]
  },
  {
    slug: 'residential',
    title: 'Residential & township',
    short: 'Residential',
    summary: 'Premium residences, gated communities and township infrastructure where build quality is measured by the people living inside.',
    description:
      'Residential buyers inspect everything: the flatness of a wall, the alignment of a tile joint, the sound of a lift. We build with a customer-eye view, run independent post-handover snag surveys and support developer handover teams through possession.',
    image: img.sectorResidential,
    projectCount: '26',
    highlights: ['Premium high-rise residences', 'Gated communities and townships', 'Clubhouses and amenity blocks', 'Internal roads and services', 'Phased possession programmes'],
    stats: [
      { value: '3,100', label: 'homes delivered' },
      { value: '4.1/5', label: 'average customer quality rating' }
    ]
  },
  {
    slug: 'industrial',
    title: 'Industrial & logistics',
    short: 'Industrial',
    summary: 'Manufacturing plants, warehouses, cold stores and distribution centres planned around throughput and uptime.',
    description:
      'Industrial clients measure us in capacity, cycle time and ramp-up. We coordinate process vendors, utilities and clearances so that equipment arrives into a prepared facility, and we hand over with trial-run data attached.',
    image: img.sectorIndustrial,
    projectCount: '14',
    highlights: ['Manufacturing and assembly plants', 'Warehousing and distribution centres', 'Cold storage and controlled environments', 'PEB and structural steel buildings', 'Utility and effluent infrastructure'],
    stats: [
      { value: '2.6M', label: 'sq. ft. industrial delivered' },
      { value: '0', label: 'lost-time incidents on industrial sites since 2023' }
    ]
  },
  {
    slug: 'healthcare',
    title: 'Healthcare & life sciences',
    short: 'Healthcare',
    summary: 'Hospitals, day-care centres, diagnostics and laboratories where infection control and medical gas safety are non-negotiable.',
    description:
      'Healthcare construction is a technical and ethical exercise. We build to healthcare-specific standards for air changes, pressure regimes, medical gas, shielding and infection control — and we phase works so that a functioning hospital keeps functioning.',
    image: img.sectorHealthcare,
    projectCount: '7',
    highlights: ['Multi-speciality hospitals', 'Operating theatre and ICU fit-out', 'Diagnostic imaging and radiation shielding', 'Laboratories and cleanrooms', 'Live-hospital phased upgrades'],
    stats: [
      { value: '410', label: 'clinical beds delivered' },
      { value: '100%', label: 'projects executed with an infection-control plan' }
    ]
  },
  {
    slug: 'hospitality',
    title: 'Hospitality & leisure',
    short: 'Hospitality',
    summary: 'Hotels, resorts, restaurants and wellness destinations where craft, material quality and brand standards define success.',
    description:
      'Hospitality projects are won in the detail: the grain of a veneer, the temperature of a corridor, the acoustics of a banquet hall. We protect brand standards with mock-up rooms, benchmark materials and a finish-level sign-off before bulk procurement.',
    image: img.sectorHospitality,
    projectCount: '9',
    highlights: ['Business and resort hotels', 'Boutique and heritage properties', 'Restaurants and banquet facilities', 'Spa and wellness facilities', 'Brand-standard mock-up rooms'],
    stats: [
      { value: '1,250', label: 'keys delivered or under construction' },
      { value: '100%', label: 'brand-standard audits passed at first review' }
    ]
  },
  {
    slug: 'infrastructure',
    title: 'Infrastructure & public works',
    short: 'Infrastructure',
    summary: 'Bridges, viaducts, roads, water systems and public realm delivered under live conditions and public scrutiny.',
    description:
      'Infrastructure work is visible work. We plan for utilities that are not where drawings place them, traffic that cannot stop, and quality that must hold for decades — with independent verification at every critical stage.',
    image: img.sectorInfrastructure,
    projectCount: '12',
    highlights: ['Elevated corridors and flyovers', 'Urban road and junction packages', 'Water supply and sewerage networks', 'Public plazas and streetscapes', 'Utility diversion and traffic staging'],
    stats: [
      { value: '38 km', label: 'roads, viaducts and networks delivered' },
      { value: '4.2M', label: 'safe man-hours without lost-time incident' }
    ]
  }
]

export const process = {
  eyebrow: 'How we deliver',
  title: 'Rigour at every stage. Clarity in every decision.',
  intro:
    'You need more than a contractor. You need a partner who can see around corners and keep the whole brief moving — with a method the whole team understands.',
  steps: [
    { number: '01', title: 'Listen & define', text: 'We surface the opportunity, constraints and measures of success together, and write them down so they can be managed.', outputs: ['Brief definition', 'Success criteria', 'Constraint map'] },
    { number: '02', title: 'Plan & align', text: 'We unite people, programme, cost and procurement around a plan that the whole team has signed up to.', outputs: ['Baseline programme', 'Cost plan', 'Procurement strategy'] },
    { number: '03', title: 'Build & adapt', text: 'We lead proactive, transparent delivery — reporting honestly and solving in real time while the work continues.', outputs: ['Weekly report', 'Live risk register', 'Digital site record'] },
    { number: '04', title: 'Hand over & learn', text: 'We commission thoroughly, close carefully and carry the learning into the next project.', outputs: ['Commissioning evidence', 'Handover dossier', 'Post-project review'] },
    { number: '05', title: 'Support & perform', text: 'We stay accountable through defects liability and into long-term asset performance.', outputs: ['Defects management', 'Operator training', 'Performance measurement'] }
  ]
}
