# Supabase readiness

The site remains entirely local. This note records the intended production boundary without creating a Supabase project, remote repository, deployment configuration or secrets.

## Existing boundary

All page and admin code works with the typed `SiteContent` object. Server persistence is isolated behind `ContentRepository` in `src/lib/server/content.ts`.

- `LocalJsonContentRepository` reads and writes `data/content.json` for local development.
- A future `SupabaseContentRepository` can implement the same `read()` and `write()` methods.
- Components and routes should continue to depend on the repository functions, never on the Supabase client directly.

## Recommended first production schema

For the first deployment, preserve the current editor’s atomic save behaviour with a versioned `site_content` row containing the complete content object in a `jsonb` column. This avoids prematurely splitting a small editorial model across many tables.

Use a Supabase Storage bucket for uploaded images and store public object paths in the same fields that currently contain `/uploads/...` or `/assets/...` paths.

If multiple editors, partial updates or content history become requirements, the structured arrays already provide clean candidates for later tables: projects, project gallery images, initiatives, Consular Ball years and partners.

## Production authentication

The temporary `admin` / `password` login is strictly local. Before deployment, replace the in-memory session implementation with Supabase Auth, keep service-role credentials server-only and protect content/storage mutations with row-level security policies.

## GitHub setup

When the repository is created, commit source code, default content and curated static assets. Do not commit `.env` files, Supabase service keys, generated build output or runtime uploads. Add deployment and CI only after the production host and Supabase environment have been chosen.
