import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, Code2, Eye, EyeOff, Home as HomeIcon,
  Image as ImageIcon, ImagePlus, LayoutDashboard, LogOut, Mail, Monitor, Newspaper, Palette,
  Plus, RefreshCw, RotateCcw, Save, Settings2, Smartphone, Tablet, Trash2, UploadCloud, UsersRound
} from 'lucide-react'
import Brand from '../components/Brand'
import { useSite } from '../lib/site'

const clone = v => JSON.parse(JSON.stringify(v))
const get = (obj, path) => path.reduce((o, k) => o?.[k], obj)
const slugify = s => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const PREVIEW_PAGES = [
  ['/', 'Home page'], ['/about', 'About us'], ['/capabilities', 'Capabilities'], ['/projects', 'Projects'],
  ['/sustainability', 'Sustainability'], ['/insights', 'Insights'], ['/contact', 'Contact'], ['/careers', 'Careers']
]
const PAGE_SECTIONS = [
  ['about', 'About us'], ['capabilities', 'Capabilities'], ['sustainability', 'Sustainability'],
  ['contact', 'Contact'], ['careers', 'Careers']
]

/* ---------- shared editor controls ---------- */

function Field({ draft, update, label, path, type = 'text', rows = 3, wide = false, hint }) {
  const value = get(draft, path) ?? ''
  return <label className={wide || type === 'textarea' ? 'wide' : ''}>{label}
    {type === 'textarea'
      ? <textarea rows={rows} value={value} onChange={e => update(path, e.target.value)}/>
      : <input type={type} value={value} onChange={e => update(path, e.target.value)}/>}
    {hint && <small className="field-hint">{hint}</small>}
  </label>
}

function ImageField({ label, value, onChange, uploadImage, hint }) {
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const pick = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true); setError('')
    try { onChange(await uploadImage(file)) } catch (err) { setError(err.message) }
    setBusy(false); e.target.value = ''
  }
  return <div className="image-field wide">
    <span className="image-field-label">{label}</span>
    <div className="image-field-row">
      <span className="image-thumb">{value ? <img src={value} alt="" onError={e => { e.currentTarget.style.opacity = .25 }}/> : <ImageIcon size={15}/>}</span>
      <input value={value || ''} onChange={e => onChange(e.target.value)} placeholder="https://… or /uploads/…"/>
      <button type="button" className="upload-chip" disabled={busy} onClick={() => fileRef.current?.click()}>
        <UploadCloud size={13}/>{busy ? 'Uploading…' : 'Upload'}
      </button>
      <input ref={fileRef} type="file" hidden accept="image/png,image/jpeg,image/webp,image/gif" onChange={pick}/>
    </div>
    {(error || hint) && <small className={error ? 'field-error' : 'field-hint'}>{error || hint}</small>}
  </div>
}

function ImgField({ draft, update, uploadImage, label, path, hint }) {
  return <ImageField label={label} hint={hint} value={get(draft, path) || ''} onChange={v => update(path, v)} uploadImage={uploadImage}/>
}

function StringList({ label, items = [], onChange, placeholder = 'Add a line' }) {
  return <div className="string-list wide">
    <span className="image-field-label">{label}</span>
    {items.map((value, i) => <div key={i} className="string-row">
      <input value={value} onChange={e => { const next = [...items]; next[i] = e.target.value; onChange(next) }} placeholder={placeholder}/>
      <button type="button" className="icon-button danger" onClick={() => onChange(items.filter((_, x) => x !== i))} aria-label="Remove line"><Trash2 size={13}/></button>
    </div>)}
    <button type="button" className="add-row" onClick={() => onChange([...items, ''])}><Plus size={13}/> Add line</button>
  </div>
}

