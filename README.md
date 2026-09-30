# SPORTBUK

SPORTBUK is a football clothing and equipment catalog built as a Web Application course project. It uses a React, TypeScript, and Vite customer frontend with a Node.js, Express, Mongoose, and MongoDB backend.

> **Status: Under production.** This project is still being developed and is not production-ready. Customer checkout is not available in the active storefront.

Active customer and admin experiences live in `frontend/`. The former vanilla frontend is archived locally as `frontend-legacy/` and excluded from this repository. Lecture PDFs in `slides/` are ignored; presentation Markdown in `slides/presentation/` is tracked.

Final presentation materials: [slide plan](slides/presentation/SLIDE_PLAN.md), [5–7 minute speaker script](slides/presentation/SPEAKER_SCRIPT.md), and [demo runbook with examiner Q&A](slides/presentation/DEMO_RUNBOOK.md).

## Current Scope

Active customer flow:

- Register and sign in
- Browse football products and categories
- Search, sort, and filter products
- View products, colors, sizes, prices, and stock
- Save wishlist items
- Add products to a training bag
- Browse football collections
- Read the football journal
- Save a contact request draft locally

Active admin flow:

- Manage products, categories, collections, sizes, and users
- Manage order status and deletion
- View dashboard and analytics pages
- Review and reply to chat conversations

Admin URL: `http://localhost:5173/admin`

Checkout, orders, and payment code still exist in the repository, but checkout is intentionally removed from active customer navigation.

## Technology

- Frontend: React 19, TypeScript, Vite, React Router, Fetch API
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Authentication: JWT and bcrypt
- Realtime support: Socket.IO
- Uploads: Multer
- Icons: Phosphor Icons
- Fonts: self-hosted Barlow Condensed and Be Vietnam Pro

## Architecture

```text
Browser (React and TypeScript)
              |
          Fetch API
              |
    Node.js + Express REST API
              |
         Mongoose ODM
              |
            MongoDB
```

### What MongoDB Stores

MongoDB database `sportbuk_shop` stores shop records as documents, including products (names, descriptions, prices, stock, color/size variants, image URLs), categories, collections, size guides, accounts, wishlists, and signed-in carts. The backend defines these document shapes in `backend/src/models/` and reads/writes them through API routes in `backend/src/routes/`. For example, an admin product edit sends a request to `/api/v1/products/:id`, which updates a `Product` document through Mongoose; the storefront then reads that product from the API.

MongoDB stores **paths to uploaded images**, not the image file contents. Files uploaded in the dashboard live in `backend/uploads/`, while bundled demo images live in `frontend/public/`. Guest bags, guest wishlists, and contact drafts are saved in the browser's local storage instead of MongoDB. Journal articles are currently defined in frontend source.

### Course Concepts in This Project

The local course slides cover HTML structure and forms (`2-HTML.pdf`), CSS layout and the box model (`3-CSS.pdf`), JavaScript events and form validation (`4-JavaScript.pdf`), asynchronous Node.js and HTTP servers (`6-NodeJS.pdf`), Flask routes (`8-Python Flask.pdf`), and relational/NoSQL databases (`9-Database.pdf`). SPORTBUK applies those concepts through React forms and events, responsive CSS, `fetch` requests, Express routes, and persistent MongoDB documents.

The database lecture introduces MongoDB as a NoSQL option but uses MySQL, Flask, and SQLAlchemy for its sample registration app. SPORTBUK uses **MongoDB + Mongoose + Express** for the same core ideas: models, routes, validation, and persisted user/catalog data. Flask and MySQL are examples from the slides, not dependencies of this project.

## Requirements

- Node.js 18 or newer
- npm
- MongoDB running locally
- Internet access for dependency installation and fallback demo photography

## Backend Setup

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/sportbuk_shop
CLIENT_URL=http://127.0.0.1:5500
SERVER_URL=http://127.0.0.1:5000
JWT_SECRET=replace_with_a_long_random_secret
JWT_REFRESH_SECRET=replace_with_a_different_long_random_secret
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
```

Install and start backend:

```bash
cd backend
npm install
npm run seed:demo
npm start
```

Run `npm run seed:demo` to initialize the demo catalog or restore missing demo records. Existing dashboard edits, including uploaded image references, are preserved.

Backend health endpoint:

```text
http://127.0.0.1:5000/health
```

## Frontend Setup

From `frontend`:

```bash
npm install
npm run dev
```

Vite prints the local development URL. Set `VITE_API_ORIGIN` when the backend is not running at `http://127.0.0.1:5000`.

To keep the backend and frontend running in one terminal:

```bash
cd frontend
npm run dev:full
```

## Demo Data

Run this command from `backend` to initialize or restore missing demo catalog data:

```bash
npm run seed:demo
```

The demo seed initializes:

- 3 football categories: áo đấu câu lạc bộ, giày và tất bóng đá, phụ kiện khác
- 9 photographed football products with colors, sizes, prices, stock, and SKUs
- 2 football collections
- 16 size-guide records

The script inserts missing demo records without overwriting existing products, categories, collections, size guides, or uploaded-image references. Source: `backend/scripts/seed-demo.js`.

If an existing database still contains the older eight illustrated products, run `npm run catalog:replace-demo` **once** from `backend/` to insert the photographed catalog and remove only those older demo products, their obsolete categories, and collections. This command does not remove other custom catalog entries. It stops if an old product is referenced by an order. Current catalog prices and stock are example values for the course demo; adjust them in the admin dashboard.

## Demo Admin

```text
Email: admin@sportbuk.com
Password: admin123456
```

These credentials are for local course demonstration only. Do not deploy them publicly.

## Frontend Configuration

The API origin defaults to `http://127.0.0.1:5000`. To change it, set `VITE_API_ORIGIN` in `frontend/.env` (this file is ignored by Git):

```env
VITE_API_ORIGIN=http://127.0.0.1:5000
```

Main frontend modules:

- Routes: `frontend/src/app/App.tsx`
- Header and footer: `frontend/src/components/layout/`
- Customer pages: `frontend/src/pages/`
- Admin shell: `frontend/src/components/admin/AdminLayout.tsx`
- Admin pages: `frontend/src/pages/admin/`
- API client: `frontend/src/lib/api.ts`
- Football journal: `frontend/src/features/journal/articles.ts`
- Theme: `frontend/src/styles/global.css`
- Demo products and collections: `backend/scripts/seed-demo.js`

Seed data is intended for initial setup and restoring missing demo records. Make subsequent catalog changes in the admin dashboard.

To translate existing photographed-catalog names, descriptions, and gallery alt text to English, run `npm run catalog:english` from `backend/`. This migration matches known Vietnamese text, including shortened sock names, even when admin edits have changed product slugs. It also updates wishlist name snapshots. Product/variant identifiers and unrelated custom text are preserved. New seed records use English catalog names and descriptions.

## Replacing Football Images

The photographed demo catalog is included in `frontend/public/assets/images/catalog/`. Files are organized by product slug and named by color and view (for example `red-front.png`, `red-back.png`). MongoDB stores the image URLs and color associations. Upload additional product galleries, category images, and collection images through the admin dashboard; those managed files live under `backend/uploads/` and are referenced in MongoDB as `/uploads/...` URLs.

Customer category images appear as selectable tiles on `/products`, alongside the category dropdown filter.

`backend/uploads/` and MongoDB data are not stored in Git. A GitHub clone needs its own MongoDB data and uploaded files (or new uploads through the dashboard). Keep a backup of both if you move the catalog to another machine.

For a reproducible demo catalog, update assets under `frontend/public/assets/` and the matching paths in `backend/scripts/seed-demo.js` before seeding a fresh database. Changes to seed definitions do not overwrite existing dashboard-customized records.

## Main API Routes

All routes use `/api/v1`:

- `/auth`
- `/products`
- `/categories`
- `/collections`
- `/wishlist`
- `/carts`
- `/sizes`
- `/users`
- `/chats`
- `/dashboard`

Legacy but retained routes:

- `/orders`
- `/payments`
- `/comments`

## Design System

```text
Background: #FFFFFF
Surface:    #F5F5F5
Border:     #CACACB
Text:       #111111
Muted:      #707072
Sale:       #D30005
Display:    Barlow Condensed
Body:       Be Vietnam Pro
```

Customer pages follow the photography-first commerce system in `DESIGN.md` and respect system dark mode. Native React admin routes use a separate protected operations shell.

## Testing Status

- Demo seed script syntax verified with `node --check`.
- Seed can be rerun to restore missing demo records without overwriting customized ones.
- MongoDB demo catalog contains 9 photographed products, 3 categories, and 2 collections after the replacement command.
- Seeded catalog and storefront image references use local football assets; no Unsplash image references remain.
- No Jest test files currently exist; `npm test` reports `No tests found`.

## Security Notes

- Never commit `backend/.env`.
- Replace JWT secrets before sharing or deployment.
- Rotate any credentials that were previously exposed.
- Default admin credentials are demo-only.
- Payment integration is outside the current active project scope.

See `UPDATES.md` for change history and future-session handoff notes.
