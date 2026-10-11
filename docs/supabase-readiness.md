# Supabase setup

The website now uses Supabase in the browser for two narrowly scoped jobs:

- a single `site_content` row stores editable website content;
- the `site-media` bucket stores editor-uploaded images.

Public visitors can read the published content and public media. Only Supabase accounts added to `site_admins` can edit content or upload images. The application never contains a Supabase secret or service-role key.

## One-time dashboard setup

1. In **Supabase Dashboard → SQL Editor**, run [the migration](../supabase/migrations/20261011_initial_content.sql).
2. In **Authentication → Users**, create the email/password account that Isabel or the site editor will use. Do not enable public sign-ups.
3. In SQL Editor, run the commented final command in the migration with that account’s email to grant editor access.
4. Open `/admin/`, sign in with that email and password, and press **Save changes** once. That safely imports the current site's content into Supabase.

## GitHub Pages configuration

In GitHub: **Settings → Secrets and variables → Actions → Variables**, add these two repository variables:

| Name | Value |
| --- | --- |
| `PUBLIC_SUPABASE_URL` | Your project URL, for example `https://project-ref.supabase.co` |
| `PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Your `sb_publishable_...` key |

They are intentionally build-time public values. The database policies—not obscurity—protect writes. Never add a `service_role`, `secret`, or database password to GitHub or this app.

After the variables are set, each build publishes a static site that loads its editable content directly from Supabase. A new static build remains necessary when adding a brand-new project URL, because GitHub Pages needs a generated page for that route.
