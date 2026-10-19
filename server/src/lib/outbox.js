/**
 * A small durable outbox for enquiry emails.
 *
 * A submission is always written to the CMS inbox first. This queue exists so
 * that the *email* copy is not lost either: if SMTP is down, misconfigured or
 * simply not set up yet, the message waits here and is retried automatically
 * (and can be retried from the admin screen) instead of disappearing silently.
 *
 * Stored at server/data/outbox.json — the same git-ignored runtime folder as
 * the CMS store, so the queue survives a restart.
 */
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { repo } from './store.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outboxPath = path.join(__dirname, '../../data/outbox.json')
const MAX_ENTRIES = 100
const MAX_ATTEMPTS = 24
const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000

const emptyState = () => ({ pending: [], stats: { queued: 0, delivered: 0, dropped: 0, lastAttemptAt: null, lastSuccessAt: null, lastError: null } })

async function read() {
  try {
    const raw = JSON.parse(await fs.readFile(outboxPath, 'utf8'))
    return { pending: Array.isArray(raw?.pending) ? raw.pending : [], stats: { ...emptyState().stats, ...(raw?.stats || {}) } }
  } catch {
    return emptyState()
  }
}

async function write(state) {
  await fs.mkdir(path.dirname(outboxPath), { recursive: true })
  await fs.writeFile(outboxPath, JSON.stringify(state, null, 2))
}

/** Serialise writes so two enquiries arriving together cannot clobber the file. */
let chain = Promise.resolve()
function serial(task) {
  const run = chain.then(task, task)
  chain = run.catch(() => {})
  return run
}

const backoffMs = (attempts) => Math.min(60 * 60 * 1000, 5 * 60 * 1000 * 2 ** Math.max(0, attempts - 1))

/**
 * Once a queued email is finally accepted, update the stored submission so the
 * inbox badge stops saying "not delivered".
 */
async function markDelivered(entry, result) {
  if (!entry?.reference || entry.type === 'newsletter') return
  const delivery = {
    at: new Date().toISOString(),
    email: {
      sent: true,
      messageId: result?.messageId || null,
      to: result?.to || null,
      at: new Date().toISOString(),
      retriedFromOutbox: true,
      queued: false
    },
    acknowledgement: null,
    webhook: null,
    delivered: true
  }
  try {
    if (String(entry.type).startsWith('registration-')) await repo.updateRegistration(entry.reference, { delivery })
    else await repo.updateInquiry(entry.reference, { delivery })
  } catch (error) {
    console.warn('Could not update the delivery record for', entry.reference, error.message)
  }
}

/** Adds a failed delivery to the queue. Returns the stored entry, or null. */
export function enqueue({ payload, subject, reason }) {
  return serial(async () => {
    try {
      const state = await read()
      const existing = state.pending.find((entry) => entry.key === `${payload?.type}|${payload?.reference || ''}|${payload?.email || ''}`)
      if (existing) {
        existing.lastError = reason || existing.lastError
        existing.updatedAt = new Date().toISOString()
        await write(state)
        return existing
      }
      const now = Date.now()
      const entry = {
        id: crypto.randomBytes(6).toString('hex'),
        key: `${payload?.type}|${payload?.reference || ''}|${payload?.email || ''}`,
        reference: payload?.reference || null,
        type: payload?.type || 'unknown',
        to: payload?.email || null,
        subject: subject || 'Website submission',
        payload,
        attempts: 0,
        paused: false,
        createdAt: new Date(now).toISOString(),
        updatedAt: new Date(now).toISOString(),
        nextAttemptAt: new Date(now).toISOString(),
        lastError: reason || null
      }
      state.pending = [...state.pending, entry].slice(-MAX_ENTRIES)
      state.stats.queued = (state.stats.queued || 0) + 1
      await write(state)
      return entry
    } catch (error) {
      console.warn('Could not write the mail outbox:', error.message)
      return null
    }
  })
}

