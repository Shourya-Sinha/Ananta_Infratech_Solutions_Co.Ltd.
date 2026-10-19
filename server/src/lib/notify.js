/**
 * Notification and email delivery.
 *
 * Every submission (contact enquiry, job application, contractor/worker
 * registration, newsletter signup) is stored in the CMS inbox first — nothing
 * is ever lost if email is unavailable. On top of that, this module can deliver
 * a real email to the company inbox and an optional acknowledgement to the
 * person who wrote in.
 *
 * Email is configured entirely through environment variables, so no provider
 * is hard-coded:
 *
 *   SMTP_HOST       smtp host, e.g. smtp.zoho.in / smtp.gmail.com
 *   SMTP_PORT       465 (secure) or 587 (STARTTLS)
 *   SMTP_SECURE     true for port 465
 *   SMTP_USER       mailbox login, usually support@anantainfratechsolutions.com
 *   SMTP_PASS       mailbox password or app password
 *   MAIL_FROM       "Ananta Infratech Solutions <support@anantainfratechsolutions.com>"
 *   MAIL_TO         comma-separated recipients (defaults to the support inbox)
 *   MAIL_REPLY_TO   optional override for reply-to
 *   MAIL_ACK        "true" to send the submitter a confirmation email
 *
 * If SMTP is not configured the webhook (NOTIFY_WEBHOOK_URL) is still used, and
 * submissions remain visible in the admin portal.
 */
import nodemailer from 'nodemailer'

const env = (key) => (process.env[key] || '').trim()
const DEFAULT_INBOX = 'support@anantainfratechsolutions.com'

let transporter = null
let transporterKey = ''

function mailConfig() {
  const host = env('SMTP_HOST')
  const user = env('SMTP_USER')
  const pass = env('SMTP_PASS')
  const port = Number(env('SMTP_PORT') || (env('SMTP_SECURE') === 'true' ? 465 : 587))
  const secure = env('SMTP_SECURE') ? env('SMTP_SECURE') === 'true' : port === 465
  const to = (env('MAIL_TO') || DEFAULT_INBOX).split(',').map((item) => item.trim()).filter(Boolean)
  return {
    host,
    user,
    pass,
    port,
    secure,
    service: env('MAIL_SERVICE') || '',
    from: env('MAIL_FROM') || `Ananta Infratech Solutions <${user || DEFAULT_INBOX}>`,
    replyTo: env('MAIL_REPLY_TO') || '',
    to,
    ack: env('MAIL_ACK') === 'true',
    configured: Boolean((host || env('MAIL_SERVICE')) && user && pass)
  }
}

export function mailStatus() {
  const config = mailConfig()
  return {
    configured: config.configured,
    host: config.host || config.service || null,
    port: config.configured ? config.port : null,
    secure: config.secure,
    from: config.configured ? config.from : null,
    to: config.to,
    acknowledgements: config.ack,
    reason: config.configured
      ? null
      : 'Set SMTP_HOST, SMTP_USER and SMTP_PASS (see .env.example) to deliver form submissions to the inbox.'
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

function getTransporter() {
  const config = mailConfig()
  if (!config.configured) return null
  const key = `${config.host}|${config.port}|${config.user}|${config.secure}`
  if (transporter && transporterKey === key) return transporter
  transporter = nodemailer.createTransport({
    ...(config.service ? { service: config.service } : { host: config.host, port: config.port, secure: config.secure }),
    auth: { user: config.user, pass: config.pass },
    pool: true,
    maxConnections: 2,
    connectionTimeout: 12_000,
    greetingTimeout: 12_000,
    socketTimeout: 20_000
  })
  transporterKey = key
  return transporter
}

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
  const title = heading || SUBJECTS[payload.type]?.(payload) || 'New website submission'
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

/** Sends one email through the configured SMTP transport. */
export async function sendMail({ subject, html, text, to, replyTo, attachments }) {
  const config = mailConfig()
  if (!config.configured) return { sent: false, reason: 'smtp-not-configured' }
  const transport = getTransporter()
  try {
    const info = await transport.sendMail({
      from: config.from,
      to: to || config.to,
      replyTo: replyTo || config.replyTo || undefined,
      subject,
      text: text || undefined,
      html,
      attachments
    })
    return { sent: true, messageId: info.messageId, accepted: info.accepted }
  } catch (error) {
    console.warn('Email delivery failed:', error.message)
    return { sent: false, reason: error.message }
  }
}

/**
 * Delivers a submission by email and, if configured, by webhook.
 * Returns a compact delivery report that is stored with the submission so the
 * admin portal can show whether the inbox actually received it.
 */
export async function notify(payload) {
  const config = mailConfig()
  const subject = SUBJECTS[payload.type]?.(payload) || 'New website submission'
  const report = { at: new Date().toISOString(), email: { sent: false, reason: 'smtp-not-configured' }, acknowledgement: null, webhook: null }

  if (config.configured) {
    report.email = await sendMail({
      subject: `[Website] ${subject}`,
      html: renderEmail(payload),
      replyTo: payload.email && /.+@.+\..+/.test(payload.email) ? payload.email : undefined
    })

    if (config.ack && payload.email && /.+@.+\..+/.test(payload.email) && ['contact-enquiry', 'job-application', 'registration-contractor', 'registration-worker'].includes(payload.type)) {
      report.acknowledgement = await sendMail({
        to: payload.email,
        subject: 'We have your message — Ananta Infratech Solutions',
        html: renderAcknowledgement(payload)
      })
    }
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
  return report
}

/** Used by the admin "send a test email" button. */
export async function sendTestEmail(recipient) {
  const config = mailConfig()
  const status = mailStatus()
  if (!config.configured) return { sent: false, reason: status.reason, status }
  const result = await sendMail({
    to: recipient || config.to,
    subject: '[Website] Email delivery test — Ananta Infratech Solutions',
    html: renderEmail({
      type: 'test',
      reference: 'TEST',
      name: 'Ananta admin',
      message: 'If you are reading this, form submissions from the website will now reach this inbox.',
      at: new Date().toLocaleString('en-IN')
    }, { heading: 'Email delivery test' })
  })
  return { ...result, status }
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
