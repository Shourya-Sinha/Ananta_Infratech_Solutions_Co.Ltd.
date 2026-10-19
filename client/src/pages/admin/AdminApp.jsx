import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle, BarChart3, Check, ChevronRight, CircleDot, Code2, Database, Download,
  ExternalLink, Eye, EyeOff, History, Image as ImageIcon, LayoutDashboard, Loader2, LogOut, Mail,
  MonitorPlay, RotateCcw, Save, Search, ShieldCheck, Trash2, Upload, X
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { adminGet, adminPost, adminPut, clone, formatBytes, formatDate, readToken, writeToken } from '../../lib/api'
import { useSite, writeLocalPreview } from '../../lib/site'
import { useToast } from '../../components/Toast'
import { adminSections, sectionsByGroup } from '../../lib/adminSchema'
import SectionPanel, { ProblemList, ResetButton } from './SectionPanel'
import Inbox from './Inbox'
import LivePreview from './LivePreview'
import EmailPanel from './EmailPanel'

/* ============================================================== sign in */

function Login({ onSignedIn }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [hint, setHint] = useState('')

  useEffect(() => {
    fetch('/api/auth/session').then((response) => response.json()).then((data) => {
      if (data?.configured === false) setHint('No admin password has been set on the server yet.')
    }).catch(() => {})
    const saved = (() => { try { return localStorage.getItem('ananta-admin-email') || '' } catch { return '' } })()
    if (saved) setForm((current) => ({ ...current, email: saved }))
  }, [])

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Those details were not accepted.')
      writeToken(data.token)
      try { localStorage.setItem('ananta-admin-email', form.email) } catch { /* ignore */ }
      onSignedIn(data)
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <p className="eyebrow eyebrow-light"><i />Content portal</p>
        <h1>Sign in to manage<br /><em>the website.</em></h1>
        <p className="admin-login-copy">
          Everything you publish here goes live on the public site within a minute. Nothing changes until you press publish.
        </p>

        <form className="form-grid" onSubmit={submit}>
          <label className="form-full">
            Email
            <input required type="email" autoComplete="username" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="support@anantainfratechsolutions.com" />
          </label>
          <label className="form-full">
            Password
            <input required type="password" autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="••••••••" />
          </label>
          {error ? <p className="login-error form-full"><AlertTriangle size={15} /> {error}</p> : null}
          {hint ? <p className="field-hint form-full">{hint}</p> : null}
          <button className="button button-acid form-full" disabled={busy} type="submit">
            {busy ? <><Loader2 size={16} className="spin" /> Signing in…</> : <>Sign in <ChevronRight size={16} /></>}
          </button>
        </form>

        <div className="login-highlights">
          <div><ShieldCheck size={16} /><b>Draft &amp; publish</b><span>Edit safely, review, then publish. Every publish is versioned and reversible.</span></div>
          <div><LayoutDashboard size={16} /><b>Structured editors</b><span>Services, projects, jobs, FAQs, offices and SEO all have purpose-built forms.</span></div>
          <div><BarChart3 size={16} /><b>Submissions inbox</b><span>Contractor, worker, applicant and client submissions in one place, exportable to CSV.</span></div>
        </div>

        <p className="admin-login-foot">
          <Link to="/">← Back to the website</Link>
        </p>
      </div>
    </div>
  )
}

/* ============================================================ dashboard */

