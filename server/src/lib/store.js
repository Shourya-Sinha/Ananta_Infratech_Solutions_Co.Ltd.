import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { Workspace, Site, Inquiry, Registration, Subscriber } from '../models.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataPath = path.join(__dirname, '../../data/cms.json')

const clone = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)))

/**
 * Two interchangeable stores behind one interface.
 *
 * `mongo`  — used when MONGODB_URI is configured. Content, enquiries, registrations
 *            and subscribers persist in MongoDB across redeploys.
 * `local`  — a durable JSON file used for development with zero configuration.
 *
 * Both expose the same methods so route handlers never branch on storage type.
 */

function emptyState() {
  return {
    published: null,
    draft: null,
    publishedAt: null,
    publishedBy: null,
    revisions: [],
    inquiries: [],
    registrations: [],
    subscribers: []
  }
}

function normaliseFileState(raw) {
  const state = emptyState()
  if (!raw || typeof raw !== 'object') return state

  // Legacy format: the file *is* the content object, with an `inquiries` array on it.
  if (raw.company && !raw.published) {
    state.published = clone(raw)
    state.inquiries = raw.inquiries || []
    delete state.published.inquiries
    return state
  }

  state.published = raw.published || raw.content || null
  state.draft = raw.draft || null
  state.publishedAt = raw.publishedAt || null
  state.publishedBy = raw.publishedBy || null
  state.revisions = Array.isArray(raw.revisions) ? raw.revisions : []
  state.inquiries = Array.isArray(raw.inquiries) ? raw.inquiries : []
  state.registrations = Array.isArray(raw.registrations) ? raw.registrations : []
  state.subscribers = Array.isArray(raw.subscribers) ? raw.subscribers : []
  return state
}

class LocalStore {
  constructor() { this.kind = 'local-fallback' }

  async #read() {
    try {
      return normaliseFileState(JSON.parse(await fs.readFile(dataPath, 'utf8')))
    } catch {
      return emptyState()
    }
  }

  async #write(state) {
    await fs.mkdir(path.dirname(dataPath), { recursive: true })
    await fs.writeFile(dataPath, JSON.stringify(state, null, 2))
  }

  async readState() { return this.#read() }
  async writeState(state) { await this.#write(state) }

  async listInquiries({ kind, status, limit = 200 } = {}) {
    let rows = (await this.#read()).inquiries
    if (kind) rows = rows.filter((row) => row.kind === kind)
    if (status) rows = rows.filter((row) => (row.status || 'new') === status)
    return rows.slice(-limit).reverse()
  }

  async addInquiry(record) {
    const state = await this.#read()
    const entry = { ...record, status: 'new', notes: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    state.inquiries = [...state.inquiries, entry]
    await this.#write(state)
    return entry
  }

  async updateInquiry(id, patch) {
    const state = await this.#read()
    let updated = null
    state.inquiries = state.inquiries.map((row) => {
      const rowId = row.id || row.reference || row.createdAt
      if (rowId !== id) return row
      updated = { ...row, ...patch, updatedAt: new Date().toISOString() }
      return updated
    })
    await this.#write(state)
    return updated
  }

  async listRegistrations({ type, status, limit = 200 } = {}) {
    let rows = (await this.#read()).registrations
    if (type) rows = rows.filter((row) => row.type === type)
    if (status) rows = rows.filter((row) => (row.status || 'new') === status)
    return rows.slice(-limit).reverse()
  }

  async addRegistration(record) {
    const state = await this.#read()
    const entry = { ...record, status: 'new', notes: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    state.registrations = [...state.registrations, entry]
    await this.#write(state)
    return entry
  }

  async updateRegistration(id, patch) {
    const state = await this.#read()
    let updated = null
    state.registrations = state.registrations.map((row) => {
      const rowId = row.id || row.reference || row.createdAt
      if (rowId !== id) return row
      updated = { ...row, ...patch, updatedAt: new Date().toISOString() }
      return updated
    })
    await this.#write(state)
    return updated
  }

  async addSubscriber(record) {
    const state = await this.#read()
    const existing = state.subscribers.find((row) => row.email === record.email)
    if (existing) return existing
    const entry = { ...record, status: 'subscribed', createdAt: new Date().toISOString() }
    state.subscribers = [...state.subscribers, entry]
    await this.#write(state)
    return entry
  }

  async listSubscribers() { return (await this.#read()).subscribers }
}

class MongoStore {
  constructor() { this.kind = 'mongodb' }

  async readState() {
    const doc = await Workspace.findOne({ key: 'primary' }).lean()
    if (doc) {
      return {
        published: doc.published || null,
        draft: doc.draft || null,
        publishedAt: doc.publishedAt || null,
        publishedBy: doc.publishedBy || null,
        revisions: doc.revisions || [],
        inquiries: [],
        registrations: [],
        subscribers: []
      }
    }
    // One-time upgrade from the previous single-document format.
    const legacy = await Site.findOne({ key: 'primary' }).lean()
    return { ...emptyState(), published: legacy?.content || null }
  }

  async writeState(state) {
    await Workspace.findOneAndUpdate(
      { key: 'primary' },
      {
        key: 'primary',
        published: state.published,
        draft: state.draft,
        publishedAt: state.publishedAt,
        publishedBy: state.publishedBy,
        revisions: (state.revisions || []).slice(-25)
      },
      { upsert: true, new: true }
    )
  }

  async listInquiries({ kind, status, limit = 200 } = {}) {
    const query = {}
    if (kind) query.kind = kind
    if (status) query.status = status
    return Inquiry.find(query).sort({ createdAt: -1 }).limit(limit).lean()
  }

  async addInquiry(record) { return (await Inquiry.create(record)).toObject() }

  async updateInquiry(id, patch) {
    const query = /^[0-9a-f]{24}$/i.test(id) ? { _id: id } : { reference: id }
    return Inquiry.findOneAndUpdate(query, patch, { new: true }).lean()
  }

  async listRegistrations({ type, status, limit = 200 } = {}) {
    const query = {}
    if (type) query.type = type
    if (status) query.status = status
    return Registration.find(query).sort({ createdAt: -1 }).limit(limit).lean()
  }

  async addRegistration(record) { return (await Registration.create(record)).toObject() }

  async updateRegistration(id, patch) {
    const query = /^[0-9a-f]{24}$/i.test(id) ? { _id: id } : { reference: id }
    return Registration.findOneAndUpdate(query, patch, { new: true }).lean()
  }

  async addSubscriber(record) {
    return Subscriber.findOneAndUpdate({ email: record.email }, record, { upsert: true, new: true }).lean()
  }

  async listSubscribers() { return Subscriber.find().sort({ createdAt: -1 }).lean() }
}

export const store = { current: new LocalStore() }

export function useMongo() { store.current = new MongoStore(); return store.current }
export function useLocal() { store.current = new LocalStore(); return store.current }
export const storageKind = () => store.current.kind

export const repo = {
  readState: () => store.current.readState(),
  writeState: (state) => store.current.writeState(state),
  listInquiries: (options) => store.current.listInquiries(options),
  addInquiry: (record) => store.current.addInquiry(record),
  updateInquiry: (id, patch) => store.current.updateInquiry(id, patch),
  listRegistrations: (options) => store.current.listRegistrations(options),
  addRegistration: (record) => store.current.addRegistration(record),
  updateRegistration: (id, patch) => store.current.updateRegistration(id, patch),
  addSubscriber: (record) => store.current.addSubscriber(record),
  listSubscribers: () => store.current.listSubscribers()
}
