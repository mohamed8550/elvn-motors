# Initial security review — 13 November 2026

Scope: current tracked HTML/JS, deployment workflow, public HTTP response. This is a limited source review, not a penetration test or a guarantee of security. GitHub/IONOS account MFA, collaborator access, repository history and DNS-account settings have not been audited.

## Observations

- HTTPS loads and HTTP redirects to HTTPS in the current live check.
- No passwords or private API credentials were found in the reviewed application files. This does not constitute a full secret scan of repository history.
- There are no public write endpoints, authentication flows or server database in this version. Visitors cannot save inventory through the current website.
- Inventory JSON, photographs and internal vehicle IDs are public. IDs are identifiers, not secrets or authorization tokens. Future drafts, purchase costs, customer records and private notes must be stored separately and never placed in this JSON or public repository.
- Vehicle text is rendered using textContent. innerHTML is used for hardcoded translation strings; never replace these strings with untrusted admin input without sanitization or safe text rendering.
- The prior workflow uploaded the repository root. It now packages a public-file allowlist, excluding markdown documentation, environment files and future backend directories. Files already in a public repository remain public even when excluded from deployment.
- The live response did not show CSP or frame-related security headers. A restrictive HTML CSP and referrer policy were added as partial hardening. Meta CSP cannot enforce frame-ancestors; configure response headers on production hosting/reverse proxy before enabling administration.

## Demo boundary

admin-demo.html is deliberately a public, noindex design prototype, not a secured administration portal. It contains only existing public inventory, has no credentials and no live-write capability. Edits and uploaded photo previews exist only in the browser tab and disappear on reload. Client upload checks here are UX checks, not server security.

## Production launch requirements

1. Invite-only administrator accounts; public signup disabled; MFA required server-side for writes; authenticated does not automatically mean administrator.
2. Server/database authorization: public reads only for published vehicles; allowlisted administrator IDs for writes; no self-assignable roles. Enforce immutable unique ELVN IDs and validate all changes server-side.
3. If using Supabase: enable RLS, least-privilege table and storage grants, deny anonymous writes, protect drafts/private fields, and never expose service-role/secret keys in a browser. Verify anonymous and non-admin write attempts are denied before connecting the live inventory.
4. Upload size/type limits enforced server-side, decode/re-encode accepted raster images, strip metadata, reject SVG/HTML/executable uploads and use generated object names. Only published images may be public; draft images require private storage.
5. Secure session expiry/logout, MFA and recovery testing, rate limits, restrictive CORS; CSRF protection for cookie-based write endpoints. Never store credentials in GitHub.
6. Separate staging from production, audit log with actor/time/changes, backups with restore test, optimistic concurrency to avoid overwriting another editor's work.
7. Account security: review GitHub and IONOS owners/collaborators, enable MFA, review deploy permissions and dependency update process.

No production backend has been provisioned. Owner account/provider selection is required for the next stage.
