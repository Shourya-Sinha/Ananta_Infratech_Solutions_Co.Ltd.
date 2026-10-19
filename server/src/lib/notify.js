/**
 * Notification and email delivery.
 *
 * Every submission (contact enquiry, job application, contractor/worker
 * registration, newsletter signup) is stored in the CMS inbox first — nothing
 * is ever lost if email is unavailable. On top of that, this module delivers a
 * real email to the company inbox and an optional acknowledgement to the person
 * who wrote in.
 *
 * Email is configured entirely through environment variables, so no provider is
 * hard-coded (see mail-config.js for the provider presets and validation):
 *
 *   MAIL_PROVIDER   optional preset: godaddy, titan, microsoft365, gmail, zoho…
 *   SMTP_HOST       smtp host, e.g. smtpout.secureserver.net / smtp.gmail.com
 *   SMTP_PORT       465 (SSL) or 587 (STARTTLS)
 *   SMTP_SECURE     true for port 465
 *   SMTP_USER       mailbox login, usually support@anantainfratechsolutions.com
 *   SMTP_PASS       mailbox password or app password
 *   MAIL_FROM       "Ananta Infratech Solutions <support@anantainfratechsolutions.com>"
 *   MAIL_TO         comma-separated recipients (defaults to the support inbox)
 *   MAIL_REPLY_TO   optional override for reply-to
 *   MAIL_ACK        "true" to send the submitter a confirmation email
 *
 * When a send fails the reason is reported back, attached to the stored
 * submission and — for temporary failures — queued in outbox.js for retry, so a
 * broken mailbox can never fail silently again.
 */
import nodemailer from 'nodemailer'
import crypto from 'node:crypto'
import net from 'node:net'
import tls from 'node:tls'
import dns from 'node:dns/promises'
import {
  mailConfig,
  publicMailConfig,
  explainSmtpError,
  detectMailProvider,
  DEFAULT_INBOX
} from './mail-config.js'
import { enqueue, outboxSummary } from './outbox.js'

const env = (key) => (process.env[key] || '').trim()

let transporter = null
let transporterKey = ''

export { DEFAULT_INBOX }

/* ------------------------------------------------------------- status ---- */

export function mailStatus() {
  const config = mailConfig()
  const status = publicMailConfig()
  const first = config.problems[0]
  return {
    ...status,
    configured: config.configured,
    acknowledgements: config.ack,
    reason: config.configured
      ? null
      : first
        ? `${first.message} ${first.hint || ''}`.trim()
        : 'Set MAIL_PROVIDER (or SMTP_HOST), SMTP_USER and SMTP_PASS to deliver form submissions to the inbox.',
    problems: config.problems,
    warnings: config.warnings
  }
}

export function notificationStatus() {
  const config = mailConfig()
  const url = env('NOTIFY_WEBHOOK_URL')
  return {
    enabled: config.configured || Boolean(url),
    email: mailStatus(),
    webhook: url ? { target: safeHost(url) } : null,
    to: config.to.join(', ')
  }
}

function safeHost(url) {
  try { return new URL(url).host } catch { return 'configured' }
}

/* --------------------------------------------------------- transport ---- */

function getTransporter() {
  const config = mailConfig()
  if (!config.configured) return null
  const key = `${config.host}|${config.port}|${config.user}|${config.secure}|${config.service}|${crypto.createHash('sha1').update(config.pass).digest('hex').slice(0, 8)}`
  if (transporter && transporterKey === key) return transporter
  if (transporter?.close) { try { transporter.close() } catch { /* already closed */ } }

  const shared = {
    auth: { user: config.user, pass: config.pass },
    pool: true,
    maxConnections: 2,
    maxMessages: 50,
    connectionTimeout: 12_000,
    greetingTimeout: 12_000,
    socketTimeout: 20_000,
    logger: config.debug ? console : false,
    debug: config.debug,
    tls: { rejectUnauthorized: !config.allowInvalidCert, ...(net.isIP(config.host) ? {} : { servername: config.host }) }
  }

  transporter = nodemailer.createTransport(
    config.service
      ? { service: config.service, ...shared }
      : { host: config.host, port: config.port, secure: config.secure, ...shared }
  )
  transporterKey = key
  return transporter
}

/** Drops the cached connection so a corrected .env takes effect after restart. */
export function resetTransport() {
  if (transporter?.close) { try { transporter.close() } catch { /* ignore */ } }
  transporter = null
  transporterKey = ''
}

