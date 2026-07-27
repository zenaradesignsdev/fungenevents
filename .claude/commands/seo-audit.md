You are performing an SEO audit of a Zenara Designs client project. This is a Next.js 14 App Router site for a local professional services business (law firm, accountant, consultant, financial advisor, etc.). Work through every step below in order. Be specific — quote the actual values found when checking metadata, and flag any that still contain boilerplate placeholder text.

The full SEO standard is in `blueprints/seo.md`. Treat it as your reference throughout.

---

## Step 1 — siteConfig

Read `src/lib/metadata.ts`.

Check every field in `siteConfig`:
- `name` — has this been updated from `'Client Name'`? If not, flag as critical.
- `description` — has this been updated from the boilerplate placeholder? Is it 150–160 characters? Does it mention the service and location?
- `url` — does it match the real production domain? Does it have no trailing slash? Does it start with `https://`?
- `ogImage` — is it set to `/og-image.jpg`? (Acceptable default — check that the file actually exists in `public/`)
- `locale` — is it appropriate for this client's region?

---

## Step 2 — Page Metadata

Find every page file by searching `src/app/**/page.tsx`.

For each page:
1. Does it export `metadata` or `generateMetadata`?
2. Does it call `generateMetadata()` (or `buildMetadata()`) from `@/lib/metadata`?
3. Does the call include a `path` parameter matching the page's route? (e.g. `/contact` for the contact page)
4. Is the `title` unique across all pages — no two pages share the same title?
5. Is the `description` unique and between 150–160 characters?
6. Does the title lead with the keyword, not the firm name?

Flag any page missing metadata, missing the `path` param, or using placeholder text.

---

## Step 3 — Open Graph Image

Check:
- `public/og-image.jpg` exists (use a file check)
- If it exists, note its presence — dimensions cannot be verified in code but flag if the file is the default boilerplate placeholder (0 bytes or missing)

---

## Step 4 — Sitemap

Read `src/app/sitemap.ts`.

Check:
- Does it include an entry for every page in `src/app/**/page.tsx`?
- Is `LAST_MODIFIED` derived from `process.env.BUILD_TIME` (not `new Date()`)?
- Does the sitemap URL match `siteConfig.url`?
- Are priorities set correctly (homepage = 1.0, service pages = 0.8, contact = 0.5)?

List any pages that exist in the file system but are missing from the sitemap.

---

## Step 5 — Robots

Read `src/app/robots.ts`.

Check:
- It is a `.ts` file (not a static `public/robots.txt`)
- It reads the sitemap URL from `siteConfig.url`, not hardcoded
- `/api/` is disallowed
- No pages that should be indexed are accidentally disallowed

Also check that `public/robots.txt` does NOT exist — if it does, flag it (the static file will take precedence over the dynamic route).

---

## Step 6 — Structured Data

Search `src/` for any `application/ld+json` script tags or a `JsonLd` component.

- If found: verify the schema type is appropriate for the client (`LegalService`, `AccountingService`, `LocalBusiness`, `Person`, etc.), and that `name`, `url`, `telephone`, `address`, and `areaServed` are populated with real client data, not placeholders.
- If not found: flag this as a missing item. Note which schema type would be appropriate based on the client's industry (check `.claude/CLAUDE.md` for industry context).

---

## Step 7 — Semantic HTML and Heading Hierarchy

Read every page file in `src/app/**/page.tsx` and any section components in `src/components/`.

For each page:
- Is there exactly one `<h1>`?
- Does the `<h1>` contain the primary keyword for the page (service + location)?
- Do headings follow a logical hierarchy (h1 → h2 → h3, no skipping)?
- Is `<main>` wrapping the primary content?
- Is `<nav>` used for navigation (if a nav component exists)?
- Is contact information wrapped in `<address>`?

---

## Step 8 — Image Alt Text

Search all component and page files for `<Image` usage.

For each image:
- Does it have an `alt` prop?
- Is the `alt` descriptive (not `"image"`, `"photo"`, `"logo"` alone, or an empty string on a non-decorative image)?
- Is the `alt` empty (`alt=""`) only for genuinely decorative images?

---

## Step 9 — Local SEO Signals

Read `.claude/CLAUDE.md` for client industry and location context, then check:

- Is the city/service area mentioned explicitly in at least one `<h1>` or opening paragraph?
- Is the phone number rendered as a `<a href="tel:...">` link (not plain text)?
- Is the email rendered as a `<a href="mailto:...">` link (not plain text)?
- Is there a Google Maps embed or link on the contact page?
- Does the NAP (name, address, phone) appear consistently wherever it is shown?

---

## Step 10 — Core Web Vitals Signals

Scan page and component files for common CWV issues:

**LCP:**
- Is there an `<Image>` with `priority` on the above-the-fold image on each page?
- Does the priority image have a `sizes` prop?

**CLS:**
- Do all `<Image>` components have explicit `width` and `height`, or use `fill` with a sized parent?
- Are there any iframes or video embeds without explicit dimensions?

**INP:**
- Are there `'use client'` components that could be server components?
- Are heavy below-fold components wrapped in `dynamic()`?

---

## Final Report

Output a report with these sections:

### ✅ Passing
List everything that checked out correctly with specific values found (e.g. "siteConfig.name: 'Smith & Associates Law' ✓").

### ⚠️ Issues Found
For each issue:
- **File**: exact path
- **Issue**: what is wrong or missing
- **Impact**: how this affects search visibility
- **Fix**: exact change needed

### 📋 Pre-Launch SEO Checklist
Output the checklist from `blueprints/seo.md` Section 11 with each item marked [x] (confirmed passing) or [ ] (needs attention) based on your findings.
