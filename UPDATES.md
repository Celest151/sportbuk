# SPORTBUK Frontend Updates

Last updated: 2026-09-09

## New Frontend Version

- Built a new React 19, TypeScript, and Vite customer storefront in `frontend/`.
- Kept `frontend-legacy/` isolated. Only its supplied SPORTBUK logo was copied to `frontend/public/logos/sportbuk.png` at the user's request.
- Added responsive customer routes for home, shop, product details, collections, journal, contact, authentication, account, wishlist, and training bag.
- Connected public catalog, category, collection, authentication, wishlist, and cart services to `/api/v1`.
- Added guest wishlist and training-bag persistence in local storage.
- Added local-only contact draft persistence under `sportbuk_contact_draft`.
- Added product search, category and price filters, and backend-supported sorting.
- Added loading, empty, error, stock, success, and signed-out states.
- Applied the photography-first system from `DESIGN.md`: flat product media, neutral chrome, condensed campaign type, pill actions, responsive grids, and system dark mode.
- Rebuilt the landing hero as a three-image slideshow based on the legacy interaction: 3-second autoplay, crossfade, dots, arrows, timer reset after manual navigation, pause on interaction, and reduced-motion support.
- Replaced the compact search dropdown with an animated full-width search tray using the `DESIGN.md` search-pill focus treatment, football shortcuts, clear/submit controls, backdrop dismissal, and Escape-key handling.
- Added one-time scroll reveals for customer content. Elements animate on first viewport entry, then detach from observation and remain static; reduced-motion users receive immediate static content.
- Replaced all native frontend selects with one accessible Radix Select component styled for SPORTBUK. Contact topic, catalog category, and catalog sorting now use animated flat menus with Phosphor caret/check icons, keyboard navigation, typeahead, selected indicators, and dark-mode contrast.
- Added `npm run dev:full` in `frontend/` to run the Express API and Vite together, preventing detached backend processes from disappearing during frontend development.
- Aligned training-bag feedback with the useful legacy flow: exact product/size/color lines increment, the header badge counts total units, card and detail actions show a 1.2-second check confirmation, failures surface through notifications, and unavailable variant combinations are disabled. Fixed backend cart comparisons for populated product IDs so authenticated add, update, and remove operations target the correct line.
- Restored minus/plus quantity controls in the training bag. Quantity stays at one or above, cannot exceed current variant stock, persists for guest and authenticated bags, and immediately recalculates line totals, summary totals, and the header badge.
- Migrated the legacy admin workflow into protected native React routes under `/admin`. Added responsive dashboard, product/category/collection/size CRUD, user role and status controls, order management, customer chat replies, analytics, a dedicated admin shell, and strict customer/admin route separation.
- Completed the MARC-to-SPORTBUK rebrand across application source, configuration, legacy storage keys, package metadata, demo credentials, and persisted MongoDB values. Migrated records with stable IDs to `sportbuk_shop`; retained the old database as a safety backup. Added Express serving and frontend normalization for seeded football asset paths so product imagery loads in customer and admin views.
- Added a responsive Products mega-tab listing every active product, moved seeded product SVGs into the active frontend for backend-independent loading, corrected the admin logo source, debounced price-range filtering by 500 ms, and translated seeded Vietnamese catalog copy with proper diacritics in source and persisted data.
- Added Phosphor Icons as the only interface icon family.
- Self-hosted Barlow Condensed and Be Vietnam Pro through npm font packages.
- Checkout and orders remain outside active customer navigation.

## Structure

```text
frontend/src/
  app/          Route composition
  components/   Shared customer UI and the protected admin shell
  features/     Auth, shop state, and journal content
  hooks/        Reusable data hooks
  lib/          API and formatting utilities
  pages/        Customer screens and admin management screens
  styles/       Global design tokens and responsive rules
  types/        Shared API models
```

## Verification

- `npm run lint`: passes.
- `npm run typecheck`: passes.
- `npm run build`: passes.
- Authenticated admin API smoke test: all dashboard, order, catalog, size, user, chat, and analytics reads return `200`.
- `npm audit --omit=dev`: 0 vulnerabilities.

## Backend Follow-Ups

- Validate cart and wishlist size/color selections against real variants and stock.
- Add product pagination metadata and customer size, color, and stock filters.
- Serve seeded image paths from the backend or replace them with `/uploads/...` URLs.
- Add rate limiting to authentication routes and update the legacy password-reset URL.