function ListEditor({ title, hint, items = [], onChange, blank, fields, uploadImage, labelKey = 'title', itemName = 'entry', transform, onOpen }) {
  const [open, setOpenState] = useState(-1)
  const setOpen = i => { setOpenState(i); if (i >= 0 && onOpen) onOpen(items[i], i) }
  const set = (i, key, value) => {
    const next = clone(items)
    next[i][key] = value
    if (transform) next[i] = transform(next[i], key, value)
    onChange(next)
  }
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = clone(items); [next[i], next[j]] = [next[j], next[i]]
    onChange(next); setOpenState(j)
  }
  const remove = i => {
    if (!window.confirm('Remove this entry? It disappears from the site when you publish.')) return
    onChange(items.filter((_, x) => x !== i)); setOpenState(-1)
  }
  const add = () => { onChange([...items, typeof blank === 'function' ? blank() : clone(blank)]); setOpenState(items.length) }
  return <div className="content-card list-editor">
    <div className="list-editor-head">
      <div><h2>{title}</h2>{hint && <p className="card-hint">{hint}</p>}</div>
      <button type="button" className="button button-small" onClick={add}><Plus size={14}/> Add {itemName}</button>
    </div>
    {items.length === 0 && <p className="card-hint">Nothing here yet — add your first {itemName}.</p>}
    {items.map((item, i) => <div key={i} className={`list-item ${open === i ? 'open' : ''}`}>
      <div className="list-item-head" role="button" tabIndex={0} onClick={() => setOpen(open === i ? -1 : i)} onKeyDown={e => e.key === 'Enter' && setOpen(open === i ? -1 : i)}>
        <span className="list-index">{String(i + 1).padStart(2, '0')}</span>
        <b>{item[labelKey] || `Untitled ${itemName}`}</b>
        <span className="list-item-tools" onClick={e => e.stopPropagation()}>
          <button type="button" className="icon-button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><ChevronUp size={14}/></button>
          <button type="button" className="icon-button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down"><ChevronDown size={14}/></button>
          <button type="button" className="icon-button danger" onClick={() => remove(i)} aria-label="Remove"><Trash2 size={14}/></button>
        </span>
        <ChevronDown className={`list-caret ${open === i ? 'rot' : ''}`} size={15}/>
      </div>
      {open === i && <div className="editor-grid list-item-body">
        {fields.map(f => {
          if (f.type === 'image') return <ImageField key={f.key} label={f.label} value={item[f.key] || ''} onChange={v => set(i, f.key, v)} uploadImage={uploadImage}/>
          if (f.type === 'list') return <StringList key={f.key} label={f.label} items={item[f.key] || []} onChange={v => set(i, f.key, v)} placeholder={f.placeholder}/>
          if (f.type === 'textarea') return <label key={f.key} className="wide">{f.label}<textarea rows={f.rows || 3} value={item[f.key] || ''} onChange={e => set(i, f.key, e.target.value)}/></label>
          return <label key={f.key} className={f.wide ? 'wide' : ''}>{f.label}<input value={item[f.key] || ''} onChange={e => set(i, f.key, e.target.value)}/></label>
        })}
      </div>}
    </div>)}
  </div>
}

/* ---------- live preview ---------- */

