# Synergy Hub Audit Studio developer handover

Read `AGENTS.md` and `README.md` before changes. The README is the feature/status/deployment authority. This is a production foundation requiring deployment configuration and real-account acceptance checks, not a completed commercial rollout.

Node.js 22+ serves the approved audit interface and JSON API. `pg` connects to a dedicated PostgreSQL database. A database-backed, manually triggered queue runs public HTML crawl checks, optional PageSpeed and optional owner-permitted AI analysis. Google OAuth tokens use AES-256-GCM with per-site authenticated data. GA4/Search Console results are refreshed on request. All site resources are tenant scoped.

No third-party secrets or real accounts are included. Owner creation/reset are terminal scripts, not public unauthenticated endpoints. `public/app.js` does not use the earlier demo model or sample analytics. Report-only printing preserves the designed report; the direct PDF is a text summary using standard fonts.

Validation: `npm ci`, `npm run build`, `npm test`, `npm audit --omit=dev`. Tests use in-memory PostgreSQL/PGlite, a DOM harness and provider fixtures. Complete live acceptance on the Cloudways target before telling customers services are connected.