/* ----------------------------------------------------------- templates ---- */

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

const SUBJECTS = {
  'contact-enquiry': (data) => `New website enquiry${data.department ? ` · ${data.department}` : ''} — ${data.name || 'Unknown'}`,
  'job-application': (data) => `Job application — ${data.role || 'role not specified'} · ${data.name || ''}`,
  'registration-contractor': (data) => `Contractor registration — ${data.company || data.name || ''}`,
  'registration-worker': (data) => `Worker registration — ${data.name || ''}`,
  'newsletter': (data) => `Newsletter signup — ${data.email || ''}`,
  test: () => 'Ananta website — email delivery test'
}

const subjectFor = (payload) => SUBJECTS[payload.type]?.(payload) || 'New website submission'

function rows(payload) {
  const labels = {
    type: 'Type', reference: 'Reference', name: 'Name', email: 'Email', phone: 'Phone',
    company: 'Company', role: 'Role', department: 'Department', city: 'City', state: 'State',
    message: 'Message', trades: 'Trades', scale: 'Scale', gst: 'GST', experience: 'Experience',
    interest: 'Interest', source: 'Source page', ip: 'IP address', at: 'Received at'
  }
  return Object.entries(payload)
    .filter(([key, value]) => !['type'].includes(key) && value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && !value.length))
    .map(([key, value]) => [labels[key] || key, Array.isArray(value) ? value.join(', ') : String(value)])
}

