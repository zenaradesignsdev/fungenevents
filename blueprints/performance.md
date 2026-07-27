# Performance Blueprint
# Zenara Designs — applies to every client project

---

## Philosophy

Our clients are professionals who expect precision. A slow site communicates the same thing as a slow lawyer — it erodes trust before a single word is read. Performance is also a direct SEO signal via Core Web Vitals.

Target: **Lighthouse ≥ 90 on all four categories** (Performance, Accessibility, Best Practices, SEO) on every page before handoff, measured on a production build on Vercel — not localhost.

---

## 1. Rendering Strategy

Next.js 14 App Router defaults to **Server Components**. This is the right default — server components produce zero client-side JavaScript, which is the single most impactful performance decision.

### The rule: reach for `'use client'` only when you need it

A component needs `'use client'` if it uses:
- React state (`useState`, `useReducer`)
- React effects (`useEffect`, `useLayoutEffect`)
- Browser APIs (`window`, `document`, `navigator`)
- Event handlers that need to interact with state
- Client-side hooks (`useMediaQuery`, `useMutation`, etc.)

Everything else — layout wrappers, text blocks, static images, icon-only components — should be server components.

### Common mistake

Marking a parent `'use client'` because one child needs it. Instead: extract the interactive child into its own `'use client'` component and keep the parent as a server component.

```typescript
// ✗ Entire section becomes client JS
'use client'
export function ServicesSection() {
  const [open, setOpen] = useState(false)
  return (
    <section>
      <h2>Our Services</h2>          {/* purely static — doesn't need to be client */}
      <ServiceList />                {/* purely static */}
      <AccordionItem open={open} />  {/* this is the only part that needs state */}
    </section>
  )
}

// ✓ Only the interactive part ships as client JS
export function ServicesSection() {  // server component
  return (
    <section>
      <h2>Our Services</h2>
      <ServiceList />
      <AccordionItem />              {/* this component is 'use client' internally */}
    </section>
  )
}
```

### `dynamic()` for heavy client components

Load below-the-fold interactive components lazily so they don't block the initial page render:

```typescript
import dynamic from 'next/dynamic'

const ContactForm = dynamic(() => import('@/components/contact/ContactForm'), {
  loading: () => <div className="h-64 animate-pulse rounded-md bg-muted" />,
})
```

Use for: forms that appear below the fold, chat widgets, map embeds, any component over ~30KB.

---

## 2. Images

Images are the single largest contributor to poor Lighthouse Performance scores. Every image decision has a measurable impact.

### Always use our Image component

```typescript
import { Image } from '@/components/ui/image'
```

Never use raw `<img>` tags — they skip Next.js optimisation entirely.

### The `sizes` prop

Without `sizes`, the browser fetches the largest available srcset variant for every image. This is the most common cause of oversized image warnings in Lighthouse.

```typescript
// ✗ Fetches full-width image on all devices
<Image src="/hero.jpg" alt="..." width={1600} height={900} priority />

// ✓ Browser fetches appropriately-sized variant
<Image
  src="/hero.jpg"
  alt="..."
  width={1600}
  height={900}
  priority
  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1280px"
/>
```

### Sizes reference

| Use case | sizes value |
|---|---|
| Full-bleed hero | `100vw` |
| Constrained hero (max-width container) | `(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1280px` |
| Half-width (2-col layout) | `(max-width: 768px) 100vw, 50vw` |
| Third-width (3-col grid) | `(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw` |
| Headshot / avatar | `(max-width: 768px) 80px, 120px` |
| Logo in header | `(max-width: 768px) 120px, 160px` |

### `priority` — LCP element only

Only one image per page should have `priority`. It should be the image most likely to be the Largest Contentful Paint element — typically the hero image. Priority preloads the image and tells Next.js not to lazy-load it.

Adding `priority` to multiple images cancels out the benefit and wastes bandwidth.

### Fill mode

For images that must cover a container, use `fill` with `object-fit`:

```typescript
<div className="relative h-96 w-full overflow-hidden">
  <Image
    src="/office.jpg"
    alt="Smith & Associates office"
    fill
    className="object-cover"
    sizes="100vw"
  />
</div>
```

The parent must have `position: relative` (Tailwind `relative`) and explicit dimensions.

### Blur placeholders

For above-the-fold images where layout shift during load is visible, use blur placeholders:

1. Add `plaiceholder` and `sharp` to the project (`npm install plaiceholder sharp` — `sharp` is already in the boilerplate)
2. Generate the `blurDataURL` at build time:
   ```typescript
   import { getPlaiceholder } from 'plaiceholder'
   const { base64 } = await getPlaiceholder(fs.readFileSync('./public/hero.jpg'))
   ```
