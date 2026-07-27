# SEO Blueprint
# Zenara Designs — applies to every client project

---

## Philosophy

Our clients earn business through trust and local reputation. Someone searching "Toronto estate lawyer" or "Vancouver tax accountant" is a warm lead. Ranking for those terms — and presenting credibly when found — is a direct business outcome, not a checkbox.

SEO for this client type is: technically clean, locally relevant, and structured so Google understands exactly what the firm does and where they operate.

---

## 1. Metadata — The Pattern

Every page uses `generateMetadata()` from `src/lib/metadata.ts`. Never write raw `<title>` tags or hardcode Open Graph values directly in a page.

### siteConfig (update after forking)

```typescript
// src/lib/metadata.ts
export const siteConfig = {
  name: 'Smith & Associates Law',
  description: 'Toronto estate and corporate law firm. Serving individuals and businesses since 1998.',
  url: 'https://smithlaw.ca',       // no trailing slash — must match NEXT_PUBLIC_SITE_URL
  ogImage: '/og-image.jpg',         // 1200×630, client-branded
  locale: 'en_CA',                  // adjust per client region
}
```

### Per-page usage

```typescript
// Every page exports metadata like this:
export const metadata: Metadata = generateMetadata({
  title: 'Estate Planning',
  description: 'Wills, powers of attorney, and estate administration in Toronto. Call Smith & Associates.',
  path: '/estate-planning',
})
```

The `path` parameter ensures `og:url` and `canonical` are correct for every subpage. Always include it — leaving it off means the canonical points to the homepage.

### Title rules

- **Homepage**: just `siteConfig.name` — no `| Client Name` suffix
- **Subpages**: `Page Name | Client Name` (generated automatically by `generateMetadata()`)
- Max 60 characters for the full title
- Lead with the keyword, not the firm name: `"Estate Planning | Smith & Associates"` not `"Smith & Associates | Estate Planning"`

### Description rules

- 150–160 characters — longer is truncated in search results
- Include the service and the location: `"Toronto estate lawyer specialising in wills and powers of attorney. Book a free 30-minute consultation."`
- Include a soft call to action where natural
- Every page must have a unique description — never reuse

---

## 2. Open Graph & Social Sharing

When a client shares their site URL on LinkedIn or a client forwards it in an email, the preview card is the first impression.

### OG image

- Dimensions: **1200×630px** minimum
- File: `public/og-image.jpg` (the boilerplate default)
- For per-page OG images (service pages, blog posts): pass `ogImage: '/path/to/image.jpg'` to `generateMetadata()`
- Content: firm name, a visual mark or logo, optionally the service area. No stock photos. Matches the site's visual identity.
- Format: JPEG at 80–85% quality — PNG is acceptable but larger

### Checklist

- [ ] `og:title` — matches page `<title>`
- [ ] `og:description` — matches meta description
- [ ] `og:image` — 1200×630, present, resolves correctly at production URL
- [ ] `og:url` — exact canonical URL of the page (generated via `path` param)
- [ ] `og:type` — `website` for all standard pages
- [ ] `og:locale` — matches `siteConfig.locale`
- [ ] `og:site_name` — matches `siteConfig.name`
- [ ] `twitter:card` — `summary_large_image`

---

## 3. Canonical URLs

Every page must have a canonical URL. This prevents duplicate content issues if the page is ever accessible at multiple paths (e.g. with/without trailing slash, HTTP vs HTTPS).

The `generateMetadata()` helper sets both `alternates.canonical` and `openGraph.url` to `${siteConfig.url}${path}`. Always pass `path`.

For pages with query parameters (search, filters) — the canonical should always point to the clean base URL, not the filtered version.

---

## 4. Sitemap

`src/app/sitemap.ts` generates `/sitemap.xml` automatically. Add every new page here when you create it.

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteConfig.url}/contact`, lastModified: LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.5 },
    // Add per-client pages:
    { url: `${siteConfig.url}/estate-planning`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteConfig.url}/corporate-law`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.8 },
  ]
}
```

### Priority guidelines

| Page | Priority |
|---|---|
| Homepage | 1.0 |
| Primary service pages | 0.8 |
| Secondary / about / team | 0.6 |
| Contact | 0.5 |
| Legal / privacy | 0.3 |

### CMS-driven sites

If the site has a CMS with dynamic pages, fetch the slugs at build time and generate sitemap entries programmatically:

```typescript
const posts = await cms.getPosts()
const dynamicEntries = posts.map((post) => ({
  url: `${siteConfig.url}/blog/${post.slug}`,
  lastModified: new Date(post.updatedAt),
  changeFrequency: 'monthly' as const,
  priority: 0.6,
}))
return [...staticEntries, ...dynamicEntries]
```

---

## 5. Robots

`src/app/robots.ts` generates `/robots.txt` dynamically. The sitemap URL is derived from `siteConfig.url` — no manual update needed after deploying.

The default allows all crawlers and disallows `/api/`. This is correct for most projects.

**When to modify robots.txt:**
- Add `Disallow: /thank-you` if you have a conversion tracking page you don't want indexed
- Add `Disallow: /` temporarily for a site that is not yet ready to be indexed (remove before launch)
- Never add `Disallow: /` permanently — communicate this to the client

---

## 6. Structured Data (JSON-LD)

Structured data helps Google understand what the business is and where it operates. For professional services, it often triggers rich results (review stars, contact info, business hours in the Knowledge Panel).

**This is not included in the boilerplate** — it is client-specific. Add it per project.

### How to add

Create a server component that renders a `<script>` tag:

```typescript
// src/components/JsonLd.tsx
interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

Render it in the relevant page's layout or directly in the page component (place in `<head>` via `layout.tsx` or inline in the page — both work with App Router).

