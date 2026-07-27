# Security Blueprint
# Zenara Designs — applies to every client project

---

## Philosophy

Our clients are law firms, accountants, and financial advisors. Their websites do not handle payments or authentication, but they collect contact information and carry their professional reputation. A defaced site or a leaked submission is a trust disaster. Security is not optional.

The standard: treat every form submission as hostile, every env var as a secret, and every third-party dependency as a liability.

---

## 1. HTTP Security Headers

Already configured in `next.config.mjs`. Review before each deploy — do not remove headers to fix bugs.

### Current headers and what they do

| Header | Value | Purpose |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS for 2 years; prevents SSL stripping |
| `X-Frame-Options` | `SAMEORIGIN` | Prevents clickjacking — site can't be iframed by another domain |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing attacks |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Sends referrer to same-origin only; hides path from third parties |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disables browser APIs the site never uses |
| `X-DNS-Prefetch-Control` | `on` | Allows DNS prefetch (safe; improves performance) |
| `Content-Security-Policy` | See below | Controls what the browser is allowed to load |

### Content Security Policy

The CSP in `next.config.mjs` is conditional — `unsafe-eval` is present in development (required for Next.js hot reload) and removed in production.

```
default-src 'self'
script-src 'self' 'unsafe-inline'          ← prod (no unsafe-eval)
style-src 'self' 'unsafe-inline'
img-src 'self' blob: data:
font-src 'self'
object-src 'none'
base-uri 'self'
form-action 'self'
frame-ancestors 'none'
upgrade-insecure-requests
```

**When you add a third-party service, update the CSP.** Common additions:

| Service | Directive to add |
|---|---|
| Google Analytics / GTM | `script-src` + `https://*.google-analytics.com` + `https://*.googletagmanager.com`; `img-src` + `https://*.google-analytics.com` |
| Google Fonts (avoid — use next/font) | `font-src https://fonts.gstatic.com`; `style-src https://fonts.googleapis.com` |
| Intercom / Zendesk chat | `script-src` + their CDN domain; check their docs |
| YouTube embeds | `frame-src https://www.youtube-nocookie.com` |
| Calendly / Acuity | `frame-src https://calendly.com` etc. |

Never add `unsafe-eval` to production. If a library requires it, find an alternative.

---

## 2. Environment Variables

### Rules

- **Never commit secrets.** `.gitignore` blocks `.env*` — do not override this.
- **`NEXT_PUBLIC_` prefix exposes the value to the browser.** Only use it for values that are genuinely public (site URL, analytics IDs). Never prefix API keys.
- **Set all production values in Vercel dashboard** under Settings → Environment Variables. Use separate values for Preview and Production where relevant (e.g. a test Resend key for previews).
- **Document every var in `.env.local.example`** with a comment explaining where to get the value. Never put real values in this file.

### Required vars (every project)

```
RESEND_API_KEY          — from resend.com dashboard (server only)
CONTACT_FROM_EMAIL      — verified sender domain in Resend (server only)
CONTACT_TO_EMAIL        — receives form submissions (server only)
NEXT_PUBLIC_SITE_URL    — production URL, no trailing slash
```

### Validating presence at runtime

For any API route that requires env vars, validate all of them before any logic runs and return 500 if any are missing. Never let a missing var cause a silent failure downstream.

```typescript
const apiKey = process.env.RESEND_API_KEY
const toEmail = process.env.CONTACT_TO_EMAIL
const fromEmail = process.env.CONTACT_FROM_EMAIL

if (!apiKey || !toEmail || !fromEmail) {
  console.error('[contact] Missing required env vars')
  return NextResponse.json({ error: 'Service not configured.' }, { status: 500 })
}
```

---

## 3. Form Security

Every form in the project goes through three layers of protection.

### Layer 1: Client-side validation (UX only)

Zod schema via `react-hook-form` + `@hookform/resolvers`. Catches errors before submission and gives the user immediate feedback. **This is not security** — a user can bypass it entirely.

### Layer 2: Server-side validation (security)

The API route re-validates the body with the same Zod schema. Always. Even if the client already validated.

```typescript
const result = contactSchema.safeParse(body)
if (!result.success) {
  return NextResponse.json({ error: 'Invalid form data.' }, { status: 422 })
}
```

Never destructure `request.json()` directly without parsing. Never trust field names or types from the request body.

### Layer 3: Spam protection (honeypot + rate limiting)

