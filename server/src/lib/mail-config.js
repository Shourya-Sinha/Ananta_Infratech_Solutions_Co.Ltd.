/**
 * Email configuration, provider presets and failure explanations.
 *
 * Every value comes from the environment, but the environment is read
 * generously: common alternative variable names are accepted, provider presets
 * fill in the server/port/encryption, and if only a mailbox address and
 * password are supplied the mail host is detected from the domain's MX records.
 *
 * This is what turns a silent "email not sent" into a precise diagnosis such as
 * "GoDaddy rejected the password (535) — SMTP Authentication is switched off
 * for this mailbox".
 */
import dns from 'node:dns/promises'

export const DEFAULT_INBOX = 'support@anantainfratechsolutions.com'
export const DEFAULT_FROM_NAME = 'Ananta Infratech Solutions'

/** Accepted spellings for each setting, so a slightly different .env still works. */
const ALIASES = {
  host: ['SMTP_HOST', 'MAIL_HOST', 'EMAIL_HOST', 'SMTP_SERVER'],
  port: ['SMTP_PORT', 'MAIL_PORT', 'EMAIL_PORT', 'SMTP_SERVER_PORT'],
  secure: ['SMTP_SECURE', 'MAIL_SECURE', 'SMTP_SSL'],
  user: ['SMTP_USER', 'SMTP_USERNAME', 'MAIL_USER', 'MAIL_USERNAME', 'EMAIL_USER', 'EMAIL_USERNAME', 'SMTP_LOGIN', 'SMTP_EMAIL'],
  pass: [
    'SMTP_PASS', 'SMTP_PASSWORD', 'SMTP_PWD', 'MAIL_PASS', 'MAIL_PASSWORD', 'MAIL_PWD',
    'EMAIL_PASS', 'EMAIL_PASSWORD', 'EMAIL_PWD', 'SMTP_PASSWORD_APP',
    'MAILBOX_PASSWORD', 'GODADDY_PASSWORD', 'GODADDY_EMAIL_PASSWORD'
  ],
  from: ['MAIL_FROM', 'EMAIL_FROM', 'SMTP_FROM', 'MAIL_FROM_ADDRESS'],
  fromName: ['MAIL_FROM_NAME', 'EMAIL_FROM_NAME'],
  to: ['MAIL_TO', 'EMAIL_TO', 'CONTACT_EMAIL', 'ENQUIRY_EMAIL', 'ENQUIRIES_EMAIL', 'SMTP_TO'],
  replyTo: ['MAIL_REPLY_TO', 'EMAIL_REPLY_TO'],
  ack: ['MAIL_ACK', 'MAIL_ACKNOWLEDGE', 'EMAIL_ACK'],
  provider: ['MAIL_PROVIDER', 'SMTP_PROVIDER', 'EMAIL_PROVIDER'],
  service: ['MAIL_SERVICE', 'SMTP_SERVICE']
}

export function envValue(keys) {
  for (const key of keys) {
    const value = String(process.env[key] ?? '').trim()
    if (value) return { key, value }
  }
  return { key: null, value: '' }
}

const env = (keys) => envValue(keys).value

/** .env lines are occasionally pasted with quotes or trailing comments. */
function clean(value) {
  let out = String(value ?? '').trim()
  if ((out.startsWith('"') && out.endsWith('"')) || (out.startsWith("'") && out.endsWith("'"))) {
    out = out.slice(1, -1).trim()
  }
  return out
}

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || '').trim())

// Only the exact strings that ship as examples count as "not filled in" — a
// real password must never be rejected because it happens to start with "your".
const PLACEHOLDERS = [
  /^changeme$/i,
  /^change[-_ ]?this[-_ ]?password$/i,
  /^change[-_ ]?me$/i,
  /^your[-_ ]?mailbox[-_ ]?password/i,
  /^your[-_ ]?password$/i,
  /^replace[-_ ]?me$/i,
  /^<.*>$/,
  /^x{6,}$/i,
  /^todo$/i,
  /^placeholder$/i
]

