# Production Readiness Blueprint
# Zenara Designs — Vercel deployment checklist for every client project

---

## Philosophy

A site is not done when the design looks right — it is done when it is fast, secure, findable, and provably working end-to-end. This blueprint is the final gate before any client site goes live. Work through it top to bottom. Nothing ships with an open item.

---

## 1. Codebase

- [ ] `npm run lint` — zero errors, zero warnings
- [ ] `npm run type-check` — zero errors
- [ ] `npm run build` — clean build, no errors, no warnings
- [ ] No `console.log` or `console.warn` left in source (errors in catch blocks are fine)
- [ ] No `TODO`, `FIXME`, or `PLACEHOLDER` comments in production code
- [ ] No hardcoded client data that should be in env vars
- [ ] `npm audit` — no high or critical unresolved vulnerabilities
- [ ] All placeholder boilerplate text removed from pages (no "Client Name", "update per client", etc.)

---

## 2. Environment Variables

Set all of these in the **Vercel dashboard** (Settings → Environment Variables) for the **Production** environment. Never in committed files.

**Required for every project:**

| Variable | Where to get it | Scope |
|---|---|---|
| `RESEND_API_KEY` | resend.com dashboard | Server |
| `CONTACT_FROM_EMAIL` | Verified sender in Resend | Server |
| `CONTACT_TO_EMAIL` | Client's preferred inbox | Server |
| `NEXT_PUBLIC_SITE_URL` | Production domain, no trailing slash | Public |

**Verification:**
- [ ] All four required vars are set in Vercel → Production environment
- [ ] `NEXT_PUBLIC_SITE_URL` matches the exact production domain (e.g. `https://smithlaw.ca`)
- [ ] `CONTACT_FROM_EMAIL` uses a domain verified in Resend (not zenaradesigns.com)
- [ ] Preview environment uses separate, lower-privilege values (test Resend key, internal contact email)
- [ ] `.env.local` is not committed — confirmed via `git log --all -- .env.local`

---

## 3. Domain and DNS

- [ ] Custom domain added in Vercel (Settings → Domains)
- [ ] DNS records configured at the registrar — Vercel shows green on all records
- [ ] `www` redirect configured (www → apex or apex → www, consistent)
- [ ] HTTPS is active — no browser certificate warning on the production URL
- [ ] Old domain or staging URL (`.vercel.app`) redirects to production domain, or is not publicly linked anywhere
- [ ] `NEXT_PUBLIC_SITE_URL` updated in Vercel env vars to match the final domain

---

## 4. Vercel Project Settings

- [ ] **Framework preset**: Next.js (auto-detected)
- [ ] **Root directory**: `.` (or the correct monorepo subdirectory if applicable)
- [ ] **Node.js version**: 20.x (matches local dev — check Vercel Settings → General)
- [ ] **Build command**: `npm run build` (default)
- [ ] **Output directory**: `.next` (default)
- [ ] **Deployment Protection**: enabled on Preview deployments if the project is confidential during build (Settings → Deployment Protection)
- [ ] **Ignored build step**: not configured unless intentional
- [ ] Team/org ownership confirmed — project is under the Zenara Designs Vercel team, not a personal account

---

## 5. Security

- [ ] Security headers present in `next.config.mjs` — all seven headers confirmed
- [ ] CSP validated — `unsafe-eval` absent from production CSP
- [ ] CSP updated for any third-party scripts or iframes added during build (analytics, maps, chat, booking)
- [ ] No API keys, tokens, or passwords anywhere in committed source code — run: `git grep -i "sk_\|re_\|bearer\|password\|secret" -- src/`
- [ ] Contact form: honeypot rejection tested — submit with the hidden field populated, confirm 200 returned and no email sent
- [ ] Contact form: rate limiter tested — submit 6 times in quick succession from same IP, confirm 6th returns 429
- [ ] `NEXT_PUBLIC_` prefix confirmed only on values safe to expose to the browser

---

## 6. Contact Form — End-to-End Test

Run this test on the **production URL** after deployment, not localhost.

- [ ] Submit the form with valid data
- [ ] Client notification email received at `CONTACT_TO_EMAIL` — check subject, body, reply-to
- [ ] Confirmation email received by the submitter — check subject, body, sender name
- [ ] `from` address in both emails shows the client domain (not zenaradesigns.com)
- [ ] Replying to the confirmation email routes to the client's inbox (reply-to is correct)
- [ ] Form shows success toast and resets after submission
- [ ] Submit with invalid data — form shows field-level errors, no email sent
- [ ] Submit with missing required fields — form blocked by client-side validation

---

## 7. Content and Copy

- [ ] All content reviewed and approved by the client in writing (email or message is sufficient)
- [ ] Firm name spelled correctly and consistently across all pages
- [ ] Phone number correct and formatted consistently
- [ ] Email address correct
- [ ] Physical address correct (if shown) — matches Google Business Profile exactly
- [ ] All links tested — no broken internal or external links
- [ ] All images are final (not stock placeholders) and have proper alt text
- [ ] No lorem ipsum, placeholder headings, or "TBD" copy anywhere
- [ ] Legal pages present if required: Privacy Policy, Terms of Use (especially if collecting contact data)

---

## 8. SEO

