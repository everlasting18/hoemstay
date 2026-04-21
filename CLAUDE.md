# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Single-page Astro landing site for **Tri Tôn Ecotourism Resort** (An Giang, Vietnam). All content is in Vietnamese.

## Commands

```bash
npm run dev       # Start dev server (hot reload)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run check     # TypeScript type checking (astro check)
```

No test framework or linter is configured.

## Architecture

### Data Layer

**`src/data/site.ts`** is the single source of truth for all content: navigation, room types, services, gallery collections, reviews, itinerary stops, and contact info. All content edits go here. TypeScript types (`Room`, `Service`, `GalleryItem`, `ItineraryStop`, etc.) are defined and exported from this file.

### Page & Layout

- `src/pages/index.astro` — The only page (779 lines). Contains the full page section layout: Hero → Story → Itinerary → Services → Gallery → Audience → Reviews → Contact CTA.
- `src/layouts/MainLayout.astro` — HTML shell with SEO meta tags, font loading, scroll progress bar, and global script initialization.

### Components

Reusable components in `src/components/`:
- `Header.astro` — Fixed nav with hamburger menu (inline script handles mobile toggle)
- `Footer.astro` — Brand info and section links
- `FloatActions.astro` — Fixed Zalo/call buttons (sticky mobile CTA)
- `ContactForm.astro` — 3-field form; on submit, copies a pre-formatted Zalo message to clipboard and redirects to Zalo chat

### Styling

`src/styles/global.css` (3100+ lines) is the sole stylesheet. It defines:
- CSS custom properties: color palette (`--color-primary`, `--color-accent`, etc.), spacing tokens, border radii, shadow levels
- Typography: Cormorant Garamond (headings) + Plus Jakarta Sans (body)
- All component and layout styles; no CSS framework is used

### Client-Side Interactivity

All JS is inline scripts (no separate JS files). Key behaviors:
- **Hero carousel** — Auto-rotates every 4s, pauses on hover/touch
- **Mobile snap carousels** — Itinerary, services, and reviews sections use scroll-snap with indicator dots
- **Scroll animations** — Motion library (`motion` npm package) drives fade-in reveals and itinerary story-beat highlighting
- **Gallery** — Parallax-like focus effect on card hover
- **ContactForm** — Constructs a Vietnamese Zalo message from form fields, copies to clipboard, then opens Zalo URL

### Images

All images live in `public/images/tri-ton/`. SVG files are placeholder stubs; JPG files are production assets. The `README.md` in that folder describes the expected image filenames and dimensions.

## Key Conventions

- All page content (text, images paths, metadata) is defined in `src/data/site.ts` — avoid hardcoding strings in `.astro` files when the content belongs to site data.
- Astro's `site` is set to `https://example.com` in `astro.config.mjs` — update this before deploying.
- Motion animations use `inView` + `animate` from the `motion` package; keep animation logic inline with the relevant section.