const looksLikePlaceholder = (value) => PLACEHOLDERS.some((pattern) => pattern.test(String(value || '').trim()))

/**
 * Known mail providers. `host`/`port`/`secure` are used when the matching
 * values are not set explicitly in the environment.
 */
export const PROVIDER_PRESETS = {
  godaddy: {
    label: 'GoDaddy Workspace Email / Professional Email',
    host: 'smtpout.secureserver.net',
    port: 465,
    secure: true,
    help: 'GoDaddy: smtpout.secureserver.net, port 465, SSL. Username is the full mailbox address.'
  },
  titan: {
    label: 'Titan Email (GoDaddy Professional Email)',
    host: 'smtp.titan.email',
    port: 465,
    secure: true,
    help: 'Titan: smtp.titan.email, port 465, SSL.'
  },
  microsoft365: {
    label: 'Microsoft 365 / Outlook',
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    help: 'Microsoft 365: smtp.office365.com, port 587, STARTTLS. SMTP AUTH must be enabled on the mailbox.'
  },
  gmail: {
    label: 'Gmail / Google Workspace',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    help: 'Google: smtp.gmail.com, port 465, SSL. Requires an App Password when 2-Step Verification is on.'
  },
  zoho: {
    label: 'Zoho Mail',
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    help: 'Zoho: smtp.zoho.in (India), smtp.zoho.com, smtp.zoho.eu or smtp.zoho.com.au, port 465, SSL.'
  },
  'zoho-in': { label: 'Zoho Mail (India)', host: 'smtp.zoho.in', port: 465, secure: true, help: 'Zoho India: smtp.zoho.in, port 465, SSL.' },
  'zoho-eu': { label: 'Zoho Mail (Europe)', host: 'smtp.zoho.eu', port: 465, secure: true, help: 'Zoho EU: smtp.zoho.eu, port 465, SSL.' },
  hostinger: { label: 'Hostinger', host: 'smtp.hostinger.com', port: 465, secure: true, help: 'Hostinger: smtp.hostinger.com, port 465, SSL.' },
  namecheap: { label: 'Namecheap Private Email', host: 'mail.privateemail.com', port: 465, secure: true, help: 'Private Email: mail.privateemail.com, port 465, SSL.' },
  brevo: { label: 'Brevo (Sendinblue)', host: 'smtp-relay.brevo.com', port: 587, secure: false, help: 'Brevo: smtp-relay.brevo.com, port 587, STARTTLS.' },
  sendgrid: { label: 'SendGrid', host: 'smtp.sendgrid.net', port: 587, secure: false, help: 'SendGrid: smtp.sendgrid.net, port 587, STARTTLS.' },
  mailgun: { label: 'Mailgun', host: 'smtp.mailgun.org', port: 587, secure: false, help: 'Mailgun: smtp.mailgun.org, port 587, STARTTLS.' },
  resend: { label: 'Resend', host: 'smtp.resend.com', port: 465, secure: true, help: 'Resend: smtp.resend.com, port 465, SSL.' },
  ses: { label: 'Amazon SES', host: 'email-smtp.ap-south-1.amazonaws.com', port: 465, secure: true, help: 'Amazon SES: email-smtp.<region>.amazonaws.com, port 465, SSL.' }
}

const normaliseProviderKey = (value) => String(value || '').toLowerCase().trim()
  .replace(/[\s_]+/g, '-')
  .replace(/^godaddy-(workspace|email)$/, 'godaddy')
  .replace(/^google(-workspace)?$/, 'gmail')
  .replace(/^office-?365$/, 'microsoft365')
  .replace(/^outlook$/, 'microsoft365')
  .replace(/^microsoft$/, 'microsoft365')

