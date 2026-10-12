import { useEffect, useRef, useState } from 'react'
import { ImagePlus, Link2, Loader2, Trash2, UploadCloud, Wand2 } from 'lucide-react'
import { adminGet, formatBytes } from '../lib/api'

/**
 * Click-to-browse image field.
 *
 * Clicking the tile opens the operating system file explorer, the chosen file is
 * uploaded (Cloudinary when configured, otherwise the server's /uploads folder)
 * and the returned public URL is written straight into the content field.
 *
 * A "Choose from library" action lists previously uploaded files so the same
 * photograph never has to be uploaded twice, and a URL can still be pasted
 * manually behind the "Use a link instead" toggle.
 */
export default function ImageField({
  label,
  value = '',
  onChange,
  hint,
  uploadImage,
  className = '',
  accept = 'image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml'
}) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [showUrl, setShowUrl] = useState(false)
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [library, setLibrary] = useState(null)

  useEffect(() => {
    if (!libraryOpen || library) return
    adminGet('/api/admin/media')
      .then((data) => setLibrary(data))
      .catch((requestError) => setError(requestError.message))
  }, [libraryOpen, library])

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please choose an image file.'); return }
    setError('')
    setBusy(true)
    try {
      const result = await uploadImage(file)
      onChange(result.url)
      setLibrary(null)
    } catch (uploadError) {
      setError(uploadError.message || 'The upload failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const openExplorer = () => { if (!busy) inputRef.current?.click() }

  return (
    <div className={`image-field ${className}`.trim()}>
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
          : <span className="image-placeholder"><ImagePlus size={19} /></span>}

        <span className="image-dropzone-copy">
          <b>{busy ? 'Uploading…' : value ? 'Click to replace this image' : 'Click to upload an image'}</b>
          <small>{hint || 'Opens your file explorer · drag & drop also works · JPG, PNG, WEBP, GIF, SVG up to 10MB'}</small>
        </span>

        <span className="image-dropzone-action">{busy ? <Loader2 className="spin" size={17} /> : <UploadCloud size={17} />}</span>
        <input ref={inputRef} type="file" accept={accept} hidden onChange={(event) => { handleFile(event.target.files?.[0]); event.target.value = '' }} />
      </div>

      <div className="image-field-tools">
        <button type="button" className="text-button" onClick={() => setShowUrl((open) => !open)}>
          <Link2 size={13} /> {showUrl ? 'Hide link field' : 'Use a link instead'}
        </button>
        <button type="button" className="text-button" onClick={() => setLibraryOpen((open) => !open)}>
          <Wand2 size={13} /> {libraryOpen ? 'Hide library' : 'Choose from library'}
        </button>
        {value ? <button type="button" className="text-button danger" onClick={() => onChange('')}><Trash2 size={13} /> Remove</button> : null}
      </div>

      {showUrl ? (
        <input
          className="image-url-input"
          value={value}
          placeholder="https://res.cloudinary.com/…/image.jpg"
          onChange={(event) => onChange(event.target.value)}
        />
      ) : null}

      {libraryOpen ? (
        <div>
          {!library ? <small className="field-hint">Loading your image library…</small> : null}
          {library?.images?.length === 0 ? <small className="field-hint">No uploaded images yet. Uploading a file will add it here for reuse.</small> : null}
          {library?.images?.length ? (
            <div className="media-grid" style={{ marginTop: 8 }}>
              {library.images.slice(0, 18).map((image) => (
                <div className="media-tile" key={image.url}>
                  <img src={image.url} alt={image.name} loading="lazy" />
                  <div className="media-tile-body">
                    <small>{formatBytes(image.bytes)}</small>
                    <div className="media-tile-actions">
                      <button type="button" onClick={() => { onChange(image.url); setLibraryOpen(false) }}>Use this</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {value && !showUrl ? <small className="image-field-path">{value}</small> : null}
      {error ? <small className="image-field-error">{error}</small> : null}
    </div>
  )
}
