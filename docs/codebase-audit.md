# Proud Partners rebuild: codebase audit

## Scope reviewed

The rebuild was informed by all three local source projects and the supplied media collection:

- `aeriasathletics.github.io/app` — the existing Svelte/SvelteKit Aerias application.
- `kindersvandiekoning-creator.github.io` — a separate charity-site reference.
- `proudpartnersbasicwebsitecopy` — the earlier Proud Partners prototype.
- `proudpartners-oldwebsite-assets` — archived Proud Partners imagery and source-site assets.

The public Proud Partners site was also reviewed to understand its information architecture, project order, image bands and surviving copy. No remote deployment or repository configuration was added.

## Reusable Aerias infrastructure identified

| Area | What was useful | Decision in the new base |
| --- | --- | --- |
| Layout | Root layout, persistent navigation/footer, route-based pages | Retained as a smaller SvelteKit shell with `Header` and `Footer` components |
| Navigation/footer | Responsive desktop/mobile navigation and a consistent site footer | Rebuilt without cart, account, shop or contact links |
| Typography/styling | Global design tokens, fluid type, consistent spacing and reusable surfaces | Reworked into a blue, white and cream token system; local Nugo Sans is the body face |
| Responsive utilities | Fluid containers, grid breakpoints, object-fit media and mobile navigation | Retained as lightweight global utility classes and component media queries |
| Media handling | Static assets, aspect-ratio crops and responsive full-width imagery | Retained; old images are presented with deliberate crops rather than stretched |
| Animation | Small entrance and interaction transitions | Replaced with one reusable IntersectionObserver reveal action with reduced-motion support |
| SEO/meta | Per-page Svelte `<svelte:head>` data | Centralised in a reusable `Seo` component with title, description, Open Graph and Twitter metadata |
| General UI | Buttons, cards, bands, section headings and responsive grids | Rebuilt as focused components: `ProjectCard`, `ImageBand`, `SectionHeading` and `VideoFeature` |
| Forms | Newsletter, account and transactional forms existed | No form was retained because the brief explicitly excludes direct contact and ecommerce |

## Ecommerce architecture identified in Aerias

The original application mixed the presentation layer with a complete storefront. The following areas were identified as ecommerce-specific and were not carried into the Proud Partners base:

- Product catalogue routes, product-detail routes, gender/category shop routes and product carousels.
- Product variants, sizes, pricing, availability and stock state sourced through Contentful.
- Cart state, cart drawer, quick-add modal, shipping progress and persistent browser cart data.
- Checkout routes, success handling, payment initialisation and Paystack/Supabase Edge integration.
- Customer authentication, verification, profile/account pages and Supabase session state.
- Orders, customer order history and ecommerce tracking events.
- Returns, shipping, size-guide and store policy experiences.
- Aerias-specific training, coaching, athlete, calculator and retail storytelling routes that do not belong to Proud Partners.
- Runtime integrations for Contentful, Supabase, EmailJS, Mailchimp and YAML/Markdown content parsing.

The new project has no product, variant, stock, cart, checkout, payment, customer-account or order models, routes, stores or API clients.

## Dependency decisions

The new `package.json` contains only the packages required to build, validate and run SvelteKit locally:

- Svelte and SvelteKit
- Vite and the Svelte Vite plugin
- Svelte Node adapter, used by the local file-backed content editor
- TypeScript and `svelte-check`

Removed from the new base because they are not required:

- `@supabase/supabase-js`
- `@emailjs/browser`
- `contentful`
- `marked`
- `yaml`
- Bootstrap, jQuery, AOS, Swiper, Isotope and GLightbox from the earlier static prototype

There are no analytics, tracking, deployment, GitHub Actions, hosted CMS credentials or CI/CD files in the rebuilt project.

## New content architecture

The defaults are defined in `src/lib/content/site.ts`; the local admin portal writes the active version to `data/content.json`. It holds:

- Primary navigation and organisation metadata.
- Home, About, Consular Ball, Partners and Support copy.
- Every project, image choice, banner, paragraph, initiative and external link.
- Consular Ball fundraising years and partner/donor directory entries.
- Curated, captioned galleries for each project, migrated from the organized legacy archive.
- The placeholder for the future video embed.

This keeps routine text, image and link updates out of layout components. The editor supports adding projects, project-gallery photographs, Consular Ball years, partners, paragraphs, initiatives, links and local image uploads. Each content save preserves the previous JSON as `data/content.backup.json`.

## Local admin architecture

- `/admin` is protected by a server-side, HTTP-only session cookie.
- Temporary defaults are username `admin` and password `password`; environment variables can override both.
- The credentials are never shipped into the browser bundle.
- Content saves and uploads require an authenticated local session.
- Uploaded images are written to `static/uploads` and become ordinary site assets.
- This is intentionally a local-development system, not production authentication or a hosted CMS.
- The server reads and writes through a `ContentRepository` contract. `LocalJsonContentRepository` is the current adapter; a future Supabase adapter can replace it without coupling Svelte components to a database SDK.

## Requirements represented in the build

- Home, About, Projects, Consular Ball and Partners are primary pages.
- Home retains the historic multi-photo masthead and uses the newer smiling-child portrait below the introduction.
- About omits the masthead, leads with the Isabel and Prieur image, and excludes “Our Story” and “In the Media”.
- Projects omits the home masthead and opens with the lightbulb image.
- Project detail pages keep their distinctive top and closing image bands.
- Consular Ball is separated from Projects and presents its archive through a compact year selector, with editable copy, images, milestones and highlights for every year.
- Partners has a category-filtered directory for core donors, event partners and project collaborators; every item and external link is editable.
- Nianell is part of Education, not a standalone category.
- Iris House and other available project organisations have direct external links.
- There is no Proud Partners/Isabel contact page, form, email address or phone number.
- The site supports long-form scrolling and responds down to mobile layouts.
- The visual system uses shades of blue, white and cream with Nugo Sans for a more contemporary body style.
- The organized legacy archive was curated rather than copied wholesale: higher-resolution source files were preferred, duplicate thumbnails and obsolete shared branding were omitted, and the old Contact page was not restored.

## Known content gap

The archived assets and reviewed pages did not expose the requested children's “What do you want to become?” video URL. A complete, responsive video feature is present on Home and will render the embed as soon as its URL is added in Admin → Home. Until then it shows a clear editorial placeholder rather than a broken player.
