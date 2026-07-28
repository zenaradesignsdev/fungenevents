# FunGen Events and Experiences — Project Context
# .claude/CLAUDE.md | Project-level Claude instructions

---

## Client

- **Name**: FunGen Events and Experiences
- **Industry**: Event planning — birthdays, weddings, anniversaries, social gatherings, entertainment, and nonprofit events
- **Website**: fungenevents.ca — real domain, confirmed 2026-07-27
- **Phone**: (647) 926-9787 — real, confirmed 2026-07-27
- **Address**: Unit 312/5, 2855 Markham Road, Toronto, ON M1X 0C3 — real, confirmed 2026-07-27
- **Email**: fungeneventsinc@gmail.com — real, confirmed 2026-07-28

---

## Current Status

This repo currently ships a **single placeholder landing page** only (`/`). The client
needed something to hand to prospective customers now while the full multi-page site
design is still being finalized in a separate Claude design project. The contact page,
contact form, and Resend API route from the boilerplate were removed for this phase —
the landing page uses direct `mailto:` and `tel:` links with real contact details
(email, phone, address) instead. Re-add `src/app/contact/`, `src/app/api/contact/`,
and the Resend env vars (commented out in `.env.local.example`) when the full site
is built.

---

## Design Personality

Polished, professional, and celebratory — trust-critical like Zenara's usual clients,
but warmer than a law firm brochure since FunGen sells joy and hospitality, not just
credibility. Full direction is being finalized in Claude design; this placeholder page
intentionally stays simple.

---

## Colour Palette

Set in `src/app/globals.css` (also mapped into `tailwind.config.ts`):

| Token | Hex | HSL | Use |
|---|---|---|---|
| `--primary` / `--brand` | `#1B2A41` Deep Navy | `216 41% 18%` | Primary CTAs, headings |
| `--gold` | `#C9A227` Luxury Gold | `46 68% 47%` | Accent CTA, highlights — use sparingly |
| `--background` | `#FAF8F5` Warm White | `36 33% 97%` | Page background |
| `--secondary` / `--accent` / `--muted` | `#F2F2F2` Soft Gray | `0 0% 95%` | Tags, subtle fills |
| `--foreground` | `#333333` Charcoal | `0 0% 20%` | Body text |

These are final client brand colours (not placeholders) — confirmed 2026-07-26.
Typography and full layout are still pending the finalized Claude design.

---

## Typography

Currently default boilerplate Inter (`src/lib/fonts.ts`) — not yet customized since this
is a temporary placeholder page. Revisit when the full site design is finalized.

---

## CMS

- **Platform**: None (static placeholder page)

---

## Pages

- [x] Home (`/`) — placeholder "full site coming soon" page with email/call CTAs
- [ ] Contact (`/contact`) — removed for now, re-add for full site
- [ ] Additional pages — to be defined once the full site design is finalized

---

## Content & Copy

- **Tone**: Warm, professional, celebratory
- Phone and address (`src/lib/metadata.ts` → `businessInfo`) and email
  (`CONTACT_EMAIL` in `src/components/home/HomeLanding.tsx`) are all real now.
- Real phone/address are also emitted as `LocalBusiness` JSON-LD in `src/app/page.tsx`
  for local SEO.

---

## Images

- `public/images/` holds the hero background, six category-carousel photos (stock/CC0 —
  see git history for sourcing), and `fungen-logo.svg` (client-provided).
- No OG image yet — add `public/og-image.jpg` (1200×630) once available.
- SVG logo requires `dangerouslyAllowSVG` in `next.config.mjs` (already enabled, scoped
  to this trusted local asset only — never enable for user-uploaded SVGs).
- Use `<Image />` from `@/components/ui/image` for all rendered images — never raw `<img>`

---

## Stack Additions

| Package | Reason |
|---|---|
| None | No dependencies added beyond the boilerplate |

Note: added a `gold` Tailwind colour token (`--gold` / `--gold-foreground` in
`globals.css`, `gold` variant in `tailwind.config.ts` and `button.tsx`) since the
luxury gold brand colour didn't fit the existing `brand`/`secondary` slots.

---

## Environment Variables

Actual values are in Vercel dashboard — never committed.
See `.env.local.example` for required keys.

- `NEXT_PUBLIC_SITE_URL` — `https://fungenevents.ca` (real domain)
- Resend vars (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`) — not needed
  until the contact form is rebuilt for the full site

---

## Notes

- GitHub remote `zenaradesignsdev/fungenevents` is already configured as `origin`.
- Initial landing page committed and pushed to `main` 2026-07-27, ahead of connecting
  the repo to Vercel.
