const images = {
  hero: 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=2200&q=88',
  detail: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85',
  project1: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
  project2: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85',
  project3: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
  project4: 'https://images.unsplash.com/photo-1554435493-93422e8220c8?auto=format&fit=crop&w=1200&q=85',
  project5: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=85',
  project6: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=85'
}

export const defaultSite = {
  company: {
    name: 'Ananta Infratech Solutions',
    shortName: 'ANANTA',
    tagline: 'Building the future, connecting the dots.',
    founded: '2016',
    address: 'Juhu, Mumbai, Maharashtra 400049, India',
    phone: '+91 22 4968 2016',
    email: 'hello@anantainfratech.com',
    linkedin: 'https://www.linkedin.com',
    instagram: 'https://www.instagram.com',
    logo: '/assets/dlogo-removebg.png',
    alternateLogo: '/assets/logo.jpeg'
  },
  home: {
    eyebrow: 'Independent engineering • Mumbai, India',
    heroTitle: 'We make ambitious places possible.',
    heroText: 'Ananta brings design intelligence, field discipline and accountable delivery to the places where people live, work and move.',
    heroImage: images.hero,
    heroVideo: 'https://videos.pexels.com/video-files/2763687/2763687-hd_1920_1080_25fps.mp4',
    manifestoLabel: 'The Ananta approach',
    manifestoTitle: 'Every complex brief has a clear way forward.',
    manifestoText: 'Since 2016, we have partnered with owners, architects and institutions to move critical projects from intent to enduring impact.',
    beliefQuote: 'Construction is not simply a sequence of trades. It is the careful orchestration of trust, detail and momentum.',
    newsTitle: 'Looking ahead, on the ground.',
    stats: [
      { value: '10+', label: 'years of delivery' },
      { value: '42', label: 'active work fronts' },
      { value: '1.8M', label: 'sq. ft. delivered' },
      { value: '97%', label: 'repeat partners' }
    ]
  },
  about: {
    title: 'A grounded ambition for the built world.',
    intro: 'Ananta Infratech Solutions is an owner-minded construction and engineering partner headquartered in Juhu, Mumbai. We align people, process and technology around the one thing that matters: making better places, reliably.',
    image: images.detail,
    storyTitle: 'Built on accountability. Shaped by possibility.',
    storyText: 'What began in 2016 as a hands-on contracting practice has grown into an integrated delivery platform. Our teams bring preconstruction insight, rigorous controls and the confidence to solve in real time—without losing sight of the original idea.',
    values: [
      { number: '01', title: 'Own the outcome', text: 'We take personal responsibility for safety, quality, programme and partner confidence.' },
      { number: '02', title: 'Build with intent', text: 'Every decision is tested against performance, longevity and the people who will use the space.' },
      { number: '03', title: 'Stay constructively curious', text: 'The best answer is rarely obvious. We ask better questions before we build.' }
    ]
  },
  capabilities: {
    title: 'One integrated partner. Every critical discipline.',
    intro: 'From the earliest feasibility conversation to asset handover, our specialist teams work as one connected delivery engine.',
    services: [
      { id: '01', title: 'Preconstruction', text: 'Feasibility, estimating, value engineering, constructability and procurement strategies that protect the brief before a shovel breaks ground.', items: ['Cost planning', 'Design coordination', 'Risk workshops'] },
      { id: '02', title: 'Construction management', text: 'Disciplined site leadership, transparent reporting and collaborative workflows for complex, live and high-value environments.', items: ['Programme control', 'Trade management', 'Digital site reporting'] },
      { id: '03', title: 'Civil & structural works', text: 'Foundations, concrete, steel and enabling works delivered with relentless attention to safety, sequence and tolerances.', items: ['RCC structures', 'Piling & foundations', 'Industrial works'] },
      { id: '04', title: 'Interiors & fit-out', text: 'Workplaces, retail and hospitality environments delivered with exceptional finish, pace and operational sensitivity.', items: ['Corporate interiors', 'MEP coordination', 'Turnkey handover'] }
    ]
  },
  sustainability: {
    title: 'Progress should leave more possibility behind.',
    intro: 'We are reducing the impact of the work we do while increasing the resilience and value of what we create.',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85',
    commitments: [
      { metric: '30%', label: 'target reduction in project waste intensity by 2028' },
      { metric: '100%', label: 'sites measured for water, energy and diversion performance' },
      { metric: '0', label: 'compromise on people going home safely' }
    ]
  },
  contact: {
    title: 'Let’s create what’s next.',
    intro: 'Bring us a site, a brief or a problem worth solving. Our Mumbai team is ready to start the conversation.',
    mapUrl: 'https://www.google.com/maps?q=Juhu,Mumbai&output=embed'
  },
  careers: {
    title: 'Make your mark on what matters.',
    intro: 'We are builders, planners, engineers and problem-solvers who believe the industry can move forward with more care and more imagination.',
    roles: [
      { title: 'Project Engineer', location: 'Mumbai', type: 'Full-time' },
      { title: 'Planning Manager', location: 'Mumbai', type: 'Full-time' },
      { title: 'Quantity Surveyor', location: 'Mumbai', type: 'Full-time' }
    ]
  },
  projects: [
    { id: 'atlas-business-park', title: 'Atlas Business Park', category: 'Commercial', location: 'Andheri East, Mumbai', year: '2025', status: 'In progress', scope: 'Construction management · RCC works · MEP coordination', image: images.project1, summary: 'A high-performance workplace campus designed for a new generation of enterprise.', challenge: 'A constrained urban site required a precise logistics plan and uninterrupted neighbouring operations.', impact: '12-storey commercial campus delivered through phased, digitally coordinated work fronts.' },
    { id: 'keens-urban-district', title: 'Keen’s Urban District', category: 'Mixed use', location: 'Powai, Mumbai', year: '2024', status: 'Completed', scope: 'Preconstruction · Structure · Fit-out', image: images.project2, summary: 'A connected residential and retail address shaped around public life.', challenge: 'Multiple stakeholder packages had to arrive together on a compressed programme.', impact: 'A 410,000 sq. ft. mixed-use destination with a people-first ground plane.' },
    { id: 'capasite-house', title: 'Capasite House', category: 'Workplace', location: 'BKC, Mumbai', year: '2024', status: 'Completed', scope: 'Turnkey interiors · MEP · Technology', image: images.project3, summary: 'A flexible, low-carbon headquarters built around teams and ideas.', challenge: 'The live building environment demanded careful sequencing and zero-disruption coordination.', impact: 'A 58,000 sq. ft. workplace handed over ahead of programme.' },
    { id: 'harbour-logistics', title: 'Harbour Logistics Hub', category: 'Industrial', location: 'Navi Mumbai', year: '2023', status: 'Completed', scope: 'Civil works · Steel · External development', image: images.project4, summary: 'A resilient distribution facility built for round-the-clock movement.', challenge: 'Complex ground conditions and operational access drove an accelerated foundation strategy.', impact: 'A 280,000 sq. ft. logistics asset completed with an exemplary safety record.' },
    { id: 'alibaug-retreat', title: 'The Alibaug Retreat', category: 'Hospitality', location: 'Alibaug, Maharashtra', year: '2023', status: 'Completed', scope: 'Construction management · Finishes', image: images.project5, summary: 'A landscape-led hospitality destination with a distinctly local material language.', challenge: 'Coastal conditions and craft-led details asked for exacting quality control.', impact: 'Forty keys, villas and shared spaces delivered with minimal site waste.' },
    { id: 'juhu-residences', title: 'Juhu Residences', category: 'Residential', location: 'Juhu, Mumbai', year: '2022', status: 'Completed', scope: 'RCC · Facade · Premium fit-out', image: images.project6, summary: 'A considered collection of homes balancing privacy, light and city access.', challenge: 'Detailed facade systems had to meet tight urban boundaries and a monsoon programme.', impact: '18 premium residences created at the heart of our home neighbourhood.' }
  ],
  news: [
    { date: '08.06.26', type: 'Perspective', title: 'Why preconstruction is the most important part of building well.' },
    { date: '21.05.26', type: 'Project note', title: 'Atlas Business Park reaches a new milestone in Andheri East.' },
    { date: '03.04.26', type: 'People', title: 'Meet the site leaders shaping a stronger safety culture.' }
  ]
}