/** Maps an MX host name to a provider preset, used when SMTP_HOST is absent. */
function presetFromMx(mxHosts = []) {
  for (const host of mxHosts) {
    const mx = String(host || '').toLowerCase().replace(/\.$/, '')
    if (/secureserver\.net$/.test(mx)) return { key: 'godaddy', ...PROVIDER_PRESETS.godaddy }
    if (/titan\.email$/.test(mx)) return { key: 'titan', ...PROVIDER_PRESETS.titan }
    if (/zoho\.in$/.test(mx)) return { key: 'zoho-in', ...PROVIDER_PRESETS['zoho-in'] }
    if (/zoho\.com\.au$/.test(mx)) return { key: 'zoho', host: 'smtp.zoho.com.au', port: 465, secure: true, label: 'Zoho Mail (Australia)', help: 'Zoho AU: smtp.zoho.com.au, port 465, SSL.' }
    if (/zoho\.eu$/.test(mx)) return { key: 'zoho-eu', ...PROVIDER_PRESETS['zoho-eu'] }
    if (/zoho\.(com|jp|ca|sa)$/.test(mx)) return { key: 'zoho', ...PROVIDER_PRESETS.zoho }
    if (/(google\.com|googlemail\.com|gmail\.com)$/.test(mx)) return { key: 'gmail', ...PROVIDER_PRESETS.gmail }
    if (/(outlook\.com|office365\.com|protection\.outlook\.com)$/.test(mx)) return { key: 'microsoft365', ...PROVIDER_PRESETS.microsoft365 }
    if (/hostinger\.com$/.test(mx)) return { key: 'hostinger', ...PROVIDER_PRESETS.hostinger }
    if (/privateemail\.com$/.test(mx)) return { key: 'namecheap', ...PROVIDER_PRESETS.namecheap }
    if (/brevo\.com$|sendinblue\.com$/.test(mx)) return { key: 'brevo', ...PROVIDER_PRESETS.brevo }
    if (/sendgrid\.net$/.test(mx)) return { key: 'sendgrid', ...PROVIDER_PRESETS.sendgrid }
    if (/mailgun\.(org|net)$/.test(mx)) return { key: 'mailgun', ...PROVIDER_PRESETS.mailgun }
  }
  return null
}

/** Filled in by `detectMailProvider()` at boot; read synchronously afterwards. */
let detected = null

export const detectionState = () => detected

/**
 * Works out which mail host a mailbox belongs to by reading the domain's MX
 * records. Only runs when neither MAIL_PROVIDER nor SMTP_HOST is set — an
 * explicit setting always wins.
 */
export async function detectMailProvider({ force = false, timeoutMs = 4000 } = {}) {
  if (/^(false|0|no|off)$/i.test(clean(process.env.MAIL_DETECT || ''))) return detected
  if (detected && !force) return detected

  const user = clean(env(ALIASES.user))
  const domain = user.includes('@') ? user.split('@').pop().toLowerCase() : ''
  if (!domain || /^(localhost|example\.(com|org|net))$/i.test(domain)) return detected

  try {
    const records = await Promise.race([
      dns.resolveMx(domain),
      new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error('MX lookup timed out'), { code: 'ETIMEDOUT' })), timeoutMs))
    ])
    const hosts = (records || []).sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0)).map((row) => row.exchange)
    const preset = presetFromMx(hosts)
    detected = preset
      ? { ...preset, source: 'mx', domain, mx: hosts, at: new Date().toISOString() }
      : { key: null, source: 'mx-unknown', domain, mx: hosts, at: new Date().toISOString() }
  } catch (error) {
    detected = { key: null, source: 'mx-failed', domain, error: error.code || error.message, at: new Date().toISOString() }
  }
  return detected
}

/** Test helper — clears a detected provider between runs. */
export function resetDetectedProvider() { detected = null }

function parseAddress(value) {
  const raw = clean(value)
  if (!raw) return ''
  const angled = raw.match(/<([^>]+)>/)
  return (angled ? angled[1] : raw).trim()
}

function parseAddressList(value) {
  return String(value || '')
    .split(',')
    .map(parseAddress)
    .filter(Boolean)
}

function normalisePort(value, fallback) {
  const port = Number(String(value || '').trim())
  return Number.isFinite(port) && port > 0 && port <= 65535 ? port : fallback
}

/**
 * Resolves the complete mail configuration plus any problems and warnings.
 * Never returns the password outside `pass` — callers must not serialise it.
 */
