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

- Website: `http://localhost:7000`
- Admin panel: `http://localhost:7001` (with a real-time live preview of the site beside every editor)
- API: `http://localhost:5050` (proxied through both apps)

In production (`npm run build && npm start`) a single server serves the site with the admin panel under `/admin`.

Demo portal access is `admin@anantainfratech.com` / `Ananta@2016`. **Change this and `JWT_SECRET` through environment variables before deploying.** Copy `.env.example` to `.env` to configure deployment settings.

## Brand files

The brand component is already wired to the files requested by the client:

- `client/public/assets/dlogo-removebg.png` — used as the primary transparent logo
- `client/public/assets/logo.jpeg` — retained as the alternate logo

Those source files were not present in this checkout, so a polished typographic fallback is shown until they are copied to that folder. See `client/public/assets/ADD_LOGOS_HERE.txt`.

## Editing the website

The protected `/admin` portal provides:

1. Quick editing for business, home hero and contact details.
2. Image upload (the returned URL is copied for use in content).
3. A visual **Portfolio editor** for adding, editing and removing projects without touching code.
4. An **Everything editor** for all page copy, navigation content, services, statistics, projects, roles, insights/articles, image/video URLs and links.
5. A unified view of project and career enquiries.

Click **Publish changes** to update the public site. With MongoDB connected, content and enquiries are stored in MongoDB. Without it, they persist to `server/data/cms.json` in development.
