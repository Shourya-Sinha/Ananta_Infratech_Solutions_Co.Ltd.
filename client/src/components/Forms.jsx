import { useMemo, useState } from 'react'
import { Check, CheckCircle2, Loader2, Send } from 'lucide-react'
import { postJson } from '../lib/api'

/* --------------------------------------------------------------- helpers */

/** Small hook that standardises submitting, error and success states. */
export function useSubmit(endpoint, { onSuccess } = {}) {
  const [state, setState] = useState({ busy: false, message: '', error: false, reference: '' })

  const submit = async (payload) => {
    setState({ busy: true, message: '', error: false, reference: '' })
    try {
      const data = await postJson(endpoint, payload)
      setState({ busy: false, message: data.message || 'Thank you — your message is with our team.', error: false, reference: data.reference || '' })
      onSuccess?.(data)
      return data
    } catch (error) {
      setState({ busy: false, message: error.message || 'We could not send that. Please try again.', error: true, reference: '' })
      return null
    }
  }

  const reset = () => setState({ busy: false, message: '', error: false, reference: '' })
  return { ...state, submit, reset }
}

export function FormStatus({ message, error, reference }) {
  if (!message) return null
  return (
    <p className={`form-message ${error ? 'is-error' : ''}`}>
      {error ? null : <CheckCircle2 size={17} />}
      <span>
        {message}
        {reference ? <b style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: 11.4, marginTop: 4 }}>Reference {reference}</b> : null}
      </span>
    </p>
  )
}

function SubmitButton({ busy, label, busyLabel = 'Sending…' }) {
  return (
    <button className="button submit-button" type="submit" disabled={busy}>
      {busy ? <><Loader2 size={16} className="spin" /> {busyLabel}</> : <>{label} <Send size={15} /></>}
    </button>
  )
}

function Consent({ checked, onChange, children }) {
  return (
    <label className="checkbox-field form-full">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} required />
      <span>{children}</span>
    </label>
  )
}

/** Multi-select chip group used for trades and packages. */
export function ChipSelect({ options = [], value = [], onChange, max }) {
  const toggle = (option) => {
    const has = value.includes(option)
    if (has) return onChange(value.filter((item) => item !== option))
    if (max && value.length >= max) return onChange([...value.slice(1), option])
    onChange([...value, option])
  }
  return (
    <div className="chip-group">
      {options.map((option) => {
        const selected = value.includes(option)
        return (
          <button type="button" key={option} className={`chip ${selected ? 'is-selected' : ''}`} onClick={() => toggle(option)} aria-pressed={selected}>
            {selected ? <Check size={13} /> : null}
            {option}
          </button>
        )
      })}
    </div>
  )
}

/* ---------------------------------------------------------------- contact */

export function ContactForm({ departments = [], defaultDepartment = '' }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', city: '', department: defaultDepartment, interest: '', message: '', consent: false })
  const { busy, message, error, reference, submit } = useSubmit('/api/contact', {
    onSuccess: () => setForm({ name: '', email: '', phone: '', company: '', city: '', department: defaultDepartment, interest: '', message: '', consent: false })
  })

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const onSubmit = (event) => { event.preventDefault(); submit({ ...form, source: 'contact-page' }) }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <label>Your name<input required name="name" value={form.name} onChange={change} placeholder="Full name" /></label>
      <label>Work email<input required type="email" name="email" value={form.email} onChange={change} placeholder="you@company.com" /></label>
      <label>Phone number<input name="phone" value={form.phone} onChange={change} placeholder="+91 …" /></label>
      <label>Company / organisation<input name="company" value={form.company} onChange={change} placeholder="Optional" /></label>
      <label>City<input name="city" value={form.city} onChange={change} placeholder="Project location" /></label>
      <label>
        Route my enquiry to
        <select name="department" value={form.department} onChange={change}>
          <option value="">Choose a team</option>
          {departments.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
      </label>
      <label className="form-full">
        What can we help build?
        <textarea required name="message" rows="5" value={form.message} onChange={change} placeholder="A little about your project, site, timeline and what you need from a partner…" />
      </label>
      <Consent checked={form.consent} onChange={(value) => setForm({ ...form, consent: value })}>
        I agree that Ananta Infratech Solutions may store and use these details to respond to my enquiry, as described in the privacy policy.
      </Consent>
      <SubmitButton busy={busy} label="Send enquiry" />
      <FormStatus message={message} error={error} reference={reference} />
    </form>
  )
}

