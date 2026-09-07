# FunGen Events and Experiences — Project Context
# .claude/CLAUDE.md | Project-level Claude instructions

---

## Client

- **Name**: FunGen Events and Experiences
- **Industry**: Event planning. Birthdays (often at home), anniversaries, weddings (banquet halls
  around Markham and Scarborough, including the convention centres), corporate lunches and
  happy hours, patio and outdoor parties, and local nonprofit, book fair and community events.
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
route returns a friendly 503 and the form surfaces an error toast. `CONTACT_FROM_EMAIL` must
sit on a domain verified in Resend, or Resend rejects the send and the route answers 502.
Vercel only picks up env var changes on the next deploy.

Route guards, in order: same-origin check (403), `Content-Length` cap at 64KB (413), IP rate
limit of 5 per 10 minutes (429, with `Retry-After`), JSON parse (400), Zod re-validation
(422), honeypot (silent 200). The rate limiter keys off `x-real-ip` first — `x-forwarded-for`
is client-settable, so trusting its leftmost entry let one caller rotate a fresh "IP" per
request. `src/lib/validations/contact.ts` is shared by the client resolver and the route;
it sanitises by *rejecting* control characters rather than transforming, because a zod
transform makes input and output types diverge and the react-hook-form resolver cannot
reconcile them. `budget` and `eventType` are enums matching the UI's own options, so the
route will not forward arbitrary strings into the studio's inbox.

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

- **Tone**: Warm, professional, plain-spoken. This is a small local business, not a luxury
  agency: no "galas", no "luxury", no five-hundred-guest events, no destination weddings.
  Guest counts on the site stay in the 20-150 range. Em dashes are used sparingly by
  deliberate choice (the copy was rewritten 2026-09-04 to remove 56 of them); prefer
  commas, periods and colons.
- All copy/imagery centralised in `src/lib/site-data.ts`.
- Real phone/address/email in `src/lib/metadata.ts` → `businessInfo` (email
  `hello@fungenevents.ca` is still a placeholder pending the client). Emitted as
  `LocalBusiness` JSON-LD (with `areaServed`) on the homepage in `src/app/page.tsx`.

---

## Images

- `public/images/gallery/` holds 27 event photos (downloaded locally from the design's
  stock sources so they serve same-origin under the `img-src 'self'` CSP). The three
  `corporate-*.jpg` files back the Corporate Events discipline. Four are client-supplied
  (2026-09-04): `ceremony-aisle-florals`, `candlelit-table-setting` and `ballroom-styling`
  are the homepage hero collage; `party-crowd-lights` is a Birthdays portfolio card. The
  latter two are AI-generated (Gemini) — not photographs of the client's own events.
- Logo: `public/images/fungen-logo.svg` is the client's master mark (FUNGEN-LOGO-V3, the
  flat `#EFB921` flame monogram, delivered 2026-09-04), stored exactly as supplied. Three
  derived marks carry its three drawing paths on a tight `6.3 6.5 44.6 114.9` viewBox —
  aspect ratio ≈ **0.388 (tall and narrow)**, so width ≈ height × 0.3882 wherever the mark
  is sized. The master ships 38 zero-length `<path>` stubs; the derived marks drop them.
  - `fungen-mark-gold.svg` — the logo's own `#EFB921`. **Dark backgrounds only.**
  - `fungen-mark-gold-deep.svg` — `#C9A227` (the `--gold` token). **Light backgrounds** —
    the delivered gold reads faint against `#FAF8F5`.
  - `fungen-mark-cream.svg` — flat `#FAF8F5`, for the nav over the dark hero.
- `public/og-image.jpg` (1200×630) — brand OG card (mark + wordmark), generated with sharp.
- Favicons / app icons (`favicon-16/32`, `apple-touch-icon`, `android-chrome-192/512`,
  `src/app/favicon.ico`) are the mark on a navy tile. The 16/32px ones brighten the fill
  (`#F5C842` / `#F0BE2A`) and use less padding — the mark is narrow enough that hairline
  strokes need the extra weight to survive.
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
