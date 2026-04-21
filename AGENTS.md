# Repository Guidelines

## Project Structure & Module Organization
This project is a single-page Astro landing site for Tri Tôn (An Giang).
- `src/pages/index.astro`: main page composition and section flow.
- `src/layouts/MainLayout.astro`: HTML shell, metadata, global script bootstrapping.
- `src/components/`: reusable UI blocks (`Header`, `Footer`, `FloatActions`, `ContactForm`, `PageHero`).
- `src/data/site.ts`: single source of truth for content (navigation, rooms, services, gallery, contact).
- `src/styles/global.css`: global styling tokens and section/component styles.
- `public/images/tri-ton/`: production image assets and attribution docs.
- `dist/`: build output (generated; do not edit manually).

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev` (or `npm run start`): run local dev server with hot reload.
- `npm run build`: create production output in `dist/`.
- `npm run preview`: preview the built site locally.
- `npm run check`: run Astro + TypeScript checks.

## Coding Style & Naming Conventions
Use TypeScript + ESM, with 2-space indentation and semicolons as in existing files.
- Keep content in `src/data/site.ts`; avoid hardcoding copy in component/page templates.
- Use PascalCase for component filenames (e.g., `PageHero.astro`).
- Use camelCase for variables/functions, kebab-case for section anchors/IDs.
- Prefer small, focused inline scripts near the section they control.

## Testing Guidelines
There is currently no automated test framework. Required validation for each change:
1. Run `npm run check`.
2. Run `npm run build`.
3. Manually verify key flows in desktop and mobile (hero carousel motion, navigation anchors, Zalo/hotline CTA, contact form behavior).

If a test framework is introduced later, place tests under `src/**/__tests__` or `tests/` with `*.test.*` naming.

## Commit & Pull Request Guidelines
No Git history is available in this workspace, so follow Conventional Commits:
- `feat(hero): refine carousel transition timing`
- `fix(mobile): prevent hero card overflow on 390px`

For PRs, include:
- Clear scope and user-facing impact.
- Linked issue/task (if available).
- Before/after screenshots for desktop + mobile.
- Notes on commands run (`check`, `build`) and any known limitations.

## Configuration & Content Safety
- Update `astro.config.mjs` `site` URL before deployment.
- Keep contact links/phone/Zalo IDs in `src/data/site.ts`.
- Add image attribution updates when new assets are introduced.
