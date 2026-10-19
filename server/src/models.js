import mongoose from 'mongoose'

/** A single content document holding the published site, the working draft and the revision history. */
const workspaceSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'primary' },
  published: mongoose.Schema.Types.Mixed,
  draft: mongoose.Schema.Types.Mixed,
  publishedAt: Date,
  publishedBy: String,
  revisions: [
    {
      id: String,
      at: Date,
      by: String,
      note: String,
      content: mongoose.Schema.Types.Mixed
    }
  ]
}, { timestamps: true, minimize: false })

/** Legacy single-blob content document, read once for a smooth upgrade. */
const siteSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  content: mongoose.Schema.Types.Mixed
}, { timestamps: true })

/** Every form submission on the website: contact, career, tender, download, alert. */
const inquirySchema = new mongoose.Schema({
  reference: { type: String, index: true },
  kind: String,
  status: { type: String, default: 'new', index: true },
  name: String,
  email: String,
  phone: String,
  company: String,
  role: String,
  jobId: String,
  department: String,
  city: String,
  experience: String,
  currentCtc: String,
  expectedCtc: String,
  noticePeriod: String,
  message: String,
  cv: String,
  portfolio: String,
  source: String,
  interest: String,
  documents: String,
  consent: Boolean,
  notes: [{ at: Date, text: String, by: String }],
  ip: String,
  // Delivery report for the email copy (sent / failed, reason, queue state).
  delivery: mongoose.Schema.Types.Mixed
}, { timestamps: true })

/** Contractor, supplier, vendor and worker registrations. */
const registrationSchema = new mongoose.Schema({
  reference: { type: String, index: true },
  type: { type: String, default: 'contractor', index: true },
  status: { type: String, default: 'new', index: true },
  name: String,
  company: String,
  email: String,
  phone: String,
  city: String,
  state: String,
  trades: [String],
  scale: String,
  experience: String,
  certification: String,
  gst: String,
  pan: String,
  licences: String,
  employees: String,
  regions: [String],
  pastWork: String,
  trade: String,
  preferredLocation: String,
  message: String,
  consent: Boolean,
  notes: [{ at: Date, text: String, by: String }],
  ip: String,
  delivery: mongoose.Schema.Types.Mixed
}, { timestamps: true })

/** Newsletter subscribers. */
const subscriberSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  name: String,
  source: String,
  status: { type: String, default: 'subscribed' }
}, { timestamps: true })

export const Workspace = mongoose.models.Workspace || mongoose.model('Workspace', workspaceSchema)
export const Site = mongoose.models.Site || mongoose.model('Site', siteSchema)
export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema)
export const Registration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema)
export const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema)