**Honeypot** — the `website` field in the contact schema is hidden from real users. Bots that fill every field will populate it. The server checks it after schema validation and returns 200 silently (bots don't learn they failed).

**Rate limiter** — 5 requests per IP per 10 minutes (in-memory). For production sites receiving real traffic or with known spam problems, replace with Upstash Redis:
- Install `@upstash/ratelimit` + `@upstash/redis`
- See: https://upstash.com/docs/redis/sdks/ratelimit-ts/overview

### Payload size

The Zod schema enforces `message.max(2000)`. Next.js has a default body size limit of 1MB for API routes — more than enough for a contact form. Do not increase this limit.

### Error responses

Do not leak internal details to the client. Field-level errors from Zod are acceptable for form UX but do not expose stack traces, database errors, or service names. Use generic messages for 500 errors.

```typescript
// ✓ Acceptable
return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })

// ✗ Never
return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 })
```

---

## 4. Email (Resend)

- `from` address must use a **domain verified in Resend**. Using an unverified domain causes silent send failures.
- Set `replyTo` to the submitter's email so the client can reply directly from their inbox without exposing raw API routing.
- The confirmation email sent to the submitter uses `replyTo: toEmail` — replies go to the client, not back through the API.
- Never construct email HTML from user input without sanitising it. The current plain-text implementation avoids this entirely. If you switch to HTML email templates, use a library like `react-email` and never interpolate raw user strings into HTML.

---

## 5. Images

**Allowed sources** — `next/image` only fetches from domains listed in `next.config.mjs` `remotePatterns`. Do not use the deprecated `domains` array.

```javascript
// next.config.mjs
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'cdn.clientdomain.com' },
  ],
}
```

Only add domains you control or explicitly trust. Never use a wildcard hostname (`**`).

**User-uploaded images** — if a CMS allows client image uploads, validate MIME type and file size server-side before storing. Never serve user-uploaded files from the same origin as the app.

---

## 6. Cookies

Always use `next/headers` for cookie access in Server Components and API routes. Never use `document.cookie` in client code.

```typescript
import { cookies } from 'next/headers'
const cookieStore = cookies()
const token = cookieStore.get('token')
```

If adding session cookies: use `HttpOnly`, `Secure`, and `SameSite=Lax` flags. Never store sensitive data in `localStorage`.

---

## 7. Dependencies

### Before every deploy

```bash
npm audit
```

Review high and critical severity findings. For vulnerabilities in direct dependencies, update immediately. For transitive dependencies, assess exposure (is the vulnerable code path reachable?) before force-patching.

### Adding new packages

Before adding any package:
1. Check npm weekly downloads and last publish date — abandoned packages are a liability
2. Check for known CVEs: `npm audit` after install
3. Flag it in `.claude/CLAUDE.md` under Stack Additions

Avoid packages that have not been updated in 12+ months for any security-adjacent function (auth, crypto, session, parsing).

---

## 8. API Routes

### General rules

- Every route that mutates state (`POST`, `PUT`, `DELETE`) must validate input with Zod
- Validate all env vars at the top of the handler before any logic
- Use `NextResponse.json()` consistently — never `Response` directly (loses type safety)
- Do not log sensitive user data (email addresses, phone numbers) at info level — only at error level and only enough to diagnose the issue

### CORS

Next.js API routes are same-origin by default. If you need to accept requests from a different domain (e.g. a separate frontend), add explicit `Access-Control-Allow-Origin` headers and restrict them to the specific allowed origin. Never use `*` for routes that accept form data.

---

## 9. Deployment (Vercel)

- **Branch protection** — main branch should require PR review before merge
- **Preview deployments** — use separate (lower-privilege) env var values. Never use production Resend API keys or real contact emails on preview branches.
- **Preview URL access** — Vercel preview deployments are publicly accessible by default. For client projects in active development, consider enabling Vercel Authentication on previews (Vercel dashboard → Settings → Deployment Protection) so only your team can access them.

---

## 10. Pre-Deploy Security Checklist

- [ ] `npm audit` — no high or critical unresolved vulnerabilities
- [ ] All env vars set in Vercel dashboard (not in committed files)
- [ ] `NEXT_PUBLIC_` prefix only on values that are genuinely public
- [ ] CSP updated if any new third-party scripts or iframes were added
- [ ] Contact form tested — valid submission delivers both emails, honeypot silently drops
- [ ] Rate limiter tested — 6th submission from same IP within 10 min returns 429
- [ ] No `console.log` statements leaking user data or secrets
- [ ] No hardcoded API keys, tokens, or passwords in source code
- [ ] Vercel preview protection enabled (if client site is confidential during build)
