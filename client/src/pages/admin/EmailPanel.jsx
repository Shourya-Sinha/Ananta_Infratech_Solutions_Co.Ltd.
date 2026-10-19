import { useCallback, useEffect, useState } from 'react'
import {
  AlertTriangle, CheckCircle2, Inbox, Loader2, Mail, MinusCircle, RefreshCw,
  Send, ServerCog, XCircle
} from 'lucide-react'
import { adminGet, adminPost } from '../../lib/api'
import { useToast } from '../../components/Toast'

/**
 * Email delivery panel.
 *
 * Every form on the website is stored in the inbox first, then emailed to the
 * address configured on the server. This screen proves whether that channel is
 * working — configuration, DNS, TCP, TLS, sign-in and a real test message — and
 * shows exactly what to change when it is not.
 */
const STEP_ICON = { pass: CheckCircle2, fail: XCircle, warn: AlertTriangle, skip: MinusCircle }

function StepList({ steps }) {
  if (!steps?.length) return null
  return (
    <ol className="mail-steps">
      {steps.map((item, index) => {
        const Icon = STEP_ICON[item.status] || MinusCircle
        return (
          <li key={`${item.id}-${index}`} className={`mail-step is-${item.status}`}>
            <Icon size={15} />
            <div>
              <b>{item.label}</b>
              {item.detail ? <p>{item.detail}</p> : null}
              {item.hint && item.status !== 'pass' ? <p className="mail-step-hint">{item.hint}</p> : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default function EmailPanel({ supportEmail = 'support@anantainfratechsolutions.com' }) {
  const toast = useToast()
  const [status, setStatus] = useState(null)
  const [target, setTarget] = useState(supportEmail)
  const [busy, setBusy] = useState('')
  const [result, setResult] = useState(null)
  const [steps, setSteps] = useState(null)
  const [outbox, setOutbox] = useState(null)

  const load = useCallback(() => {
    adminGet('/api/admin/notify/status')
      .then((data) => {
        setStatus(data)
        setOutbox(data?.outbox || null)
        if (data?.mail?.to?.[0]) setTarget(data.mail.to[0])
      })
      .catch((error) => toast.error(error.message))
  }, [toast])

  useEffect(() => { load() }, [load])

  const sendTest = async () => {
    setBusy('test')
    setResult(null)
    setSteps(null)
    try {
      const data = await adminPost('/api/admin/notify/test', { email: target })
      setResult(data)
      setSteps(data?.diagnostics?.steps || null)
      if (data?.email?.sent) toast.success(`Test email sent to ${target}. Check the inbox (and spam folder).`)
      else toast.error(data?.email?.reason || 'The email channel is not configured yet.')
      setStatus({ mail: data.mail, status: data.status })
      setOutbox(data?.outbox || null)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setBusy('')
    }
  }

  const runCheck = async () => {
    setBusy('check')
    setSteps(null)
    try {
      const data = await adminPost('/api/admin/notify/diagnose', { email: target, send: false })
      setSteps(data?.steps || null)
      if (data?.ok) toast.success('The mail channel is working — the mailbox accepted the sign-in.')
      else toast.error(data?.summary || 'The mail channel could not be verified.')
      setOutbox(data?.outbox || null)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setBusy('')
    }
  }

  const retryQueue = async () => {
    setBusy('queue')
    try {
      const data = await adminPost('/api/admin/notify/outbox/retry', {})
      setOutbox(data?.outbox || null)
      const report = data?.report
      if (report?.sent) toast.success(`${report.sent} queued ${report.sent === 1 ? 'enquiry' : 'enquiries'} delivered. ${report.remaining || 0} still waiting.`)
      else toast.error(report?.failed ? `Still failing — open the connection check for the reason.` : 'Nothing was waiting to be sent.')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setBusy('')
    }
  }

  const mail = status?.mail
  const configured = Boolean(mail?.configured)
  const problems = mail?.problems || []
  const warnings = mail?.warnings || []
  const pending = outbox?.pending || 0

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <h1>Email delivery</h1>
          <p>
            Every enquiry, application and registration is stored in the inbox below and emailed to your support mailbox.
            This screen shows whether that email actually left the building — and, when it did not, exactly what to fix.
          </p>
        </div>
        <span className={`admin-status-chip ${configured && !problems.length ? '' : 'is-warn'}`}>
          {configured && !problems.length ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
          {configured && !problems.length ? 'Email channel active' : 'Not delivering'}
        </span>
      </div>

      {!configured ? (
        <div className="editor-message is-error" style={{ marginBottom: '1.2rem' }}>
          <AlertTriangle size={16} />
          <div>
            <b>Enquiries are being saved, but no email is being sent.</b>
            <p style={{ margin: '4px 0 0', fontSize: 12.6 }}>
              The website shows the visitor a reference number either way, so this screen is the only place the failure is visible.
              Fix the items below and send a test email before relying on the inbox.
            </p>
          </div>
        </div>
      ) : null}

      {problems.length ? (
        <div className="mail-alerts">
          {problems.map((problem) => (
            <div key={problem.code} className="editor-message is-error">
              <AlertTriangle size={16} />
              <div><b>{problem.message}</b>{problem.hint ? <p style={{ margin: '4px 0 0', fontSize: 12.4 }}>{problem.hint}</p> : null}</div>
            </div>
          ))}
        </div>
      ) : null}

      {warnings.length ? (
        <div className="mail-alerts">
          {warnings.map((warning) => (
            <div key={warning.code} className="editor-message">
              <AlertTriangle size={16} />
              <div><b>{warning.message}</b>{warning.hint ? <p style={{ margin: '4px 0 0', fontSize: 12.4 }}>{warning.hint}</p> : null}</div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="admin-panels">
        <div className="editor-subsection">
          <h3><ServerCog size={16} /> Current configuration</h3>
          <dl className="admin-guide admin-guide-stacked">
            <div><dt>Provider</dt><dd>{mail?.providerLabel || mail?.provider || 'Not detected'}</dd></div>
            <div><dt>Mail server</dt><dd>{mail?.host ? `${mail.host}:${mail.port}${mail.secure ? ' (SSL)' : ' (STARTTLS)'}` : '—'}</dd></div>
            <div><dt>Signs in as</dt><dd>{mail?.user || '—'}</dd></div>
            <div><dt>From address</dt><dd>{mail?.from || '—'}</dd></div>
            <div><dt>Delivered to</dt><dd>{(mail?.to || []).join(', ') || '—'}</dd></div>
            <div><dt>Confirmation to sender</dt><dd>{mail?.acknowledgements ? 'Enabled — the visitor gets a short acknowledgement email.' : 'Disabled'}</dd></div>
            <div><dt>Fallback webhook</dt><dd>{status?.status?.webhook?.target || 'Not configured'}</dd></div>
          </dl>
          {mail?.source === 'detected' ? (
            <p className="field-hint">
              The mail server was detected automatically from your domain's MX records, so setting only <code>SMTP_USER</code> and <code>SMTP_PASS</code> is enough.
            </p>
          ) : null}
          {!configured && mail?.reason ? <p className="field-hint">{mail.reason}</p> : null}
        </div>

        <div className="editor-subsection">
          <h3><Send size={16} /> Prove it works</h3>
          <p className="field-hint" style={{ marginBottom: '0.8rem' }}>
            The connection check tests DNS, the port, encryption and the mailbox password — then sends one real message.
            It uses exactly the same path as a live enquiry.
          </p>
          <label className="field">
            <span className="field-label">Send to</span>
            <input type="email" value={target} onChange={(event) => setTarget(event.target.value)} placeholder="support@anantainfratechsolutions.com" />
          </label>
          <div className="button-row" style={{ marginTop: '0.8rem' }}>
            <button type="button" className="button button-sm button-acid" disabled={Boolean(busy)} onClick={sendTest}>
              {busy === 'test' ? <><Loader2 size={14} className="spin" /> Sending…</> : <><Mail size={14} /> Send test email</>}
            </button>
            <button type="button" className="button button-sm button-ghost" disabled={Boolean(busy)} onClick={runCheck}>
              {busy === 'check' ? <><Loader2 size={14} className="spin" /> Checking…</> : <><ServerCog size={14} /> Run connection check</>}
            </button>
            <button type="button" className="button button-sm button-ghost" onClick={load}><RefreshCw size={14} /> Refresh</button>
          </div>

          {result && !result.email?.sent ? (
            <div className="editor-message is-error" style={{ marginTop: '0.9rem' }}>
              <AlertTriangle size={16} />
              <div>
                <b>The test email could not be sent.</b>
                <p style={{ margin: '4px 0 0', fontSize: 12.4 }}>{result.email?.reason || 'Unknown error'}</p>
              </div>
            </div>
          ) : null}

          <StepList steps={steps} />
        </div>
      </div>

      <div className="editor-subsection" style={{ marginTop: '1.2rem' }}>
        <h3>
          <Inbox size={16} /> Waiting to be emailed{' '}
          {pending ? <span className="tag tag-warning">{pending} queued</span> : null}
          {outbox?.paused ? <span className="tag tag-warning">{outbox.paused} waiting for a fix</span> : null}
        </h3>
        <p className="field-hint">
          If a send fails, the enquiry is kept here and retried automatically every few minutes — nothing is thrown away while the mailbox is fixed.
          {outbox?.oldest ? ` Oldest waiting since ${new Date(outbox.oldest).toLocaleString('en-IN')}.` : ''}
        </p>
        {outbox?.entries?.length ? (
          <ul className="mail-queue">
            {outbox.entries.map((entry) => (
              <li key={entry.id}>
                <b>{entry.reference || entry.subject}</b>
                <span>
                  {entry.paused
                    ? `waiting for a fix · ${entry.lastError || 'not sent'}`
                    : `${entry.attempts} attempt${entry.attempts === 1 ? '' : 's'} · ${entry.lastError || 'waiting'}`}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="field-hint" style={{ marginTop: '0.5rem' }}>Nothing is waiting — every enquiry that could be emailed has been.</p>
        )}
        <div className="button-row" style={{ marginTop: '0.8rem' }}>
          <button type="button" className="button button-sm button-ghost" disabled={Boolean(busy) || !pending} onClick={retryQueue}>
            {busy === 'queue' ? <><Loader2 size={14} className="spin" /> Retrying…</> : <><RefreshCw size={14} /> Retry queued enquiries</>}
          </button>
        </div>
      </div>

      <div className="editor-card">
        <div className="editor-card-head">
          <div>
            <h2>GoDaddy mailbox? Provider, username, password</h2>
            <p>Add these values to the <code>.env</code> file in the project root, then restart the server.</p>
          </div>
        </div>
        <pre className="admin-code">{`# GoDaddy Workspace Email / Professional Email
MAIL_PROVIDER=godaddy
SMTP_USER=support@anantainfratechsolutions.com
SMTP_PASS="the mailbox password"
MAIL_FROM=Ananta Infratech Solutions <support@anantainfratechsolutions.com>
MAIL_TO=support@anantainfratechsolutions.com
MAIL_ACK=true`}</pre>
        <ul className="admin-notes">
          <li><b>GoDaddy:</b> server <code>smtpout.secureserver.net</code>, port <code>465</code>, SSL. The username is the full mailbox address.</li>
          <li><b>Turn on SMTP Authentication.</b> GoDaddy Email &amp; Office dashboard → <i>Manage</i> next to the mailbox → <i>Advanced Settings</i> → enable <b>SMTP Authentication</b>. Without this, GoDaddy answers every sign-in with error <code>535</code>.</li>
          <li><b>Use the mailbox password</b> — the one you use to sign in to GoDaddy webmail, not your GoDaddy account password.</li>
          <li><b>Gmail / Google Workspace:</b> use an App Password (2-Step Verification must be on) and <code>smtp.gmail.com</code> on port 465.</li>
          <li><b>Zoho Mail:</b> <code>smtp.zoho.in</code> (India) or <code>smtp.zoho.com</code>, port 465, SSL on.</li>
          <li><b>Microsoft 365:</b> <code>smtp.office365.com</code>, port 587, STARTTLS, SMTP AUTH enabled on the mailbox.</li>
          <li><b>Hostinger / cPanel:</b> <code>smtp.hostinger.com</code>, port 465.</li>
          <li>Some hosting platforms block outbound ports 25/465/587 — the connection check will say so. The password is never exposed to the browser; it stays in the server environment.</li>
        </ul>
      </div>
    </div>
  )
}
