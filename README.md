# SPORTBUK

SPORTBUK is a football clothing and equipment catalog built as a Web Application course project. It uses a React, TypeScript, and Vite customer frontend with a Node.js, Express, Mongoose, and MongoDB backend.

> Frontend rebuild status: the previous vanilla app is archived at `frontend-legacy/`. Active customer and admin experiences live in `frontend/`.

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

Checkout, orders, and payment code still exists in the repository, but checkout is intentionally removed from active customer navigation.

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

Backend health endpoint:

```text
http://127.0.0.1:5000/health
```

## New Frontend Setup

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

To inspect the archived site, serve the repository root and open files under `frontend-legacy/pages/`. It is retained only as a reference during the rebuild.

## Demo Data

Run this command from `backend` whenever demo catalog data must be restored:

```bash
npm run seed:demo
```

The idempotent seed creates:

- 4 football categories
- 8 football products with colors, sizes, prices, stock, and SKUs
- 2 football collections
- 12 size-guide records

The script removes only the known earlier generic demo-product slugs before inserting the football catalog. Source: `backend/scripts/seed-demo.js`.

## Demo Admin

```text
Email: admin@sportbuk.com
Password: admin123456
```

These credentials are for local course demonstration only. Do not deploy them publicly.

## Frontend Configuration

API origin:

```text
frontend/.env.example
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

After changing seeded product text, rerun `npm run seed:demo` from `backend`.

## Replacing Football Images

Managed product images should be uploaded through the backend and stored as `/uploads/...` paths. The frontend resolves these paths against `VITE_API_ORIGIN` and uses remote fallback photography when a seeded image is unavailable.

To use a different filename or file type such as PNG, JPG, or WEBP:

1. Upload the image through the relevant admin product, category, or collection flow.
2. Confirm the API returns its `/uploads/...` path.
3. Update `backend/scripts/seed-demo.js` if demo records must use the same image.
4. Run `npm run seed:demo` from `backend` after seed changes.

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
- Seed rerun verified as idempotent.
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