/* ----------------------------------------------------------------- careers */

const EXPERIENCE_BANDS = ['0 – 2 years', '2 – 5 years', '5 – 10 years', '10 – 15 years', '15+ years']
const NOTICE_PERIODS = ['Immediate', '15 days', '30 days', '60 days', '90 days']

export function CareerForm({ role = '', jobId = '', department = '', compact = false, roles = [] }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', role, jobId, department, city: '',
    experience: '', currentCtc: '', expectedCtc: '', noticePeriod: '', cv: '', portfolio: '', message: '', consent: false
  })
  const { busy, message, error, reference, submit } = useSubmit('/api/careers', {
    onSuccess: () => setForm((current) => ({ ...current, name: '', email: '', phone: '', currentCtc: '', expectedCtc: '', message: '', cv: '', portfolio: '', consent: false }))
  })

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const onSubmit = (event) => { event.preventDefault(); submit({ ...form, source: jobId ? `job-${jobId}` : 'careers-page' }) }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <label>Your name<input required name="name" value={form.name} onChange={change} placeholder="Full name" /></label>
      <label>Email<input required type="email" name="email" value={form.email} onChange={change} placeholder="you@email.com" /></label>
      <label>Phone<input name="phone" value={form.phone} onChange={change} placeholder="+91 …" /></label>
      <label>Current city<input name="city" value={form.city} onChange={change} placeholder="Where are you based?" /></label>
      <label className="form-full">
        Role you are applying for
        {roles.length && !jobId ? (
          <select required name="role" value={form.role} onChange={change}>
            <option value="">Select a role</option>
            {roles.map((item) => <option key={item.id} value={item.title}>{item.title}</option>)}
            <option value="Speculative application">Something else — speculative application</option>
          </select>
        ) : (
          <input required name="role" value={form.role} onChange={change} placeholder="Role you are interested in" />
        )}
      </label>
      <label>
        Total experience
        <select name="experience" value={form.experience} onChange={change}>
          <option value="">Select</option>
          {EXPERIENCE_BANDS.map((band) => <option key={band} value={band}>{band}</option>)}
        </select>
      </label>
      <label>Current CTC<input name="currentCtc" value={form.currentCtc} onChange={change} placeholder="₹ per annum" /></label>
      <label>Expected CTC<input name="expectedCtc" value={form.expectedCtc} onChange={change} placeholder="₹ per annum" /></label>
      <label>
        Notice period
        <select name="noticePeriod" value={form.noticePeriod} onChange={change}>
          <option value="">Select</option>
          {NOTICE_PERIODS.map((period) => <option key={period} value={period}>{period}</option>)}
        </select>
      </label>
      <label>Portfolio / CV link<input type="url" name="cv" value={form.cv} onChange={change} placeholder="https://drive.google.com/…" /></label>
      <label>LinkedIn profile<input type="url" name="portfolio" value={form.portfolio} onChange={change} placeholder="https://linkedin.com/in/…" /></label>
      {!compact ? (
        <label className="form-full">
          A note for our team
          <textarea name="message" rows="4" value={form.message} onChange={change} placeholder="What do you want to build with us? Anything we should know about your experience?" />
        </label>
      ) : null}
      <Consent checked={form.consent} onChange={(value) => setForm({ ...form, consent: value })}>
        I confirm the information above is accurate and agree to Ananta storing it for recruitment purposes.
      </Consent>
      <SubmitButton busy={busy} label="Submit application" />
      <FormStatus message={message} error={error} reference={reference} />
    </form>
  )
}

/* --------------------------------------- contractor & worker registration */

