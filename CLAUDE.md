# CLAUDE.md

This file provides implementation context for agents working in this repository.

## Overview

This repo contains a Vietnamese homestay showcase for **Windy Hill** in Tri Ton, An Giang.

- Public site: Astro static site in `src/`
- Admin CMS: Vite + React app in `admin/`
- Content backend: PocketBase MVP schema and seed data in `pocketbase/mvp/`
- Local fallback content: `src/data/site.ts`

## Commands

Run from the repository root:

```bash
npm run dev
npm run check
npm run build
npm run preview
npm run pb:mvp:setup
npm run pb:check
```

Run admin commands from `admin/`:

```bash
npm run dev
npm run check
npm run build
```

## Public Site

- `src/pages/index.astro`: homepage sections, hero carousel, services, rooms, gallery, reviews, and contact CTA
- `src/pages/phong-nghi/[slug].astro`: generated room detail pages
- `src/layouts/MainLayout.astro`: document shell, SEO tags, header/footer, floating actions, and shared scroll animation script
- `src/components/`: shared Astro components
- `src/styles/global.css`: global site styles

Content loading starts in `src/lib/content.ts`. It fetches PocketBase records at build time when `PUBLIC_POCKETBASE_URL` is set, otherwise it falls back to `src/data/site.ts`. Set `PUBLIC_REQUIRE_CMS=true` in production if builds must fail when PocketBase is unavailable.

## Admin App

The admin app uses PocketBase superuser auth and edits these collections:

- `settings`
- `hero_slides`
- `rooms`
- `services`
- `gallery`
- `reviews`

Collection fields are configured in `admin/src/config/collections.ts`. Shared API helpers live in `admin/src/lib/`. Cloudinary upload is optional and configured through `admin/.env`.

## Assets

Static public assets live in `public/`. Current fallback room photos are in `public/images/tri-ton/`; homepage scenic/service placeholders are in `public/images/views/`.

Build output and dependency folders are intentionally ignored:

- `dist/`
- `admin/dist/`
- `.astro/`
- `node_modules/`
- `admin/node_modules/`

Do not commit `.env` files, PocketBase credentials, or Cloudinary secrets. Keep only `.env.example` templates.
