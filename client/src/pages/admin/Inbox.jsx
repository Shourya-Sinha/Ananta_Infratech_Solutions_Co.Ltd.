import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowUpRight, Briefcase, Building2, Download, FileText, HardHat, Inbox as InboxIcon,
  Mail, MessageSquare, RefreshCw, Send, UserPlus
} from 'lucide-react'
import { adminGet, adminPatch, formatDate, STATUS_OPTIONS, statusTone } from '../../lib/api'
import { useToast } from '../../components/Toast'
import { EmptyState } from '../../components/Blocks'

/**
 * The submissions inbox.
 *
 * Everything a visitor sends us through any form lands here in one of three
 * queues: registrations (contractor/worker tracks), enquiries (contact, project,
 * tender, document and job submissions) and subscribers. Staff can search,
 * filter, move a record through the workflow, leave internal notes and export
 * the filtered view to CSV for procurement or HR records.
 */

const KIND_LABELS = {
  contact: { label: 'Contact', icon: MessageSquare },
  careers: { label: 'Job application', icon: Briefcase },
  tender: { label: 'Tender enquiry', icon: FileText },
  download: { label: 'Document request', icon: Download },
  subscribe: { label: 'Newsletter', icon: Mail },
  other: { label: 'Other', icon: InboxIcon }
}

const prettyKind = (kind) => (KIND_LABELS[kind] || KIND_LABELS.other).label

