import crypto from 'crypto'
import fs from 'fs/promises'
import path from 'path'
import multer from 'multer'

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const ALLOWED_MIME = /^image\/(jpeg|jpg|png|webp|gif|avif|svg\+xml)$/

/**
 * Files are held in memory so the same endpoint can either stream them to
 * Cloudinary (when credentials are configured) or persist them on disk.
 */
export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: (_req, file, cb) => cb(null, ALLOWED_MIME.test(file.mimetype))
})

const env = (key) => (process.env[key] || '').trim()

export function cloudinaryStatus() {
  const cloudName = env('CLOUDINARY_CLOUD_NAME')
  const apiKey = env('CLOUDINARY_API_KEY')
  const apiSecret = env('CLOUDINARY_API_SECRET')
  const preset = env('CLOUDINARY_UPLOAD_PRESET')
  const signed = Boolean(cloudName && apiKey && apiSecret)
  const unsigned = Boolean(cloudName && preset && !signed)
  return { cloudName, apiKey, apiSecret, preset, signed, unsigned, enabled: signed || unsigned }
}

function safeName(originalname = 'image') {
  return originalname.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-80) || 'image'
}

function signParams(params, apiSecret) {
  const payload = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== '')
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')
  return crypto.createHash('sha1').update(`${payload}${apiSecret}`).digest('hex')
}

async function uploadToCloudinary(file) {
  const { cloudName, apiKey, apiSecret, preset, signed } = cloudinaryStatus()
  const folder = env('CLOUDINARY_UPLOAD_FOLDER') || 'ananta-infratech'
  const form = new FormData()
  form.append('file', new Blob([file.buffer], { type: file.mimetype }), safeName(file.originalname))
  form.append('folder', folder)

  if (signed) {
    const timestamp = Math.round(Date.now() / 1000)
    form.append('api_key', apiKey)
    form.append('timestamp', String(timestamp))
    form.append('signature', signParams({ folder, timestamp }, apiSecret))
  } else {
    form.append('upload_preset', preset)
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: form })
  const result = await response.json().catch(() => ({}))
  if (!response.ok || !result.secure_url) {
    throw new Error(result?.error?.message || 'Cloudinary rejected the upload.')
  }
  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    storage: 'cloudinary'
  }
}

async function saveLocally(file, uploadDir) {
  await fs.mkdir(uploadDir, { recursive: true })
  const filename = `${Date.now()}-${safeName(file.originalname)}`
  await fs.writeFile(path.join(uploadDir, filename), file.buffer)
  return { url: `/uploads/${filename}`, publicId: filename, bytes: file.size, storage: 'local' }
}

/**
 * Stores an uploaded image and returns its public URL.
 * Cloudinary is used when configured; otherwise the file is written to /uploads.
 */
export async function storeImage(file, uploadDir) {
  if (cloudinaryStatus().enabled) {
    try {
      return await uploadToCloudinary(file)
    } catch (error) {
      console.warn('Cloudinary upload failed, storing the image locally instead:', error.message)
    }
  }
  return saveLocally(file, uploadDir)
}
