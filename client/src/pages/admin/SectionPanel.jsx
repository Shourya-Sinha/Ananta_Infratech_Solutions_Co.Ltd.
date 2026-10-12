import { useMemo, useState } from 'react'
import { AlertTriangle, Check, Eye, RotateCcw } from 'lucide-react'
import { FieldControl, sectionMatches } from './controls'
import { getPath, setPath } from '../../lib/api'

/**
 * Renders one section of the content document from its schema definition.
 *
 * The panel never knows what it is editing: it looks up the value at the
 * section's root path, renders a control per field, and writes changes back
 * immutably. Because of that, all forty-odd editable areas of the site —
 * hero slides, services, jobs, FAQs, footer columns, registration copy — share
 * one implementation and cannot drift apart.
 */
export default function SectionPanel({ section, content, onChange, uploadImage, onJump }) {
  const [query, setQuery] = useState('')
  const rootValue = section.root.length ? getPath(content, section.root) : content

  const visibleFields = useMemo(
    () => section.fields.filter((field) => sectionMatches({ title: field.label, description: field.hint }, query)),
    [section, query]
  )

  const setField = (key, value) => {
    onChange(setPath(content, [...section.root, key], value), [...section.root, key])
  }

  return (
    <div className="editor-card">
      <div className="editor-card-head">
        <div>
          <h2>{section.title}</h2>
          {section.description ? <p>{section.description}</p> : null}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {onJump ? <button type="button" className="button button-sm button-ghost" onClick={onJump}><Eye size={14} /> View on site</button> : null}
        </div>
      </div>

      {section.fields.length > 6 ? (
        <label className="field field-inline" style={{ marginBottom: '1rem' }}>
          <input value={query} placeholder="Filter the fields in this section…" onChange={(event) => setQuery(event.target.value)} />
        </label>
      ) : null}

      <div className="editor-grid">
        {visibleFields.map((field) => (
          <FieldControl
            key={field.key}
            field={field}
            value={rootValue?.[field.key] ?? (field.type === 'list' || field.type === 'repeater' ? [] : field.type === 'number' ? 0 : '')}
            uploadImage={uploadImage}
            onChange={(value) => setField(field.key, value)}
          />
        ))}
        {!visibleFields.length ? <p className="empty-hint">No fields match that filter.</p> : null}
      </div>
    </div>
  )
}

/** Non-blocking list of validation problems coming back from the API. */
export function ProblemList({ problems = [], message }) {
  if (!problems.length && !message) return null
  return (
    <div className="editor-message is-error">
      <AlertTriangle size={16} />
      <div>
        <b>{message || 'This content cannot be saved yet.'}</b>
        {problems.length ? <ul>{problems.slice(0, 8).map((problem) => <li key={problem}>{problem}</li>)}</ul> : null}
      </div>
    </div>
  )
}

export function SavedNote({ savedAt, children }) {
  if (!savedAt) return null
  return <span className="saved-note"><Check size={13} /> {children || 'Draft saved'} · {savedAt}</span>
}

export function ResetButton({ onReset, label = 'Reset this draft to the last published version' }) {
  const [confirming, setConfirming] = useState(false)
  if (!confirming) {
    return <button type="button" className="button button-sm button-ghost" onClick={() => setConfirming(true)}><RotateCcw size={14} /> Reload content</button>
  }
  return (
    <span style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
      <span className="field-hint">{label}</span>
      <button type="button" className="button button-sm" onClick={() => { setConfirming(false); onReset() }}>Yes, discard my changes</button>
      <button type="button" className="button button-sm button-ghost" onClick={() => setConfirming(false)}>Cancel</button>
    </span>
  )
}
