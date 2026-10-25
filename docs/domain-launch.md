# proudpartners.org handover and launch

Prepared 25 October 2026. Expected handover: **Monday 26 October 2026**. Existing email must be preserved.

Recommended arrangement: GitHub Pages hosts the website; Cloudflare manages DNS; the current mail provider continues hosting the mailboxes; Supabase and Resend deliver contact-form messages. Moving domain registration to Cloudflare is not required for its DNS setup.

## Prepare before the handover

- [ ] Get a complete DNS zone export from the current provider, including mail-related records and subdomains, and confirmation that the existing email hosting will remain active after the transfer. A domain transfer does not migrate mailboxes.
- [ ] Create/sign in to Cloudflare, add `proudpartners.org` on the Free plan, and import/review that export. Leave the existing website and mail values in place during staging. Stop before changing nameservers.
- [ ] Compare the imported zone with the full export: MX, SPF/TXT, DKIM, DMARC, mail-server addresses, autodiscover and any SRV records. Cloudflare's automatic scan can miss records. [Review DNS records](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/), [import records](https://developers.cloudflare.com/dns/manage-dns-records/how-to/import-and-export/).
- [ ] Obtain registrar access for tomorrow and note Cloudflare's two assigned nameservers.
- [ ] Finish as much of the [contact-form setup](contact-email-setup.md) as possible.
- [ ] Commit/sync the final website changes to GitHub when ready, and confirm the existing Pages build passes on the preview URL.

I saved a [public DNS snapshot](source/proudpartners-dns-before-launch-2026-10-25.json). It showed `ns1.worldnic.com`, `ns2.worldnic.com`, and website address `66.235.200.2`. It did not provide a complete mail configuration. **This snapshot cannot replace the provider's full zone export.**

## Evening cutover

1. If the full zone is confirmed, change nameservers to Cloudflare's assigned pair and confirm Cloudflare reports Active. If DNSSEC is enabled, follow Cloudflare's migration steps before switching, then re-enable it after activation. [Nameserver setup](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/).
2. Verify the domain through **GitHub profile Settings → Pages → Add a domain**, using GitHub's generated TXT record. [Domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).
3. In **Quino97/proud-partners → Settings → Pages**, save `proudpartners.org` as the custom domain, then apply only the website records below. Keep the imported mail configuration intact.

| Type | Name | Value | Cloudflare setting |
| --- | --- | --- | --- |
| A | `@` | `185.199.108.153` | DNS only |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| CNAME | `www` | `quino97.github.io` | DNS only |

Replace the old website address; do not leave conflicting website A/AAAA/CNAME records. Check with the mail provider first if mail delivery relies on the root website IP. `www` points to the account hostname, without `/proud-partners`. GitHub handles the www-to-root redirect. [GitHub's DNS values](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

4. In **Actions → Deploy Proud Partners to GitHub Pages → Run workflow**, run the latest `main`. Our workflow already uses GitHub's `base_path` output, so the custom-domain build uses root asset paths. Do not hard-code `/proud-partners` for the new domain.
5. Enable **Enforce HTTPS** when GitHub makes it available. DNS and certificate readiness can take up to 24 hours; allow time for both. [HTTPS availability](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
6. Verify the Resend sending subdomain and complete the form test. The prepared allowed-origins value already includes both domain variants.

If the mail records are not confirmed, keep the existing nameservers and configure the website through the current DNS provider first. Move DNS to Cloudflare later using the verified zone export.

## Final checks

- [ ] `https://proudpartners.org` and `https://www.proudpartners.org` reach the intended site with valid HTTPS.
- [ ] Directly open `/projects/`, `/consular-ball/2024/`, `/contact/` and `/admin/`; confirm photos and PDF links load.
- [ ] The latest intended content is published from admin, and a content backup has been exported.
- [ ] The contact message arrives at the Plexus address and Reply targets the visitor.
- [ ] Existing domain mailboxes can send and receive mail from an unrelated address.
- [ ] Keep the old DNS export and mail hosting available while confirming the handover.

No nameservers, DNS records, GitHub settings or live email services were changed by preparing this guide.
