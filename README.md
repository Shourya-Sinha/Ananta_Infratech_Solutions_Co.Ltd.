# Ananta Infratech Solutions — Digital Platform

A full-stack, responsive construction-company website and content administration portal for **Ananta Infratech Solutions**.

The public site covers **28 marketed pages plus 34 content-driven detail pages** — services, sectors, 14 project
case studies, insight articles, careers and role pages, tenders, downloads, FAQs, policies and a working
contractor/worker registration route — all of it editable from a structured admin portal with draft, publish,
versioning and rollback.

## Stack

- **Client:** React, Vite, React Router, Framer Motion, Lucide icons and a bespoke responsive design system
- **API:** Node.js, Express, JWT-protected administrator endpoints, Multer image upload
- **Data:** MongoDB/Mongoose when `MONGODB_URI` is configured; durable local JSON CMS fallback for an immediately runnable preview
- **Assets:** every default image and typeface ships in the repository — no third-party CDN at runtime

## Start locally

```bash
npm install
npm install --prefix client
npm run dev
```

- Website: `http://localhost:5173`
- API: `http://localhost:5050`
- Admin portal: `http://localhost:5173/admin`

Demo portal access is `admin@anantainfratechsolutions.com` / `Ananta@2016`. **Change this and `JWT_SECRET` through
environment variables before deploying.** Copy `.env.example` to `.env` to configure deployment settings.

Production build and run:

```bash
npm run build      # builds client/dist
npm start          # serves the built site and API from port 5050
```

## Verify it still renders

```bash
npm run smoke
```

The smoke test server-renders every public route **and every CMS editor section** against the live content
document, then reports anything that throws or comes back empty. It is the fastest way to catch a content-driven
page breaking after a copy edit — run it after any content or component change. (It needs the API running; it falls
back to the JSON store if not.)

## Site map

| Area | Routes |
| --- | --- |
| Company | `/about` `/leadership` `/hse` `/sustainability` `/awards` `/clients` `/equipment` `/newsroom` |
| What we do | `/services` + 8 service pages, `/sectors` + 6 sector pages |
| Work | `/projects` + 14 project case studies, `/insights` + 8 articles |
| Careers | `/careers` + 8 role pages, `/careers#open-roles`, `/register` |
| Commercial | `/tenders` `/downloads` `/faq` `/contact` `/track` `/sitemap` |
| Legal | `/policy/privacy` `/policy/terms` `/policy/code-of-conduct` `/policy/anti-bribery` `/policy/whistleblower` |
| Portal | `/admin` (sign-in required) |

## Contractor and worker registration

The registration section is built and shipped **switched off**. Nothing has been removed — both tracks, all their
copy, the launch messaging and the FAQ stay on the website — but the page presents itself honestly as **"Coming soon"**
until you are ready to accept applications:

- Every registration link (utility bar, mega menu, careers, tenders, equipment, FAQ, contact, 404) is labelled
  "Coming soon" from one source of truth.
- `/register` shows what is being built for each track, the opening phases, what to prepare, and who to contact in the
  meantime — with no form collecting applications nobody can process yet.
- `POST /api/register` is refused server-side with a clear message while the switch is off, so no one is left expecting
  a reply.

**To open applications**, go to **Admin → Careers & registration → Contractor & worker registration** and turn on
*Accept registration applications*. The same page becomes the live route: two tracks (contractors/suppliers and
workers/technicians), each with its own steps, requirements and form, deep-linkable as `/register?track=worker` and
`/register?track=contractor`. Submissions are acknowledged with a reference (`ANC-…` contractor, `ANW-…` worker) and
land in the CMS inbox, where they can be filtered by track and status, annotated and exported to CSV. `/track` lets an
applicant check any submission by reference or email.

Closing it again is the same toggle in reverse, and the API stops accepting submissions immediately. For contractors
and suppliers the interim contact is `tenders@anantainfratechsolutions.com`; for workers and technicians, `careers@anantainfratechsolutions.com`.

## Editing the website

The protected `/admin` portal is schema-driven: `client/src/lib/adminSchema.js` describes every editable section
of the site once, and the editor UI is generated from it. That is why adding a new editable page means adding one
entry to that file — not another bespoke React panel.

The portal provides:

