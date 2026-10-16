/**
 * Thin fetch helpers shared by the public site and the admin portal.
 */

export async function getJson(url, options = {}) {
  const response = await fetch(url, options)
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`)
  return data
}

export async function postJson(url, body, options = {}) {
  return getJson(url, {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    body: JSON.stringify(body)
  })
}

export const TOKEN_KEY = 'ananta-token'

export const readToken = () => {
  try { return localStorage.getItem(TOKEN_KEY) || '' } catch { return '' }
}

export const writeToken = (token) => {
  try { token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY) } catch { /* storage blocked */ }
}

/** Authenticated admin request. Throws a tagged error when the session has expired. */
export async function adminRequest(url, options = {}) {
  const token = readToken()
  if (!token) throw Object.assign(new Error('Please sign in to continue.'), { status: 401 })
  const headers = { ...(options.headers || {}), Authorization: `Bearer ${token}` }
  if (options.body && !(options.body instanceof FormData)) headers['Content-Type'] = 'application/json'
  const response = await fetch(url, { ...options, headers })
  const data = await response.json().catch(() => ({}))
  if (response.status === 401) {
    writeToken('')
    throw Object.assign(new Error(data.message || 'Your session has expired.'), { status: 401 })
  }
  if (!response.ok) throw Object.assign(new Error(data.message || 'That request could not be completed.'), { status: response.status, problems: data.problems })
  return data
}

export const adminGet = (url) => adminRequest(url)
export const adminPost = (url, body) => adminRequest(url, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) })
export const adminPut = (url, body) => adminRequest(url, { method: 'PUT', body: JSON.stringify(body) })
export const adminPatch = (url, body) => adminRequest(url, { method: 'PATCH', body: JSON.stringify(body) })

/** Deep clone that also works for structures coming out of React state. */
export const clone = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)))

/** Reads a nested value by path array. */
export const getPath = (object, path) => path.reduce((current, key) => (current === undefined || current === null ? undefined : current[key]), object)

/** Immutably writes a nested value by path array. */
export function setPath(object, path, value) {
  const next = Array.isArray(object) ? [...object] : { ...object }
  let cursor = next
  path.forEach((key, index) => {
    if (index === path.length - 1) { cursor[key] = value; return }
    const child = cursor[key]
    cursor[key] = Array.isArray(child) ? [...child] : { ...(child || {}) }
    cursor = cursor[key]
  })
  return next
}

export const slugify = (value) => String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const formatBytes = (bytes) => {
  if (!bytes) return '0 KB'
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}

export const formatDate = (value, withTime = false) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString('en-IN', withTime
    ? { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: 'short', year: 'numeric' })
}

export const STATUS_OPTIONS = ['new', 'reviewing', 'shortlisted', 'contacted', 'closed']

export const statusTone = (status) => ({
  new: 'tag-acid',
  reviewing: 'tag-info',
  shortlisted: 'tag-warning',
  contacted: 'tag-success',
  closed: 'tag'
}[status] || 'tag')