export function renderEmail(payload, { heading } = {}) {
  const title = heading || subjectFor(payload)
  const details = rows(payload)
  const accent = '#c9d94a'
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f2f0eb;font-family:Helvetica,Arial,sans-serif;color:#141d23">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f0eb;padding:28px 12px">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #dedbd3">
        <tr><td style="background:#141d23;padding:22px 26px">
          <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${accent};margin-bottom:6px">Ananta Infratech Solutions</div>
          <div style="font-size:21px;color:#f9f8f5;font-weight:600;line-height:1.25">${escapeHtml(title)}</div>
        </td></tr>
        <tr><td style="padding:24px 26px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.55">
            ${details.map(([label, value]) => `
              <tr>
                <td style="padding:7px 0;width:150px;color:#5c6963;vertical-align:top;border-bottom:1px solid #eeece6">${escapeHtml(label)}</td>
                <td style="padding:7px 0;border-bottom:1px solid #eeece6;white-space:pre-wrap">${escapeHtml(value)}</td>
              </tr>`).join('')}
          </table>
          <p style="margin:22px 0 0;font-size:13px;color:#5c6963">
            This submission is also stored in the admin portal under <b>Submissions inbox</b>.
            Reply directly to this email to answer the sender.
          </p>
        </td></tr>
        <tr><td style="padding:16px 26px;background:#f2f0eb;font-size:11.5px;color:#5c6963">
          ${escapeHtml(payload.email || 'No sender email')} · ${escapeHtml(payload.reference || 'no reference')} · sent via anantainfratechsolutions.com
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

export function renderAcknowledgement(payload) {
  const first = String(payload.name || '').split(' ')[0]
  const greeting = first ? `Hello ${escapeHtml(first)},` : 'Hello,'
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f2f0eb;font-family:Helvetica,Arial,sans-serif;color:#141d23">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f0eb;padding:28px 12px">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #dedbd3">
        <tr><td style="background:#141d23;padding:26px">
          <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#c9d94a;margin-bottom:8px">Ananta Infratech Solutions</div>
          <div style="font-size:23px;color:#f9f8f5;font-weight:600">We have your message.</div>
        </td></tr>
        <tr><td style="padding:26px;font-size:14.5px;line-height:1.65">
          <p style="margin:0 0 14px">${greeting}</p>
          <p style="margin:0 0 14px">
            Thank you for writing to Ananta Infratech Solutions. Your message has reached our team
            and someone will respond within one working day${payload.reference ? ` — your reference is <b>${escapeHtml(payload.reference)}</b>` : ''}.
          </p>
          <p style="margin:0 0 14px">
            If your enquiry is urgent, call <a href="tel:+912249682016" style="color:#141d23">+91 22 4968 2016</a>
            or reply to this email. For anything else, our inbox is
            <a href="mailto:${DEFAULT_INBOX}" style="color:#141d23">${DEFAULT_INBOX}</a>.
          </p>
          <p style="margin:0;color:#5c6963;font-size:12.5px">
            Ananta Infratech Solutions · Construction, infrastructure and digital technology · Mumbai, India
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

/* --------------------------------------------------------------- send ---- */

/**
 * Sends one email through the configured SMTP transport.
 * Returns `{ sent, ... }` — never throws. Failures carry a structured
 * explanation (`code`, `message`, `hint`, `retryable`) for the admin screen.
 */
export async function sendMail({ subject, html, text, to, replyTo, attachments }) {
  const config = mailConfig()
  if (!config.configured) {
    const explanation = config.problems[0] || { code: 'smtp-not-configured', message: 'Email is not configured.', hint: 'Set MAIL_PROVIDER (or SMTP_HOST), SMTP_USER and SMTP_PASS.' }
    return {
      sent: false,
      reason: `${explanation.message} ${explanation.hint || ''}`.trim(),
      code: explanation.code || 'smtp-not-configured',
      // Keep it in the queue: once the mailbox is configured, these are sent.
      retryable: true,
      configured: false,
      at: new Date().toISOString()
    }
  }

  const transport = getTransporter()
  const recipients = Array.isArray(to) ? to.join(', ') : (to || config.to.join(', '))
  try {
    const info = await transport.sendMail({
      from: config.from,
      to: recipients,
      replyTo: replyTo || config.replyTo || undefined,
      subject,
      text: text || undefined,
      html,
      attachments
    })

    const accepted = Array.isArray(info.accepted) ? info.accepted : []
    const rejected = Array.isArray(info.rejected) ? info.rejected : []
    if (!accepted.length && rejected.length) {
      const error = Object.assign(new Error(`The server rejected every recipient (${rejected.join(', ')}).`), { code: 'EENVELOPE', responseCode: 550 })
      const explanation = explainSmtpError(error, config)
      console.warn(`Email rejected for ${recipients}: ${explanation.message}`)
      return { sent: false, reason: explanation.message, ...explanation, rejected, at: new Date().toISOString() }
    }

    console.log(`Email sent to ${recipients} (${info.messageId || 'no id'})`)
    return {
      sent: true,
      messageId: info.messageId,
      accepted,
      rejected,
      response: info.response,
      to: recipients,
      subject,
      at: new Date().toISOString()
    }
  } catch (error) {
    const explanation = explainSmtpError(error, config)
    console.warn(`Email delivery failed: ${explanation.code} ${explanation.message}`)
    if (config.debug) console.warn(error)
    return {
      sent: false,
      reason: explanation.message,
      ...explanation,
      to: recipients,
      subject,
      at: new Date().toISOString()
    }
  }
}

/**
 * Emails one submission to the company inbox. Used both by `notify()` and by
 * the outbox retry worker.
 */
export async function deliverPayload(payload) {
  const config = mailConfig()
  const subject = `[Website] ${subjectFor(payload)}`
  const result = await sendMail({
    subject,
    html: renderEmail(payload),
    replyTo: payload.email && /.+@.+\..+/.test(payload.email) ? payload.email : undefined
  })
  return { ...result, subject, configured: config.configured }
}

/**
 * Delivers a submission by email and, if configured, by webhook.
 * Returns a compact delivery report that is stored with the submission so the
 * admin portal can show whether the inbox actually received it.
 */
export async function notify(payload) {
  const config = mailConfig()
  const subject = `[Website] ${subjectFor(payload)}`
  const report = { at: new Date().toISOString(), email: { sent: false, reason: 'smtp-not-configured' }, acknowledgement: null, webhook: null }

  const email = await deliverPayload(payload)
  report.email = email

  if (config.ack && payload.email && /.+@.+\..+/.test(payload.email) && ['contact-enquiry', 'job-application', 'registration-contractor', 'registration-worker'].includes(payload.type)) {
    report.acknowledgement = await sendMail({
      to: payload.email,
      subject: 'We have your message — Ananta Infratech Solutions',
      html: renderAcknowledgement(payload)
    })
  }

  // Keep a temporary or configuration failure so it can be retried once the
  // mailbox is fixed — this is what stops enquiries vanishing silently.
  if (!email.sent && payload.type !== 'test') {
    const entry = await enqueue({ payload, subject, reason: email.reason })
    report.email.queued = Boolean(entry)
    report.email.queuedAt = entry?.createdAt || null
  }

  const url = env('NOTIFY_WEBHOOK_URL')
  if (url) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(env('NOTIFY_WEBHOOK_SECRET') ? { 'X-Ananta-Signature': env('NOTIFY_WEBHOOK_SECRET') } : {})
        },
        body: JSON.stringify({ source: 'ananta-website', at: new Date().toISOString(), to: config.to, ...payload })
      })
      report.webhook = { sent: response.ok, status: response.status }
    } catch (error) {
      console.warn('Notification webhook failed:', error.message)
      report.webhook = { sent: false, reason: error.message }
    }
  }

  report.delivered = Boolean(report.email.sent || report.webhook?.sent)
  report.stored = true
  return report
}