1. **Dashboard** — submission counts, content status, portfolio totals and quick actions.
2. **Structured editors** for every content type: page copy and SEO, services, sectors, projects, leadership and
   departments, clients and testimonials, certifications, offices, insights, newsroom, awards, sustainability, HSE,
   equipment, careers copy, vacancies, registration tracks, tenders, downloads, FAQs, policies, navigation, footer,
   badges and company profile.
3. **Click-to-browse image fields** — clicking an image tile opens the file explorer (drag and drop also works),
   uploads the file and fills in its public URL. Pasting a URL is still available behind "Use a link instead".
4. **Media library** — every uploaded image, reusable anywhere without re-uploading.
5. **Submissions inbox** — contractor/worker registrations, enquiries and applications, newsletter subscribers,
   with search, status workflow, internal notes and CSV export.
6. **Draft, publish, revisions and rollback** — editors work in a private draft; publishing stores the version it
   replaced so any release can be restored. "Preview" opens the unpublished draft in a new tab.
7. **Advanced JSON tab** for bulk edits and integrations.

Content validation runs on save and on publish, so a missing required field is reported with its exact path before
anything reaches the live site.

## Brand files

- `client/public/assets/logo_bg_remove.png` — primary logo, used by the header, footer, admin portal and favicon
- `server/src/seed.js` sets `company.logo` to that path, and the API repairs any CMS record still pointing at a
  removed legacy file (for example `/assets/dlogo-removebg.png` or `/assets/logo.jpeg`)
- `Brand.jsx` falls back to the bundled PNG if the CMS URL fails to load, and only then to the typographic "A" mark

Upload a new logo from **Admin → Site settings → Company profile** — no code change or file copy is needed.

## Images and typography

- All default photography lives in `client/public/assets` and is served from the same origin; the site renders
  identically offline, inside a preview sandbox, and in production.
- Fonts (Manrope, Playfair Display, DM Mono) are self-hosted through `@fontsource`, so there is no external font
  request and no flash of fallback type.
- `client/src/lib/images.js` installs a global image fallback: any image that fails to load — a deleted upload or a
  mistyped URL — is replaced with an on-brand placeholder instead of a broken box.

## Environment

| Variable | Purpose |
| --- | --- |
| `PORT` | API/site port (default `5050`) |
| `MONGODB_URI` | Enables MongoDB storage; omitted, the durable JSON store is used |
| `JWT_SECRET` | Signing key for admin sessions — set this in production |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_PASSWORD_HASH` | Portal credentials (`ADMIN_PASSWORD_HASH` wins) |
| `SITE_URL` | Canonical URL used by `robots.txt`, `sitemap.xml` and canonical tags |
| `CLOUDINARY_*` | Optional image storage; without it uploads are stored in `server/uploads` |
| `NOTIFY_WEBHOOK_URL`, `NOTIFY_WEBHOOK_SECRET`, `NOTIFY_EMAIL` | Submission notifications |

SEO endpoints are mounted at the site root: `/robots.txt` and `/sitemap.xml`.

## Project layout

```
client/                 React application
  public/assets/        bundled photography and logo
  scripts/render-smoke  render smoke test (npm run smoke)
  src/lib/              API client, site context, SEO head manager, image fallback, admin schema
  src/components/       layout, shared blocks, forms, uploader, toasts, error boundary
  src/pages/            one module per route
  src/pages/admin/      portal shell, schema-driven editors, submissions inbox, media, revisions
  src/styles/           base, layout, components, pages, admin, responsive
server/                 Express API
  src/content/          seed content: company, services, sectors, projects, people, pages, images
  src/routes/           site, auth, submissions and admin routes
  src/lib/              content validation/merge, storage adapters, notifications
  data/                 JSON CMS store (created on first write)
```

## Deployment notes

- The API serves `client/dist` with an SPA fallback when `NODE_ENV=production`, so a single process serves both the
  website and the endpoints.
- Set `JWT_SECRET`, `ADMIN_PASSWORD_HASH` (or a strong `ADMIN_PASSWORD`) and `SITE_URL` before going live.
- `server/data/*.json` and `server/uploads/*` are runtime data and are git-ignored; back them up with the
  deployment, or move to MongoDB by setting `MONGODB_URI`.
