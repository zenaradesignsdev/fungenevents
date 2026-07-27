You are performing a performance audit of a Zenara Designs client project. This is a Next.js 14 App Router site for a local professional services business. The target is Lighthouse ≥ 90 on all four categories on every page, measured on a production Vercel build.

The full performance standard is in `blueprints/performance.md`. Treat it as your reference throughout.

---

## Step 1 — Build

Run:
```bash
npm run build
```

Report:
- Whether the build succeeded
- Any warnings (unused variables, missing dependencies, large bundle warnings)
- First Load JS sizes reported by Next.js for each route — flag any route over 150KB

---

## Step 2 — Rendering Strategy ('use client' audit)

Search for every `'use client'` directive in `src/`:

```bash
grep -rn "'use client'" src/
```

For each file found, read it and assess:
- Does it genuinely need to be a client component? (Requires: `useState`, `useReducer`, `useEffect`, browser APIs, or event handlers that update state)
- Could any of its content be extracted into a server component, leaving only the interactive part as `'use client'`?
- Is a parent marked `'use client'` only because one child needed it? (If so, that child should be extracted)

Flag any `'use client'` component that could reasonably be a server component.

---

## Step 3 — Image Audit

Search all component and page files for image usage.

**Raw `<img>` tags:**
```bash
grep -rn "<img " src/
```
Flag every occurrence — raw `<img>` bypasses Next.js optimisation entirely.

**`<Image>` usage (our wrapper or next/image directly):**
For each `<Image>` usage, check:
1. Does it have a `sizes` prop? Flag any image wider than ~640px that lacks one.
2. Is `priority` set on exactly one image per page (the LCP element)? Flag pages where `priority` appears on multiple images or on no images when a large above-fold image is present.
3. Does every `<Image>` have an `alt` prop?
4. For images using `fill`, does the parent have `position: relative` and explicit dimensions?
5. Does any `<Image>` use `quality` lower than 80 or higher than 90? (85 is the project default — flag deviations)

---

## Step 4 — Font Loading

Read `src/lib/fonts.ts` and `src/app/layout.tsx`.

Check:
- Fonts are only loaded via `next/font/google` or `next/font/local` — never via a CDN `<link>` tag
- `display: 'swap'` is set on all font declarations
- Weight arrays are explicit (not loading all weights): e.g. `weight: ['400', '500', '600']`
- Only weights and styles actually used in the design are loaded
- For French Canadian clients, `subsets: ['latin', 'latin-ext']` is used

Search for any Google Fonts CDN links that should not be present:
```bash
grep -rn "fonts.googleapis.com\|fonts.gstatic.com" src/ public/
```

---

## Step 5 — Framer Motion

Search for any Framer Motion usage:
```bash
grep -rn "framer-motion\|from 'framer-motion'" src/
```

If Framer Motion is used:
- Is `LazyMotion` with `domAnimation` wrapping the app in `src/providers/Providers.tsx`? (Reduces bundle from ~95KB to ~16KB)
- Are components using `m.div` (with LazyMotion) rather than `motion.div`?
- Is `useReducedMotion` used in animated components to respect accessibility preferences?
- Are any LCP elements (hero images, hero headings) being animated? (Animating the LCP element delays the LCP score — flag this)
- Are all `whileInView` animations using `viewport={{ once: true }}`?
- Are animations limited to `opacity` and `transform` properties? (Flag `width`, `height`, `top`, `left`, `margin`, `padding` animations — they cause layout recalculation)

---

## Step 6 — JavaScript Bundle

Read `src/app/layout.tsx` and `src/providers/Providers.tsx`.

Check:
- Are heavy components that appear below the fold wrapped in `next/dynamic` with a loading placeholder?
- Are there any large libraries (lodash, moment, date-fns full import) imported in client components?

Search for potential bundle issues:
```bash
grep -rn "import \* from\|require(" src/
```

Flag any wildcard imports in client components.

Check if `@next/bundle-analyzer` has been installed — if not, note it as a diagnostic tool available when Lighthouse flags bundle size issues.

---

## Step 7 — TanStack Query

Read `src/providers/Providers.tsx`.

Check:
- `staleTime` is set to at least 60 seconds (prevents unnecessary background refetches)
- `retry` is set to 1 (prevents hammering a failing API)
- `refetchOnWindowFocus` is not enabled (would cause form remounts on tab switch)

Search for any `useQuery` usage:
```bash
grep -rn "useQuery" src/
```

For each occurrence: could this data be fetched in a Server Component instead? If the data is the same for all users and doesn't depend on user context, it should be a server fetch.

---

## Step 8 — Static vs Dynamic Rendering

Search for `force-dynamic` directives:
```bash
grep -rn "force-dynamic\|dynamic = " src/app/
```

For each occurrence: does this page genuinely require dynamic rendering (reads cookies, user-specific data, request-time information)? If not, flag it — unnecessary dynamic rendering defeats Vercel's edge caching.

Check that the contact page (`src/app/contact/page.tsx`) is static (no `force-dynamic`). The contact form submits via API route — the page itself should be statically generated.

---

## Step 9 — Third-Party Scripts

Search for script tags and `next/script` usage:
```bash
grep -rn "next/script\|<Script\|<script" src/
```

For each `<Script>`:
- Is it using `next/script` (not raw `<script>`)?
- Is the `strategy` appropriate? (`afterInteractive` for analytics, `lazyOnload` for chat widgets)
- Is the CSP in `next.config.mjs` updated to allow this script's origin?

For raw `<script>` tags: flag every occurrence.

---

## Step 10 — Console Logs

Search for console statements that may leak to production:
```bash
grep -rn "console.log\|console.warn\|console.debug" src/
```

Flag any `console.log` or `console.warn` that is not inside a catch block or clearly intended for error monitoring. `console.error` in catch blocks is acceptable.

---

## Step 11 — Tailwind Class Safety

Search for dynamically constructed Tailwind class names:
```bash
grep -rn "className={\`" src/
```

For each result: are any class names partially constructed from variables? (e.g. `` `text-${color}-500` ``)
Flag any dynamic class name that Tailwind's JIT compiler would purge.

---

## Final Report

Output a report with these sections:

### ✅ Passing
List everything that is correctly implemented.

### ⚠️ Issues Found
For each issue:
- **File**: exact path and line if possible
- **Issue**: what is wrong
- **Performance impact**: estimated effect (e.g. "adds ~79KB to client bundle", "prevents edge caching on this route")
- **Fix**: exact change needed

### 📊 Build Output Summary
Paste the First Load JS sizes from the build output.

### 📋 Pre-Deploy Performance Checklist
Output the checklist from `blueprints/performance.md` Section 10 with each item marked [x] (confirmed passing) or [ ] (needs attention) based on your findings.