/* --------------------------------------------------------- diagnostics ---- */

const step = (id, label, status, detail, hint) => ({ id, label, status, detail: detail || null, hint: hint || null })

function withTimeout(promise, ms, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error(message || 'Timed out'), { code: 'ETIMEDOUT' })), ms))
  ])
}

function checkTcp(host, port, timeoutMs = 8000) {
  return new Promise((resolve) => {
    let settled = false
    const socket = net.createConnection({ host, port })
    const finish = (result) => {
      if (settled) return
      settled = true
      try { socket.destroy() } catch { /* ignore */ }
      resolve(result)
    }
    socket.setTimeout(timeoutMs)
    socket.once('connect', () => finish({ ok: true, detail: `Connected to ${host}:${port}.` }))
    socket.once('timeout', () => finish({ ok: false, code: 'ETIMEDOUT', detail: `No response from ${host}:${port} within ${Math.round(timeoutMs / 1000)}s.` }))
    socket.once('error', (error) => finish({ ok: false, code: error.code, detail: error.message }))
  })
}

function checkTls(host, port, rejectUnauthorized, timeoutMs = 8000) {
  return new Promise((resolve) => {
    let settled = false
    let socket
    const finish = (result) => {
      if (settled) return
      settled = true
      try { socket?.destroy() } catch { /* ignore */ }
      resolve(result)
    }
    try {
      socket = tls.connect({ host, port, servername: net.isIP(host) ? undefined : host, rejectUnauthorized }, () => {
        finish({ ok: true, detail: `TLS established with ${host}:${port}.` })
      })
    } catch (error) {
      finish({ ok: false, code: error.code, detail: error.message })
      return
    }
    socket.setTimeout(timeoutMs)
    socket.once('timeout', () => finish({ ok: false, code: 'ETIMEDOUT', detail: `TLS handshake timed out after ${Math.round(timeoutMs / 1000)}s.` }))
    socket.once('error', (error) => finish({ ok: false, code: error.code, detail: error.message }))
  })
}

/**
 * Runs the same checks a mail client would: configuration, DNS, TCP, TLS,
 * authentication and sender identity. Every failure carries the specific fix.
 */