export function mailConfig() {
  const hostEnv = envValue(ALIASES.host)
  const portEnv = envValue(ALIASES.port)
  const secureEnv = envValue(ALIASES.secure)
  const userEnv = envValue(ALIASES.user)
  const passEnv = envValue(ALIASES.pass)
  const providerEnv = envValue(ALIASES.provider)
  const serviceEnv = envValue(ALIASES.service)

  const problems = []
  const warnings = []

  const providerKey = normaliseProviderKey(providerEnv.value)
  const explicitPreset = providerKey ? (PROVIDER_PRESETS[providerKey] || null) : null
  // A detected provider only supplies defaults; it never overrides SMTP_HOST.
  const preset = explicitPreset || (!hostEnv.value && detected?.host ? detected : null)

  if (providerKey && !preset) {
    warnings.push({
      code: 'unknown-provider',
      message: `MAIL_PROVIDER="${providerEnv.value}" is not a known preset.`,
      hint: `Use one of: ${Object.keys(PROVIDER_PRESETS).join(', ')} — or set SMTP_HOST directly.`
    })
  }

  const user = clean(userEnv.value)
  const pass = clean(passEnv.value)
  const host = clean(hostEnv.value) || preset?.host || ''

  /** The provider that owns a given outgoing host — used for the right advice. */
  const providerFromHost = (value) => {
    const target = String(value || '').toLowerCase()
    if (/secureserver\.net$|titan\.email$/.test(target)) return 'godaddy'
    if (/gmail\.com$|googlemail\.com$/.test(target)) return 'gmail'
    if (/office365\.com$|outlook\.com$/.test(target)) return 'microsoft365'
    if (/zoho\.(in|com|eu|com\.au)$/.test(target)) return target.includes('zoho.in') ? 'zoho-in' : 'zoho'
    if (/hostinger\.com$/.test(target)) return 'hostinger'
    if (/privateemail\.com$/.test(target)) return 'namecheap'
    return null
  }
  const effectiveProvider = preset?.key || providerKey || providerFromHost(host) || null
  let port = normalisePort(portEnv.value, preset?.port || (secureEnv.value === 'false' ? 587 : 465))
  let secure = preset?.secure ?? port === 465
  if (secureEnv.value) secure = /^(true|1|yes|on|ssl|tls)$/i.test(secureEnv.value)

  // Port and encryption must agree: 465 is implicit TLS, 587/25 are plain + STARTTLS.
  if (port === 465 && !secure) {
    warnings.push({ code: 'secure-corrected', message: 'Port 465 always uses SSL, so SMTP_SECURE was read as true.', hint: 'Set SMTP_SECURE=true with port 465, or use port 587 with SMTP_SECURE=false.' })
    secure = true
  }
  if (port !== 465 && secure) {
    warnings.push({ code: 'secure-corrected', message: `Port ${port} uses STARTTLS, not implicit SSL — SMTP_SECURE was read as false.`, hint: `Use port 465 with SMTP_SECURE=true, or port ${port} with SMTP_SECURE=false.` })
    secure = false
  }

  const fromRaw = clean(env(ALIASES.from))
  const fromAddress = parseAddress(fromRaw) || user || DEFAULT_INBOX
  const fromName = clean(env(ALIASES.fromName)) || DEFAULT_FROM_NAME
  const from = /<[^>]+>/.test(fromRaw) ? fromRaw : `${fromName} <${fromAddress}>`

  const to = parseAddressList(env(ALIASES.to)).length ? parseAddressList(env(ALIASES.to)) : [DEFAULT_INBOX]
  const replyTo = parseAddress(env(ALIASES.replyTo))

  // ------------------------------------------------------------ validation
  if (!host) {
    problems.push({
      code: 'missing-host',
      message: 'No mail server is configured.',
      hint: 'Set MAIL_PROVIDER=godaddy (for a GoDaddy mailbox) or SMTP_HOST=smtpout.secureserver.net. Alternatively set SMTP_USER to the mailbox address and the host is detected from the domain automatically.'
    })
  }
  if (!user) {
    problems.push({ code: 'missing-user', message: 'No SMTP username is configured.', hint: 'Set SMTP_USER to the full mailbox address, e.g. support@anantainfratechsolutions.com.' })
  } else if (!isEmail(user)) {
    problems.push({ code: 'bad-user', message: `SMTP_USER "${user}" is not an email address.`, hint: 'GoDaddy, Titan, Google and Microsoft all expect the full mailbox address as the username.' })
  }
  if (!pass) {
    problems.push({ code: 'missing-pass', message: 'No SMTP password is configured.', hint: `Set SMTP_PASS to the mailbox password${user ? ` for ${user}` : ''} — for GoDaddy that is the password used at webmail, not the password for the GoDaddy account itself.` })
  } else if (looksLikePlaceholder(pass)) {
    problems.push({ code: 'placeholder-pass', message: 'SMTP_PASS still contains the example placeholder text.', hint: 'Replace it with the real mailbox password. If the value contains spaces, wrap it in quotes ("...").' })
  } else if (pass.length < 6) {
    warnings.push({ code: 'short-pass', message: 'SMTP_PASS looks unusually short — double-check it was copied in full.', hint: 'Re-copy the password from the GoDaddy mailbox settings.' })
  }

  if (isEmail(fromAddress) && isEmail(user) && fromAddress.split('@').pop().toLowerCase() !== user.split('@').pop().toLowerCase()) {
    warnings.push({
      code: 'from-domain-mismatch',
      message: `MAIL_FROM uses @${fromAddress.split('@').pop()} but the mailbox signs in as @${user.split('@').pop()}.`,
      hint: 'GoDaddy, Titan, Google and Microsoft reject a From address on another domain. Set MAIL_FROM to the authenticated mailbox, or add the domain as a verified sender/alias.'
    })
  }
  if (!isEmail(fromAddress)) {
    problems.push({ code: 'bad-from', message: `MAIL_FROM "${fromRaw}" does not contain a valid email address.`, hint: 'Use the form: Ananta Infratech Solutions <support@anantainfratechsolutions.com>' })
  }
  if (to.some((address) => !isEmail(address))) {
    problems.push({ code: 'bad-to', message: 'MAIL_TO contains an invalid address.', hint: 'MAIL_TO takes one or more plain email addresses separated by commas.' })
  }

  // Gmail displays app passwords in groups of four; spaces are not part of it.
  const isGoogle = providerKey === 'gmail' || /gmail\.com$/i.test(host)
  const effectivePass = isGoogle ? pass.replace(/\s+/g, '') : pass

  // Cross-check an explicitly configured host against where the domain's mail
  // actually lives. This catches the most common failure of all: the SMTP host
  // copied from an example for a different provider.
  if (detected?.host && detected.source === 'mx' && host && detected.host.toLowerCase() !== host.toLowerCase()) {
    warnings.push({
      code: 'host-mx-mismatch',
      message: `Mail for ${detected.domain} is hosted by ${detected.label}, but this server sends through ${host}.`,
      hint: `Unless you deliberately send through a relay, use MAIL_PROVIDER=${detected.key} (or SMTP_HOST=${detected.host}, port ${detected.port}).`
    })
  }

  if (!serviceEnv.value) {
    const commonMistakes = {
      'smtp.godaddy.com': 'smtpout.secureserver.net',
      'smtp.secureserver.net': 'smtpout.secureserver.net',
      'mail.anantainfratechsolutions.com': 'smtpout.secureserver.net',
      'smtp.anantainfratechsolutions.com': 'smtpout.secureserver.net'
    }
    if (commonMistakes[host.toLowerCase()]) {
      warnings.push({
        code: 'suspect-host',
        message: `SMTP_HOST=${host} is not the GoDaddy outgoing server.`,
        hint: `Use ${commonMistakes[host.toLowerCase()]} on port 465 with SSL, or simply set MAIL_PROVIDER=godaddy.`
      })
    }
  }

  const configured = problems.length === 0
  const source = hostEnv.value ? 'env'
    : providerEnv.value && PROVIDER_PRESETS[providerKey] ? 'provider'
      : detected?.host ? 'detected' : 'none'

  return {
    configured,
    provider: effectiveProvider,
    providerLabel: preset?.label || (providerKey ? providerKey : null) || PROVIDER_PRESETS[effectiveProvider]?.label || null,
    source,
    detection: detected || null,
    host,
    port,
    secure,
    service: clean(serviceEnv.value),
    user,
    pass: effectivePass,
    passwordSet: Boolean(pass),
    passwordPlaceholder: Boolean(pass) && looksLikePlaceholder(pass),
    from,
    fromAddress,
    replyTo,
    to,
    ack: /^(true|1|yes|on)$/i.test(env(ALIASES.ack)),
    allowInvalidCert: /^(true|1|yes|on)$/i.test(env(['SMTP_ALLOW_INVALID_CERT'])),
    debug: /^(true|1|yes|on)$/i.test(env(['SMTP_DEBUG', 'MAIL_DEBUG'])),
    problems,
    warnings,
    variables: {
      host: hostEnv.key, port: portEnv.key, secure: secureEnv.key, user: userEnv.key,
      pass: passEnv.key, from: envValue(ALIASES.from).key, to: envValue(ALIASES.to).key,
      provider: providerEnv.key
    }
  }
}

