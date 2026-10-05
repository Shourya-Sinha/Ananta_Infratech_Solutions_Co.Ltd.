import { useRef, useState } from 'react'
import { ImagePlus, Link2, Loader2, Trash2, UploadCloud } from 'lucide-react'

/**
 * Click-to-browse image field.
 * Clicking the tile opens the operating system file explorer, the selected file is
 * uploaded (Cloudinary when configured, otherwise the server's /uploads folder) and the
 * returned public URL is written straight into the content field — no manual URL work.
 * A URL can still be pasted manually through the "Use a link instead" toggle.
 */
export default function ImageField({ label, value = '', onChange, hint, uploadImage, className = '', accept = 'image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml' }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [showUrl, setShowUrl] = useState(false)

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please choose an image file.'); return }
    setError(''); setBusy(true)
    try {
      const result = await uploadImage(file)
      onChange(result.url)
    } catch (err) { setError(err.message || 'The upload failed. Please try again.') }
    finally { setBusy(false) }
  }

  const openExplorer = () => { if (!busy) inputRef.current?.click() }

  return <div className={`image-field ${className}`}>
    <span className="image-field-label">{label}</span>
    <div
      className={`image-dropzone ${dragging ? 'is-dragging' : ''} ${busy ? 'is-busy' : ''}`}
      role="button"
      tabIndex={0}
      onClick={openExplorer}
      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openExplorer() } }}
      onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => { event.preventDefault(); setDragging(false); handleFile(event.dataTransfer.files?.[0]) }}
      title="Click to choose an image from your computer"
    >
      {value
        ? <img className="image-preview" src={value} alt="" onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} />
        : <span className="image-placeholder"><ImagePlus size={20} /></span>}
      <span className="image-dropzone-copy">
        <b>{busy ? 'Uploading…' : value ? 'Click to replace this image' : 'Click to upload an image'}</b>
        <small>{hint || 'Opens your file explorer · drag & drop also works · JPG, PNG, WEBP, GIF, SVG up to 10MB'}</small>
      </span>
      <span className="image-dropzone-action">{busy ? <Loader2 className="spin" size={18} /> : <UploadCloud size={18} />}</span>
      <input ref={inputRef} type="file" accept={accept} hidden onChange={(event) => { handleFile(event.target.files?.[0]); event.target.value = '' }} />
    </div>
    <div className="image-field-tools">
      <button type="button" className="text-button" onClick={() => setShowUrl((open) => !open)}><Link2 size={13} /> {showUrl ? 'Hide link field' : 'Use a link instead'}</button>
      {value && <button type="button" className="text-button danger" onClick={() => onChange('')}><Trash2 size={13} /> Remove</button>}
    </div>
    {showUrl && <input className="image-url-input" value={value} placeholder="https://res.cloudinary.com/…/image.png" onChange={(event) => onChange(event.target.value)} />}
    {value && !showUrl && <small className="image-field-path">{value}</small>}
    {error && <small className="image-field-error">{error}</small>}
  </div>
}
