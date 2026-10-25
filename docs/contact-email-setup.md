# Finish the contact form

Prepared 25 October 2026 for Supabase project `vgvydyjnqzuvvbwhzpno`.

The form and email function are implemented. Real email delivery still requires your private Resend key, a verified sender and a deployed function. Messages go to **amouton@plexus.co.za**; Reply goes to the visitor.

Read-only endpoint check on 25 October returned **404 — Requested function was not found** for `contact`. Deploying the function in step 4 is still required; the email-delivery step has not been completed.

## 1. Prepare Resend

1. Create/sign in to your [Resend account](https://resend.com).
2. Under Domains, add `notifications.proudpartners.org` for website sending. Once you have DNS access, copy Resend's exact DNS records into the active DNS provider and verify the domain. Preserve the existing root-domain mail records. Receiving email in Resend is not required.
3. Create an API key with sending permission, preferably restricted to this verified domain. Save it directly in Supabase Secrets in step 3.

Resend supports verified sending subdomains; this keeps website sending separate from existing mail. [Domain guidance](https://resend.com/docs/dashboard/domains/introduction), [DNS verification](https://resend.com/docs/add-a-domain), [API keys](https://resend.com/docs/dashboard/api-keys/introduction).

**Before tomorrow:** if you already control another verified sending domain, use a sender on that domain temporarily and test the whole form now. Otherwise prepare the account, function and settings now, then complete verification when DNS access arrives. Resend's `onboarding@resend.dev` test sender cannot deliver to arbitrary recipients such as the Plexus address unless it is your account email. [Test-sender restriction](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).

## 2. Install the contact rate limiter

In your Supabase project, open **SQL Editor → New query**. Paste the complete contents of [20261024_contact_rate_limit.sql](../supabase/migrations/20261024_contact_rate_limit.sql), then Run. It can be run again safely.

This is separate from the existing content/editor migration. It creates the private counters used by this contact function.

## 3. Add Supabase Edge Function secrets

Open **Edge Functions → Secrets**. Add:

| Name | Value |
| --- | --- |
| `RESEND_API_KEY` | Your private Resend sending API key |
| `CONTACT_FROM` | `Proud Partners <website@notifications.proudpartners.org>` — use your actual verified sender domain |
| `CONTACT_TO` | `amouton@plexus.co.za` |
| `CONTACT_ALLOWED_ORIGINS` | The complete comma-separated value below |

```text
https://proudpartners.org,https://www.proudpartners.org,https://quino97.github.io,http://localhost:5173,http://127.0.0.1:5173
```

Origins contain no path or trailing slash. This already includes tomorrow's domain and the current preview addresses.

Supabase normally supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the function. If the legacy service-role key is unavailable in your project, add the project's private server key as `SB_SECRET_KEY` in this same Secrets screen. These private keys belong only in Supabase; never in GitHub repository variables, browser code or a chat message. The existing public website keys need no change.

This function does not use the Authentication → SMTP settings.

## 4. Deploy the existing function

No local CLI is required:

1. Open **Edge Functions → Deploy a new function → Via Editor**.
2. Name it **contact** and replace the default `index.ts` with the complete contents of [supabase/functions/contact/index.ts](../supabase/functions/contact/index.ts).
3. Deploy it. In this function's settings, turn **Verify JWT** off: visitors submit without logging in. The function applies its own origin, input, bot-trap and rate-limit checks.
4. If `contact` already exists, update that function rather than creating a second one.

[Supabase dashboard deployment](https://supabase.com/docs/guides/functions/quickstart-dashboard), [public function authentication](https://supabase.com/docs/guides/functions/auth).

CLI alternative, from this repository if the Supabase CLI is installed:

```powershell
supabase login
supabase link --project-ref vgvydyjnqzuvvbwhzpno
supabase functions deploy contact --no-verify-jwt
```

## 5. Confirm real delivery

- [ ] Submit from `http://127.0.0.1:5173/contact/` using a real email address you can check.
- [ ] Confirm the success message, then confirm the email actually arrives at `amouton@plexus.co.za`, including spam/junk checks.
- [ ] Check Resend's email log for its delivered status. Provider acceptance alone is not inbox delivery.
- [ ] Confirm Reply addresses the visitor, not the website sender.
- [ ] Repeat from the final `https://proudpartners.org/contact/` after launch.

Use the website form for the test: the function expects an allowed Origin header, so an unconfigured dashboard Test request can return 403.

If delivery fails, check the function logs and Resend log:

| Status | Check |
| --- | --- |
| 401 before the function runs | Verify JWT is off for `contact` |
| 403 | Exact website origin appears in `CONTACT_ALLOWED_ORIGINS` |
| 429 | Five attempts per IP per hour, or 100 per day across the site, has been reached |
| 502 | Resend sender domain, API-key permission and provider log |
| 503 | Required secrets and the SQL migration are installed |

The website remains static on GitHub Pages; Supabase runs the email function. The database keeps rate-limit counters, not form messages or raw IP addresses. Resend processes the email content as the delivery provider.
