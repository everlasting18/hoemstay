# Repository Guidelines

## Project Structure & Module Organization
This repository contains an Astro public site and a Vite/React admin panel. Site pages live in `src/pages/`, layout in `src/layouts/`, components in `src/components/`, and global styles in `src/styles/global.css`. Site data and contact details are centralized in `src/data/site.ts`; CMS/content helpers are in `src/lib/`. Static assets belong in `public/`, especially `public/images/`.

The admin app is under `admin/`, with React source in `admin/src/`, UI primitives in `admin/src/components/ui/`, and collection config in `admin/src/config/collections.ts`. PocketBase schema, seed data, and CSV imports are in `pocketbase/mvp/`; setup notes are in `docs/`.

## Build, Test, and Development Commands
Run site commands from the repository root:

- `npm install`: install Astro dependencies.
- `npm run dev`: start the Astro dev server.
- `npm run check`: run Astro and TypeScript validation.
- `npm run build`: build the production site into `dist/`.
- `npm run preview`: preview the built site locally.
- `npm run pb:mvp:setup`: initialize the PocketBase MVP content.
- `npm run pb:check`: validate PocketBase content assumptions.

Run admin commands from `admin/`:

- `npm install`: install admin dependencies.
- `npm run dev`: start the Vite admin app.
- `npm run check`: run TypeScript checks.
- `npm run build`: build the admin bundle.

## Coding Style & Naming Conventions
Use TypeScript and ESM imports. Match the existing 2-space indentation and semicolon style. Name Astro and React components in PascalCase, such as `Header.astro` or `RecordEditor.tsx`. Use camelCase for variables, hooks, and helpers; use kebab-case for routes and slugs such as `phong-nghi`. Keep business copy and contact details in data/config files.

## Testing Guidelines
There is no dedicated test suite yet. Before handoff, run `npm run check` and `npm run build` for the site, plus the same commands in `admin/` when admin files change. Manually verify responsive navigation, room detail pages, contact actions, image rendering, and admin CRUD workflows. If tests are added, prefer `*.test.ts` or `*.test.tsx` near the code or under `tests/`.

## Commit & Pull Request Guidelines
Current history uses short descriptive subjects, for example `Initial commit - homestay website`. Keep commits concise and action-oriented; Conventional Commits such as `feat(admin): add gallery sorting` are encouraged.

Pull requests should describe scope, user-facing impact, linked tasks, screenshots for UI changes, and the commands run for verification.

## Security & Configuration Tips
Do not commit secrets, PocketBase admin credentials, or private API keys. Keep deployment URLs in `astro.config.mjs` and public contact/map links in `src/data/site.ts` accurate.
