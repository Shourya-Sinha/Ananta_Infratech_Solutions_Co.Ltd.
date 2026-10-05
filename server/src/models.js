import mongoose from 'mongoose'

const siteSchema = new mongoose.Schema({ key: { type: String, unique: true }, content: mongoose.Schema.Types.Mixed }, { timestamps: true })
const projectSchema = new mongoose.Schema({ title: String, category: String, location: String, year: String, status: String, scope: String, image: String, summary: String, challenge: String, impact: String }, { timestamps: true })
const inquirySchema = new mongoose.Schema({ kind: String, name: String, email: String, phone: String, company: String, message: String, role: String, cv: String }, { timestamps: true })
export const Site = mongoose.models.Site || mongoose.model('Site', siteSchema)
export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema)
export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema)