3. Pass it to the component:
   ```typescript
   <Image src="/hero.jpg" alt="..." width={1600} height={900} blurDataURL={base64} />
   ```

`placeholder="blur"` activates automatically when `blurDataURL` is provided (handled by the Image wrapper component).

### Format

`next.config.mjs` already serves AVIF and WebP automatically for browsers that support them. No additional config needed. JPEG/PNG source files are fine — Next.js converts them.

---

## 3. Fonts

Poor font loading causes two problems: flash of invisible text (FOIT) and layout shift (CLS from font metric changes). The boilerplate handles both.

### Rules

- Only load fonts via `next/font/google` or `next/font/local` in `src/lib/fonts.ts`
- Never use a CDN link (`<link href="fonts.googleapis.com">`) — it requires an extra network request and fails CSP
- `display: 'swap'` is set by default — shows system font while the custom font loads, then swaps
- Only load the weights and styles the design actually uses

### Loading only what you need

```typescript
// ✗ Loads all weights — large download
export const fontSans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

// ✓ Only loads weights used in the design
export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600'],
})
```

For display/serif fonts, also specify italic only if used:
```typescript
export const fontDisplay = Lora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '600'],
  style: ['normal', 'italic'],  // only if italic is used in the design
})
```

### Subsetting

`subsets: ['latin']` is correct for English-only sites. For French Canadian clients, add `subsets: ['latin', 'latin-ext']`.

---

## 4. Animation (Framer Motion)

Animation is purposeful — it communicates meaning, not decoration. It also has a performance cost.

### Reduce bundle size with LazyMotion

By default, `framer-motion` includes all features. Use `LazyMotion` with `domAnimation` to load only what's needed for most sites (~16KB instead of ~95KB):

```typescript
// src/providers/Providers.tsx
import { LazyMotion, domAnimation } from 'framer-motion'

// Wrap children with:
<LazyMotion features={domAnimation}>
  {children}
</LazyMotion>

// Then use m.div instead of motion.div in components:
import { m } from 'framer-motion'
<m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>...</m.div>
```

### Rules

- Never animate the LCP element — it delays Largest Contentful Paint
- Prefer `opacity` and `transform` animations — they run on the GPU and don't trigger layout
- Avoid animating `width`, `height`, `top`, `left`, `margin`, `padding` — they cause layout recalculation
- Use `will-change: transform` sparingly — it promotes the element to its own layer (good for complex animations, wasteful otherwise)
- Respect `prefers-reduced-motion`:

```typescript
import { useReducedMotion } from 'framer-motion'

export function FadeIn({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <m.div
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </m.div>
  )
}
```

### When to use `viewport` vs `animate`

- `whileInView` + `viewport={{ once: true }}` for section reveals — fires once on scroll into view
- `animate` for elements that are interactive or need to animate on every render
- Never use `whileInView` without `viewport={{ once: true }}` — otherwise elements re-animate on scroll back, which is disorienting

---

## 5. JavaScript Bundle

The goal is to ship as little JavaScript as possible to the browser.

### Audit with `@next/bundle-analyzer`

When Lighthouse flags a large JS bundle, install temporarily and analyse:

```bash
npm install -D @next/bundle-analyzer
```

```javascript
// next.config.mjs
import bundleAnalyzer from '@next/bundle-analyzer'
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })
export default withBundleAnalyzer(nextConfig)
```

```bash
ANALYZE=true npm run build
```

Look for: large packages loaded on the client, duplicate packages, packages that should be server-only.

### Common bundle issues

| Problem | Fix |
|---|---|
| A utility library (lodash, date-fns) imported in a client component | Move the logic to a server component or import only the specific function |
| An icon library importing everything | Import icons individually: `import { ArrowRight } from 'lucide-react'` (Lucide already does this) |
| A heavy component (chart, editor, map) in the initial bundle | Wrap in `dynamic(() => import(...))` |
| Duplicate React versions | Run `npm ls react` to check |

---

## 6. TanStack Query

Query is included for data fetching patterns. In static professional sites, it is mostly used for form mutations. Misconfigured, it can cause unnecessary network requests.

### Defaults (already set in Providers.tsx)

```typescript
defaultOptions: {
  queries: {
    staleTime: 60 * 1000,  // data stays fresh for 60 seconds before background refetch
    retry: 1,               // one retry on failure — don't hammer a failing API
  },
}
```

### Rules

- Do not use `useQuery` for data that could be fetched in a Server Component — fetch in the server component instead
- `useMutation` is the right pattern for form submissions (already used in ContactForm)
- If a query fetches the same data on multiple pages, set a longer `staleTime` to avoid redundant requests
- Do not enable `refetchOnWindowFocus` for contact/lead forms — it would resubmit on tab switch

