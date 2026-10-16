# Synergy Hub Audit Studio — working foundation 1.0

This is a new Node.js/PostgreSQL application, separate from the earlier sample demo and from the main Synergy Hub. It retains the approved Audit Studio branding and centred window. It does not import or overwrite the existing Hub database.

**Status:** implementation and local automated tests completed. Not deployed or verified against a real Cloudways database, Google account, PageSpeed account or AI provider. The development environment could not resolve the live test website, so a live public crawl must be verified on the target host. Do not describe this release as a fully launched commercial service before the acceptance checks below pass.

## Implemented now

- Administrator-created business accounts; salted scrypt passwords; HttpOnly sessions; CSRF protection; account/IP attempt limits; sign-out and administrator password reset.
- Separate tenant business workspaces. Each website has its own profile, stored documents, tasks, approved draft notes, keyword ideas, access instructions, implementation requests and audit history.
- Durable PostgreSQL schema and database-backed audit queue. Results survive browser close and server restart. Stale interrupted jobs are failed clearly so they can be re-run; queued jobs are picked up again.
- Bounded, server-side public HTML crawling with robots.txt checks, fixed public IPv4 socket resolution, private/reserved network blocking, redirect checks, timeouts and body limits. Default 20 pages, configurable up to 50. No custom ports, protected account areas or cross-site crawl.
- Evidence-backed checks for HTTP failures, HTTPS, titles, descriptions, duplicates, H1 count, page language, viewport, canonical presence, missing image alt attributes, noindex directives and malformed JSON-LD. The score is the pass rate of implemented checks, not a Google ranking score or a full accessibility audit.
- Optional PageSpeed API connection for mobile/desktop Lighthouse results, opportunities and supplied field-data category. No score is invented if the API is absent or fails. Lab TBT is not labelled INP. Tests apply to the start page, not every crawled page.
- Optional Google OAuth with state, PKCE, encrypted per-site refresh tokens and property selection. Read-only Search Console queries/pages and GA4 top pages, countries, cities, channels and totals. GA4 is filtered to the selected hostname. Data is refreshed manually and separately timestamped.
- Optional OpenAI Responses structured editorial analysis, only after website owner permission. Uses public page extracts, confirmed brand fields and stored text documents. No website tools or publishing. AI output is labelled as unverified editorial guidance. No AI-readiness percentage or invented search volume is produced.
- Real-data HTML report, report-only printing, downloadable PDF text summary, audit JSON and action-plan CSV. Browser print-to-PDF retains the full visual report and Unicode text. Direct PDF summary uses standard PDF fonts and transliterates accented characters.

## Not implemented / not advertised as active

Automated website edits, unrestricted crawls, JavaScript rendering, external-link destination checking, full browser/device testing, Bing integration, AI answer-engine visibility measurement, keyword-volume/competitor data, PDF/DOCX parsing, credential vault, outgoing emails, scheduled audits, billing, public self-registration, staff invitations, self-service password-reset emails, and subscription management. These are follow-on work, not switches that will become live by deploying this ZIP.

TXT/Markdown documents work now. For a PDF brand guideline, export or copy reviewed text into a TXT document before upload. Implementation requests are saved in the database but no email is sent.

## Deploy separately on Cloudways Velocity

1. Unzip the package. Put the **contents** of `synergy-hub-audit-studio` in a new GitHub repository, for example `synergy-hub-audit-studio`. `package.json`, `package-lock.json`, `server.mjs`, `lib`, `scripts`, `public` and `test` must sit directly at repository root. Do not commit `.env`, passwords, tokens or a database dump.
2. Create a **separate** Velocity Node.js app and connect that repository. Do not replace The Synergy Creative, Sassy Sadie or Ocean Hunter app files.
3. Use Node **22 LTS or a supported newer LTS**, root `./`, install `npm ci`, build `npm run build`, start `npm start`, port **3000**. Set `PORT=3000` as well; configured application port and environment port must match. No static output directory.
4. Create a dedicated PostgreSQL database for this app. Set `DATABASE_URL` to the database connection string. URL-encode special characters in its username/password. Use verified TLS for a remote database (`DATABASE_SSL=true`; provide `DATABASE_CA` when needed). For a private local connection, follow the database provider's connection settings. Never set `rejectUnauthorized:false`.
5. Set the required environment values:

   | Variable | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `3000` |
   | `PUBLIC_APP_URL` | This app's exact HTTPS URL, no trailing path |
   | `DATABASE_URL` | Dedicated PostgreSQL connection string |
   | `DATABASE_SSL` | As required by the database connection |
   | `MAX_CRAWL_PAGES` | `20` initially |

   Copy names from `.env.example`; enter real secrets only in Cloudways settings. `PUBLIC_APP_URL` determines cookie and origin security. Update it when adding a custom domain; use one canonical application address.
6. Deploy. Schema creation runs on application startup. `/health` must return `{"status":"ok","mode":"production-foundation"}`. If the database is unavailable the application stops rather than silently using browser storage.
7. Open the application terminal in the deployed root directory. Run `npm run create-owner`. Enter the business name, owner email, a unique password of at least 12 characters, and `https://thesynergycreative.nz/` as the first website. Password entry is hidden. Keep it private; do not send it in chat. If your hosting terminal does not support interactive input, use an SSH terminal with a TTY.
8. Open the app's HTTPS URL and sign in. Do the first public-page crawl **before** enabling optional services. Configure database backups and a restore procedure with your hosting provider before storing customer information.
9. To add another customer workspace, run `npm run create-owner` again with a new business/email. Each invocation creates a separate tenant. Do not create clients by giving them your existing owner credentials.
10. To reset an account: `npm run reset-password`. This revokes all existing sessions for that user. Password-reset emails are not implemented.

