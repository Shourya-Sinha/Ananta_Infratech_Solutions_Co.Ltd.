/**
 * Admin editor schema.
 *
 * Every section of the public website is described here once, and the editor UI
 * is generated from these descriptions. Adding a new editable page therefore
 * means adding one entry below — not writing another bespoke React panel.
 *
 * Field types: text | textarea | longtext | image | url | email | number |
 *              select | list (array of strings) | kv (array of {label,value}) |
 *              links (array of {label,to,description}) | repeater
 *
 * `root` is the path inside the content document that the section edits.
 * `key` inside each field is relative to that root. A root of [] means the
 * section edits a top-level collection directly.
 */

const t = (key, label, hint) => ({ key, label, type: 'text', hint })
const ta = (key, label, hint) => ({ key, label, type: 'textarea', hint })
const long = (key, label, hint) => ({ key, label, type: 'longtext', hint })
const img = (key, label, hint) => ({ key, label, type: 'image', hint })
const url = (key, label, hint) => ({ key, label, type: 'url', hint })
const list = (key, label, hint) => ({ key, label, type: 'list', hint })
const kv = (key, label, hint) => ({ key, label, type: 'kv', hint })
const links = (key, label, hint) => ({ key, label, type: 'links', hint })
const rep = (key, label, fields, itemLabel = 'title', hint) => ({ key, label, type: 'repeater', fields, itemLabel, hint })

const imageHint = 'Click the tile to upload from your computer, or pick an existing file from the library.'