---

## 7. CSS & Tailwind

### Keep the stylesheet small

Tailwind's JIT compiler only includes classes that appear in files matching the `content` paths in `tailwind.config.ts`. Ensure those paths cover all component locations.

### Never construct class names dynamically

```typescript
// ✗ Tailwind purges this — class never appears in output CSS
const colour = 'red'
<div className={`text-${colour}-500`} />

// ✓ Full class name present in source
const className = isError ? 'text-red-500' : 'text-green-500'
<div className={className} />
```

### CSS variables over JavaScript for theming

All client colours are CSS variables (`--brand`, `--background`, etc.). Changing the theme never requires JavaScript — just updating the CSS variable values. This means zero performance cost for theming.

---

## 8. Caching & Static Generation

### App Router defaults

App Router defaults to static generation (SSG) for every page that doesn't use dynamic data. This means pages are rendered at build time and served as static HTML — the fastest possible delivery.

Do not add `export const dynamic = 'force-dynamic'` unless the page genuinely requires it (e.g. it reads cookies or shows user-specific data). Most client pages — home, services, about, contact — are fully static.

### Route handlers

API routes (`src/app/api/`) are dynamic by default (they handle runtime requests). The contact form API route must be dynamic — this is correct.

### Vercel Edge Network

Vercel automatically caches static pages at the edge (CDN nodes near the user). This means a visitor in Vancouver gets the Toronto law firm's homepage served from a local node — fast for everyone.

To leverage this fully: keep pages static where possible and use `revalidate` for pages that need periodic updates:

```typescript
// Revalidate at most once per hour (for CMS-driven content)
export const revalidate = 3600
```

---

## 9. Third-Party Scripts

Third-party scripts (analytics, chat widgets, booking systems) are common for client sites and frequently the #1 cause of poor Lighthouse scores.

### Use Next.js Script component

Never use raw `<script>` tags. Always use `next/script`:

```typescript
import Script from 'next/script'

// In layout.tsx or a specific page:
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"
  strategy="afterInteractive"   // loads after page is interactive
/>
```

### Strategy selection

| Strategy | When to use |
|---|---|
| `beforeInteractive` | Scripts that must run before React hydrates (rare — almost never needed) |
| `afterInteractive` | Analytics, tag managers — runs after page is interactive |
| `lazyOnload` | Chat widgets, social embeds — loads during browser idle time |
| `worker` | Experimental — offloads to Web Worker (Partytown integration) |

Use `afterInteractive` for Google Analytics / GTM. Use `lazyOnload` for chat widgets that are below the fold.

### Analytics without Lighthouse penalty

If Vercel Analytics is sufficient (pageviews, Web Vitals, no PII), it adds ~1KB and has zero Lighthouse impact:

```bash
npm install @vercel/analytics
```

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
// Add <Analytics /> inside <Providers>
```

For clients who need Google Analytics: wrap the GTM snippet in `afterInteractive` and accept the minor Lighthouse hit. Document it in `.claude/CLAUDE.md`.

---

## 10. Pre-Deploy Performance Checklist

Run on a production build deployed to Vercel — Lighthouse on localhost is not representative.

### Lighthouse targets

| Category | Target |
|---|---|
| Performance | ≥ 90 |
| Accessibility | ≥ 90 |
| Best Practices | ≥ 90 |
| SEO | ≥ 90 |

### Checklist

- [ ] `npm run build` completes with no errors or warnings
- [ ] Lighthouse Performance ≥ 90 on homepage (mobile and desktop)
- [ ] Lighthouse Performance ≥ 90 on contact page
- [ ] LCP element has `priority` prop and correct `sizes`
- [ ] No images without explicit `width`/`height` or `fill` (check Lighthouse "Properly size images")
- [ ] No images missing `sizes` prop (check Lighthouse "Uses responsive images")
- [ ] Fonts loaded via `next/font` — no external font CDN requests in Network tab
- [ ] No unused JavaScript flagged in Lighthouse (check "Reduce unused JavaScript")
- [ ] All below-fold heavy components use `dynamic()` with a loading placeholder
- [ ] Framer Motion uses `LazyMotion` + `domAnimation` if motion is used on the page
- [ ] `prefers-reduced-motion` respected in all animated components
- [ ] No `console.log` in production build (check browser console on production URL)
- [ ] Third-party scripts use `next/script` with `afterInteractive` or `lazyOnload`
- [ ] CLS < 0.1 — no visible layout shift during page load (check in Lighthouse)