export function RegisterForm({ type, config, sources = [] }) {
  const isContractor = type === 'contractor'

  const initial = useMemo(() => (isContractor
    ? { type: 'contractor', company: '', name: '', email: '', phone: '', city: '', state: '', trades: [], scale: '', gst: '', pan: '', licences: '', employees: '', regions: [], pastWork: '', message: '', consent: false }
    : { type: 'worker', name: '', email: '', phone: '', city: '', state: '', trade: '', experience: '', certification: '', preferredLocation: '', message: '', consent: false }), [isContractor])

  const [form, setForm] = useState(initial)
  const { busy, message, error, reference, submit } = useSubmit('/api/register', {
    onSuccess: () => setForm(initial)
  })

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const onSubmit = (event) => {
    event.preventDefault()
    submit({ ...form, trades: isContractor ? form.trades : [form.trade].filter(Boolean), source: 'register-page' })
  }

  const allTrades = useMemo(() => (config?.trades || []).flatMap((group) => (typeof group === 'string' ? group : group.items)), [config])

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <div className="form-section" style={{ paddingTop: 0 }}>
        <h3>{isContractor ? 'Company details' : 'About you'}</h3>
        {isContractor ? (
          <div className="form-grid" style={{ padding: 0 }}>
            <label>Company / firm name<input required name="company" value={form.company} onChange={change} placeholder="Registered name" /></label>
            <label>Contact person<input required name="name" value={form.name} onChange={change} placeholder="Who should we speak to?" /></label>
            <label>Email<input required type="email" name="email" value={form.email} onChange={change} placeholder="you@company.com" /></label>
            <label>Phone<input required name="phone" value={form.phone} onChange={change} placeholder="+91 …" /></label>
            <label>City<input name="city" value={form.city} onChange={change} placeholder="Head office city" /></label>
            <label>State<input name="state" value={form.state} onChange={change} placeholder="Maharashtra" /></label>
          </div>
        ) : (
          <div className="form-grid" style={{ padding: 0 }}>
            <label>Full name<input required name="name" value={form.name} onChange={change} placeholder="Your name" /></label>
            <label>Phone<input required name="phone" value={form.phone} onChange={change} placeholder="+91 …" /></label>
            <label>Email<input required type="email" name="email" value={form.email} onChange={change} placeholder="you@email.com" /></label>
            <label>City / district<input name="city" value={form.city} onChange={change} placeholder="Where do you live?" /></label>
            <label>State<input name="state" value={form.state} onChange={change} placeholder="Bihar" /></label>
            <label>Preferred work location<input name="preferredLocation" value={form.preferredLocation} onChange={change} placeholder="Mumbai / Pune / Noida / anywhere" /></label>
          </div>
        )}
      </div>

      <div className="form-section">
        <h3>{isContractor ? 'Work you can deliver' : 'Your trade & experience'}</h3>
        {isContractor ? (
          <>
            <span className="field-hint">Select every category you can deliver. Choose as many as apply.</span>
            <ChipSelect
              options={config?.types || []}
              value={form.trades}
              onChange={(value) => setForm({ ...form, trades: value })}
            />
            <div className="form-grid" style={{ padding: 0 }}>
              <label>
                Largest package value you can take
                <select name="scale" value={form.scale} onChange={change}>
                  <option value="">Select a range</option>
                  {(config?.scaleOptions || []).map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label>Number of workers / staff<input name="employees" value={form.employees} onChange={change} placeholder="e.g. 45" /></label>
              <label>GST number<input name="gst" value={form.gst} onChange={change} placeholder="27ABCDE1234F1Z5" /></label>
              <label>PAN<input name="pan" value={form.pan} onChange={change} placeholder="ABCDE1234F" /></label>
              <label className="form-full">Licences & registrations held<input name="licences" value={form.licences} onChange={change} placeholder="BOCW, PF, ESIC, electrical licence, ISO, others" /></label>
              <label className="form-full">Regions you serve<input name="regions" value={form.regions} onChange={(event) => setForm({ ...form, regions: event.target.value })} placeholder="Maharashtra, Gujarat, Delhi NCR…" /></label>
              <label className="form-full">Past performance<textarea name="pastWork" rows="3" value={form.pastWork} onChange={change} placeholder="Name two or three comparable projects with client, value, year and scope." /></label>
            </div>
          </>
        ) : (
          <>
            <span className="field-hint">Pick the trade that best matches your skill. You can add more detail below.</span>
            <div className="form-grid" style={{ padding: 0 }}>
              <label className="form-full">
                Trade / skill
                <select required name="trade" value={form.trade} onChange={change}>
                  <option value="">Select your trade</option>
                  {(config?.trades || []).map((group) => (
                    <optgroup key={group.group || group} label={group.group || 'Trades'}>
                      {(group.items || [group]).map((item) => <option key={item} value={item}>{item}</option>)}
                    </optgroup>
                  ))}
                </select>
              </label>
              <label>
                Years of experience
                <select name="experience" value={form.experience} onChange={change}>
                  <option value="">Select</option>
                  {(config?.experienceOptions || []).map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label>Certification held<input name="certification" value={form.certification} onChange={change} placeholder="e.g. ITI, crane operator licence, none" /></label>
            </div>
          </>
        )}
      </div>

      <div className="form-section">
        <h3>Anything else</h3>
        <div className="form-grid" style={{ padding: 0 }}>
          {isContractor && sources.length ? (
            <label className="form-full">Where did you hear about the registration programme?<input name="source" value={form.source || ''} onChange={change} placeholder="Referral, tender notice, website…" /></label>
          ) : null}
          <label className="form-full">Notes for our team<textarea name="message" rows="3" value={form.message} onChange={change} placeholder={isContractor ? 'Anything we should know about your firm, safety record or capacity.' : 'Anything we should know — availability, certifications in progress, training you would like.'} /></label>
        </div>
        <Consent checked={form.consent} onChange={(value) => setForm({ ...form, consent: value })}>
          {isContractor
            ? 'I confirm this information is accurate, that I am authorised to share it, and I agree to Ananta storing it for prequalification purposes.'
            : 'I confirm these details are accurate and agree to Ananta contacting me about registration, training and work opportunities.'}
        </Consent>
      </div>

      <SubmitButton busy={busy} label={isContractor ? 'Register my company' : 'Register my interest'} busyLabel="Submitting…" />
      <FormStatus message={message} error={error} reference={reference} />
      {!message ? <p className="field-hint form-full" style={{ marginTop: 4 }}>There is no fee to register, ever. If anyone asks you for payment to register or be placed, report it to support@anantainfratechsolutions.com immediately.</p> : null}
    </form>
  )
}

/* --------------------------------------------------------- tenders, downloads */

export function TenderForm({ packages = [] }) {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', city: '', package: '', message: '', consent: false })
  const { busy, message, error, reference, submit } = useSubmit('/api/tenders/enquiry', { onSuccess: () => setForm({ name: '', company: '', email: '', phone: '', city: '', package: '', message: '', consent: false }) })
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const onSubmit = (event) => { event.preventDefault(); submit({ ...form, source: 'tenders-page' }) }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <label>Your name<input required name="name" value={form.name} onChange={change} /></label>
      <label>Company<input required name="company" value={form.company} onChange={change} /></label>
      <label>Email<input required type="email" name="email" value={form.email} onChange={change} /></label>
      <label>Phone<input name="phone" value={form.phone} onChange={change} /></label>
      <label className="form-full">
        Package you are enquiring about
        <select name="package" value={form.package} onChange={change}>
          <option value="">Select a package</option>
          {packages.map((item) => <option key={item.name} value={item.name}>{item.name} — {item.type}</option>)}
          <option value="Other">Something else</option>
        </select>
      </label>
      <label className="form-full">Your enquiry<textarea required name="message" rows="4" value={form.message} onChange={change} placeholder="Include the project, scope or clarification you need. All clarifications are issued in writing to every bidder." /></label>
      <Consent checked={form.consent} onChange={(value) => setForm({ ...form, consent: value })}>I agree to Ananta storing these details to respond to my tender enquiry.</Consent>
      <SubmitButton busy={busy} label="Send tender enquiry" />
      <FormStatus message={message} error={error} reference={reference} />
    </form>
  )
}

