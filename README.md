# Proud Partners

A clean, content-first SvelteKit website for Proud Partners. Local development uses the Node adapter so the temporary JSON admin can save content; GitHub Pages uses a separate static build.

## Run locally

```powershell
npm install
npm run dev
```

Then open the local address printed by Vite (normally `http://localhost:5173`).

## Admin portal

Open `http://localhost:5173/admin` and sign in with the temporary local credentials:

- Username: `admin`
- Password: `password`

The portal edits site identity, navigation, Home, About, Projects, the Consular Ball year archive, Partners, support links and all managed image choices. It can add and remove projects, project-gallery photographs, Consular Ball years, partners, paragraphs, initiatives and external links.

Saved content is stored in:

- `data/content.json`

Before each save, the previous version is copied to:

- `data/content.backup.json`

Uploaded images are stored in:

- `static/uploads`

The original default content remains in:

- `src/lib/content/site.ts`

To replace the temporary credentials, copy `.env.example` to `.env` and change `PP_ADMIN_USERNAME` and `PP_ADMIN_PASSWORD`. The current login is for local development only; it must be replaced before any public hosting.

Original supplied images live in:

- `static/assets/images`

Curated photographs migrated from `proudpartners-organized` live in:

- `static/assets/images/archive`

The body typeface is the locally hosted Nugo Sans file at:

- `static/assets/fonts/NugoSans.ttf`

Page layouts are in `src/routes`, while shared interface components are in `src/lib/components`.

## Useful commands

```powershell
npm run check
npm run build
npm run preview
```

## Current content notes

- There is deliberately no contact page or general contact form.
- Support links lead directly to featured partner organisations.
- The Nianell motivational project is included within Education rather than as a separate project.
- The Consular Ball has its own page with an editable year selector and historical fundraising milestones.
- The Partners page separates core donors and project collaborators through an editable category filter.
- Six project pages include editable galleries curated from the organized legacy archive. Duplicate thumbnails, shared legacy branding and the old Contact page were deliberately excluded.
- The home video area is ready for the children's “What do you want to become?” video. Add its YouTube or Vimeo embed URL in Admin → Home once the original link is available.
- `static/robots.txt` allows search indexing for the public deployment.

## GitHub Pages

The workflow at `.github/workflows/deploy-pages.yml` builds and deploys the public site whenever `main` is pushed. It reads the correct repository base path from GitHub, so both `https://quino97.github.io/proud-partners/` and a future custom domain are supported.

In GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**. Then push the current changes to `main` and watch the **Actions** tab for the deployment to finish.

GitHub Pages is static, so `/admin` and the local JSON upload/save endpoints are not included in the deployed website. They continue to work locally. Content persistence is accessed through the `ContentRepository` interface in `src/lib/server/content.ts`; the current implementation can later be replaced with Supabase without changing the public page components. See `docs/supabase-readiness.md` for the intended boundary.

See `docs/codebase-audit.md` for the source-project review and removal decisions.