function PreviewPane({ draft, page, setPage, device, setDevice }) {
  const frameRef = useRef(null)
  const stageRef = useRef(null)
  const [box, setBox] = useState({ w: 640, h: 720 })
  const widths = { desktop: 1366, tablet: 834, mobile: 390 }
  const width = widths[device]
  const send = useCallback(() => {
    try { frameRef.current?.contentWindow?.postMessage({ type: 'ananta:site', site: draft }, '*') } catch { /* frame not ready */ }
  }, [draft])
  useEffect(() => { send() }, [send])
  useEffect(() => {
    const onMessage = e => { if (e.data?.type === 'ananta:ready') send() }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [send])
  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const fit = () => setBox({ w: el.clientWidth, h: el.clientHeight })
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  const scale = Math.min(1, box.w / width)
  const offset = Math.max(0, (box.w - width * scale) / 2)
  return <aside className="preview-pane">
    <div className="preview-toolbar">
      <span className="preview-dot" aria-hidden="true"/><b>Live preview</b>
      <select value={page} onChange={e => setPage(e.target.value)} aria-label="Preview page">
        {PREVIEW_PAGES.map(([to, label]) => <option key={to} value={to}>{label}</option>)}
        {!PREVIEW_PAGES.some(([to]) => to === page) && <option value={page}>{page}</option>}
      </select>
      <span className="device-switch">
        {[['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]].map(([id, Icon]) =>
          <button key={id} type="button" className={device === id ? 'active' : ''} onClick={() => setDevice(id)} aria-label={`${id} preview`}><Icon size={14}/></button>)}
      </span>
      <button type="button" className="icon-button light" onClick={() => { const f = frameRef.current; if (f) f.src = `${page}?preview=1&t=${Date.now()}` }} aria-label="Reload preview"><RefreshCw size={13}/></button>
    </div>
    <div className="preview-stage" ref={stageRef}>
      <iframe key={page} ref={frameRef} name="ananta-preview" title="Live site preview" src={`${page}?preview=1`} onLoad={send}
        style={{ width, height: scale ? box.h / scale : box.h, transform: `scale(${scale})`, marginLeft: offset }}/>
    </div>
    <p className="preview-note">Edits appear here instantly. Visitors only see them after you press “Publish changes”.</p>
  </aside>
}

/* ---------- section editors ---------- */

function BrandEditor({ draft, update, uploadImage }) {
  const shared = { draft, update, uploadImage }
  return <>
    <div className="content-card">
      <h2>Logo & brand marks</h2>
      <p className="card-hint">Upload a new logo and watch the header and footer update instantly in the preview. A PNG with a transparent background works best.</p>
      <div className="editor-grid">
        <ImgField {...shared} label="Primary logo (header, footer & admin)" path={['company', 'logo']}/>
        <ImgField {...shared} label="Alternate / square logo" path={['company', 'alternateLogo']}/>
      </div>
    </div>
    <div className="content-card">
      <h2>Company profile</h2>
      <div className="editor-grid">
        <Field {...shared} label="Company name" path={['company', 'name']}/>
        <Field {...shared} label="Short name" path={['company', 'shortName']}/>
        <Field {...shared} label="Tagline" path={['company', 'tagline']}/>
        <Field {...shared} label="Founded" path={['company', 'founded']}/>
        <Field {...shared} label="Phone" path={['company', 'phone']}/>
        <Field {...shared} label="Email" path={['company', 'email']}/>
        <Field {...shared} label="LinkedIn URL" path={['company', 'linkedin']}/>
        <Field {...shared} label="Instagram URL" path={['company', 'instagram']}/>
        <Field {...shared} label="Address" path={['company', 'address']} type="textarea" rows={2}/>
      </div>
    </div>
  </>
}

function HomeEditor({ draft, update, uploadImage }) {
  const shared = { draft, update, uploadImage }
  return <>
    <div className="content-card">
      <h2>Hero</h2>
      <div className="editor-grid">
        <Field {...shared} label="Eyebrow line" path={['home', 'eyebrow']}/>
        <Field {...shared} label="Main title" path={['home', 'heroTitle']} type="textarea" rows={3} hint="New lines become line breaks. Wrap a word in *asterisks* to italicise it."/>
        <Field {...shared} label="Intro paragraph" path={['home', 'heroText']} type="textarea"/>
        <ImgField {...shared} label="Hero image (also the video poster)" path={['home', 'heroImage']}/>
        <Field {...shared} label="Hero video URL (MP4, optional)" path={['home', 'heroVideo']} wide/>
      </div>
    </div>
    <div className="content-card">
      <h2>Signature section & approach</h2>
      <div className="editor-grid">
        <ImgField {...shared} label="Signature full-width image" path={['home', 'signatureImage']}/>
        <Field {...shared} label="Caption left" path={['home', 'signatureCaptionLeft']}/>
        <Field {...shared} label="Caption right" path={['home', 'signatureCaptionRight']}/>
        <Field {...shared} label="Approach eyebrow" path={['home', 'manifestoLabel']}/>
        <Field {...shared} label="Approach title" path={['home', 'manifestoTitle']} wide/>
        <Field {...shared} label="Approach text" path={['home', 'manifestoText']} type="textarea"/>
        <Field {...shared} label="Belief quote" path={['home', 'beliefQuote']} type="textarea"/>
        <ImgField {...shared} label="Capability band image" path={['home', 'capabilityImage']}/>
      </div>
    </div>
    <ListEditor title="Statistics strip" hint="The four headline numbers on the home page." itemName="statistic"
      items={draft.home.stats} onChange={v => update(['home', 'stats'], v)} labelKey="label"
      blank={{ value: '0', label: 'New statistic' }}
      fields={[{ key: 'value', label: 'Value (e.g. 10+)' }, { key: 'label', label: 'Label' }]}/>
  </>
}

function PagesEditor({ draft, update, uploadImage, section, setSection }) {
  const shared = { draft, update, uploadImage }
  return <>
    <div className="section-chips">
      {PAGE_SECTIONS.map(([id, label]) => <button key={id} type="button" className={section === id ? 'active' : ''} onClick={() => setSection(id)}>{label}</button>)}
    </div>
    {section === 'about' && <>
      <div className="content-card"><h2>About page</h2><div className="editor-grid">
        <Field {...shared} label="Heading" path={['about', 'title']} wide/>
        <Field {...shared} label="Introduction" path={['about', 'intro']} type="textarea"/>
        <ImgField {...shared} label="Hero image" path={['about', 'image']}/>
        <Field {...shared} label="Story title" path={['about', 'storyTitle']} wide/>
        <Field {...shared} label="Story text" path={['about', 'storyText']} type="textarea"/>
        <ImgField {...shared} label="People banner image" path={['about', 'peopleImage']}/>
      </div></div>
      <ListEditor title="Values" itemName="value" items={draft.about.values} onChange={v => update(['about', 'values'], v)}
        blank={() => ({ number: String(draft.about.values.length + 1).padStart(2, '0'), title: 'New value', text: '' })}
        fields={[{ key: 'number', label: 'Number (e.g. 01)' }, { key: 'title', label: 'Title' }, { key: 'text', label: 'Description', type: 'textarea' }]}/>
    </>}
    {section === 'capabilities' && <>
      <div className="content-card"><h2>Capabilities page</h2><div className="editor-grid">
        <Field {...shared} label="Heading" path={['capabilities', 'title']} wide/>
        <Field {...shared} label="Introduction" path={['capabilities', 'intro']} type="textarea"/>
      </div></div>
      <ListEditor title="Services" itemName="service" items={draft.capabilities.services} onChange={v => update(['capabilities', 'services'], v)}
        blank={() => ({ id: String(draft.capabilities.services.length + 1).padStart(2, '0'), title: 'New service', text: '', items: [] })}
        fields={[{ key: 'id', label: 'Number (e.g. 05)' }, { key: 'title', label: 'Service name' }, { key: 'text', label: 'Description', type: 'textarea' }, { key: 'items', label: 'Bullet points', type: 'list', placeholder: 'e.g. Cost planning' }]}/>
    </>}
    {section === 'sustainability' && <>
      <div className="content-card"><h2>Sustainability page</h2><div className="editor-grid">
        <Field {...shared} label="Heading" path={['sustainability', 'title']} wide/>
        <Field {...shared} label="Introduction" path={['sustainability', 'intro']} type="textarea"/>
        <ImgField {...shared} label="Primary image" path={['sustainability', 'image']}/>
        <ImgField {...shared} label="Secondary image" path={['sustainability', 'secondaryImage']}/>
      </div></div>
      <ListEditor title="Commitments" itemName="commitment" items={draft.sustainability.commitments} onChange={v => update(['sustainability', 'commitments'], v)} labelKey="label"
        blank={{ metric: '0%', label: 'New commitment' }}
        fields={[{ key: 'metric', label: 'Metric (e.g. 30%)' }, { key: 'label', label: 'Description', type: 'textarea', rows: 2 }]}/>
    </>}
    {section === 'contact' && <div className="content-card"><h2>Contact page</h2><div className="editor-grid">
      <Field {...shared} label="Heading" path={['contact', 'title']} wide/>
      <Field {...shared} label="Introduction" path={['contact', 'intro']} type="textarea"/>
      <Field {...shared} label="Map embed URL" path={['contact', 'mapUrl']} wide hint="Use a Google Maps embed link, e.g. https://www.google.com/maps?q=Juhu,Mumbai&output=embed"/>
    </div></div>}
    {section === 'careers' && <>
      <div className="content-card"><h2>Careers page</h2><div className="editor-grid">
        <Field {...shared} label="Heading" path={['careers', 'title']} wide/>
        <Field {...shared} label="Introduction" path={['careers', 'intro']} type="textarea"/>
        <ImgField {...shared} label="Careers image" path={['careers', 'image']}/>
      </div></div>
      <ListEditor title="Open roles" itemName="role" items={draft.careers.roles} onChange={v => update(['careers', 'roles'], v)}
        blank={{ title: 'New role', location: 'Mumbai', type: 'Full-time' }}
        fields={[{ key: 'title', label: 'Role title' }, { key: 'location', label: 'Location' }, { key: 'type', label: 'Type (e.g. Full-time)' }]}/>
    </>}
  </>
}

function PortfolioEditor({ draft, update, uploadImage, setPreviewPage }) {
  return <ListEditor title="Project portfolio" itemName="project"
    hint="Open a project to edit it — the preview jumps to its page so you can see every change live."
    items={draft.projects} onChange={v => update(['projects'], v)} uploadImage={uploadImage}
    onOpen={item => { if (item?.id || item?._id) setPreviewPage(`/projects/${item.id || item._id}`) }}
    blank={() => ({ id: `new-project-${Date.now()}`, title: 'New project', category: 'Commercial', location: 'Mumbai, India', year: String(new Date().getFullYear()), status: 'In progress', scope: 'Construction management', image: '/assets/ananta-signature-structure.jpg', summary: 'Add a concise project summary.', challenge: 'Describe the project challenge.', impact: 'Describe the result.' })}
    transform={(item, key) => { if (key === 'title' && !item._id) item.id = slugify(item.title) || item.id; return item }}
    fields={[
      { key: 'title', label: 'Project name' }, { key: 'category', label: 'Category' },
      { key: 'location', label: 'Location' }, { key: 'year', label: 'Year' },
      { key: 'status', label: 'Status' }, { key: 'scope', label: 'Scope' },
      { key: 'image', label: 'Project image', type: 'image' },
      { key: 'summary', label: 'Summary', type: 'textarea' },
      { key: 'challenge', label: 'The challenge', type: 'textarea' },
      { key: 'impact', label: 'The impact', type: 'textarea' }
    ]}/>
}

function InsightsEditor({ draft, update, uploadImage, setPreviewPage }) {
  return <>
    <ListEditor title="Insight articles" itemName="article"
      hint="Full articles shown on the Insights page. Each paragraph of the body is one line below."
      items={draft.insights} onChange={v => update(['insights'], v)} uploadImage={uploadImage}
      onOpen={item => { if (item?.slug) setPreviewPage('/insights') }}
      blank={() => ({ slug: `new-insight-${Date.now()}`, date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '.'), type: 'Perspective', title: 'New insight', image: '', excerpt: '', author: 'Ananta Editorial', body: [''] })}
      transform={(item, key) => { if (key === 'title') item.slug = slugify(item.title) || item.slug; return item }}
      fields={[
        { key: 'title', label: 'Title', wide: true }, { key: 'type', label: 'Type (e.g. Perspective)' },
        { key: 'date', label: 'Date (e.g. 08.06.26)' }, { key: 'author', label: 'Author' },
        { key: 'slug', label: 'URL slug' }, { key: 'image', label: 'Article image', type: 'image' },
        { key: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 2 },
        { key: 'body', label: 'Body paragraphs', type: 'list', placeholder: 'Write a paragraph' }
      ]}/>
    <ListEditor title="Home page news links" itemName="news link"
      hint="The short list of headlines on the home page. Use the slug of an insight article so the link works."
      items={draft.news} onChange={v => update(['news'], v)}
      blank={{ slug: '', date: '', type: 'Perspective', title: 'New headline' }}
      fields={[
        { key: 'title', label: 'Headline', wide: true }, { key: 'type', label: 'Type' },
        { key: 'date', label: 'Date' }, { key: 'slug', label: 'Insight slug to link to' }
      ]}/>
  </>
}

function EverythingEditor({ draft, setDraft }) {
  const [text, setText] = useState(JSON.stringify(draft, null, 2))
  const [message, setMessage] = useState('')
  useEffect(() => setText(JSON.stringify(draft, null, 2)), [draft])
  const apply = () => {
    try {
      const parsed = JSON.parse(text)
      setDraft(parsed); setText(JSON.stringify(parsed, null, 2))
      setMessage('Valid content applied to the preview — remember to publish.')
    } catch (e) { setMessage(`JSON error: ${e.message}`) }
  }
  return <div className="everything-editor">
    <div className="editor-intro">
      <div><h2>All website content</h2><p>Advanced: edit the complete content object directly. Apply to push it into the live preview, then publish.</p></div>
      <button className="button button-dark" onClick={apply}>Apply to preview</button>
    </div>
    {message && <p className="editor-message">{message}</p>}
    <textarea spellCheck="false" value={text} onChange={e => setText(e.target.value)} aria-label="Complete site content JSON"/>
  </div>
}

function Overview({ site, setTab }) {
  return <div className="admin-overview">
    <div className="admin-kpis">
      <div><span>Portfolio projects</span><strong>{site.projects.length}</strong><button onClick={() => setTab('portfolio')}>Edit portfolio →</button></div>
      <div><span>Insight articles</span><strong>{site.insights.length}</strong><button onClick={() => setTab('insights')}>Edit insights →</button></div>
      <div><span>Open roles</span><strong>{site.careers.roles.length}</strong><button onClick={() => setTab('pages')}>Edit careers →</button></div>
    </div>
    <div className="admin-guide">
      <div><Palette size={24}/><h2>Live preview everywhere</h2><p>Every editor shows the real website beside it. Type a word, swap an image or upload a new logo and watch it change in real time — nothing goes live until you publish.</p><button className="text-button" onClick={() => setTab('brand')}>Update the logo →</button></div>
      <div><UsersRound size={24}/><h2>Everything is editable</h2><p>Brand, home page, every inner page, projects, insights and careers each have their own editor with image uploads built into every picture field.</p><button className="text-button" onClick={() => setTab('home')}>Edit the home page →</button></div>
    </div>
  </div>
}

function InquiryList({ inquiries, reload }) {
  return <div className="inquiries">
    <div className="inquiry-tools"><p>{inquiries.length} message{inquiries.length === 1 ? '' : 's'} received</p><button onClick={reload}>Refresh</button></div>
    {inquiries.length === 0
      ? <div className="empty-state"><Mail size={26}/><h2>No enquiries yet.</h2><p>Project and career enquiries submitted on the website will appear here.</p></div>
      : inquiries.map(item => <article key={item._id || item.createdAt} className="inquiry">
        <div><span>{item.kind === 'career' ? 'Career application' : 'Project enquiry'}</span><h2>{item.name}</h2><a href={`mailto:${item.email}`}>{item.email}</a>{item.phone && <a href={`tel:${item.phone}`}>{item.phone}</a>}</div>
        <div><p>{item.message || 'No message supplied.'}</p>{item.role && <small>Role: {item.role}</small>}{item.cv && <a target="_blank" rel="noreferrer" href={item.cv}>Portfolio / CV ↗</a>}<time>{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Just now'}</time></div>
      </article>)}
  </div>
}

/* ---------- main admin shell ---------- */

const MENU = [
  ['overview', 'Overview', LayoutDashboard],
  ['brand', 'Brand & logo', Palette],
  ['home', 'Home page', HomeIcon],
  ['pages', 'Pages', Settings2],
  ['portfolio', 'Portfolio', ImagePlus],
  ['insights', 'Insights & news', Newspaper],
  ['cms', 'Everything editor', Code2],
  ['inquiries', 'Enquiries', Mail]
]
const EDIT_TABS = ['brand', 'home', 'pages', 'portfolio', 'insights', 'cms']
const TAB_TITLES = {
  overview: 'Good to see you.', brand: 'Brand & logo.', home: 'Home page editor.', pages: 'Page editor.',
  portfolio: 'Portfolio editor.', insights: 'Insights & news.', cms: 'Everything editor.', inquiries: 'Website enquiries.'
}

export default function Admin() {
  const { site, setSite } = useSite()
  const [token, setToken] = useState(localStorage.getItem('ananta-token'))
  const [tab, setTab] = useState('overview')
  const [pageSection, setPageSection] = useState('about')
  const [notice, setNotice] = useState('')
  const [inquiries, setInquiries] = useState([])
  const [draft, setDraft] = useState(null)
  const [email, setEmail] = useState('admin@anantainfratech.com')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showPreview, setShowPreview] = useState(true)
  const [previewPage, setPreviewPage] = useState('/')
  const [device, setDevice] = useState('desktop')

  useEffect(() => { if (site && !draft) setDraft(clone(site)) }, [site, draft])
  useEffect(() => { if (token && tab === 'inquiries') loadInquiries() }, [token, tab]) // eslint-disable-line
  useEffect(() => {
    const map = { brand: '/', home: '/', cms: '/', portfolio: '/projects', insights: '/insights', pages: `/${pageSection}` }
    if (map[tab]) setPreviewPage(map[tab])
  }, [tab, pageSection])

  const api = async (url, options = {}) => {
    const response = await fetch(url, { ...options, headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` } })
    const data = await response.json()
    if (!response.ok) throw Error(data.message || 'Request failed')
    return data
  }
  const login = async e => {
    e.preventDefault(); setLoginError('')
    try {
      const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      const data = await response.json()
      if (!response.ok) throw Error(data.message)
      localStorage.setItem('ananta-token', data.token); setToken(data.token); setPassword('')
    } catch (err) { setLoginError(err.message) }
  }
  const save = async () => {
    try {
      await api('/api/admin/site', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) })
      setSite(clone(draft))
      setNotice('Changes published to the live site.'); setTimeout(() => setNotice(''), 4000)
    } catch (err) { setNotice(err.message) }
  }
  const discard = () => {
    if (!window.confirm('Discard all unpublished changes?')) return
    setDraft(clone(site)); setNotice('Draft reset to the published site.'); setTimeout(() => setNotice(''), 3000)
  }
  const loadInquiries = async () => { try { setInquiries(await api('/api/admin/inquiries')) } catch (err) { setNotice(err.message) } }
  const update = (path, value) => setDraft(old => {
    const next = clone(old)
    let ref = next
    path.slice(0, -1).forEach(key => { ref = ref[key] })
    ref[path.at(-1)] = value
    return next
  })
  const uploadImage = async file => {
    const form = new FormData()
    form.append('file', file)
    const data = await api('/api/admin/upload', { method: 'POST', body: form })
    return data.url
  }

  if (!token) return <main className="admin-login">
    <Link className="admin-back" to="/"><ArrowLeft size={16}/> Back to website</Link>
    <div className="admin-login-card">
      <Brand/>
      <p className="eyebrow"><i/>Secure client portal</p>
      <h1>Manage your<br/><em>digital presence.</em></h1>
      <p>Update every word, image, project and the company logo — with a live preview of the website as you type.</p>
      <form onSubmit={login}>
        <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required/></label>
        <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter password"/></label>
        <button className="button">Sign in</button>
        {loginError && <small className="login-error">{loginError}</small>}
      </form>
      <small className="demo-note">Demo access: admin@anantainfratech.com / Ananta@2016<br/>Change credentials using environment variables before launch.</small>
    </div>
  </main>

  const editing = EDIT_TABS.includes(tab)
  const dirty = draft && site && JSON.stringify(draft) !== JSON.stringify(site)
  const shared = { draft, update, uploadImage }

  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <Brand inverse/>
      <nav>{MENU.map(([id, label, Icon]) => <button key={id} onClick={() => setTab(id)} className={tab === id ? 'active' : ''}><Icon size={18}/>{label}{id === 'inquiries' && inquiries.length > 0 ? <small>{inquiries.length}</small> : null}</button>)}</nav>
      <div>
        <Link to="/" target="_blank">View website ↗</Link>
        <button onClick={() => { localStorage.removeItem('ananta-token'); setToken(null) }}><LogOut size={17}/> Sign out</button>
      </div>
    </aside>
    <section className="admin-panel">
      <header>
        <div><p className="eyebrow"><i/>Ananta CMS</p><h1>{TAB_TITLES[tab]}</h1></div>
        {tab !== 'inquiries' && <div className="admin-actions">
          {dirty && <span className="dirty-flag">Unsaved changes</span>}
          {editing && <button type="button" className="ghost-button" onClick={() => setShowPreview(v => !v)}>{showPreview ? <EyeOff size={15}/> : <Eye size={15}/>}{showPreview ? 'Hide preview' : 'Show preview'}</button>}
          {dirty && <button type="button" className="ghost-button" onClick={discard}><RotateCcw size={14}/> Discard</button>}
          <button className="button" onClick={save}><Save size={16}/> Publish changes</button>
        </div>}
      </header>
      {notice && <div className="admin-notice"><CheckCircle2 size={17}/>{notice}</div>}
      {!draft && tab !== 'inquiries' ? <p className="card-hint">Loading content…</p> :
        <div className={`admin-workspace ${editing && showPreview ? 'with-preview' : ''}`}>
          <div className="admin-editor">
            {tab === 'overview' && <Overview site={site} setTab={setTab}/>}
            {tab === 'brand' && <BrandEditor {...shared}/>}
            {tab === 'home' && <HomeEditor {...shared}/>}
            {tab === 'pages' && <PagesEditor {...shared} section={pageSection} setSection={setPageSection}/>}
            {tab === 'portfolio' && <PortfolioEditor {...shared} setPreviewPage={setPreviewPage}/>}
            {tab === 'insights' && <InsightsEditor {...shared} setPreviewPage={setPreviewPage}/>}
            {tab === 'cms' && <EverythingEditor draft={draft} setDraft={setDraft}/>}
            {tab === 'inquiries' && <InquiryList inquiries={inquiries} reload={loadInquiries}/>}
          </div>
          {editing && showPreview && <PreviewPane draft={draft} page={previewPage} setPage={setPreviewPage} device={device} setDevice={setDevice}/>}
        </div>}
    </section>
  </main>
}