export function DownloadForm({ documents = [] }) {
  const [selected, setSelected] = useState([])
  const [form, setForm] = useState({ name: '', company: '', role: '', email: '', phone: '', consent: false })
  const { busy, message, error, reference, submit } = useSubmit('/api/downloads/request', { onSuccess: () => setSelected([]) })
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const onSubmit = (event) => {
    event.preventDefault()
    if (!selected.length) return
    submit({ ...form, documents: selected, source: 'downloads-page' })
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <div className="form-full">
        <span className="field-hint" style={{ display: 'block', marginBottom: 10 }}>Select the documents you would like us to send.</span>
        <div className="checkbox-grid">
          {documents.map((document) => {
            const checked = selected.includes(document.title)
            return (
              <label className="checkbox-field" key={document.id}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => setSelected(checked ? selected.filter((item) => item !== document.title) : [...selected, document.title])}
                />
                <span><b>{document.title}</b><br /><small style={{ color: 'var(--muted)' }}>{document.meta}</small></span>
              </label>
            )
          })}
        </div>
      </div>
      <label>Your name<input required name="name" value={form.name} onChange={change} /></label>
      <label>Company<input name="company" value={form.company} onChange={change} /></label>
      <label>Your role<input name="role" value={form.role} onChange={change} placeholder="e.g. Procurement head" /></label>
      <label>Email<input required type="email" name="email" value={form.email} onChange={change} /></label>
      <label>Phone<input name="phone" value={form.phone} onChange={change} /></label>
      <Consent checked={form.consent} onChange={(value) => setForm({ ...form, consent: value })}>I agree to Ananta emailing these documents and storing my details for this purpose.</Consent>
      <SubmitButton busy={busy} label={selected.length ? `Send ${selected.length} document${selected.length > 1 ? 's' : ''}` : 'Select a document'} />
      <FormStatus message={message} error={error} reference={reference} />
    </form>
  )
}

