# Verification record — 16 October 2026

- Source build and JavaScript syntax checks passed.
- 18 automated tests passed: HTTP/database authentication, CSRF, tenant isolation, persistence, queue/results, truthful provider failures, frontend rendering/export, URL/network restrictions, DNS pinning, robots, HTML checks, PageSpeed fixtures, authenticated token encryption, property coverage and AI payload boundaries.
- Final crawler/UI hardening checks repeated: 6 targeted tests passed.
- npm audit reported zero known vulnerabilities in installed dependencies at the time of packaging. This is not an independent security audit.
- PostgreSQL semantics tested with PGlite; target Cloudways PostgreSQL and TLS configuration not yet verified.
- Live crawl attempt could not resolve thesynergycreative.nz in this development environment (EAI_AGAIN). Live outbound crawling must be verified on the host.
- Google OAuth, PageSpeed and AI tested with fixtures/configuration paths, not the owner’s real accounts or API keys.
- UI checked in a DOM harness; full visual/browser/device QA remains on the deployed app.
- Not deployed. No live site, existing Hub, customer database or external account was changed.