- [ ] `siteConfig.name` — real firm name, not "Client Name"
- [ ] `siteConfig.description` — 150–160 chars, keyword + location included
- [ ] `siteConfig.url` — matches production domain exactly
- [ ] `siteConfig.locale` — correct for client region
- [ ] Every page has a unique `<title>` (max 60 chars) and `<meta description>`
- [ ] All `generateMetadata()` calls include the correct `path` param
- [ ] OG image at `public/og-image.jpg` is client-branded (not the boilerplate placeholder)
- [ ] OG tags verified: paste production URL into [opengraph.xyz](https://www.opengraph.xyz)
- [ ] `/sitemap.xml` resolves at production URL and lists all pages
- [ ] `/robots.txt` resolves and sitemap URL matches production domain
- [ ] Structured data (JSON-LD) present and validated via [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] One `<h1>` per page containing the primary keyword
- [ ] Phone number is a `tel:` link — not plain text
- [ ] Email is a `mailto:` link — not plain text

---

## 9. Performance

Run Lighthouse on the **production Vercel URL** in an incognito window (Chrome → DevTools → Lighthouse). Measure both mobile and desktop.

**Targets — all four categories ≥ 90:**

| Category | Mobile | Desktop |
|---|---|---|
| Performance | ≥ 90 | ≥ 90 |
| Accessibility | ≥ 90 | ≥ 90 |
| Best Practices | ≥ 90 | ≥ 90 |
| SEO | ≥ 90 | ≥ 90 |

**Core Web Vitals:**
- [ ] LCP < 2.5s — above-fold image has `priority` and correct `sizes`
- [ ] CLS < 0.1 — no layout shift during page load
- [ ] INP < 200ms — page responds quickly to interaction

**Additional:**
- [ ] No images without explicit `width`/`height` or `fill`
- [ ] No raw `<img>` tags — all images through `<Image />` component
- [ ] Fonts loaded via `next/font` — no external CDN requests in Network tab
- [ ] All third-party scripts use `next/script` with correct strategy
- [ ] First Load JS for homepage route ≤ 150KB (check build output)

---

## 10. Mobile

Test on a real device if possible, Chrome DevTools at minimum.

- [ ] No horizontal scroll at 375px viewport
- [ ] No text touching screen edges — minimum 16px horizontal padding everywhere
- [ ] All touch targets ≥ 44×44px (buttons, nav links, icon buttons)
- [ ] Form inputs do not trigger iOS zoom (all inputs ≥ 16px font size)
- [ ] Contact form usable end-to-end on mobile — fields accessible, keyboard doesn't obscure submit
- [ ] Mobile navigation opens, closes, and closes on route change
- [ ] Click-to-call phone link works on a real device
- [ ] Hero image loads correctly at mobile viewport — no awkward crop
- [ ] Lighthouse Mobile Performance ≥ 90

---

## 11. Accessibility

- [ ] Colour contrast ≥ 4.5:1 for all body text — check with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ ] All interactive elements reachable and operable by keyboard (Tab through the entire page)
- [ ] Focus ring visible on all focusable elements (`:focus-visible` style present)
- [ ] All images have descriptive `alt` text (or `alt=""` for decorative)
- [ ] Form labels visible above every input — no placeholder-only labels
- [ ] ARIA attributes correct on mobile nav toggle (`aria-expanded`, `aria-controls`, `aria-label`)
- [ ] No `onClick` on non-interactive elements (`div`, `span`)
- [ ] Lighthouse Accessibility score ≥ 90

---

## 12. Analytics and Tracking

- [ ] Analytics confirmed with client — do they want it? Which platform? (Vercel Analytics, Google Analytics, Plausible, etc.)
- [ ] If analytics added: tracking fires on production URL (verify in platform dashboard)
- [ ] If Google Analytics / GTM: added via `next/script` with `strategy="afterInteractive"`
- [ ] If analytics added: CSP in `next.config.mjs` updated with analytics domains
- [ ] Privacy policy updated to disclose any tracking if required by client's jurisdiction (PIPEDA for Canada, GDPR for EU clients)
- [ ] Cookie consent banner added if analytics set cookies and client is subject to PIPEDA/GDPR

---

## 13. Post-Launch

Complete these within 24 hours of the site going live.

- [ ] **Google Search Console**: add property for the production domain, verify ownership (Vercel DNS verification or HTML tag method)
- [ ] **Submit sitemap**: in Search Console → Sitemaps → submit `https://clientdomain.com/sitemap.xml`
- [ ] **Google Business Profile**: confirm the website URL on the profile matches the production domain exactly
- [ ] **Test production form one final time** from a personal device/email (not a test account) to confirm the full email flow works on live infrastructure
- [ ] **Share URLs with client**: production site, Search Console access, any analytics dashboard
- [ ] **Handoff notes**: document anything the client needs to know — how to update content (if CMS), who to contact for changes, any scheduled tasks or renewals (domain, hosting)
- [ ] **Internal**: update project status in Zenara records, archive Figma/design files, note any ongoing maintenance agreement

---

## Quick Reference — Vercel Deployment Flow

```
1. Push to main branch
       ↓
2. Vercel auto-deploys (watch build logs for errors)
       ↓
3. Preview URL generated — verify on mobile + desktop
       ↓
4. Promote to production (or auto-promotes if main = production)
       ↓
5. Custom domain resolves → run this checklist
       ↓
6. Contact form end-to-end test on production URL
       ↓
7. Lighthouse on production URL (incognito)
       ↓
8. Submit sitemap in Search Console
       ↓
9. Notify client ✓
```
