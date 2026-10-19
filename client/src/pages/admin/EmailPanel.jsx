import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, Loader2, Mail, Send, ServerCog } from 'lucide-react'
import { adminGet, adminPost } from '../../lib/api'
import { useToast } from '../../components/Toast'

/**
 * Email delivery panel.
 *
 * Every form on the website is stored in the inbox first, then emailed to the
 * address configured on the server. This screen shows whether that channel is
 * working and lets the admin send a real test email without leaving the portal.
 */
export default function EmailPanel({ supportEmail = 'support@anantainfratechsolutions.com' }) {
  const toast = useToast()
  const [status, setStatus] = useState(null)
  const [target, setTarget] = useState(supportEmail)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)

  const load = useCallback(() => {
    adminGet('/api/admin/notify/status')
      .then((data) => {
        setStatus(data)
        if (data?.mail?.to?.[0]) setTarget(data.mail.to[0])
      })
      .catch((error) => toast.error(error.message))
  }, [toast])

  useEffect(() => { load() }, [load])

  const sendTest = async () => {
    setBusy(true)
    setResult(null)
    try {
      const data = await adminPost('/api/admin/notify/test', { email: target })
      setResult(data)
      if (data?.email?.sent) toast.success(`Test email sent to ${target}. Check the inbox (and spam folder).`)
      else toast.error(data?.email?.reason || 'The email channel is not configured yet.')
      setStatus({ mail: data.mail, status: data.status })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setBusy(false)
    }
  }

  const mail = status?.mail
  const configured = Boolean(mail?.configured)

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <h1>Email delivery</h1>
          <p>
            Every enquiry, application and registration is stored in the inbox below and emailed to your support mailbox.
            Set the SMTP values once and all website forms start arriving in that inbox.
          </p>
        </div>
        <span className={`admin-status-chip ${configured ? '' : 'is-warn'}`}>
          {configured ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
          {configured ? 'Email channel active' : 'Email not configured'}
        </span>
      </div>

      <div className="admin-panels">
        <div className="editor-subsection">
          <h3><ServerCog size={16} /> Current configuration</h3>
          <dl className="admin-guide admin-guide-stacked">
            <div><dt>Status</dt><dd>{configured ? 'SMTP credentials found — form submissions are emailed.' : 'No SMTP credentials — submissions are stored in the inbox only.'}</dd></div>
            <div><dt>Mail server</dt><dd>{mail?.host ? `${mail.host}:${mail.port}${mail.secure ? ' (SSL)' : ' (STARTTLS)'}` : '—'}</dd></div>
            <div><dt>From address</dt><dd>{mail?.from || '—'}</dd></div>
            <div><dt>Delivered to</dt><dd>{(mail?.to || []).join(', ') || '—'}</dd></div>
            <div><dt>Confirmation to sender</dt><dd>{mail?.acknowledgements ? 'Enabled — the visitor gets a short acknowledgement email.' : 'Disabled'}</dd></div>
            <div><dt>Fallback webhook</dt><dd>{status?.status?.webhook?.target || 'Not configured'}</dd></div>
          </dl>
          {!configured && mail?.reason ? <p className="field-hint">{mail.reason}</p> : null}
        </div>

        <div className="editor-subsection">
          <h3><Send size={16} /> Send a test email</h3>
          <p className="field-hint" style={{ marginBottom: '0.8rem' }}>
            This uses exactly the same path as a real enquiry, so if the test arrives, enquiries will too.
          </p>
          <label className="field">
            <span className="field-label">Send to</span>
            <input type="email" value={target} onChange={(event) => setTarget(event.target.value)} placeholder="support@anantainfratechsolutions.com" />
          </label>
          <div className="button-row" style={{ marginTop: '0.8rem' }}>
            <button type="button" className="button button-sm button-acid" disabled={busy} onClick={sendTest}>
              {busy ? <><Loader2 size={14} className="spin" /> Sending…</> : <><Mail size={14} /> Send test email</>}
            </button>
            <button type="button" className="button button-sm button-ghost" onClick={load}>Refresh status</button>
          </div>
          {result ? (
            <div className={`editor-message ${result.email?.sent ? 'is-ok' : 'is-error'}`} style={{ marginTop: '0.9rem' }}>
              {result.email?.sent ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <div>
                <b>{result.email?.sent ? 'Test email accepted by the mail server.' : 'The test email could not be sent.'}</b>
                <p style={{ margin: '4px 0 0', fontSize: 12.4 }}>
                  {result.email?.sent ? `Message id ${result.email.messageId || '—'}` : (result.email?.reason || 'Unknown error')}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="editor-card">
        <div className="editor-card-head">
          <div>
            <h2>How to connect the mailbox</h2>
            <p>Add these values to the <code>.env</code> file in the project root, then restart the server.</p>
          </div>
        </div>
        <pre className="admin-code">{`# Example for a Zoho-hosted support@anantainfratechsolutions.com mailbox
SMTP_HOST=smtp.zoho.in
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=support@anantainfratechsolutions.com
SMTP_PASS=your-mailbox-password-or-app-password
MAIL_FROM=Ananta Infratech Solutions <support@anantainfratechsolutions.com>
MAIL_TO=support@anantainfratechsolutions.com
MAIL_ACK=true`}</pre>
        <ul className="admin-notes">
          <li><b>Gmail / Google Workspace:</b> use an App Password (2-Step Verification must be on) and <code>smtp.gmail.com</code> on port 465.</li>
          <li><b>Zoho Mail:</b> <code>smtp.zoho.in</code> (India) or <code>smtp.zoho.com</code>, port 465, SSL on.</li>
          <li><b>Microsoft 365:</b> <code>smtp.office365.com</code>, port 587, STARTTLS, SMTP AUTH enabled on the mailbox.</li>
          <li><b>Hostinger / cPanel:</b> <code>smtp.hostinger.com</code>, port 465.</li>
          <li>The password is never exposed to the browser — it stays in the server environment.</li>
        </ul>
      </div>
    </div>
  )
}
