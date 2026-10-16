# Synergy Hub Audit Studio

Preserve the approved centred Audit Studio design and Synergy Hub branding. This repository is the separate Node.js/PostgreSQL audit service, not the main Hub or ecommerce/POS demo.

- Never substitute sample scores, fake account connections or AI estimates for measured data.
- Every tenant-owned read/write must bind `tenant_id` from the server session, not from client input.
- All writes require same-origin and the session CSRF token. Never send tokens, password hashes, API keys or database credentials to the browser.
- Use the DNS-pinned public IPv4 fetcher for user-supplied website URLs. Preserve redirect, private-network, body-size, timeout, scope and robots restrictions.
- Keep AI editorial output separate from technical evidence and search/analytics measurements. Require explicit website owner permission for AI context transfer.
- Do not enable a credential vault, publishing, billing, outgoing emails, schedules or PDF/DOCX extraction without implementing and testing the actual service.
- Schema lives in `lib/db.mjs`; app routes in `server.mjs`; browser UI in `public/app.js`; crawler/providers/queue under `lib`.
- Run `npm run build` and `npm test` after functional changes. Provider fixtures are not proof of live integration. Record verification limits honestly.
- Do not commit `.env`, runtime records, tokens or local database data.
