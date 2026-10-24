# Enable Contact form email

The website form is ready. Complete these steps once to enable real delivery to `amouton@plexus.co.za`. Do not put a Resend key or Supabase service-role key in GitHub public variables or browser code.

1. In Resend, verify a domain you control and create a sending API key. Choose a verified sender such as `Proud Partners <website@your-domain.co.za>`.
2. In Supabase **SQL Editor**, run `supabase/migrations/20261024_contact_rate_limit.sql`. The original `20261011_initial_content.sql` migration should already be installed for the editor.
3. In Supabase **Edge Functions → Secrets**, add:

   | Secret | Value |
   | --- | --- |
   | `RESEND_API_KEY` | Your private Resend sending key |
   | `CONTACT_FROM` | The verified sender address, optionally with `Proud Partners` as the display name |
   | `CONTACT_ALLOWED_ORIGINS` | Comma-separated origins, for example `https://quino97.github.io,http://localhost:5173,http://127.0.0.1:5173` |
   | `CONTACT_TO` | Optional; defaults to `amouton@plexus.co.za` |

   Origins have no path or trailing slash. For a custom domain, include its full `https://` origin too. Supabase normally provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` automatically. If your project disables the legacy service-role key, add its new private server secret as `SB_SECRET_KEY` instead.

4. Deploy the function named **contact**, using `supabase/functions/contact/index.ts`. Disable **Verify JWT** for this public form endpoint. The repository also specifies this in `supabase/config.toml`.

   If using the Supabase CLI, from this repository run:

   ```powershell
   supabase login
   supabase link --project-ref vgvydyjnqzuvvbwhzpno
   supabase functions deploy contact --no-verify-jwt
   ```

5. Submit a real message from the website and check its arrival. Replies should go to the visitor’s email address. A successful browser confirmation appears only after the email provider accepts the message; final inbox delivery should be checked separately.

The function validates the fields, rejects unapproved browser origins, uses a hidden bot trap and limits each IP fingerprint to five attempts per hour, with a site-wide cap of 100 per 24 hours. Limits are stored in Supabase; form messages and raw IP addresses are not stored there. Duplicate submissions use a provider idempotency key.

The page uses `supabase.functions.invoke('contact')`, so email works with the GitHub Pages static build without a separate web server.

References: [Supabase email functions](https://supabase.com/docs/guides/functions/examples/send-emails), [Supabase function authentication](https://supabase.com/docs/guides/functions/auth), [Resend idempotency keys](https://resend.com/changelog/idempotency-keys).
