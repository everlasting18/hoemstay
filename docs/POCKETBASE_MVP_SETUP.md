# PocketBase MVP Setup

The site and admin dashboard use these PocketBase collections:

- `settings`
- `hero_slides`
- `rooms`
- `services`
- `gallery`
- `reviews`

## Setup

Start PocketBase, then set credentials in a local `.env` file or shell:

```bash
PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
POCKETBASE_ADMIN_EMAIL=admin@example.com
POCKETBASE_ADMIN_PASSWORD=your-superuser-password
```

Import schema and seed records:

```bash
npm run pb:mvp:setup
```

Validate content:

```bash
npm run pb:check
```

## Files

- `pocketbase/mvp/collections.json`: importable schema
- `pocketbase/mvp/seed.json`: sample records with fixed IDs
- `pocketbase/mvp/csv/*.csv`: manual import samples
- `scripts/pocketbase/setup-mvp.mjs`: schema import and seed upsert script
- `scripts/pocketbase/check-content.mjs`: live content validator

## Content Notes

The MVP stores media URLs as text. `rooms.amenities` and `rooms.featured_images` are JSON strings in text fields so CSV/manual imports remain simple. The frontend also accepts absolute URLs, local `/images/...` paths, and PocketBase file names if fields are later converted to file uploads.

For production builds, set `PUBLIC_REQUIRE_CMS=true` if fallback content is not acceptable.
