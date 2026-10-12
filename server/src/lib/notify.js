/**
 * Notification hook.
 *
 * When a submission arrives we try to tell somebody. Rather than bolt on an email
 * provider dependency, the server POSTs a small JSON payload to whatever webhook
 * is configured — which can be a Slack/Zapier/Make hook, an internal endpoint or
 * a transactional email relay.
 *
 * Configure with NOTIFY_WEBHOOK_URL (and optionally NOTIFY_WEBHOOK_SECRET).
 * When it is not configured, submissions are still stored and appear in the admin
 * portal — nothing is lost.
 */
const env = (key) => (process.env[key] || '').trim()

export function notificationStatus() {
  const url = env('NOTIFY_WEBHOOK_URL')
  return { enabled: Boolean(url), target: url ? new URL(url).host : null, to: env('NOTIFY_EMAIL') || null }
}

export async function notify(payload) {
  const url = env('NOTIFY_WEBHOOK_URL')
  if (!url) return { delivered: false, reason: 'not-configured' }
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(env('NOTIFY_WEBHOOK_SECRET') ? { 'X-Ananta-Signature': env('NOTIFY_WEBHOOK_SECRET') } : {})
      },
      body: JSON.stringify({ source: 'ananta-website', at: new Date().toISOString(), to: env('NOTIFY_EMAIL') || null, ...payload })
    })
    return { delivered: response.ok, status: response.status }
  } catch (error) {
    console.warn('Notification webhook failed:', error.message)
    return { delivered: false, reason: error.message }
  }
}

/**
 * Very small in-memory rate limiter, keyed by IP and route family.
 * Enough to stop form spam on a single-instance deployment.
 */
const buckets = new Map()

export function rateLimit({ windowMs = 60_000, max = 8, key = 'default' } = {}) {
  return (req, res, next) => {
    const now = Date.now()
    const id = `${key}:${req.ip}`
    const hits = (buckets.get(id) || []).filter((time) => now - time < windowMs)
    if (hits.length >= max) {
      const retryAfter = Math.ceil((windowMs - (now - hits[0])) / 1000)
      res.set('Retry-After', String(retryAfter))
      return res.status(429).json({ message: `Too many submissions. Please try again in ${retryAfter} seconds.` })
    }
    hits.push(now)
    buckets.set(id, hits)
    if (buckets.size > 5000) buckets.clear()
    next()
  }
}