export const adminSections = [
  /* ===================================================== site & identity */
  {
    id: 'meta',
    group: 'Site settings',
    title: 'Search & sharing (SEO)',
    description: 'How the site appears in Google results, browser tabs and when a link is shared on WhatsApp, LinkedIn or email.',
    root: ['meta'],
    fields: [
      t('siteUrl', 'Public website address', 'Used for canonical links, the sitemap and social preview images. Include https://'),
      t('defaultTitle', 'Home page title tag'),
      t('titleTemplate', 'Title pattern for inner pages', 'Use %s where the page name should appear, e.g. “%s | Ananta Infratech”.'),
      ta('description', 'Meta description', 'Around 150–160 characters. This is the grey text under the title in search results.'),
      list('keywords', 'Keywords', 'Used for the keywords meta tag and internal reference.'),
      img('ogImage', 'Social sharing image', 'Shown when a link is shared. Use a 1200×630 image for best results.'),
      t('twitterHandle', 'X / Twitter handle'),
      t('themeColor', 'Browser theme colour', 'Hex code used by mobile browser chrome.'),
    ]
  },
  {
    id: 'company',
    group: 'Site settings',
    title: 'Company profile',
    description: 'Legal identity, contact details, social links and the logo. These details feed the header, footer, contact page and structured data.',
    root: ['company'],
    fields: [
      t('name', 'Trading name'),
      t('legalName', 'Registered legal name'),
      t('shortName', 'Short brand name'),
      t('tagline', 'Tagline'),
      t('founded', 'Year founded'),
      t('yearsLabel', 'Years label', 'Shown next to images, e.g. “Since 2016”.'),
      t('employees', 'Team size label'),
      ta('address', 'Registered address'),
      list('addressLines', 'Address lines', 'Shown in compact locations such as the header and contact details.'),
      t('phone', 'Main phone'),
      t('phoneAlt', 'Alternate phone'),
      t('whatsapp', 'WhatsApp number', 'Digits only with country code, e.g. 919820042016.'),
      t('email', 'General email'),
      t('careersEmail', 'Careers email'),
      t('tendersEmail', 'Tenders email'),
      t('vendorEmail', 'Vendor registration email'),
      t('hrPhone', 'HR phone'),
      t('workingHours', 'Working hours'),
      url('linkedin', 'LinkedIn URL'),
      url('instagram', 'Instagram URL'),
      url('facebook', 'Facebook URL'),
      url('youtube', 'YouTube URL'),
      url('twitter', 'X / Twitter URL'),
      img('logo', 'Primary logo', 'Shown in the header, footer, admin portal and as the favicon. A transparent PNG works best.'),
      img('alternateLogo', 'Alternate logo'),
      ta('bio', 'Short company description', 'One paragraph. Used on the About page and in some structured data.'),
      kv('registrations', 'Registration summary', 'Short label/value pairs shown on the About page.'),
    ]
  },
  {
    id: 'badges',
    group: 'Site settings',
    title: 'Certifications & trust badges',
    description: 'The compliance strip shown on the home page, About page, footer and Awards page.',
    root: [],
    fields: [rep('badges', 'Badges', [t('label', 'Category'), t('value', 'Value')], 'value')]
  },
  {
    id: 'offices',
    group: 'Site settings',
    title: 'Offices & locations',
    description: 'Head office, regional offices and project offices. Each appears on the contact page with its own map.',
    root: [],
    fields: [rep('offices', 'Offices', [
      t('name', 'Office name'),
      t('type', 'Type', 'e.g. Head office, Regional office, Project office'),
      ta('address', 'Full address'),
      t('city', 'City'),
      t('phone', 'Phone'),
      t('email', 'Email'),
      t('hours', 'Opening hours'),
      url('mapUrl', 'Google Maps embed URL'),
      img('image', 'Office image'),
    ], 'name')]
  },
  {
    id: 'contact',
    group: 'Site settings',
    title: 'Contact page & department routing',
    description: 'Headings, response commitments, the map and the department list used to route enquiries.',
    root: ['contact'],
    fields: [
      t('title', 'Page heading'),
      ta('intro', 'Page introduction'),
      ta('responseNote', 'Response commitment note'),
      url('mapUrl', 'Default map embed URL'),
      rep('departments', 'Departments', [
        t('id', 'Identifier', 'Lowercase, hyphenated. Used by the contact form to route the enquiry.'),
        t('label', 'Department name'),
        t('email', 'Email'),
        t('phone', 'Phone'),
        t('note', 'What this team handles'),
      ], 'label'),
    ]
  },
  {
    id: 'footer',
    group: 'Site settings',
    title: 'Footer',
    description: 'Footer blurb, link columns, legal links and the newsletter block.',
    root: ['footer'],
    fields: [
      ta('blurb', 'Footer introduction'),
      { key: 'cta', label: 'Footer call to action', type: 'group', fields: [t('eyebrow', 'Eyebrow'), t('title', 'Heading'), t('linkLabel', 'Contact link label')] },
      { key: 'contact', label: 'Footer contact details', type: 'group', fields: [t('label', 'Heading'), t('email', 'Email'), t('phone', 'Phone'), ta('address', 'Address')] },
      links('legalLinks', 'Legal & compliance links', 'Shown along the bottom bar.'),
      t('credit', 'Credit line'),
      rep('columns', 'Link columns', [
        t('title', 'Column title'),
        links('links', 'Links in this column'),
      ], 'title'),
      {
        key: 'newsletter', label: 'Newsletter block', type: 'group', fields: [
          t('title', 'Heading'),
          ta('text', 'Description'),
          t('note', 'Small print'),
        ]
      },
    ]
  },

  /* ========================================================= navigation */
  {
    id: 'nav',
    group: 'Navigation',
    title: 'Main menu',
    description: 'The desktop mega menu and the mobile menu are generated from this list. Items with children open a dropdown; items without children link directly.',
    root: [],
    fields: [rep('nav', 'Menu items', [
      t('label', 'Menu label'),
      t('to', 'Link target', 'e.g. /services'),
      ta('blurb', 'Dropdown introduction'),
      rep('children', 'Dropdown links', [
        t('label', 'Label'),
        t('to', 'Link target'),
        ta('description', 'Short description'),
      ], 'label'),
    ], 'label')]
  },
  {
    id: 'sitemap',
    group: 'Navigation',
    title: 'Sitemap groups',
    description: 'Groups shown on the human-readable /sitemap page. The XML sitemap for search engines is generated automatically.',
    root: [],
    fields: [rep('sitemap', 'Groups', [
      t('group', 'Group name'),
      links('links', 'Links'),
    ], 'group')]
  },

  /* ============================================================== pages */
  {
    id: 'home',
    group: 'Page content',
    title: 'Home page',
    description: 'The hero slideshow, ticker, statistics, agreement sections and every heading on the home page.',
    root: ['home'],
    fields: [
      rep('slides', 'Hero slideshow', [
        t('eyebrow', 'Eyebrow'),
        t('title', 'Headline'),
        ta('text', 'Supporting text'),
        img('image', 'Slide image', imageHint),
        url('video', 'Background video URL (MP4)', 'Optional. Leave blank to use the image only.'),
        t('caption', 'Caption'),
      ], 'title'),
      rep('heroStats', 'Hero statistics', [t('value', 'Value'), t('label', 'Label')], 'label'),
      list('trustStrip', 'Certification strip'),
      list('ticker', 'News ticker items', 'Short one-line updates shown in the scrolling bar.'),
      { key: 'aboutTeaser', label: 'Introduction block', type: 'group', fields: [
        t('eyebrow', 'Eyebrow'),
        t('title', 'Heading'),
        ta('text', 'Paragraph'),
        img('image', 'Image', imageHint),
        rep('points', 'Key points', [t('title', 'Point'), ta('text', 'Detail')], 'title'),
      ] },
      { key: 'servicesSection', label: 'Services section heading', type: 'group', fields: [t('eyebrow', 'Eyebrow'), t('title', 'Heading'), ta('text', 'Description')] },
      { key: 'digitalSection', label: 'Digital services showcase', type: 'group', fields: [
        t('eyebrow', 'Eyebrow'), t('title', 'Heading'), ta('text', 'Description'),
        list('serviceSlugs', 'Services shown on home page', 'Add the exact service URL slugs to control which service cards appear in this showcase.'),
      ] },

      rep('stats', 'Statistics', [t('value', 'Value'), t('label', 'Label'), ta('detail', 'Detail')], 'label'),
      { key: 'capabilityBand', label: 'Capability band', type: 'group', fields: [
        t('eyebrow', 'Eyebrow'), t('title', 'Heading'), ta('text', 'Paragraph'), img('image', 'Image', imageHint), list('bullets', 'Bullet points'),
      ] },
      { key: 'hseTeaser', label: 'Safety section', type: 'group', fields: [
        t('eyebrow', 'Eyebrow'), t('title', 'Heading'), ta('text', 'Paragraph'), img('image', 'Image', imageHint),
        rep('metrics', 'Metrics', [t('value', 'Value'), t('label', 'Label')], 'label'),
      ] },
      { key: 'testimonialsSection', label: 'Testimonials heading', type: 'group', fields: [t('eyebrow', 'Eyebrow'), t('title', 'Heading')] },
      { key: 'processSection', label: 'Process heading', type: 'group', fields: [t('eyebrow', 'Eyebrow'), t('title', 'Heading')] },
      { key: 'ctaSection', label: 'Closing call to action', type: 'group', fields: [t('eyebrow', 'Eyebrow'), t('title', 'Heading'), ta('text', 'Paragraph'), img('image', 'Background image', imageHint)] },
    ]
  },
  {
    id: 'about',
    group: 'Page content',
    title: 'About us',
    description: 'The company story, mission, vision, values, timeline, differentiators and community work.',
    root: ['about'],
    fields: [
      t('title', 'Page heading'),
      ta('intro', 'Introduction'),
      img('image', 'Page hero image', imageHint),
      t('storyTitle', 'Story heading'),
      long('storyText', 'Story paragraph one'),
      long('storyText2', 'Story paragraph two'),
      img('storyImage', 'Story image', imageHint),
      { key: 'mission', label: 'Mission', type: 'group', fields: [t('title', 'Heading'), ta('text', 'Text')] },
      { key: 'vision', label: 'Vision', type: 'group', fields: [t('title', 'Heading'), ta('text', 'Text')] },
      rep('values', 'Values', [t('number', 'Number'), t('title', 'Title'), ta('text', 'Description')], 'title'),
      rep('timeline', 'Company timeline', [t('year', 'Year'), t('title', 'Milestone'), ta('text', 'Detail')], 'year'),
      rep('differentiators', 'Why clients stay', [t('title', 'Title'), ta('text', 'Description')], 'title'),
      { key: 'peopleImage', label: 'People image', type: 'image', hint: imageHint },
      { key: 'csrImage', label: 'Community image', type: 'image', hint: imageHint },
    ]
  },
  {
    id: 'leadershipIntro',
    group: 'Page content',
    title: 'Leadership — intro',
    root: ['leadershipIntro'],
    fields: [t('eyebrow', 'Eyebrow'), t('title', 'Heading'), ta('intro', 'Introduction')]
  },
  {
    id: 'leadership',
    group: 'Page content',
    title: 'Leadership — people',
    description: 'Director and leadership profiles. Each profile appears on the About page and the Leadership page.',
    root: [],
    fields: [rep('leadership', 'Leadership profiles', [
      t('id', 'Identifier'),
      t('name', 'Name'),
      t('role', 'Role / title'),
      t('focus', 'Focus areas'),
      img('image', 'Portrait', imageHint),
      t('years', 'Experience label'),
      ta('bio', 'Biography'),
      list('highlights', 'Career highlights'),
    ], 'name')]
  },
  {
    id: 'team',
    group: 'Page content',
    title: 'Team & departments',
    description: 'Team introduction, headline statistics and the department breakdown.',
    root: [],
    fields: [
      { key: 'teamIntro', label: 'Team introduction', type: 'group', fields: [t('eyebrow', 'Eyebrow'), t('title', 'Heading'), ta('intro', 'Introduction'), img('image', 'Team image', imageHint)] },
      rep('teamStats', 'Team statistics', [t('value', 'Value'), t('label', 'Label')], 'label'),
      rep('departments', 'Departments', [t('name', 'Department'), t('count', 'Headcount label'), ta('text', 'Description')], 'name'),
      { key: 'csr', label: 'Community work', type: 'group', fields: [
        t('eyebrow', 'Eyebrow'), t('title', 'Heading'), ta('intro', 'Introduction'),
        rep('initiatives', 'Initiatives', [t('title', 'Initiative'), ta('text', 'Description'), t('metric', 'Metric')], 'title'),
      ] },
    ]
  },
  {
    id: 'services',
    group: 'Page content',
    title: 'Services',
    description: 'Every service page is generated from this list, including its capabilities, deliverables, statistics and FAQs.',
    root: [],
    fields: [
      { key: 'servicesIntro', label: 'Services overview page', type: 'group', fields: [
        t('eyebrow', 'Eyebrow'), t('title', 'Heading'), ta('intro', 'Introduction'), img('image', 'Page hero image', imageHint),
        rep('stats', 'Statistics', [t('value', 'Value'), t('label', 'Label')], 'label'),
      ] },
      rep('services', 'Service pages', [
        t('slug', 'URL slug', 'Changing this changes the page address. Keep it lowercase and hyphenated.'),
        t('number', 'Number'),
        t('category', 'Service category', 'Use digital for technology services; construction services can leave this blank.'),
        t('title', 'Full title'),
        t('short', 'Short name', 'Used in menus and sidebars.'),
        t('tagline', 'Tagline'),
        ta('summary', 'Summary'),
        img('image', 'Image', imageHint),
        list('description', 'Opening paragraphs'),
        list('capabilities', 'Capabilities'),
        rep('deliverables', 'Deliverables', [t('title', 'Title'), ta('text', 'Description')], 'title'),
        rep('stats', 'Statistics', [t('value', 'Value'), t('label', 'Label')], 'label'),
        rep('faqs', 'FAQs', [t('question', 'Question'), ta('answer', 'Answer')], 'question'),
        list('sectors', 'Related sector slugs', 'e.g. commercial, residential. Must match sector slugs.'),
        list('relatedProjects', 'Related project IDs'),
      ], 'title'),
    ]
  },
  {
    id: 'sectors',
    group: 'Page content',
    title: 'Sectors',
    description: 'Sector pages, their highlights and statistics.',
    root: [],
    fields: [
      { key: 'sectorsIntro', label: 'Sectors overview page', type: 'group', fields: [
        t('eyebrow', 'Eyebrow'), t('title', 'Heading'), ta('intro', 'Introduction'), img('image', 'Page hero image', imageHint),
      ] },
      rep('sectors', 'Sector pages', [
        t('slug', 'URL slug'),
        t('title', 'Full title'),
        t('short', 'Short name'),
        ta('summary', 'Summary'),
        long('description', 'Full description'),
        img('image', 'Image', imageHint),
        t('projectCount', 'Project count label'),
        list('highlights', 'Scope highlights'),
        rep('stats', 'Statistics', [t('value', 'Value'), t('label', 'Label')], 'label'),
      ], 'title'),
    ]
  },
  {
    id: 'projects',
    group: 'Page content',
    title: 'Projects — overview settings',
    description: 'Headings for the projects listing page. Individual projects are managed in the Portfolio editor tab.',
    root: [],
    fields: [
      { key: 'projectsIntro', label: 'Projects page heading', type: 'group', fields: [t('eyebrow', 'Eyebrow'), t('title', 'Heading'), ta('intro', 'Introduction'), ta('note', 'Note under the grid')] },
    ]
  },
  {
    id: 'process',
    group: 'Page content',
    title: 'Delivery process',
    description: 'The five-stage method shown on the home page and the services pages.',
    root: ['process'],
    fields: [
      t('eyebrow', 'Eyebrow'),
      t('title', 'Heading'),
      ta('intro', 'Introduction'),
      rep('steps', 'Steps', [t('number', 'Number'), t('title', 'Title'), ta('text', 'Description'), list('outputs', 'Outputs')], 'title'),
    ]
  },
  {
    id: 'clientsTestimonials',
    group: 'Page content',
    title: 'Clients & testimonials',
    description: 'Client list and client quotes used across the site.',
    root: [],
    fields: [
      rep('clients', 'Clients', [t('name', 'Client name'), t('sector', 'Sector'), t('since', 'Client since'), t('projects', 'Projects together')], 'name'),
      rep('testimonials', 'Testimonials', [
        t('id', 'Identifier'), ta('quote', 'Quote'), t('author', 'Author'), t('role', 'Role'), t('project', 'Project'), t('year', 'Year'),
      ], 'author'),
    ]
  },
  {
    id: 'awards',
    group: 'Page content',
    title: 'Awards & certifications',
    root: [],
    fields: [
      rep('awards', 'Awards', [t('year', 'Year'), t('title', 'Award'), t('body', 'Awarding body'), ta('note', 'Why it was awarded')], 'title'),
      rep('certifications', 'Certifications', [t('label', 'Category'), t('value', 'Certification'), ta('detail', 'Detail')], 'value'),
    ]
  },
  {
    id: 'sustainability',
    group: 'Page content',
    title: 'Sustainability & ESG',
    root: ['sustainability'],
    fields: [
      t('eyebrow', 'Eyebrow'), t('title', 'Page heading'), ta('intro', 'Introduction'),
      img('image', 'Primary image', imageHint), img('secondaryImage', 'Secondary image', imageHint),
      rep('headlineStats', 'Headline statistics', [t('value', 'Value'), t('label', 'Label'), t('baseline', 'Baseline note')], 'label'),
      rep('commitments', 'Commitments', [t('number', 'Number'), t('title', 'Title'), ta('text', 'Description'), { key: 'progress', label: 'Progress %', type: 'number' }], 'title'),
      rep('practices', 'Practices', [t('title', 'Title'), ta('text', 'Description')], 'title'),
      rep('certifications', 'Certifications', [t('label', 'Category'), t('value', 'Value')], 'value'),
      rep('reports', 'Reports', [t('title', 'Report'), t('year', 'Year'), t('size', 'File size label'), t('to', 'Link')], 'title'),
    ]
  },
  {
    id: 'hse',
    group: 'Page content',
    title: 'Safety, quality & environment',
    root: ['hse'],
    fields: [
      t('eyebrow', 'Eyebrow'), t('title', 'Page heading'), ta('intro', 'Introduction'),
      img('image', 'Primary image', imageHint), img('secondaryImage', 'Secondary image', imageHint),
      rep('headlineStats', 'Headline statistics', [t('value', 'Value'), t('label', 'Label')], 'label'),
      rep('pillars', 'The three pillars', [t('number', 'Number'), t('title', 'Title'), ta('text', 'Description'), img('image', 'Image', imageHint), list('points', 'Key points')], 'title'),
      rep('safetyProgrammes', 'Safety programmes', [t('title', 'Title'), ta('text', 'Description')], 'title'),
      rep('certificates', 'Certificates & insurance', [t('label', 'Category'), t('value', 'Value')], 'value'),
    ]
  },
  {
    id: 'equipment',
    group: 'Page content',
    title: 'Plant & equipment',
    root: ['equipment'],
    fields: [
      t('eyebrow', 'Eyebrow'), t('title', 'Page heading'), ta('intro', 'Introduction'),
      img('image', 'Primary image', imageHint), img('secondaryImage', 'Secondary image', imageHint),
      rep('stats', 'Fleet statistics', [t('value', 'Value'), t('label', 'Label')], 'label'),
      rep('categories', 'Fleet categories', [t('name', 'Category'), img('image', 'Image', imageHint), list('items', 'Equipment list'), ta('note', 'Note')], 'name'),
      rep('maintenance', 'Maintenance & compliance', [t('title', 'Title'), ta('text', 'Description')], 'title'),
    ]
  },
  {
    id: 'insights',
    group: 'Page content',
    title: 'Insights & articles',
    description: 'Each entry becomes an article page at /insights/{slug}.',
    root: [],
    fields: [rep('insights', 'Articles', [
      t('slug', 'URL slug'),
      t('title', 'Headline'),
      t('date', 'Display date'),
      t('dateISO', 'Sortable date', 'Format: 2026-06-08'),
      t('type', 'Type', 'Perspective, Project note, People, Ideas or Innovation'),
      t('category', 'Category'),
      img('image', 'Image', imageHint),
      ta('excerpt', 'Excerpt'),
      t('author', 'Author'),
      t('authorRole', 'Author role'),
      t('readingTime', 'Reading time'),
      list('body', 'Article paragraphs'),
      list('tags', 'Tags'),
    ], 'title')]
  },
  {
    id: 'newsroom',
    group: 'Page content',
    title: 'Newsroom',
    root: [],
    fields: [rep('newsroom', 'Announcements', [
      t('date', 'Display date'), t('dateISO', 'Sortable date', 'Format: 2026-09-02'),
      t('type', 'Type'), t('title', 'Headline'), ta('summary', 'Summary'), t('link', 'Link target'),
    ], 'title')]
  },
  {
    id: 'careers',
    group: 'Careers & registration',
    title: 'Careers page',
    description: 'The careers page copy, benefits, hiring process and growth programmes. Job vacancies are managed in the Vacancies tab.',
    root: ['careers'],
    fields: [
      t('eyebrow', 'Eyebrow'), t('title', 'Page heading'), ta('intro', 'Introduction'), img('image', 'Page hero image', imageHint),
      rep('heroStats', 'Hero statistics', [t('value', 'Value'), t('label', 'Label')], 'label'),
      rep('whyJoin', 'Why people join', [t('title', 'Title'), ta('text', 'Description')], 'title'),
      rep('benefits', 'Benefits', [t('label', 'Benefit'), t('detail', 'Detail')], 'label'),
      rep('hiringProcess', 'Hiring process', [t('number', 'Number'), t('title', 'Stage'), ta('text', 'Description')], 'title'),
      rep('growthProgrammes', 'Growth programmes', [t('title', 'Programme'), ta('text', 'Description'), t('duration', 'Duration')], 'title'),
      { key: 'contact', label: 'Recruitment contact', type: 'group', fields: [t('name', 'Team name'), t('email', 'Email'), t('phone', 'Phone'), ta('note', 'Response note')] },
    ]
  },
  {
    id: 'jobs',
    group: 'Careers & registration',
    title: 'Job vacancies',
    description: 'Each vacancy gets its own page at /careers/{id} with an application form and JobPosting structured data.',
    root: [],
    fields: [rep('jobs', 'Vacancies', [
      t('id', 'URL slug'),
      t('title', 'Job title'),
      t('department', 'Department'),
      t('location', 'Location'),
      t('type', 'Employment type'),
      t('experience', 'Experience required'),
      t('salary', 'Compensation'),
      t('posted', 'Posted date'),
      { key: 'urgency', label: 'Status label', type: 'select', options: ['Open', 'Urgent', 'On hold'] },
      ta('summary', 'Role summary'),
      list('responsibilities', 'Responsibilities'),
      list('requirements', 'Requirements'),
      list('nice', 'Nice to have'),
    ], 'title')]
  },
  {
    id: 'register',
    group: 'Careers & registration',
    title: 'Contractor & worker registration',
    description: 'The registration section on the website, both tracks, and whether applications are open. The section stays on the site either way — this is the switch that decides if the form is live or the page shows "coming soon".',
    root: ['register'],
    fields: [
      {
        key: 'enabled',
        label: 'Accept registration applications',
        type: 'toggle',
        onLabel: 'Applications open — the form is live',
        offLabel: 'Coming soon — the form is disabled',
        hint: 'Off keeps every page, both tracks and the copy in place, labels every registration link “Coming soon”, and refuses submissions on the server so nobody is left expecting a reply. Turn it on when the portal is ready.'
      },
      t('status', 'Status label', 'Shown on every registration link and badge while applications are closed.'),
      t('eyebrow', 'Eyebrow'), t('title', 'Page heading'), ta('intro', 'Introduction'), img('image', 'Page hero image', imageHint),
      { key: 'launch', label: 'Launch messaging', type: 'group', fields: [
        t('status', 'Status label in the banner'),
        t('headline', 'Headline'),
        ta('note', 'Explanatory note'),
        t('date', 'Opening date message'),
      ] },
      { key: 'comingSoon', label: '“Coming soon” panel', type: 'group', fields: [
        t('headline', 'Heading'),
        ta('text', 'Introduction'),
        rep('whatsComing', 'What is being built', [t('title', 'Feature'), ta('text', 'Description')], 'title'),
        rep('meanwhile', 'Who to contact meanwhile', [
          t('label', 'Track'),
          ta('text', 'Who this line is for'),
          t('email', 'Email'),
          t('phone', 'Phone'),
        ], 'label'),
      ] },
      rep('trustPoints', 'Trust points', [t('label', 'Label'), ta('text', 'Description')], 'label'),
      { key: 'contractor', label: 'Contractor track', type: 'group', fields: [
        t('label', 'Track label'), t('title', 'Heading'), ta('text', 'Description'),
        list('steps', 'Steps'),
        list('types', 'Work categories', 'One per line. Used for the contractor registration form.'),
        list('scaleOptions', 'Package value bands'),
        list('requirements', 'Documents required'),
        ta('processNote', 'Process note'),
      ] },
      { key: 'worker', label: 'Worker track', type: 'group', fields: [
        t('label', 'Track label'), t('title', 'Heading'), ta('text', 'Description'),
        list('steps', 'Steps'),
        list('experienceOptions', 'Experience bands'),
        list('benefits', 'Benefits'),
        ta('processNote', 'Process note'),
      ] },
      { key: 'employerNote', label: 'What we ask in return', type: 'group', fields: [t('title', 'Heading'), ta('text', 'Text')] },
    ]
  },
  {
    id: 'tenders',
    group: 'Careers & registration',
    title: 'Tenders & procurement',
    root: ['tenders'],
    fields: [
      t('eyebrow', 'Eyebrow'), t('title', 'Page heading'), ta('intro', 'Introduction'), img('image', 'Page hero image', imageHint),
      rep('process', 'Tender process', [t('number', 'Number'), t('title', 'Stage'), ta('text', 'Description')], 'title'),
      rep('criteria', 'Evaluation criteria', [t('label', 'Criterion'), t('weight', 'Weighting')], 'label'),
      list('requirements', 'Prequalification requirements'),
      rep('packages', 'Open packages', [t('name', 'Package'), t('type', 'Type'), t('scale', 'Typical value'), t('status', 'Status')], 'name'),
      ta('note', 'Contact note'),
    ]
  },
  {
    id: 'downloads',
    group: 'Page content',
    title: 'Downloads & brochures',
    root: ['downloads'],
    fields: [
      t('eyebrow', 'Eyebrow'), t('title', 'Page heading'), ta('intro', 'Introduction'),
      rep('documents', 'Documents', [t('id', 'Identifier'), t('title', 'Document title'), ta('text', 'Description'), t('meta', 'File size label'), t('tag', 'Category')], 'title'),
    ]
  },
  {
    id: 'faq',
    group: 'Page content',
    title: 'Frequently asked questions',
    description: 'Grouped questions. These also generate FAQ structured data for search engines.',
    root: ['faq'],
    fields: [
      t('eyebrow', 'Eyebrow'), t('title', 'Page heading'), ta('intro', 'Introduction'),
      rep('categories', 'Question groups', [
        t('name', 'Group name'),
        rep('items', 'Questions', [t('question', 'Question'), long('answer', 'Answer')], 'question'),
      ], 'name'),
    ]
  },
  {
    id: 'policies',
    group: 'Site settings',
    title: 'Legal policies',
    description: 'Privacy, terms, conduct and compliance policies. Each becomes a page at /policy/{slug}.',
    root: [],
    fields: [rep('policies', 'Policies', [
      t('slug', 'URL slug'),
      t('title', 'Policy title'),
      t('updated', 'Last updated'),
      ta('intro', 'Introduction'),
      rep('sections', 'Sections', [t('heading', 'Heading'), list('body', 'Paragraphs')], 'heading'),
    ], 'title')]
  },
]

/** Section groups in the order they should be presented in the editor sidebar. */
export const sectionGroups = ['Site settings', 'Navigation', 'Page content', 'Careers & registration']

export const sectionsByGroup = () => sectionGroups.map((group) => ({
  group,
  sections: adminSections.filter((section) => section.group === group)
}))