/* ----------------------------------------------------------------- tracking */

export function TrackForm() {
  const [form, setForm] = useState({ reference: '', email: '' })
  const [state, setState] = useState({ busy: false, error: '', results: null, message: '' })

  const onSubmit = async (event) => {
    event.preventDefault()
    setState({ busy: true, error: '', results: null, message: '' })
    try {
      const query = new URLSearchParams()
      if (form.reference) query.set('reference', form.reference.trim().toUpperCase())
      if (form.email) query.set('email', form.email.trim())
      const response = await fetch(`/api/track?${query.toString()}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      setState({ busy: false, error: '', results: data.results, message: data.results.length ? '' : 'We could not find a submission matching those details. Check the reference from your acknowledgement email, or try the email address you used.' })
    } catch (error) {
      setState({ busy: false, error: error.message, results: null, message: '' })
    }
  }

  return (
    <>
      <form className="form-grid" onSubmit={onSubmit}>
        <label>Reference number<input name="reference" value={form.reference} onChange={(event) => setForm({ ...form, reference: event.target.value })} placeholder="ANW-…, ANH-…, ANC-…" /></label>
        <label>or the email you used<input type="email" name="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@email.com" /></label>
        <SubmitButton busy={state.busy} label="Check status" busyLabel="Checking…" />
      </form>

      {state.error ? <p className="form-message is-error">{state.error}</p> : null}
      {state.message ? <div className="notice notice-acid"><span>{state.message}</span></div> : null}

      {state.results?.length ? (
        <div className="track-result">
          {state.results.map((item) => (
            <div className="track-result-row" key={item.reference + item.label}>
              <div>
                <b>{item.label}</b>
                <small>{item.reference} · submitted {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</small>
              </div>
              <span className={`tag ${item.status === 'new' ? 'tag-acid' : item.status === 'closed' ? 'tag' : 'tag-info'}`}>{item.status}</span>
            </div>
          ))}
        </div>
      ) : null}
    </>
  )
}