One Node process handles web requests and the queue. Keep **one instance/process** for this first deployment. Jobs are serialised to limit load and provider spend. The database schema allows atomic job claims, but multi-instance rate limiting and deployment recovery need an operational review before scaling. Rate limits use the direct socket address; a reverse proxy may make several users share an IP bucket. Do not trust arbitrary forwarded headers to bypass it.

## Real speed measurement

Enable PageSpeed Insights API in the platform's Google Cloud project and set `PAGESPEED_API_KEY` on the server. Restrict the key appropriately for server use and permitted APIs. Run a new audit; mobile and desktop results should be timestamped. If Google refuses, times out or has no field data, the UI says so. API quotas and costs are the owner's responsibility.

## Real Google connections — configure once for the platform

1. Use a platform Google Cloud project. Enable Search Console API, Google Analytics Data API and Google Analytics Admin API.
2. Configure OAuth consent, the support email and authorised domains. For testing, add your own account as a test user. Consent/verification requirements depend on Google's configuration and requested scopes; complete the required review before customer rollout. Testing-mode authorisation can expire and is not a substitute for production approval.
3. Create a **Web application** OAuth client. Add the exact redirect URI:
   `https://YOUR-APP-HOST/api/google/callback`
4. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and `APP_ENCRYPTION_KEY` in Cloudways. Generate the last value once in a trusted terminal:
   `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
   Keep the key with your secure recovery records. Losing/changing it makes saved Google tokens unreadable; users must reconnect. Do not commit or paste secrets into chat.
5. Restart/redeploy with the new variables. In Connections, click **Connect Google**, authorise your account, **Choose properties**, save and **Refresh Google data**.
6. Each customer authorises their own account; they do not create their own Google Cloud project. The account must already have access to the selected properties. A matching Search Console property is enforced. GA4 data is restricted to the configured website hostname, so properties with a different hostname may correctly show no rows.

Disconnect removes this site's encrypted token and cached data. It does not revoke app-wide Google permissions that might be shared by other site connections; users can revoke access in Google account permissions if desired. No access/refresh token is returned to the browser.

## Optional AI editorial guidance

Set `OPENAI_API_KEY` and `OPENAI_MODEL` to a model available in your account that supports Responses structured outputs. On Brand & strategy, confirm your context, upload reviewed text documents and explicitly enable AI analysis permission. Run a new audit. Tokens, passwords and the business logo are not placed in the AI input. The app sends selected public-page extracts, brand fields and document text; provider terms and retention controls still apply. Output uses `store:false`. AI findings are labelled editorial and must be checked before implementation. Provider errors leave technical results usable.

## Verification before customer launch

- Sign in and out; confirm an unauthenticated `/api/sites` request is rejected. Confirm another customer account cannot open your website IDs or reports.
- Save a brand field, task and document; reload and restart the app; confirm all persist.
- Run The Synergy Creative audit. Confirm the actual title and page URLs match the live site. Check that skipped/blocked URLs, crawl limits and failures are honest.
- Add PageSpeed; run again; compare a result against the upstream service. Confirm mobile/desktop and lab/field labels.
- Connect your actual Google account; select the correct properties; compare dates and top rows with the provider UI. Verify disconnected/unavailable states.
- Enable AI only after confirming its data context and permissions. Review excerpts and suggested content for accuracy; do not assume model evidence is independently verified.
- Print only the report, open the PDF summary and export JSON/CSV. Reports must use the selected completed audit's data, not sample records.
- Confirm HTTPS, database backup/restore, secret recovery, correct domain and operational limits. This app has no billing or automatic public registration.

## Developer checks

Node 22+ and npm:

```
npm ci
npm run build
npm test
npm audit --omit=dev
```

The automated database tests use PGlite (a PostgreSQL build) in memory; production uses the `pg` driver against PostgreSQL. HTTP tests cover authentication, CSRF, tenant isolation, persistent data, queue handling, unavailable integrations and logout. Network/crawler tests cover reserved address rejection, DNS pinning, redirects, robots and HTML checks. Provider tests use fixtures, not real accounts. Interface tests render the real-data screens and verify PDF generation in a DOM harness; they are not visual browser/device QA.

Optional local development: load your own `.env` with `node --env-file=.env server.mjs`, use a separate development PostgreSQL database, `NODE_ENV=development` and `PUBLIC_APP_URL=http://localhost:3000`. CLI scripts can be run as `node --env-file=.env scripts/create-owner.mjs`. No `.env` file is loaded implicitly.

## Sources used for implementation

- Cloudways launch/deployment/database documentation: https://support.cloudways.com/en/articles/15550368-how-to-launch-an-application-on-cloudways-velocity ; https://support.cloudways.com/en/articles/16187473-how-to-manage-deployments-for-your-application-on-cloudways-velocity ; https://support.cloudways.com/en/articles/16188001-how-to-connect-and-manage-a-database-for-your-application-on-cloudways-velocity
- PageSpeed: https://developers.google.com/speed/docs/insights/v5/get-started
- Google OAuth: https://developers.google.com/identity/protocols/oauth2/web-server
- Search Console: https://developers.google.com/webmaster-tools/v1/api_reference_index
- GA4 Data API: https://developers.google.com/analytics/devguides/reporting/data/v1/basics
- Analytics Admin: https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1beta/accountSummaries/list
- Structured responses: https://developers.openai.com/api/docs/guides/structured-outputs