function Dashboard({ stats, content, onNavigate }) {
  const cards = [
    { key: 'registrations', label: 'Contractor & worker registrations', total: stats?.registrations?.total ?? 0, detail: `${stats?.registrations?.contractor ?? 0} contractor · ${stats?.registrations?.worker ?? 0} worker`, new: stats?.registrations?.new ?? 0 },
    { key: 'inquiries', label: 'Enquiries & applications', total: stats?.inquiries?.total ?? 0, detail: `${stats?.inquiries?.thisWeek ?? 0} in the last 7 days`, new: stats?.inquiries?.new ?? 0 },
    { key: 'subscribers', label: 'Newsletter subscribers', total: stats?.subscribers?.total ?? 0, detail: 'Growing with each insight article' }
  ]

  const portfolio = stats?.portfolio || {}

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <h1>Dashboard</h1>
          <p>
            {content?.hasDraft
              ? 'You have unpublished draft changes. Review them in preview and publish when you are ready.'
              : 'No unpublished changes. The public website is showing the last published version.'}
          </p>
        </div>
        <div className="inbox-toolbar">
          <span className="admin-status-chip">
            <CircleDot size={12} /> {content?.publishedAt ? `Published ${formatDate(content.publishedAt, true)}` : 'Not published yet'}
          </span>
        </div>
      </div>

      <div className="admin-kpis">
        <div className="admin-kpi admin-kpi-lg"><strong>{portfolio.projects ?? 0}</strong><span>projects in the portfolio</span></div>
        <div className="admin-kpi admin-kpi-lg"><strong>{portfolio.services ?? 0}</strong><span>service pages</span></div>
        <div className="admin-kpi admin-kpi-lg"><strong>{portfolio.sectors ?? 0}</strong><span>sector pages</span></div>
        <div className="admin-kpi admin-kpi-lg"><strong>{portfolio.openRoles ?? 0}</strong><span>open vacancies</span></div>
        <div className="admin-kpi admin-kpi-lg"><strong>{portfolio.insights ?? 0}</strong><span>insight articles</span></div>
        <div className="admin-kpi admin-kpi-lg"><strong>{portfolio.offices ?? 0}</strong><span>offices listed</span></div>
      </div>

      <div className="admin-panels">
        {cards.map((card) => (
          <button type="button" className="editor-subsection dashboard-card" key={card.key} onClick={() => onNavigate(card.key === 'subscribers' ? 'inbox' : 'inbox')}>
            <div>
              <span className="card-number">{card.new ? `${card.new} awaiting review` : 'All reviewed'}</span>
              <h3>{card.label}</h3>
              <p>{card.detail}</p>
            </div>
            <strong>{card.total}</strong>
          </button>
        ))}
      </div>

      <div className="admin-panels">
        <div className="editor-subsection">
          <h3>Content status</h3>
          <dl className="admin-guide">
            <div><dt>Working draft</dt><dd>{content?.hasDraft ? 'Yes — unpublished changes exist' : 'None — you are looking at what is live'}</dd></div>
            <div><dt>Last published</dt><dd>{content?.publishedAt ? `${formatDate(content.publishedAt, true)} by ${content.publishedBy || 'admin'}` : 'Never published'}</dd></div>
            <div><dt>Stored revisions</dt><dd>{content?.revisions?.length ?? 0} — restore any of them from the Revisions tab</dd></div>
            <div><dt>Content schema version</dt><dd>v{content?.contentVersion ?? '—'}</dd></div>
            <div><dt>Storage backend</dt><dd>{content?.storage === 'mongodb' ? 'MongoDB' : 'Local JSON file'}{stats?.notification?.email?.configured ? ' · email delivery on' : ' · email not configured'}</dd></div>
          </dl>
        </div>
        <div className="editor-subsection">
          <h3>Quick actions</h3>
          <div className="button-row">
            <button type="button" className="button button-sm" onClick={() => onNavigate('content')}><Eye size={14} /> Edit page content</button>
            <button type="button" className="button button-sm button-ghost" onClick={() => onNavigate('media')}><ImageIcon size={14} /> Media library</button>
            <button type="button" className="button button-sm button-ghost" onClick={() => onNavigate('revisions')}><History size={14} /> Revisions</button>
            <button type="button" className="button button-sm button-ghost" onClick={() => onNavigate('advanced')}><Code2 size={14} /> Advanced JSON</button>
            <a className="button button-sm button-ghost" href="/" target="_blank" rel="noreferrer"><ExternalLink size={14} /> Open the website</a>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================ media */

function MediaPanel({ uploadImage }) {
  const toast = useToast()
  const [data, setData] = useState(null)
  const [busy, setBusy] = useState(false)
  const inputRef = useRef(null)

  const load = useCallback(() => {
    adminGet('/api/admin/media').then(setData).catch((error) => toast.error(error.message))
  }, [toast])

  useEffect(() => { load() }, [load])

  const onFiles = async (files) => {
    setBusy(true)
    try {
      for (const file of Array.from(files || [])) {
        // eslint-disable-next-line no-await-in-loop
        await uploadImage(file)
        toast.success(`${file.name} uploaded`)
      }
      load()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <h1>Media library</h1>
          <p>
            Uploaded images live in {data?.storage === 'cloudinary' ? `Cloudinary (${data.cloudName})` : 'the server’s /uploads folder'}.
            Any image here can be selected from any image field on the site — upload once, reuse everywhere.
          </p>
        </div>
        <div className="inbox-toolbar">
          <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(event) => onFiles(event.target.files)} />
          <button type="button" className="button button-sm" disabled={busy} onClick={() => inputRef.current?.click()}>
            {busy ? <><Loader2 size={14} className="spin" /> Uploading…</> : <><Upload size={14} /> Upload images</>}
          </button>
        </div>
      </div>

      {!data ? <div className="skeleton" style={{ height: 220 }} /> : null}

      {data && !data.images.length ? (
        <div className="empty-state">
          <ImageIcon size={24} />
          <h3>The library is empty</h3>
          <p>Upload site photography, project photos and team portraits here. Recommended: 2000 px wide, JPG or WEBP, under 10 MB.</p>
        </div>
      ) : null}

      {data?.images?.length ? (
        <div className="media-grid">
          {data.images.map((image) => (
            <figure className="media-tile" key={image.name}>
              <img src={image.url} alt={image.name} loading="lazy" />
              <figcaption>
                <b title={image.name}>{image.name.length > 26 ? `${image.name.slice(0, 26)}…` : image.name}</b>
                <span>{formatBytes(image.bytes)} · {formatDate(image.uploadedAt)}</span>
                <div className="media-tile-actions">
                  <button
                    type="button"
                    className="button button-sm button-ghost"
                    onClick={() => { navigator.clipboard?.writeText(image.url); toast.success('Image path copied — paste it into any image field.') }}
                  >Copy path</button>
                  <a className="button button-sm button-ghost" href={image.url} target="_blank" rel="noreferrer">Open</a>
                </div>
                <code>{image.url}</code>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
    </div>
  )
}

/* ============================================================ revisions */

function RevisionsPanel() {
  const toast = useToast()
  const [rows, setRows] = useState(null)
  const [busy, setBusy] = useState('')

  const load = useCallback(() => {
    adminGet('/api/admin/content/revisions').then(setRows).catch((error) => toast.error(error.message))
  }, [toast])

  useEffect(() => { load() }, [load])

  const restore = async (revision) => {
    setBusy(revision.id)
    try {
      await adminPost(`/api/admin/content/revisions/${revision.id}/restore`, {})
      toast.success('That revision is live again. A backup of the previous version was kept.')
      load()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setBusy('')
    }
  }

  const reset = async () => {
    if (!window.confirm('This deletes every draft and revision and rebuilds the site from the shipped content. Type-free confirmation: are you sure?')) return
    try {
      await adminPost('/api/admin/content/reset', { confirm: 'RESET' })
      toast.success('Content reset to the shipped defaults. Reloading…')
      setTimeout(() => window.location.reload(), 900)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <h1>Revisions &amp; rollback</h1>
          <p>Every publish stores the version it replaced. Restoring a revision puts it live immediately and keeps a backup of what you had, so a rollback is never a one-way door.</p>
        </div>
        <div className="inbox-toolbar">
          <button type="button" className="button button-sm button-ghost" onClick={load}><History size={14} /> Refresh</button>
          <button type="button" className="button button-sm" onClick={reset}><Trash2 size={14} /> Reset all content</button>
        </div>
      </div>

      {!rows ? <div className="skeleton" style={{ height: 200 }} /> : null}

      {rows && !rows.length ? (
        <div className="empty-state">
          <History size={24} />
          <h3>No published revisions yet</h3>
          <p>As soon as you publish from the editor, the version being replaced is stored here.</p>
        </div>
      ) : null}

      <div className="revision-list">
        {(rows || []).map((row) => (
          <div className="revision-row" key={row.id}>
            <div>
              <b>{row.note}</b>
              <span>{formatDate(row.at, true)} · {row.by}</span>
            </div>
            <button type="button" className="button button-sm button-ghost" disabled={busy === row.id} onClick={() => restore(row)}>
              {busy === row.id ? <Loader2 size={14} className="spin" /> : <RotateCcw size={14} />} Restore this version
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ====================================================== raw JSON (advanced) */

function AdvancedPanel({ content, onChange }) {
  const [text, setText] = useState(() => JSON.stringify(content, null, 2))
  const [error, setError] = useState('')

  useEffect(() => { setText(JSON.stringify(content, null, 2)) }, [content])

  const apply = () => {
    try {
      const parsed = JSON.parse(text)
      onChange(parsed)
      setError('')
    } catch (parseError) {
      setError(`That is not valid JSON: ${parseError.message}`)
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <h1>Advanced — raw content document</h1>
          <p>
            The complete content document as JSON. Useful for bulk edits and for developers integrating other systems.
            For day-to-day changes the structured editor is safer: this view does not validate field names for you.
          </p>
        </div>
        <div className="inbox-toolbar">
          <button type="button" className="button button-sm button-ghost" onClick={() => setText(JSON.stringify(content, null, 2))}><RotateCcw size={14} /> Reload from editor</button>
          <button type="button" className="button button-sm" onClick={apply}><Check size={14} /> Apply to draft</button>
        </div>
      </div>
      {error ? <div className="editor-message is-error"><AlertTriangle size={16} /> {error}</div> : null}
      <textarea className="code-editor" spellCheck={false} value={text} onChange={(event) => setText(event.target.value)} rows={28} />
      <p className="field-hint">
        Saving a draft runs the same validation as the structured editor. If a field is missing you will be told exactly which one
        before anything reaches the live site.
      </p>
    </div>
  )
}

/* ================================================================= shell */

export default function AdminApp() {
  const toast = useToast()
  const { togglePreview } = useSite()
  const [session, setSession] = useState(() => (readToken() ? { token: readToken() } : null))
  const [content, setContent] = useState(null)
  const [meta, setMeta] = useState(null)
  const [tab, setTab] = useState('dashboard')
  const [activeSection, setActiveSection] = useState(adminSections[0].id)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [problems, setProblems] = useState([])
  const [navQuery, setNavQuery] = useState('')
  const [lastSaved, setLastSaved] = useState('')
  const [counting, setCounting] = useState(false)
  const [previewFocus, setPreviewFocus] = useState(false)
  const [previewOn, setPreviewOn] = useState(() => {
    try { return localStorage.getItem('ananta-preview-panel') !== 'off' } catch { return true }
  })

  const uploadImage = useCallback(async (file) => {
    const body = new FormData()
    body.append('file', file)
    return adminPost('/api/admin/upload', body)
  }, [])

  const load = useCallback(async () => {
    try {
      const data = await adminGet('/api/admin/content')
      setContent(data.draft || data.published)
      setMeta(data)
      setDirty(false)
      setProblems([])
      setLastSaved('')
    } catch (error) {
      if (/401|expired|sign/i.test(error.message)) { writeToken(''); setSession(null); return }
      toast.error(error.message)
    }
  }, [toast])

  useEffect(() => { if (session) load() }, [session, load])

  const groups = useMemo(() => sectionsByGroup(), [])
  const section = adminSections.find((item) => item.id === activeSection) || adminSections[0]

  const update = useCallback((next, path) => {
    setContent(next)
    setDirty(true)
    if (path) setProblems([])
  }, [])

  const saveDraft = useCallback(async (silent = false) => {
    if (!content) return
    setSaving(true)
    try {
      await adminPut('/api/admin/content/draft', { content })
      setDirty(false)
      setProblems([])
      setLastSaved(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
      if (!silent) toast.success('Draft saved. The live site is unchanged until you publish.')
    } catch (error) {
      setProblems(error.problems || [])
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }, [content, toast])

  const publish = useCallback(async () => {
    if (!content) return
    setSaving(true)
    try {
      // Publish exactly what is on screen: save the draft first so the two never disagree.
      await adminPut('/api/admin/content/draft', { content })
      await adminPost('/api/admin/content/publish', { content, note: 'Published from admin portal' })
      toast.success('Published. The public website is updated.')
      await load()
    } catch (error) {
      setProblems(error.problems || [])
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }, [content, load, toast])

  const discard = useCallback(async () => {
    if (!window.confirm('Discard every unpublished change and reload the last published version?')) return
    try {
      await adminPost('/api/admin/content/discard', {})
      toast.success('Draft discarded.')
      await load()
    } catch (error) {
      toast.error(error.message)
    }
  }, [load, toast])

  const signOut = () => {
    writeToken('')
    setSession(null)
  }

  const previewDraft = () => {
    if (!session?.token) { toast.error('Sign in first.'); return }
    togglePreview(true)
    // Hand the *unsaved* document to the new tab so the preview matches the
    // editor exactly, without writing anything to the server.
    if (content) writeLocalPreview(content)
    window.open('/?cmsPreview=1', '_blank', 'noopener')
    toast.success('Preview opened in a new tab — it shows your current edits, not the live site.')
  }

  const togglePreviewPanel = () => {
    setPreviewOn((current) => {
      const next = !current
      try { localStorage.setItem('ananta-preview-panel', next ? 'on' : 'off') } catch { /* ignore */ }
      return next
    })
  }

  /* Keyboard shortcut: ⌘/Ctrl + S saves the draft. */
  useEffect(() => {
    const handler = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        saveDraft()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [saveDraft])

  /* Warn before losing unsaved work. */
  useEffect(() => {
    const handler = (event) => { if (dirty) { event.preventDefault(); event.returnValue = '' } }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  if (!session) return <Login onSignedIn={(data) => { setSession(data); toast.success('Signed in.') }} />

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'inbox', label: 'Submissions inbox', icon: Database, badge: meta?.hasDraft ? null : null },
        { id: 'media', label: 'Media library', icon: ImageIcon },
        { id: 'email', label: 'Email delivery', icon: Mail },
        { id: 'revisions', label: 'Revisions', icon: History, badge: meta?.revisions?.length || null },
        { id: 'advanced', label: 'Advanced JSON', icon: Code2 }
      ]
    },
    ...groups.map((group) => ({
      title: group.group,
      items: group.sections
        .filter((item) => !navQuery || `${item.title} ${item.description || ''}`.toLowerCase().includes(navQuery.toLowerCase()))
        .map((item) => ({ id: item.id, label: item.title, icon: fileIcon(item.group) }))
    }))
  ]

  const isEditing = Boolean(content) && !['dashboard', 'inbox', 'media', 'email', 'revisions', 'advanced'].includes(tab)

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div>
            <b>Ananta</b>
            <span>Content portal</span>
          </div>
          <a href="/" target="_blank" rel="noreferrer" title="Open the public website"><ExternalLink size={16} /></a>
        </div>

        <label className="search-field admin-nav-search">
          <Search size={14} />
          <input value={navQuery} placeholder="Find a section…" onChange={(event) => setNavQuery(event.target.value)} />
        </label>

        <nav>
          {navGroups.map((group) => (
            <div className="admin-nav-group" key={group.title}>
              <span>{group.title}</span>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`admin-nav-item ${tab === item.id ? 'is-active' : ''}`}
                  onClick={() => { setTab(item.id); setActiveSection(item.id) }}
                >
                  <item.icon size={15} />
                  <span>{item.label}</span>
                  {item.badge ? <em>{item.badge}</em> : null}
                </button>
              ))}
              {!group.items.length ? <p className="admin-nav-empty">No sections match.</p> : null}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button type="button" className="admin-nav-item" onClick={previewDraft}><EyeOff size={15} /><span>Preview unpublished draft</span></button>
          <button type="button" className="admin-nav-item" onClick={signOut}><LogOut size={15} /><span>Sign out</span></button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-status">
            {dirty
              ? <span className="admin-status-chip is-warn"><CircleDot size={12} /> Unpublished changes</span>
              : <span className="admin-status-chip"><Check size={12} /> All changes saved</span>}
            {meta?.publishedAt ? <span className="field-hint">Live version published {formatDate(meta.publishedAt, true)} by {meta.publishedBy || 'admin'}</span> : null}
          </div>
          <div className="inbox-toolbar">
            <button type="button" className={`button button-sm ${previewOn ? 'button-ghost' : 'button-ghost'}`} onClick={togglePreviewPanel} title="Show the website beside the editor">
              <MonitorPlay size={14} /> {previewOn ? 'Hide preview' : 'Live preview'}
            </button>
            <button type="button" className="button button-sm button-ghost" onClick={previewDraft}><Eye size={14} /> Open preview</button>
            <button type="button" className="button button-sm button-ghost" disabled={saving} onClick={() => saveDraft()}><Save size={14} /> Save draft</button>
            <button type="button" className="button button-sm button-acid" disabled={saving} onClick={publish}>
              {saving ? <><Loader2 size={14} className="spin" /> Working…</> : <><Upload size={14} /> Publish</>}
            </button>
          </div>
        </div>

        <ProblemList problems={problems} />

        <div className={`admin-body ${previewOn && isEditing ? 'has-preview' : ''} ${previewOn && isEditing && previewFocus ? 'is-preview-focus' : ''}`}>
          <div className="admin-body-main">
            {!content ? (
              <div className="skeleton" style={{ height: 320 }} />
            ) : tab === 'dashboard' ? (
              <Dashboard stats={meta?.stats} content={meta} onNavigate={setTab} />
            ) : tab === 'inbox' ? (
              <Inbox />
            ) : tab === 'media' ? (
              <MediaPanel uploadImage={uploadImage} />
            ) : tab === 'email' ? (
              <EmailPanel supportEmail={content?.company?.supportEmail || content?.company?.email} />
            ) : tab === 'revisions' ? (
              <RevisionsPanel />
            ) : tab === 'advanced' ? (
              <AdvancedPanel content={content} onChange={update} />
            ) : (
              <>
                <SectionPanel
                  section={section}
                  content={content}
                  onChange={update}
                  uploadImage={uploadImage}
                  onJump={() => window.open('/', '_blank', 'noopener')}
                />
                <div className="editor-card">
                  <div className="editor-card-head">
                    <div>
                      <h2>Finish this section</h2>
                      <p>Save keeps your work in the private draft. Publish pushes exactly what is on screen to the live site; the preview beside you already shows it.</p>
                    </div>
                  </div>
                  <div className="button-row">
                    <button type="button" className="button button-sm button-acid" disabled={saving} onClick={() => saveDraft()}>
                      {saving ? <Loader2 size={14} className="spin" /> : <Save size={14} />} Save draft{savedSuffix(lastSaved)}
                    </button>
                    <button type="button" className="button button-sm" disabled={saving} onClick={publish}><Upload size={14} /> Publish to the website</button>
                    <ResetButton onReset={discard} />
                    <a className="button button-sm button-ghost" href="/" target="_blank" rel="noreferrer"><ExternalLink size={14} /> View live site</a>
                  </div>
                  {meta?.hasDraft ? <p className="field-hint" style={{ marginTop: '0.8rem' }}><AlertTriangle size={13} /> There are unpublished draft changes. Visitors still see the last published version.</p> : null}
                </div>
              </>
            )}
          </div>

          {previewOn && isEditing ? (
            <LivePreview
              content={content}
              section={section}
              dirty={dirty}
              saving={saving}
              onPublish={publish}
              onClose={togglePreviewPanel}
              focus={previewFocus}
              onFocusChange={setPreviewFocus}
            />
          ) : null}
        </div>
      </main>
    </div>
  )
}

const savedSuffix = (value) => (value ? ` (saved ${value})` : '')

function fileIcon(group) {
  if (group === 'Site settings') return ShieldCheck
  if (group === 'Navigation') return LayoutDashboard
  if (group === 'Careers & registration') return Database
  return Code2
}

export { Loader2, X, Download }
