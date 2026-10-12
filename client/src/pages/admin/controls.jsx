import { useState } from 'react'
import {
  ChevronDown, ChevronUp, Copy, GripVertical, ImagePlus, Link2, Plus, Trash2, X
} from 'lucide-react'
import ImageField from '../../components/ImageField'
import { clone, getPath, setPath } from '../../lib/api'

/**
 * Generic, schema-driven form controls.
 *
 * Every control is a pure function of `(field, value, onChange)` — which means a
 * new editable field anywhere on the website needs a line in `adminSchema.js`
 * and nothing else. There is no per-page editor code to maintain.
 */

const move = (list, from, to) => {
  if (to < 0 || to >= list.length) return list
  const next = list.slice()
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export function TextInput({ label, value, onChange, hint, type = 'text', placeholder, min, max }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {hint ? <span className="field-hint">{hint}</span> : null}
      <input
        type={type}
        value={value ?? ''}
        min={min}
        max={max}
        placeholder={placeholder}
        onChange={(event) => onChange(type === 'number' ? Number(event.target.value) : event.target.value)}
      />
    </label>
  )
}

export function TextArea({ label, value, onChange, hint, rows = 3, mono = false, placeholder }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {hint ? <span className="field-hint">{hint}</span> : null}
      <textarea
        rows={rows}
        className={mono ? 'mono' : ''}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

export function SelectInput({ label, value, onChange, options = [], hint }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {hint ? <span className="field-hint">{hint}</span> : null}
      <select value={value ?? ''} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

/** A list of plain strings — the most common shape in the content document. */
export function ListInput({ label, value = [], onChange, hint }) {
  const items = Array.isArray(value) ? value : []
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      {hint ? <span className="field-hint">{hint}</span> : null}
      <div className="list-editor">
        {items.map((item, index) => (
          <div className="list-editor-row" key={index}>
            <GripVertical size={14} className="list-grip" />
            <textarea
              rows={Math.min(4, Math.max(1, Math.ceil(String(item).length / 90)))}
              value={item}
              onChange={(event) => {
                const next = items.slice()
                next[index] = event.target.value
                onChange(next)
              }}
            />
            <div className="list-editor-tools">
              <button type="button" title="Move up" onClick={() => onChange(move(items, index, index - 1))} disabled={index === 0}><ChevronUp size={14} /></button>
              <button type="button" title="Move down" onClick={() => onChange(move(items, index, index + 1))} disabled={index === items.length - 1}><ChevronDown size={14} /></button>
              <button type="button" title="Duplicate" onClick={() => onChange([...items.slice(0, index + 1), item, ...items.slice(index + 1)])}><Copy size={14} /></button>
              <button type="button" className="danger" title="Remove" onClick={() => onChange(items.filter((_, i) => i !== index))}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        <button type="button" className="button button-sm button-ghost" onClick={() => onChange([...items, ''])}>
          <Plus size={14} /> Add item
        </button>
      </div>
    </div>
  )
}

/** Array of `{ label, value }` pairs — statistics, certifications and registrations. */
export function KvInput({ label, value = [], onChange, hint, labelKey = 'label', valueKey = 'value' }) {
  const items = Array.isArray(value) ? value : []
  const update = (index, key, next) => {
    const rows = items.map((item, i) => (i === index ? { ...item, [key]: next } : item))
    onChange(rows)
  }
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      {hint ? <span className="field-hint">{hint}</span> : null}
      <div className="list-editor">
        {items.map((item, index) => (
          <div className="list-editor-row" key={index}>
            <input className="kv-a" value={item[labelKey] ?? ''} placeholder="Label" onChange={(event) => update(index, labelKey, event.target.value)} />
            <input className="kv-b" value={item[valueKey] ?? ''} placeholder="Value" onChange={(event) => update(index, valueKey, event.target.value)} />
            <div className="list-editor-tools">
              <button type="button" title="Move up" onClick={() => onChange(move(items, index, index - 1))} disabled={index === 0}><ChevronUp size={14} /></button>
              <button type="button" title="Move down" onClick={() => onChange(move(items, index, index + 1))} disabled={index === items.length - 1}><ChevronDown size={14} /></button>
              <button type="button" className="danger" title="Remove" onClick={() => onChange(items.filter((_, i) => i !== index))}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        <button type="button" className="button button-sm button-ghost" onClick={() => onChange([...items, { [labelKey]: '', [valueKey]: '' }])}>
          <Plus size={14} /> Add row
        </button>
      </div>
    </div>
  )
}

/** Array of `{ label, to, description }` — menus, footers and sitemap groups. */
export function LinksInput({ label, value = [], onChange, hint }) {
  const items = Array.isArray(value) ? value : []
  const update = (index, patch) => onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      {hint ? <span className="field-hint">{hint}</span> : null}
      <div className="list-editor">
        {items.map((item, index) => (
          <div className="link-editor-row" key={index}>
            <div className="link-editor-fields">
              <input value={item.label ?? ''} placeholder="Label" onChange={(event) => update(index, { label: event.target.value })} />
              <input value={item.to ?? ''} placeholder="/path or https://…" onChange={(event) => update(index, { to: event.target.value })} />
              <textarea
                rows={2}
                value={item.description ?? ''}
                placeholder="Optional description shown in the mega menu"
                onChange={(event) => update(index, { description: event.target.value })}
              />
            </div>
            <div className="list-editor-tools">
              <button type="button" title="Move up" onClick={() => onChange(move(items, index, index - 1))} disabled={index === 0}><ChevronUp size={14} /></button>
              <button type="button" title="Move down" onClick={() => onChange(move(items, index, index + 1))} disabled={index === items.length - 1}><ChevronDown size={14} /></button>
              <button type="button" className="danger" title="Remove" onClick={() => onChange(items.filter((_, i) => i !== index))}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        <button type="button" className="button button-sm button-ghost" onClick={() => onChange([...items, { label: '', to: '', description: '' }])}>
          <Plus size={14} /> Add link
        </button>
      </div>
    </div>
  )
}

/** A blank record for a repeater, so new rows always have the right keys. */
export const blankRecord = (fields = []) => fields.reduce((acc, field) => {
  if (field.type === 'list') acc[field.key] = []
  else if (field.type === 'repeater') acc[field.key] = []
  else if (field.type === 'number') acc[field.key] = 0
  else if (field.type === 'group') acc[field.key] = blankRecord(field.fields)
  else acc[field.key] = ''
  return acc
}, {})

/**
 * Array of records — projects, services, team members, jobs, FAQ groups.
 * Each record can be collapsed, reordered, duplicated and deleted, and nested
 * repeaters (a service's deliverables, an FAQ group's questions) render recursively.
 */
export function RepeaterInput({ label, value = [], onChange, fields = [], itemLabel = 'title', hint, depth = 0 }) {
  const items = Array.isArray(value) ? value : []
  const [open, setOpen] = useState(() => (depth === 0 ? new Set(items.length ? [0] : []) : new Set(items.map((_, i) => i))))

  const toggle = (index) => {
    const next = new Set(open)
    if (next.has(index)) next.delete(index)
    else next.add(index)
    setOpen(next)
  }

  const update = (index, patch) => onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  const titleOf = (item, index) => String(item?.[itemLabel] || item?.title || item?.name || item?.label || item?.question || item?.heading || `Item ${index + 1}`)

  return (
    <div className={`field repeater depth-${depth}`}>
      <div className="repeater-head">
        <div>
          <span className="field-label">{label}</span>
          {hint ? <span className="field-hint">{hint}</span> : null}
        </div>
        <button type="button" className="button button-sm" onClick={() => { onChange([...items, blankRecord(fields)]); setOpen(new Set([...open, items.length])) }}>
          <Plus size={14} /> Add {label.toLowerCase().replace(/s$/, '')}
        </button>
      </div>

      <div className="repeater-list">
        {items.map((item, index) => {
          const isOpen = open.has(index)
          return (
            <div className={`repeater-item ${isOpen ? 'is-open' : ''}`} key={`${titleOf(item, index)}-${index}`}>
              <div className="repeater-item-head">
                <button type="button" className="repeater-toggle" onClick={() => toggle(index)}>
                  <span className="repeater-index">{String(index + 1).padStart(2, '0')}</span>
                  <b>{titleOf(item, index)}</b>
                  {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
                <div className="list-editor-tools">
                  <button type="button" title="Move up" onClick={() => onChange(move(items, index, index - 1))} disabled={index === 0}><ChevronUp size={14} /></button>
                  <button type="button" title="Move down" onClick={() => onChange(move(items, index, index + 1))} disabled={index === items.length - 1}><ChevronDown size={14} /></button>
                  <button type="button" title="Duplicate" onClick={() => onChange([...items.slice(0, index + 1), clone(item), ...items.slice(index + 1)])}><Copy size={14} /></button>
                  <button type="button" className="danger" title="Delete" onClick={() => onChange(items.filter((_, i) => i !== index))}><Trash2 size={14} /></button>
                </div>
              </div>

              {isOpen ? (
                <div className="repeater-body">
                  {fields.map((field) => (
                    <FieldControl
                      key={field.key}
                      field={field}
                      value={item?.[field.key]}
                      onChange={(next) => update(index, { [field.key]: next })}
                      path={[index, field.key]}
                      parent={{ item, index }}
                      depth={depth + 1}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          )
        })}
        {!items.length ? (
          <p className="empty-hint">
            Nothing here yet. Use <b>Add {label.toLowerCase().replace(/s$/, '')}</b> to create the first one.
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function GroupInput({ field, value = {}, onChange, depth = 0 }) {
  const [open, setOpen] = useState(depth === 0)
  return (
    <div className={`field group-field ${open ? 'is-open' : ''}`}>
      <button type="button" className="group-toggle" onClick={() => setOpen(!open)}>
        <span>{field.label}</span>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open ? (
        <div className="group-body">
          {field.fields.map((child) => (
            <FieldControl
              key={child.key}
              field={child}
              value={value?.[child.key]}
              onChange={(next) => onChange({ ...(value || {}), [child.key]: next })}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

/** Dispatches a schema field to the right control. */
export function FieldControl({ field, value, onChange, uploadImage, depth = 0 }) {
  switch (field.type) {
    case 'textarea':
      return <TextArea label={field.label} hint={field.hint} value={value} onChange={onChange} rows={3} />
    case 'longtext':
      return <TextArea label={field.label} hint={field.hint} value={value} onChange={onChange} rows={6} />
    case 'number':
      return <TextInput label={field.label} hint={field.hint} type="number" min={0} max={100} value={value} onChange={onChange} />
    case 'select':
      return <SelectInput label={field.label} hint={field.hint} value={value} onChange={onChange} options={field.options || []} />
    case 'image':
      return <ImageField label={field.label} hint={field.hint} value={value} onChange={onChange} uploadImage={uploadImage} />
    case 'list':
      return <ListInput label={field.label} hint={field.hint} value={value} onChange={onChange} />
    case 'kv':
      return <KvInput label={field.label} hint={field.hint} value={value} onChange={onChange} labelKey={field.labelKey} valueKey={field.valueKey} />
    case 'links':
      return <LinksInput label={field.label} hint={field.hint} value={value} onChange={onChange} />
    case 'repeater':
      return <RepeaterInput label={field.label} hint={field.hint} value={value} onChange={onChange} fields={field.fields} itemLabel={field.itemLabel} depth={depth} />
    case 'group':
      return <GroupInput field={field} value={value} onChange={onChange} depth={depth} />
    default:
      return <TextInput label={field.label} hint={field.hint} value={value} onChange={onChange} />
  }
}

/** Small helper used by the sidebar search — does a section mention this text? */
export const sectionMatches = (section, needle) => {
  if (!needle) return true
  const haystack = `${section.title} ${section.description || ''} ${section.group}`.toLowerCase()
  return haystack.includes(needle.toLowerCase())
}

export { ImagePlus, Link2, X }
