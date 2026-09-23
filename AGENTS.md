# Repository Guidelines

## Project Overview
This repository powers a football-focused sports shop with separate admin and customer experiences. Keep changes aligned with the existing product, catalog, user, wishlist, bag, collection, journal, contact, analytics, and chat flows. Reuse existing patterns before introducing new abstractions.

## Project Structure & Module Organization
Keep admin and customer-facing code clearly separated. Group features by domain where possible, for example `products/`, `categories/`, `collections/`, `users/`, `wishlist/`, `bag/`, `journal/`, `contact/`, and `chat/`. Shared UI, helpers, API clients, constants, and types should live in reusable shared modules rather than being duplicated.

## Frontend Requirements
Customer-facing work should support:
- Registration and sign-in.
- Product/category browsing, search, sorting, and filtering.
- Product detail views with colors, sizes, prices, stock, and availability.
- Wishlist and training-bag actions.
- Football collection browsing.
- Football journal pages.
- Contact-request drafts saved locally.

Preserve responsive behavior and provide clear loading, empty, success, and error states. Do not expose admin-only controls or data in customer routes.

Use Phosphor Icons for interface icons. Reuse the project’s Phosphor package and avoid mixing in other icon libraries or hand-drawn SVG icons unless a required icon is unavailable.

## Backend & Data Changes
The existing admin flow manages products, categories, collections, sizes, users, analytics, and chat conversations. When changing shared data models or APIs, verify that both admin and customer flows remain compatible. Validate all server-side input and never trust client-provided prices, stock values, roles, or user IDs.

## Coding Style & Naming
Follow the repository’s existing formatter, linter, and naming conventions. Use descriptive names such as `ProductCard`, `getProductById`, and `wishlistItems`. Prefer small focused components/functions over large files with mixed responsibilities.

## Testing & Verification
Before submitting changes, test the affected flow end-to-end. For catalog work, verify search, filters, variants, stock, wishlist, and bag behavior. For authentication, confirm both signed-in and signed-out states. Run the project’s existing test, lint, and build scripts before opening a pull request.

## Commits & Pull Requests
Keep commits focused and use clear imperative messages, e.g. `Add size filter to product listing`. Pull requests should explain what changed, which flows are affected, how the change was tested, and include screenshots for visible UI updates.