export async function diagnoseMail({ sendTest = false, recipient } = {}) {
  const config = mailConfig()
  const steps = []

  if (!config.configured) {
    steps.push(step('config', 'Configuration', 'fail', config.problems.map((problem) => problem.message).join(' '), config.problems[0]?.hint))
    return { ok: false, checkedAt: new Date().toISOString(), steps, config: publicMailConfig(), summary: 'Email is not fully configured yet.' }
  }

  steps.push(step('config', 'Configuration', 'pass', `${config.providerLabel || 'SMTP'} · ${config.user} → ${config.to.join(', ')}`))
  for (const warning of config.warnings) {
    steps.push(step(`warning:${warning.code}`, 'Configuration warning', 'warn', warning.message, warning.hint))
  }

  // DNS
  let lookups = []
  try {
    lookups = await withTimeout(dns.lookup(config.host, { all: true }), 5000, 'DNS lookup timed out')
    steps.push(step('dns', 'DNS lookup', 'pass', `${config.host} → ${lookups.map((row) => row.address).join(', ')}`))
  } catch (error) {
    const explanation = explainSmtpError(Object.assign(error, { code: error.code || 'EDNS' }), config)
    steps.push(step('dns', 'DNS lookup', 'fail', explanation.message, explanation.hint))
    return { ok: false, checkedAt: new Date().toISOString(), steps, config: publicMailConfig(), summary: explanation.message }
  }

  // TCP
  const tcp = await checkTcp(config.host, config.port)
  if (!tcp.ok) {
    const explanation = explainSmtpError(Object.assign(new Error(tcp.detail), { code: tcp.code }), config)
    steps.push(step('tcp', `TCP connection to port ${config.port}`, 'fail', explanation.message, explanation.hint))
    return { ok: false, checkedAt: new Date().toISOString(), steps, config: publicMailConfig(), summary: explanation.message }
  }
  steps.push(step('tcp', `TCP connection to port ${config.port}`, 'pass', tcp.detail))

  // TLS (implicit for 465)
  if (config.secure) {
    const secure = await checkTls(config.host, config.port, !config.allowInvalidCert)
    if (!secure.ok) {
      const explanation = explainSmtpError(Object.assign(new Error(secure.detail), { code: secure.code === 'ETIMEDOUT' ? 'ETIMEDOUT' : 'ETLS' }), config)
      steps.push(step('tls', 'TLS encryption', 'fail', explanation.message, explanation.hint))
      return { ok: false, checkedAt: new Date().toISOString(), steps, config: publicMailConfig(), summary: explanation.message }
    }
    steps.push(step('tls', 'TLS encryption', 'pass', secure.detail))
  } else {
    steps.push(step('tls', 'TLS encryption', 'skip', `STARTTLS will be negotiated after the greeting on port ${config.port}.`))
  }

  // Authentication
  const transport = getTransporter()
  try {
    await withTimeout(transport.verify(), 25_000, 'The mail server did not answer the sign-in within 25 seconds')
    steps.push(step('auth', 'Mailbox sign-in', 'pass', `${config.user} authenticated successfully.`))
  } catch (error) {
    const explanation = explainSmtpError(error, config)
    steps.push(step('auth', 'Mailbox sign-in', 'fail', explanation.message, explanation.hint))
    return { ok: false, checkedAt: new Date().toISOString(), steps, config: publicMailConfig(), summary: `${explanation.message} ${explanation.hint || ''}`.trim() }
  }

  // Sender identity
  if (config.fromAddress && config.user && config.fromAddress.toLowerCase() !== config.user.toLowerCase()) {
    steps.push(step('sender', 'Sender address', 'warn', `Sending as ${config.fromAddress} while signed in as ${config.user}.`, 'Most providers only allow the authenticated address (or a verified alias) as the From address. Change MAIL_FROM if the message is rejected.'))
  } else {
    steps.push(step('sender', 'Sender address', 'pass', config.from))
  }

  let delivery = null
  if (sendTest) {
    delivery = await sendMail({
      to: recipient || config.to,
      subject: '[Website] Email delivery test — Ananta Infratech Solutions',
      html: renderEmail({
        type: 'test',
        reference: 'TEST',
        name: 'Ananta admin',
        at: new Date().toLocaleString('en-IN')
      }, { heading: 'Email delivery test' }),
      text: 'If you are reading this, form submissions from the website will reach this inbox.'
    })
    steps.push(delivery.sent
      ? step('delivery', 'Test message', 'pass', `Accepted by the mail server for ${delivery.to} (${delivery.messageId || 'no message id'}). If it is not in the inbox within a minute, check the spam folder and any GoDaddy quarantine.`)
      : step('delivery', 'Test message', 'fail', delivery.reason, delivery.hint))
  }

  const failed = steps.find((entry) => entry.status === 'fail')
  return {
    ok: !failed && (!delivery || delivery.sent),
    checkedAt: new Date().toISOString(),
    steps,
    delivery,
    config: publicMailConfig(),
    summary: failed ? `${failed.detail || failed.label}` : 'The mail channel is working — the server accepted the sign-in.'
  }
}

/** Used by the admin "send a test email" button. */
export async function sendTestEmail(recipient) {
  const report = await diagnoseMail({ sendTest: true, recipient })
  return {
    sent: Boolean(report.delivery?.sent),
    reason: report.delivery?.reason || (report.ok ? null : report.summary),
    hint: report.delivery?.hint || null,
    messageId: report.delivery?.messageId,
    diagnostics: report,
    status: mailStatus()
  }
}

/** Backs the admin "retry queued enquiries" button. */
export async function mailQueueStatus() {
  return outboxSummary()
}

/** Re-exported so the server can warm the provider cache before it listens. */
export { detectMailProvider }

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