function StatusControl({ value, onChange, busy }) {
  return (
    <select className="status-select" value={value} disabled={busy} onChange={(event) => onChange(event.target.value)}>
      {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
    </select>
  )
}

function RecordCard({ record, onPatch, onOpen, busyId }) {
  const [note, setNote] = useState('')
  const [expanded, setExpanded] = useState(false)
  const status = record.status || 'new'
  const isRegistration = record.__kind === 'registration'
  const busy = busyId === record.id

  const patch = (body) => onPatch(isRegistration ? `/api/admin/registrations/${record.id}` : `/api/admin/inquiries/${record.id}`, body)

  return (
    <article className={`inbox-card ${expanded ? 'is-open' : ''}`}>
      <header>
        <div>
          <span className={`tag ${statusTone(status)}`}>{status}</span>
          {isRegistration ? (
            <span className={`tag ${record.type === 'contractor' ? 'tag-info' : 'tag-warning'}`}>
              {record.type === 'contractor' ? 'Contractor / supplier' : 'Worker'}
            </span>
          ) : <span className="tag">{prettyKind(record.kind)}</span>}
          {record.reference ? <span className="tag tag-mono">{record.reference}</span> : null}
        </div>
        <span className="inbox-date">{formatDate(record.createdAt, true)}</span>
      </header>

      <h3>{record.name || record.company || 'Unnamed submission'}</h3>
      <div className="inbox-meta">
        {record.email ? <a href={`mailto:${record.email}`}>{record.email}</a> : null}
        {record.phone ? <a href={`tel:${String(record.phone).replace(/\s/g, '')}`}>{record.phone}</a> : null}
        {record.company && record.name ? <span>{record.company}</span> : null}
        {record.city ? <span>{record.city}</span> : null}
        {record.role ? <span>{record.role}</span> : null}
      </div>

      <div className="inbox-detail">
        {record.trade ? <span><b>Trade</b> {record.trade}</span> : null}
        {record.experience ? <span><b>Experience</b> {record.experience}</span> : null}
        {record.certification ? <span><b>Certification</b> {record.certification}</span> : null}
        {record.trades?.length ? <span><b>Trades</b> {record.trades.join(', ')}</span> : null}
        {record.regions?.length ? <span><b>Regions</b> {record.regions.join(', ')}</span> : null}
        {record.scale ? <span><b>Package scale</b> {record.scale}</span> : null}
        {record.gst ? <span><b>GST</b> {record.gst}</span> : null}
        {record.pan ? <span><b>PAN</b> {record.pan}</span> : null}
        {record.employees ? <span><b>Workforce</b> {record.employees}</span> : null}
        {record.currentCtc ? <span><b>Current CTC</b> {record.currentCtc}</span> : null}
        {record.expectedCtc ? <span><b>Expected CTC</b> {record.expectedCtc}</span> : null}
        {record.noticePeriod ? <span><b>Notice period</b> {record.noticePeriod}</span> : null}
        {record.portfolio ? <span><b>Portfolio</b> <a href={record.portfolio} target="_blank" rel="noreferrer">Open link</a></span> : null}
        {record.documents?.length ? <span><b>Documents</b> {record.documents.join(', ')}</span> : null}
        {record.interest ? <span><b>Interest</b> {record.interest}</span> : null}
        {record.department ? <span><b>Department</b> {record.department}</span> : null}
        {record.package ? <span><b>Package</b> {record.package}</span> : null}
        {record.jobId ? <span><b>Role ID</b> {record.jobId}</span> : null}
        {record.source ? <span><b>Source</b> {record.source}</span> : null}
      </div>

      {record.message ? <p className="inbox-message">{record.message}</p> : null}
      {record.pastWork ? <p className="inbox-message"><b>Past work — </b>{record.pastWork}</p> : null}

      {record.notes?.length ? (
        <div className="inbox-notes">
          {record.notes.map((entry, index) => (
            <p key={index}><b>{entry.by || 'admin'}</b> · {formatDate(entry.at, true)}<br />{entry.text}</p>
          ))}
        </div>
      ) : null}

      <footer>
        <StatusControl value={status} busy={busy} onChange={(next) => patch({ status: next })} />
        <button type="button" className="button button-sm button-ghost" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Hide note box' : 'Add internal note'}
        </button>
        {record.email ? <a className="button button-sm button-ghost" href={`mailto:${record.email}?subject=Your%20submission%20${record.reference || ''}`}><Send size={14} /> Reply</a> : null}
        <button type="button" className="button button-sm button-ghost" onClick={() => onOpen(record)}>Full record <ArrowUpRight size={14} /></button>
      </footer>

      {expanded ? (
        <div className="inbox-note-form">
          <textarea rows={2} value={note} placeholder="Internal note — visible to staff only" onChange={(event) => setNote(event.target.value)} />
          <button
            type="button"
            className="button button-sm"
            disabled={!note.trim() || busy}
            onClick={() => { patch({ note: note.trim() }); setNote('') }}
          >
            Save note
          </button>
        </div>
      ) : null}
    </article>
  )
}

export default function Inbox() {
  const toast = useToast()
  const [tab, setTab] = useState('registrations')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [detail, setDetail] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      if (search) query.set('search', search)
      if (status) query.set('status', status)
      if (tab === 'registrations' && type) query.set('type', type)
      const endpoint = `/api/admin/${tab}?${query.toString()}`
      const payload = await adminGet(endpoint)
      if (tab === 'subscribers') setData({ rows: Array.isArray(payload) ? payload : [], total: Array.isArray(payload) ? payload.length : 0 })
      else setData(payload)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [tab, type, status, search, toast])

  useEffect(() => { load() }, [load])

  const rows = useMemo(() => (data?.rows || []).map((row) => ({ ...row, id: row.id || row._id || row.reference, __kind: tab === 'registrations' ? 'registration' : 'inquiry' })), [data, tab])

  const patch = async (endpoint, body) => {
    setBusyId(detail?.id)
    try {
      await adminPatch(endpoint, body)
      toast.success(body.status ? `Moved to “${body.status}”` : 'Note saved')
      load()
      if (detail) setDetail(null)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setBusyId(null)
    }
  }

  const exportHref = tab === 'subscribers' ? '/api/admin/export/subscribers' : `/api/admin/export/${tab}`

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <h1>Submissions inbox</h1>
          <p>Everything submitted through the website — contractor and worker registrations, project enquiries, tender enquiries, document requests, job applications and newsletter signups.</p>
        </div>
        <div className="inbox-toolbar">
          <button type="button" className="button button-sm button-ghost" onClick={load} disabled={loading}><RefreshCw size={14} /> Refresh</button>
          <a className="button button-sm" href={exportHref}><Download size={14} /> Export CSV</a>
        </div>
      </div>

      <div className="admin-tabs">
        {[
          { id: 'registrations', label: 'Contractor & worker registrations', icon: UserPlus },
          { id: 'inquiries', label: 'Enquiries & applications', icon: MessageSquare },
          { id: 'subscribers', label: 'Newsletter subscribers', icon: Mail }
        ].map((item) => (
          <button key={item.id} type="button" className={`admin-tab ${tab === item.id ? 'is-active' : ''}`} onClick={() => { setTab(item.id); setDetail(null) }}>
            <item.icon size={15} /> {item.label}
          </button>
        ))}
      </div>

      <div className="filter-tools inbox-filters">
        <label className="search-field">
          <InboxIcon size={15} />
          <input value={search} placeholder="Search name, company, email or reference…" onChange={(event) => setSearch(event.target.value)} />
        </label>
        {tab === 'registrations' ? (
          <label className="select-field">
            <span>Track</span>
            <select value={type} onChange={(event) => setType(event.target.value)}>
              <option value="">All tracks</option>
              <option value="contractor">Contractors &amp; suppliers</option>
              <option value="worker">Workers</option>
            </select>
          </label>
        ) : null}
        <label className="select-field">
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Any status</option>
            {STATUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <span className="result-count">{loading ? 'Loading…' : `${data?.total ?? rows.length} records`}</span>
      </div>

      {data?.counts ? (
        <div className="admin-kpis">
          {STATUS_OPTIONS.map((option) => (
            <div className="admin-kpi" key={option}>
              <strong>{data.counts[option] || 0}</strong>
              <span>{option}</span>
            </div>
          ))}
          {data.byType ? (
            <>
              <div className="admin-kpi"><strong>{data.byType.contractor}</strong><span>contractor track</span></div>
              <div className="admin-kpi"><strong>{data.byType.worker}</strong><span>worker track</span></div>
            </>
          ) : null}
        </div>
      ) : null}

      {loading && !rows.length ? (
        <div className="skeleton" style={{ height: 200 }} />
      ) : !rows.length ? (
        <EmptyState
          icon={InboxIcon}
          title="Nothing in this queue yet."
          text="Submissions from the website appear here the moment they are sent. Contractors, workers, clients and applicants all land in one of these three queues."
        />
      ) : (
        <div className="inbox-list">
          {rows.map((record) => (
            <RecordCard key={record.id} record={record} onPatch={patch} busyId={busyId} onOpen={(row) => setDetail(row)} />
          ))}
        </div>
      )}

      {rows.length && data?.total > rows.length ? (
        <p className="field-hint" style={{ marginTop: '1rem' }}>
          Showing the {rows.length} most recent of {data.total} matching records. Narrow the search to see older ones, or export the full set to CSV.
        </p>
      ) : null}

      {detail ? (
        <div className="modal-backdrop" onClick={() => setDetail(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <div>
                {detail.reference ? <span className="tag tag-mono">{detail.reference}</span> : null}
                <h3>{detail.name || detail.email}</h3>
              </div>
              <button type="button" className="icon-button" onClick={() => setDetail(null)}>✕</button>
            </div>
            <div className="modal-body">
              <pre className="code-preview">{JSON.stringify(detail, null, 2)}</pre>
            </div>
            <div className="modal-foot">
              <span className="field-hint">
                {detail.type === 'contractor' || detail.type === 'worker' ? <><Building2 size={13} /> {detail.type} track</> : null}
                {detail.type === 'worker' ? <><HardHat size={13} /> verified trade record</> : null}
              </span>
              <button type="button" className="button button-sm" onClick={() => setDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