/** Compact view for the admin screen. */
export async function outboxSummary() {
  const state = await read()
  const now = Date.now()
  return {
    pending: state.pending.length,
    paused: state.pending.filter((entry) => entry.paused).length,
    due: state.pending.filter((entry) => !entry.paused && Date.parse(entry.nextAttemptAt || 0) <= now).length,
    oldest: state.pending.reduce((min, entry) => (!min || entry.createdAt < min ? entry.createdAt : min), null),
    stats: state.stats,
    entries: state.pending.slice(-10).reverse().map((entry) => ({
      id: entry.id,
      reference: entry.reference,
      type: entry.type,
      subject: entry.subject,
      attempts: entry.attempts,
      paused: Boolean(entry.paused),
      createdAt: entry.createdAt,
      nextAttemptAt: entry.nextAttemptAt,
      lastError: entry.lastError
    }))
  }
}

/**
 * Attempts every due entry. `deliver(payload)` must return
 * `{ sent, reason, retryable }`. Returns a small report for the admin screen.
 */
export function flushOutbox({ deliver, limit = 10, force = false } = {}) {
  return serial(async () => {
    const state = await read()
    if (!state.pending.length) return { attempted: 0, sent: 0, failed: 0, remaining: 0, delivered: [] }

    const now = Date.now()
    const keep = []
    let sent = 0
    let failed = 0
    let attempted = 0
    const delivered = []

    for (const entry of state.pending) {
      const expired = now - Date.parse(entry.createdAt) > MAX_AGE_MS || entry.attempts >= MAX_ATTEMPTS
      if (expired) { state.stats.dropped = (state.stats.dropped || 0) + 1; continue }
      // A rejected password will not fix itself: keep the job, but stop
      // retrying it until someone corrects the mailbox and asks for a retry.
      if (entry.paused && !force) { keep.push(entry); continue }
      const due = force || Date.parse(entry.nextAttemptAt || 0) <= now
      if (!due || attempted >= limit) { keep.push(entry); continue }

      attempted += 1
      let result
      try {
        result = await deliver(entry.payload)
      } catch (error) {
        result = { sent: false, reason: error.message, retryable: true }
      }

      state.stats.lastAttemptAt = new Date().toISOString()
      if (result?.sent) {
        sent += 1
        delivered.push({ reference: entry.reference, type: entry.type, messageId: result.messageId || null })
        state.stats.delivered = (state.stats.delivered || 0) + 1
        state.stats.lastSuccessAt = new Date().toISOString()
        state.stats.lastError = null
        await markDelivered(entry, result)
        continue
      }

      failed += 1
      state.stats.lastError = result?.reason || 'Unknown error'
      const attempts = entry.attempts + 1
      if (result?.retryable === false) {
        keep.push({
          ...entry,
          attempts,
          paused: true,
          updatedAt: new Date().toISOString(),
          lastError: result?.reason || 'Unknown error',
          nextAttemptAt: null
        })
        console.warn(`Mail outbox: pausing ${entry.reference || entry.id} until the mailbox is fixed — ${result.reason}`)
        continue
      }
      keep.push({
        ...entry,
        attempts,
        paused: false,
        updatedAt: new Date().toISOString(),
        lastError: result?.reason || 'Unknown error',
        nextAttemptAt: new Date(now + backoffMs(attempts)).toISOString()
      })
    }

    state.pending = keep
    await write(state)
    return { attempted, sent, failed, remaining: keep.length, delivered }
  })
}

/** Re-arm every waiting entry so the next flush happens immediately. */
export function retryAllNow() {
  return serial(async () => {
    const state = await read()
    const now = new Date().toISOString()
    state.pending = state.pending.map((entry) => ({ ...entry, nextAttemptAt: now, attempts: 0, paused: false }))
    await write(state)
    return state.pending.length
  })
}

/** Background retry loop. Safe to call once at boot. */
export function startOutboxWorker({ deliver, intervalMs = 5 * 60 * 1000 } = {}) {
  const tick = async () => {
    try {
      const report = await flushOutbox({ deliver, limit: 10 })
      if (report.attempted) console.log(`Mail outbox: ${report.sent} sent, ${report.failed} still waiting, ${report.remaining} queued.`)
    } catch (error) {
      console.warn('Mail outbox worker failed:', error.message)
    }
  }
  setTimeout(tick, 20_000).unref?.()
  const timer = setInterval(tick, intervalMs)
  timer.unref?.()
  return timer
}
