# Ananta Infratech Solutions — Digital Platform

A full-stack, responsive construction-company website and content administration portal for **Ananta Infratech Solutions**.

## Stack

- **Client:** React, Vite, React Router, Framer Motion, Tailwind CSS/PostCSS and bespoke responsive design system
- **API:** Node.js, Express, JWT-protected administrator endpoints, Multer image upload
- **Data:** MongoDB/Mongoose when `MONGODB_URI` is configured; durable local JSON CMS fallback for an immediately runnable development preview

## Start locally

```bash
npm install
npm install --prefix client
npm run dev
```

- Website: `http://localhost:5173`
- API: `http://localhost:5050`
- Admin portal: `http://localhost:5173/admin`

Demo portal access is `admin@anantainfratech.com` / `Ananta@2016`. **Change this and `JWT_SECRET` through environment variables before deploying.** Copy `.env.example` to `.env` to configure deployment settings.

## Brand files

The brand component is wired to the transparent logo that ships with the repository:

- `client/public/assets/logo_bg_remove.png` — primary logo, served at `/assets/logo_bg_remove.png` and used by the header, footer, admin portal and favicon
- `server/src/seed.js` sets `company.logo` to that path, and the API repairs any CMS record still pointing at a removed legacy file (for example `/assets/dlogo-removebg.png` or `/assets/logo.jpeg`)
- `Brand.jsx` falls back to the bundled PNG if the CMS URL fails to load, and only then to the typographic "A" mark

Upload a new logo from **Admin → Quick content → Company profile** — no code change or file copy is needed.

## Editing the website

The protected `/admin` portal provides:

1. Quick editing for business, home hero and contact details.
2. Click-to-browse image fields: clicking a logo, hero, signature or project image tile opens your file explorer (drag & drop works too), uploads the file and fills in its public URL automatically. Pasting a URL is still available behind the "Use a link instead" toggle.
3. A visual **Portfolio editor** for adding, editing and removing projects without touching code.
4. An **Everything editor** for all page copy, navigation content, services, statistics, projects, roles, insights/articles, image/video URLs and links.
5. A unified view of project and career enquiries.

Click **Publish changes** to update the public site. With MongoDB connected, content and enquiries are stored in MongoDB. Without it, they persist to `server/data/cms.json` in development.

## Image storage (Cloudinary)

`POST /api/admin/upload` accepts a real file (JPG, PNG, WEBP, GIF, AVIF, SVG up to 10MB) and returns `{ url, publicId, storage }`.

- **With Cloudinary configured** (`CLOUDINARY_CLOUD_NAME` plus either `CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` or `CLOUDINARY_UPLOAD_PRESET`) the file is streamed to Cloudinary and the returned `secure_url` is saved in the CMS. This is the recommended production setup because the files survive redeploys and are served from a CDN.
- **Without Cloudinary** the image is written to `server/uploads` and served from `/uploads/<file>` (the Vite dev server proxies that path to the API).

`GET /api/admin/upload/status` reports which storage is active; the admin portal shows this in the Image library helper text.
