# Zenara Designs — Next.js Boilerplate

Production-ready starting point for all Zenara client projects. Fork this repo for each new client.

---

## Stack

Next.js 14 · TypeScript (strict) · Tailwind CSS · shadcn/ui · Framer Motion · React Hook Form + Zod · TanStack Query · Zustand · Resend · Lucide React · Sharp

---

## Forking for a New Client

Work through this checklist top to bottom before writing any client-specific code.

### 1. Project setup

```bash
git clone <this-repo> client-name
cd client-name
npm install
cp .env.local.example .env.local
```

### 2. Update site identity

**`src/lib/metadata.ts`** — `siteConfig`

```ts
name: 'Smith & Associates Law',
description: '150–160 character description for search results.',
url: 'https://smithlaw.ca',        // no trailing slash
ogImage: '/og-image.jpg',
locale: 'en_CA',                   // adjust if needed
```

### 3. Set brand colours

**`src/app/globals.css`** — update the three `--brand` CSS variables in `:root`.

```css
--brand: 215 60% 28%;          /* primary — CTAs, links */
--brand-foreground: 0 0% 98%;  /* text on brand background */
--brand-muted: 215 30% 94%;    /* subtle tints, hover states */
```

Tip: convert hex → HSL at [hslpicker.com](https://hslpicker.com) and paste the `H S% L%` values.

### 4. Choose typography

**`src/lib/fonts.ts`** — swap `Inter` for the client's body font and add a display font if needed.

```ts
// Body font (already present — swap the import)
export const fontSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

// Display font (add when client needs a serif headline)
export const fontDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  style: ['normal', 'italic'],
})
```

Then add `fontDisplay.variable` to the `<html>` className in `src/app/layout.tsx`.

Common pairings:
| Display | Body |
|---|---|
| Playfair Display | Inter |
| Cormorant Garamond | DM Sans |
| Lora | Source Sans 3 |

### 5. Configure email

Add these to **Vercel environment variables** (not committed):

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | From [resend.com](https://resend.com) dashboard |
| `CONTACT_FROM_EMAIL` | Verified sender — must match a domain verified in Resend |
| `CONTACT_TO_EMAIL` | Address that receives form submissions |
| `NEXT_PUBLIC_SITE_URL` | `https://clientdomain.com` — no trailing slash |

> The contact form sends two emails on submission: a notification to `CONTACT_TO_EMAIL` and a confirmation to the person who submitted.

### 6. Update the OG image

Replace `public/og-image.jpg` with a client-specific 1200×630 image.

### 7. Fill in `.claude/CLAUDE.md`

Document the client's design personality, colour palette, typography, tone, and CMS before starting any page work.

### 8. Build pages

`src/app/page.tsx` and `src/app/contact/page.tsx` are structural shells. Add sections per client.

For each new page:
- Create `src/app/[page]/page.tsx`
- Call `generateMetadata({ title: '...', description: '...', path: '/page' })`
- Add the route to `src/app/sitemap.ts`

---

## Development

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           Root layout — fonts, Providers, metadata base
│   ├── page.tsx             Homepage shell
│   ├── error.tsx            Runtime error boundary
│   ├── loading.tsx          Page transition loading state
│   ├── not-found.tsx        404 page
│   ├── robots.ts            Dynamic robots.txt (reads NEXT_PUBLIC_SITE_URL)
│   ├── sitemap.ts           Dynamic sitemap (add routes per client)
│   ├── globals.css          CSS variables — brand colours, shadcn tokens
│   ├── contact/page.tsx     Contact page
│   └── api/contact/route.ts Resend email handler with rate limiting + honeypot
├── components/
│   ├── ui/                  shadcn/ui base components + Image wrapper
│   └── contact/             ContactForm + Zod schema
├── hooks/
│   └── useMediaQuery.ts     SSR-safe breakpoint hook
├── lib/
│   ├── cn.ts                clsx + tailwind-merge utility
│   ├── fonts.ts             next/font declarations (swap per client)
│   └── metadata.ts          generateMetadata() + siteConfig
├── providers/
│   └── Providers.tsx        TanStack Query + Toaster
└── types/
    └── index.ts             Shared types (fill per client)
```

---

## Before Handoff

- [ ] `npm run lint` — zero errors
- [ ] `npm run type-check` — zero errors
- [ ] Lighthouse ≥ 90 on all categories
- [ ] OG image present at `public/og-image.jpg`
- [ ] All env vars set in Vercel dashboard
- [ ] `NEXT_PUBLIC_SITE_URL` matches production domain
- [ ] `robots.txt` and `sitemap.xml` verified at production URL
- [ ] Contact form tested end-to-end (check both notification and confirmation emails)
- [ ] Colour contrast ≥ 4.5:1 on all body text
- [ ] Mobile layout checked at 375px