### Schema types by client

**Law firm**
```json
{
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "Smith & Associates Law",
  "url": "https://smithlaw.ca",
  "telephone": "+1-416-555-0100",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "100 King Street West, Suite 500",
    "addressLocality": "Toronto",
    "addressRegion": "ON",
    "postalCode": "M5X 1A9",
    "addressCountry": "CA"
  },
  "areaServed": "Toronto, ON",
  "priceRange": "$$"
}
```

**Accounting / financial advisory**
```json
{
  "@context": "https://schema.org",
  "@type": "AccountingService",
  "name": "...",
  ...
}
```

**General professional services**
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  ...
}
```

**Individual consultant / advisor**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jane Smith",
  "jobTitle": "Certified Financial Planner",
  "worksFor": { "@type": "Organization", "name": "Smith Financial" },
  "url": "https://smithfinancial.ca"
}
```

Validate with Google's Rich Results Test before launch: https://search.google.com/test/rich-results

---

## 7. Semantic HTML & Heading Hierarchy

Search engines and screen readers both rely on semantic HTML. This is free SEO — no extra packages needed.

### Rules

- One `<h1>` per page — contains the primary keyword for that page
- `<h2>` for major sections, `<h3>` for sub-sections — never skip levels
- `<main>` wraps the primary page content (already in all page templates)
- `<nav>` for navigation, `<footer>` for footer, `<article>` for editorial content
- `<section>` with an implied heading for thematic groupings
- `<address>` for contact/location information

### Common mistakes to avoid

- Using headings for visual sizing rather than semantic meaning — use Tailwind classes instead
- Putting the firm name in the `<h1>` on every page — the `<h1>` should reflect the page's topic
- Skipping from `<h2>` to `<h4>` for layout reasons

---

## 8. Images and Alt Text

Every image rendered via `<Image />` must have a descriptive `alt` attribute.

### Rules

- Describe what is in the image, not what it is: `"View of Toronto skyline from Smith & Associates office on King Street"` not `"office image"`
- Decorative images that add no content: `alt=""` (empty string — tells screen readers to skip it)
- Never: `alt="image"`, `alt="photo"`, `alt="logo"` alone
- Logo: `alt="Smith & Associates Law logo"`
- Team photo: `alt="Jane Smith, founding partner at Smith & Associates Law"`
- Headshots next to name: `alt=""` (the nearby text already identifies the person)

---

## 9. Core Web Vitals

Google uses Core Web Vitals as a ranking signal. Target ≥ 90 on Lighthouse across all categories before handoff.

### LCP (Largest Contentful Paint) — target < 2.5s

LCP is usually the hero image or headline. Fix:
- Add `priority` to the `<Image />` component for the above-the-fold image
- Provide `sizes` prop so the browser fetches the correct srcset variant
- Preload the LCP image if it's in CSS: add `<link rel="preload">` manually
- Use `next/font` (already in boilerplate) so fonts don't block rendering

### CLS (Cumulative Layout Shift) — target < 0.1

CLS is caused by content shifting after load. Fix:
- Always set explicit `width` and `height` on `<Image />` (enforced by our Image component)
- Set explicit dimensions on any embedded content (iframes, videos)
- Avoid inserting content above existing content after load (e.g. a banner that appears after JS runs)
- Reserve space for font swaps: `display: 'swap'` is already set in `fonts.ts`

### INP (Interaction to Next Paint) — target < 200ms

INP measures responsiveness to user interactions. Fix:
- Keep `'use client'` components minimal — most content is static
- Avoid heavy computations in event handlers
- Defer non-critical JS with `dynamic()` and `{ ssr: false }`
- Framer Motion: use `LazyMotion` + `domAnimation` feature set to reduce bundle size

---

## 10. Local SEO

Most of our clients serve a specific city or region. Local SEO is often more valuable than broad SEO for them.

### Checklist

- [ ] City and service area named explicitly in `<h1>` or first paragraph: `"Toronto Estate Lawyer"`
- [ ] NAP (Name, Address, Phone) consistent across site, Google Business Profile, and any directories
- [ ] `LocalBusiness` or specific schema on homepage with `address` and `areaServed`
- [ ] City/region in page titles and descriptions for service pages
- [ ] Phone number is a tappable `tel:` link — never plain text
- [ ] Email address is a tappable `mailto:` link — never plain text
- [ ] Google Business Profile set up and verified (advise client — not a code task)
- [ ] Embed Google Maps on contact page if client has a physical office

### Google Business Profile

This is outside our codebase but critical. Advise every client to:
1. Claim and verify their Google Business Profile
2. Ensure the address/phone/website match exactly what's on the site
3. Add photos and services
4. Respond to reviews

---

## 11. Pre-Launch SEO Checklist

- [ ] `siteConfig` updated with real name, description, URL, and locale
- [ ] Every page has a unique `<title>` (max 60 chars) and `<meta description>` (150–160 chars)
- [ ] All `generateMetadata()` calls include the correct `path` param
- [ ] OG image exists at `public/og-image.jpg` (1200×630)
- [ ] OG tags verified with [opengraph.xyz](https://www.opengraph.xyz) or Facebook Debugger
- [ ] `/sitemap.xml` resolves and contains all pages
- [ ] `/robots.txt` resolves and sitemap URL matches production domain
- [ ] Structured data added and validated via Google Rich Results Test
- [ ] One `<h1>` per page containing the primary keyword
- [ ] All images have meaningful `alt` text
- [ ] Lighthouse SEO score ≥ 90
- [ ] Core Web Vitals — LCP < 2.5s, CLS < 0.1, INP < 200ms in Lighthouse
- [ ] Google Search Console — submit sitemap after launch
