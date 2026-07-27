You are performing a security audit of a Zenara Designs client project. This is a Next.js 14 App Router site built for a professional services client (law firm, accountant, consultant, etc.). Work through every step below in order. Be specific — quote the exact file and line when flagging an issue. Output a structured report at the end.

The full security standard is in `blueprints/security.md`. Treat it as your reference throughout.

---

## Step 1 — Security Headers

Read `next.config.mjs`.

Check:
- All seven required headers are present: `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-DNS-Prefetch-Control`, `Content-Security-Policy`
- CSP uses conditional logic — `unsafe-eval` only in development, not in production
- CSP `script-src` does not contain `unsafe-eval` in the production branch
- If any third-party scripts, iframes, or fonts are loaded, the CSP has been updated to allow those specific origins
- No headers have been removed or weakened since the boilerplate

Flag: any missing header, any CSP that allows `unsafe-eval` in production, any third-party origin loaded without a corresponding CSP entry.

---

## Step 2 — Environment Variables

Read `.env.local.example`.

Check:
- All required vars are documented: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_SITE_URL`
- Any additional vars added for this project are documented with a comment explaining where to get the value
- No actual secret values are present in this file (only placeholder strings)

Search the entire codebase for `NEXT_PUBLIC_` prefixed variables:
- Confirm each one is genuinely public (site URL, analytics IDs)
- Flag any API key or secret prefixed with `NEXT_PUBLIC_`

Search for any hardcoded secrets — API keys, tokens, passwords — in source files:
- Search for patterns like `sk_`, `re_`, `Bearer `, `password:`, `secret:` in non-example files
- Flag any that appear to be real credentials

---

## Step 3 — API Routes

Read every file under `src/app/api/`.

For each route handler, verify:
1. **Input validation** — request body is parsed with `request.json()` inside a try/catch, then validated with Zod's `safeParse()` before any field is accessed
2. **Env var validation** — all required env vars are checked at the top of the handler; returns 500 with a generic message if any are missing
3. **Error responses** — 500 errors return generic messages, not `error.message` or stack traces
4. **HTTP method** — the handler only accepts the intended method (e.g. only `POST` for a contact form)
5. **Rate limiting** — present for any route that sends email, creates records, or triggers external services

For the contact route specifically, also check:
- Honeypot field (`website`) is checked server-side and returns 200 silently when populated
- Both emails (notification + confirmation) have correct `from`, `to`, and `replyTo` fields
- `from` email uses `CONTACT_FROM_EMAIL` env var, not a hardcoded address

---

## Step 4 — Form Security

Read `src/components/contact/contact.schema.ts` and `src/components/contact/ContactForm.tsx`.

Check the schema:
- All required fields have appropriate max length constraints
- Phone field regex requires at least one digit (not just punctuation)
- Honeypot field (`website`) is defined with `.max(0).optional()`
- No field accepts unlimited input

Check the form component:
- Honeypot field is hidden via CSS off-screen (`left-[-9999px]` or equivalent), not `display: none` or `visibility: hidden` (which some bots detect)
- Honeypot has `tabIndex={-1}` and `autoComplete="off"`
- Wrapper has `aria-hidden="true"`
- Form uses `noValidate` so browser validation doesn't interfere with custom messages

---

## Step 5 — Dependency Audit

Run:
```bash
npm audit
```

Report:
- Number of high and critical vulnerabilities
- Which direct dependencies are affected (if any)
- Recommended action for each (update, investigate, or acceptable risk)

---

## Step 6 — Secrets Scan

Search the codebase for potential secret leaks. Run the following searches and report findings:

- Grep for `sk_live`, `sk_test`, `re_` (Resend key pattern), `Bearer`, `apiKey:`, `api_key` in non-example source files
- Check `src/` for any hardcoded email addresses that should be env vars
- Check that `.env.local` (if present) is listed in `.gitignore`
- Verify `node_modules` and `.next` are in `.gitignore`

---

## Step 7 — Image Sources

Read `next.config.mjs` images configuration.

Check:
- `remotePatterns` is used (not the deprecated `domains` array)
- No wildcard hostnames (`**`) are present
- Only domains the project explicitly needs are listed

---

## Step 8 — Cookie and Storage Usage

Search the codebase for:
- `document.cookie` — should never appear; flag any occurrence
- `localStorage.setItem` / `localStorage.getItem` — flag if used for anything sensitive
- `sessionStorage` — flag if used for anything sensitive

If cookies are used anywhere, verify they are accessed via `next/headers` in server context.

---

## Final Report

Output a report with these sections:

### ✅ Passing
List everything that checked out correctly.

### ⚠️ Issues Found
For each issue:
- **File**: exact path
- **Issue**: what is wrong
- **Risk**: what could go wrong
- **Fix**: exact change needed

### 📋 Pre-Deploy Security Checklist
Output the checklist from `blueprints/security.md` Section 10 with each item marked [x] (passing) or [ ] (needs attention) based on your findings.
