# FunGen Events and Experiences — Project Context
# .claude/CLAUDE.md | Project-level Claude instructions

---

## Client

- **Name**: FunGen Events and Experiences
- **Industry**: Event planning — birthdays, weddings, anniversaries, social gatherings, entertainment, and nonprofit events
- **Website**: fungenevents.ca — real domain, confirmed 2026-07-27
- **Phone**: (647) 926-9787 — real, confirmed 2026-07-27
- **Address**: Unit 312/5, 2855 Markham Road, Toronto, ON M1X 0C3 — real, confirmed 2026-07-27
- **Email**: still a placeholder (`hello@fungenevents.ca` in `HomeLanding.tsx`) — replace once the client provides a real one

---

## Current Status

This repo now ships the **full multi-page marketing site** (`/`, `/about`, `/services`,
`/portfolio`, `/contact`), converted from the finalized Claude design mockups. The old
single-page placeholder (`HomeLanding` / `CategoryCarousel`) has been removed.

Content and imagery live in `src/lib/site-data.ts`; page sections are componentised under
`src/components/{home,about,services,portfolio,contact,layout,shared}`. Shared design
primitives: `SiteNav`, `SiteFooter`, `Reveal`, `CtaBand`, `CtaButton`, `ArrowLink`,
`Eyebrow`, `ImageHero`, `PageIntroHero`, `PortfolioCard`, `GrainOverlay`.

The contact form (`src/app/contact/`) posts to the Resend route at `src/app/api/contact/`
(react-hook-form + Zod, honeypot, IP rate limiting via `src/lib/rate-limit.ts`). It needs
`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` set in Vercel — without them the
route returns a friendly 503 and the form surfaces an error toast.

Known follow-up: 3 high-severity `sharp`/libvips CVEs remain; the fix is a breaking
`sharp` bump best done via a Next.js upgrade (deferred — the site only processes trusted
local images). Still add a real Google Maps embed on `/contact` (currently a Maps link).

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

Set in `src/lib/fonts.ts` (loaded via `next/font/google`, self-hosted → CSP-compliant):

- **Display / headings**: Bodoni Moda (serif), `--font-display` → Tailwind `font-display`.
- **Body / UI**: Archivo (sans, weights 300/400/500), `--font-sans` → Tailwind `font-sans`.

Both `.variable`s are applied on `<html>` in `layout.tsx`. Bodoni Moda has no Next
font-metrics entry, so `adjustFontFallback: false` + an explicit serif fallback are set to
keep the build warning-free.

---

## CMS

- **Platform**: None. Content is hardcoded in `src/lib/site-data.ts` (typed data module).

---

## Pages

- [x] Home (`/`) — hero, discipline marquee, studio preview, interactive services, why-us,
  featured portfolio, testimonials carousel, CTA band
- [x] About (`/about`) — manifesto, mission/vision, core values, process, why-choose, CTA
- [x] Services (`/services`) — 6 discipline sections with included/options + FAQ accordions
- [x] Portfolio (`/portfolio`) — filterable gallery + client stories
- [x] Contact (`/contact`) — enquiry form (Resend) + details + Maps link

---

## Content & Copy

- **Tone**: Warm, professional, celebratory
- All copy/imagery centralised in `src/lib/site-data.ts`.
- Real phone/address/email in `src/lib/metadata.ts` → `businessInfo` (email
  `hello@fungenevents.ca` is still a placeholder pending the client). Emitted as
  `LocalBusiness` JSON-LD (with `areaServed`) on the homepage in `src/app/page.tsx`.

---

## Images

- `public/images/gallery/` holds 22 event photos (downloaded locally from the design's
  stock sources so they serve same-origin under the `img-src 'self'` CSP).
- Logo: `public/images/fungen-logo.svg` is the client's master mark (fungen-logo-v2, the
  gradient "G" monogram). Three derived marks share its path on a tight
  `8.9 8.9 129.9 143.8` viewBox — aspect ratio ≈ **0.903 (portrait)**:
  - `fungen-mark-gold.svg` — the logo's own bright gradient. **Dark backgrounds only.**
  - `fungen-mark-gold-deep.svg` — same gradient shifted darker. **Light backgrounds** —
    the bright version's highlight stop disappears against `#FAF8F5`.
  - `fungen-mark-cream.svg` — flat `#FAF8F5`, for the nav over the dark hero.
- `public/og-image.jpg` (1200×630) — brand OG card (mark + wordmark), generated with sharp.
- Favicons / app icons (`favicon-16/32`, `apple-touch-icon`, `android-chrome-192/512`,
  `src/app/favicon.ico`) are the mark on a navy tile. The 16/32px ones use a flat
  `#E6C96D` fill — the gradient's dark stops turn to mud at hairline stroke widths.
- SVG marks require `dangerouslyAllowSVG` in `next.config.mjs` (already enabled, scoped
  to trusted local assets only — never enable for user-uploaded SVGs).
- Use `<Image />` from `@/components/ui/image` for all rendered images — never raw `<img>`

---

## Stack Additions

| Package | Reason |
|---|---|
| None | Uses only boilerplate deps (framer-motion, RHF+Zod, Resend, sonner, etc.) |

Bundle note: framer-motion is loaded via `LazyMotion` + `domAnimation` in `Providers.tsx`
(`strict` mode) — always use `m.*`, never `motion.*`, or it will throw. The unused TanStack
Query provider was removed; re-add it if a real client query is introduced.

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
