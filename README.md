# SPORTBUK

SPORTBUK is a football clothing and equipment catalog built as a Web Application course project. It uses a React, TypeScript, and Vite customer frontend with a Node.js, Express, Mongoose, and MongoDB backend.

> **Status: Under production.** This project is still being developed and is not production-ready. Customer checkout is not available in the active storefront.

Active customer and admin experiences live in `frontend/`. The former vanilla frontend is archived locally as `frontend-legacy/` and is excluded from this repository, along with `slides/`.

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

Run `npm run seed:demo` only when initializing or deliberately resetting the demo catalog. It overwrites demo products, categories, and collections, including image references edited through the dashboard.

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

Run this command from `backend` only to initialize or reset demo catalog data:

```bash
npm run seed:demo
```

The demo seed initializes:

- 4 football categories
- 8 football products with colors, sizes, prices, stock, and SKUs
- 2 football collections
- 16 size-guide records

The script removes known earlier demo records, replaces size-guide records, and resets the images and other fields of seeded catalog entries. **Do not rerun it after customizing demo products, categories, collections, or their images unless you intend to reset them.** Source: `backend/scripts/seed-demo.js`.

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

Seed data is intended for initial setup. Later catalog changes should be made in the admin dashboard.

## Replacing Football Images

Upload product galleries, category images, and collection images through the admin dashboard. Managed images are stored under `backend/uploads/` and referenced in MongoDB as `/uploads/...` URLs. The frontend resolves these URLs against `VITE_API_ORIGIN`; demo images in `frontend/public/assets/` are tracked separately.

`backend/uploads/` and MongoDB data are not stored in Git. A GitHub clone needs its own MongoDB data and uploaded files (or new uploads through the dashboard). Keep a backup of both if you move the catalog to another machine.

For a reproducible demo catalog, update assets under `frontend/public/assets/` and the matching paths in `backend/scripts/seed-demo.js` **before** seeding a fresh database; do not rerun the seed over dashboard-customized records.

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
- Seed can be rerun for a fresh demo reset, but it overwrites customized demo records.
- MongoDB verified with 8 football products, 4 categories, and 2 collections.
- Seeded catalog and storefront image references use local football assets; no Unsplash image references remain.
- No Jest test files currently exist; `npm test` reports `No tests found`.

## Security Notes

- Never commit `backend/.env`.
- Replace JWT secrets before sharing or deployment.
- Rotate any credentials that were previously exposed.
- Default admin credentials are demo-only.
- Payment integration is outside the current active project scope.

See `UPDATES.md` for change history and future-session handoff notes.
