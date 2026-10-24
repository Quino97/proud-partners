# Proud Partners

SvelteKit charity website, updated to Piet’s October 2026 brief. Public pages use a shared editorial layout and reusable project tiles. The site can be built for GitHub Pages; shared editing uses Supabase.

## Local development

Use Node.js 24 and run:

```powershell
npm ci
npm run dev
```

The usual address is `http://localhost:5173/`. Copy `.env.example` to `.env` and fill in the public Supabase project URL and publishable key. Private email keys belong in Supabase Edge Function secrets, never in these public variables.

## Website editor

Open `/admin/` and sign in with an existing Supabase editor account. Accounts must be listed in `site_admins`, as described in the initial SQL migration. The old temporary username/password is no longer the editor’s sign-in method.

- Choose a page from the searchable, ordered sidebar.
- Open a section to change headings, paragraphs, photos, links or videos.
- Use **Choose from photos** to find the supplied photographs by their original folder names, or upload a replacement.
- Change each page’s tile separately from its full story. Home’s three featured tiles have their own wording and image choices.
- Reorder sections, photographs and tiles with the arrow buttons. Add or remove projects and Ball years, or hide a page from tiles.
- Edits are automatically saved as a draft in the current browser. **Preview** opens that draft without publishing it.
- **Publish changes** saves the complete website content to Supabase. **Export backup** downloads a portable JSON backup.
- On localhost only, **Edit a local draft** allows reviewing the editor without an account. It cannot publish to Supabase.

Uploading a photo stores the file in Supabase immediately; it appears on public pages only after the edited content is published. Removing a photo from a page does not permanently delete its file.

## Content and assets

`data/content.json` is the complete editable, version-3 content model and the initial static build content. `src/lib/content/site.ts` defines its types. An older version-2 Supabase record cannot replace this new structure; signing in to the editor offers the imported copy for explicit publication.

The import preserves Piet’s copy word for word. Source records are retained in:

- `docs/source/piet-2026-10-24.txt`: extracted brief, including implementation instructions kept separate from public copy.
- `docs/source/photo-map.json`: supplied image filenames and their website asset paths.
- `docs/source/archive-media.json`: recovered original video URLs and yearly Consular Ball image sources.

Supplied images are optimised WebP copies in `static/assets/piet/`. The originals in Downloads were not changed. Recovered Ball photographs are in `static/assets/ball-archive/`.

The Projects page contains five categories in the requested order. Education has seven tiles, Music twelve and Childcare four. The Ball page has nine historical year tiles and the upcoming 2026 information. The Partners page and donation prompts have been removed; the old `/partners/` address redirects to Projects.

No 2024 Ball photographs were supplied, and the recoverable old archive stops in 2022. Its page and tile are ready for the correct images. The 2024 amount remains R900,000, separate from the cumulative fundraising total.

## Contact form email setup

The Contact page contains Name, Email, Phone and Message fields matching the old site. It does not display an organisation email address or telephone number. Messages are routed privately to `amouton@plexus.co.za`.

The form is implemented but email delivery requires the one-time setup in [docs/contact-email-setup.md](docs/contact-email-setup.md). It reports an error if delivery is unavailable and never pretends to send a message.

## Checks and builds

```powershell
npm run check
node scripts/verify-piet-content.mjs
node scripts/test-contact.mjs
npm run build
```

The copy verifier checks all 621 supplied copy paragraphs, local asset paths and tile references. The contact tests use mocked HTTP calls; they never send email.

The existing GitHub Actions workflow builds for Pages using `GITHUB_PAGES=true` and the repository base path. All 41 supplied page records are included in the static build. Adding entirely new pages later works through the client-side fallback; rebuild for a prerendered HTML version of those new addresses.

No deployment or database publication is performed by running the local editor’s preview.