/** Public (safe to serialise) view of the configuration. */
export function publicMailConfig() {
  const config = mailConfig()
  return {
    configured: config.configured,
    provider: config.provider,
    providerLabel: config.providerLabel,
    source: config.source,
    detection: config.detection,
    host: config.host || null,
    port: config.configured ? config.port : config.host ? config.port : null,
    secure: config.secure,
    user: config.user || null,
    passwordSet: config.passwordSet,
    from: config.configured ? config.from : null,
    replyTo: config.replyTo || null,
    to: config.to,
    acknowledgements: config.ack,
    problems: config.problems,
    warnings: config.warnings,
    variables: config.variables
  }
}

/**
 * Turns a Nodemailer/SMTP error into a code, a plain-language message and the
 * exact thing to change. This is what the admin "Email delivery" screen shows.
 */
export function explainSmtpError(error, config = mailConfig()) {
  const code = String(error?.code || '').toUpperCase()
  const responseCode = Number(error?.responseCode || error?.response?.statusCode || 0) || null
  const raw = String(error?.message || 'Unknown error')
  const provider = config.provider || ''
  const goDaddy = provider === 'godaddy' || provider === 'titan' || /secureserver\.net|titan\.email/i.test(config.host || '')
  const google = provider === 'gmail' || /gmail\.com/i.test(config.host || '')
  const microsoft = provider === 'microsoft365' || /office365\.com/i.test(config.host || '')

  const authHint = goDaddy
    ? 'GoDaddy rejected the sign-in. 1) Use the mailbox password from GoDaddy webmail — not the password for your GoDaddy account. 2) Switch on SMTP Authentication: GoDaddy Email & Office dashboard → Manage (next to the mailbox) → Advanced Settings → SMTP Authentication. 3) The username must be the full address, e.g. support@anantainfratechsolutions.com.'
    : google
      ? 'Google rejected the sign-in. Turn on 2-Step Verification and create a 16-character App Password (Google Account → Security → App passwords), then use that as SMTP_PASS.'
      : microsoft
        ? 'Microsoft rejected the sign-in. Enable SMTP AUTH for the mailbox (Microsoft 365 admin centre → Active users → Mail → Manage email apps → Authenticated SMTP) and use an app password if MFA is on.'
        : 'Check SMTP_USER and SMTP_PASS, and make sure SMTP authentication ("outgoing server requires authentication") is switched on for this mailbox.'

  let out
  if (code === 'EAUTH' || [530, 534, 535, 538].includes(responseCode)) {
    out = {
      code: code || 'EAUTH', responseCode, retryable: false,
      message: responseCode === 535 ? 'The mailbox rejected the username or password (535).' : `Authentication failed (${responseCode || code || 'EAUTH'}).`,
      hint: authHint
    }
  } else if (code === 'EDNS' || code === 'ENOTFOUND' || /getaddrinfo|EAI_AGAIN/i.test(raw)) {
    out = {
      code: code || 'ENOTFOUND', responseCode, retryable: false,
      message: `The mail server "${config.host || 'unknown'}" could not be found.`,
      hint: goDaddy
        ? 'GoDaddy mailboxes send through smtpout.secureserver.net. Set SMTP_HOST=smtpout.secureserver.net or MAIL_PROVIDER=godaddy and restart the server.'
        : 'Check SMTP_HOST for a typo. It should be the outgoing mail server of your email provider, not your website domain.'
    }
  } else if (/ETIMEDOUT|ECONNECTION|ECONNREFUSED|ESOCKET|EHOSTUNREACH|ENETUNREACH/i.test(code) || /timeout|timed out/i.test(raw)) {
    out = {
      code: code || 'ETIMEDOUT', responseCode, retryable: true,
      message: `Could not connect to ${config.host || 'the mail server'}:${config.port} (${code || 'timeout'}).`,
      hint: 'Ports 25, 465 and 587 are blocked on many cloud hosts (Render free instances, Railway trials and most serverless platforms) and by some office firewalls. Try port 587 with SMTP_SECURE=false, or move the app to a host that allows outbound SMTP.'
    }
  } else if (code === 'ECONNRESET' && /secure TLS|handshake/i.test(raw)) {
    out = {
      code: 'ECONNRESET', responseCode, retryable: true,
      message: `The TLS handshake with ${config.host}:${config.port} was reset by the network.`,
      hint: 'The port answered but the encrypted connection was dropped. That is usually a hosting firewall blocking outbound SMTP, or the mail provider refusing this server IP. Try port 587 with SMTP_SECURE=false, whitelist the server IP with the mail provider, or send through a relay/secondary mailbox.'
    }
  } else if (code === 'ETLS' || /certificate|SSL|wrong version number|handshake|secure TLS/i.test(raw)) {
    out = {
      code: code || 'ETLS', responseCode, retryable: false,
      message: 'The secure connection to the mail server could not be established.',
      hint: config.port === 465
        ? 'Port 465 uses SSL: set SMTP_SECURE=true. If your host blocks 465, try port 587 with SMTP_SECURE=false.'
        : 'Port 587 uses STARTTLS: set SMTP_SECURE=false. If your provider only offers SSL, use port 465 with SMTP_SECURE=true.'
    }
  } else if ([550, 551, 553].includes(responseCode) || code === 'EENVELOPE') {
    out = {
      code: code || 'EENVELOPE', responseCode, retryable: false,
      message: `The mail server refused the sender or recipient (${responseCode || 'EENVELOPE'}).`,
      hint: `MAIL_FROM must be the authenticated mailbox (${config.user || 'your SMTP_USER'}). Check MAIL_TO (${(config.to || []).join(', ') || 'unset'}) is a real mailbox that accepts mail.`
    }
  } else if ([552, 554].includes(responseCode)) {
    out = {
      code: code || 'EREJECTED', responseCode, retryable: false,
      message: `The mail server rejected the message (${responseCode}).`,
      hint: 'Usually a spam/SPF/DKIM rejection or a full mailbox. Send from the mailbox address itself, keep SPF and DKIM switched on at GoDaddy, and check the destination mailbox has space.'
    }
  } else if ([421, 450, 451, 452].includes(responseCode)) {
    out = {
      code: code || 'ETEMP', responseCode, retryable: true,
      message: `The mail server asked us to try again later (${responseCode}).`,
      hint: 'Usually a rate limit or greylisting. The enquiry is stored in the inbox and will be retried automatically.'
    }
  } else {
    out = {
      code: code || 'EMAILFAILED', responseCode, retryable: true,
      message: raw,
      hint: 'Open Admin → Email delivery and run the connection test for a step-by-step diagnosis.'
    }
  }
  return out
}
