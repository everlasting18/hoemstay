# Project Overview

## Architecture

This project has three parts:

- `src/`: Astro public website
- `admin/`: Vite + React admin dashboard
- `pocketbase/mvp/`: PocketBase schema, seed data, and CSV samples

The public site is statically built. During build, `src/lib/content.ts` tries to load content from PocketBase when `PUBLIC_POCKETBASE_URL` is configured. If PocketBase is not configured, it uses fallback data from `src/data/site.ts`.

Set `PUBLIC_REQUIRE_CMS=true` for deployments that must fail instead of falling back when PocketBase cannot be reached.

## Source Layout

- `src/pages/index.astro`: homepage
- `src/pages/phong-nghi/[slug].astro`: room detail pages
- `src/layouts/MainLayout.astro`: shell, SEO, header, footer, shared scripts
- `src/components/`: Astro UI components
- `src/lib/`: content loading and utility modules
- `src/data/site.ts`: static fallback content
- `admin/src/config/collections.ts`: admin field definitions
- `admin/src/lib/`: admin API and form helpers

## Local Development

```bash
npm install
npm run dev
npm run check
npm run build
```

Admin:

```bash
cd admin
npm install
npm run dev
npm run check
npm run build
```

## Configuration

Root site env:

```bash
PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
PUBLIC_REQUIRE_CMS=false
```

Admin env:

```bash
VITE_POCKETBASE_URL=http://127.0.0.1:8090
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-unsigned-upload-preset
VITE_CLOUDINARY_IMAGE_TRANSFORM=f_webp,q_auto
```

Do not commit real `.env` files.
