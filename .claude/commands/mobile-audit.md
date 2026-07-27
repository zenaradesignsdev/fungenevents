You are performing a mobile responsiveness audit of a Zenara Designs client project. This is a Next.js 14 App Router site for a local professional services business. Most visitors arrive on mobile — the site must feel intentional at 375px.

The full mobile standard is in `blueprints/mobile.md`. Treat it as your reference throughout.

---

## Step 1 — Tailwind Mobile-First Patterns

Read every file in `src/components/` and `src/app/`.

Scan for desktop-first Tailwind patterns that fight the mobile-first approach:
```bash
grep -rn "max-sm:\|max-md:\|max-lg:" src/
```

For each result: is the `max-` prefix genuinely necessary (e.g. hiding an element on desktop) or is it fighting a desktop-first base style that should be rewritten mobile-first?

Also scan for fixed widths that could overflow on mobile:
```bash
grep -rn "w-\[" src/
```

For each arbitrary width: could it overflow at 375px? Should it be `w-full max-w-[...]` instead?

Scan for grid layouts that start with more than 1 column:
```bash
grep -rn "grid-cols-[2-9]\|grid-cols-1[0-9]" src/
```

For each result that is not prefixed with a breakpoint (`sm:`, `md:`, `lg:`): flag it — a grid starting at 2+ columns will break at 375px.

---

## Step 2 — Horizontal Overflow

Check `src/app/globals.css`:
- Is `overflow-x: hidden` set on `html` and/or `body`? (Acceptable as a safety net — but note the root cause should be found)

Scan for negative margins that could cause overflow:
```bash
grep -rn "\-mx-\|\-ml-\|\-mr-" src/
```

For each result: does the parent have `overflow-hidden` to contain it? Is the overflow intentional?

Scan for elements that could exceed viewport width:
```bash
grep -rn "min-w-\|w-screen" src/
```

Flag `w-screen` inside any container that is not itself `overflow-hidden`.

---

## Step 3 — Typography

Read all page and component files. For each, check:

**Minimum sizes:**
- Is any body text smaller than `text-base` (16px)?
- Are navigation links at least `text-base`?
- Are button labels at least `text-base`?

**Form inputs:**
- Search for any `text-sm` or `text-xs` applied directly to `<Input>` or `<Textarea>` components — these cause iOS auto-zoom on tap:
```bash
grep -rn "text-sm\|text-xs" src/components/contact/
```

**Headings:**
- Do mobile heading sizes start at `text-3xl` or larger for `<h1>`? (Minimum 28px)
- Is `max-w-prose` or similar applied to body copy containers to prevent overly long lines?

---

## Step 4 — Touch Targets

Scan for interactive elements that may be undersized:

**Icon-only buttons:**
```bash
grep -rn "<button\|<Button" src/
```
For each button: if it contains only an icon (no text), does it have at least `p-2.5` padding? (24px icon + 10px×2 padding = 44px total)

**Navigation links:**
Read any nav component files. Do links have at least `py-2` and `px-3` padding to ensure 44px tap height?

**CTA buttons:**
Are primary CTAs using `size="lg"` (`h-11` = 44px) rather than the default `size` (`h-10` = 40px)?
Do primary CTAs use `w-full sm:w-auto` to be full-width on mobile?

**Link spacing:**
Are clickable list items separated by at least `space-y-1` (4px) — ideally `space-y-2` (8px)?

---

## Step 5 — Click-to-Call and Click-to-Email

Scan all files for phone numbers and email addresses:
```bash
grep -rn "tel:\|mailto:" src/
```

Also scan for plain text phone patterns that should be links:
```bash
grep -rn "\+1\|(\d\{3\})\|\d\{3\}-\d\{3\}" src/
```

Check:
- Every phone number displayed on screen is wrapped in `<a href="tel:+1XXXXXXXXXX">`
- Every email address displayed on screen is wrapped in `<a href="mailto:...">`
- The `href="tel:..."` uses international format (`+1XXXXXXXXXX`), not display format
- On mobile, is there a prominent above-the-fold or sticky CTA for phone contact? Flag if the primary conversion action is buried below the fold with no mobile shortcut.

---

## Step 6 — Mobile Navigation

Find the navigation component (search `src/components/` for files named `nav`, `header`, or similar).

If a nav component exists, check:
- Is there a hamburger/menu button for mobile (visible on small screens, hidden on `lg:`)?
- Is the menu button padded to at least 44px touch target (`p-2.5` minimum)?
- Does the button have `aria-expanded`, `aria-controls`, and `aria-label` attributes?
- Is body scroll locked when the menu is open (`document.body.style.overflow = 'hidden'`)?
- Does the menu close on route change (`usePathname` effect)?
- Does the menu close on `Escape` key?
- Does the mobile menu contain all the same links as the desktop nav?

If no nav component exists yet, note that one needs to be built and flag the mobile nav checklist items.

---

## Step 7 — Forms on Mobile

Read `src/components/contact/ContactForm.tsx`.

Check:
- `type="email"` on the email input — triggers correct keyboard on iOS
- `type="tel"` on the phone input — triggers numeric keypad
- `autoComplete` attributes on all fields: `name`, `email`, `tel`, and `off` for message
- All inputs are at least `h-10` (40px) — flag if any are shorter
- Visible `<FormLabel>` above every field (not placeholder-only)
- Submit button uses `w-full sm:w-auto` and `size="lg"`
- Honeypot field is positioned off-screen (not `display: none` or `visibility: hidden`)

---

## Step 8 — Images on Mobile

Search all component and page files for `<Image` usage.

For each image:
1. **`sizes` prop** — is it present? Does it account for mobile (e.g. starts with `(max-width: 768px) 100vw,...`)?
2. **Aspect ratio containers** — for fill-mode images, does the parent use `aspect-video`, `aspect-square`, or `aspect-[custom]` to prevent CLS while loading?
3. **Art direction** — for hero/banner images, is there a separate mobile crop if the landscape version would crop faces or key content at mobile aspect ratios?
4. **Priority** — does each page have exactly one `priority` image (the LCP element)?

---

## Step 9 — Safe Area Insets

Search for fixed or sticky positioned elements:
```bash
grep -rn "fixed\|sticky" src/
```

For each `fixed` element (header, footer, CTA bar, mobile menu):
- Does a fixed header account for `pt-[env(safe-area-inset-top)]`?
- Does a fixed bottom element account for `pb-[env(safe-area-inset-bottom)]`?
- Does a fixed sidebar account for left/right safe area insets?

If the project has no fixed elements, note this as acceptable.

---

## Step 10 — Animation on Mobile

Search for Framer Motion usage:
```bash
grep -rn "framer-motion\|from 'framer-motion'\|whileInView\|whileHover\|whileTap" src/
```

For each animated component:
- Is `useReducedMotion` used to disable animation for users who request it?
- Are `whileHover` effects accompanied by `whileTap` equivalents for touch devices?
- Are motion values kept small on mobile (y offset ≤ 16px for reveals)?
- Are animations limited to `opacity` and `transform` (not layout-causing properties)?

---

## Step 11 — Spacing and Padding

Scan page and section components for padding patterns:

Check:
- Every full-width section has at least `px-4` horizontal padding — never lets text touch the screen edge
- Content containers use the standard pattern: `mx-auto max-w-6xl px-4 sm:px-6 lg:px-8`
- Vertical section spacing follows the pattern: `py-16 md:py-24` (not the same large value at all breakpoints)

Flag any section or container without horizontal padding that is not itself `overflow-hidden`.

---

## Step 12 — Viewport Height

Search for `100vh` usage:
```bash
grep -rn "100vh\|h-screen\|min-h-screen" src/
```

For each `100vh`:
- Should this be `100dvh` (dynamic viewport height, excludes browser chrome)?
- Note: Tailwind's `min-h-screen` in modern browsers correctly uses `100svh`/`100dvh` — flag raw `100vh` values in arbitrary Tailwind classes or CSS

---

## Final Report

Output a report with these sections:

### ✅ Passing
List everything correctly implemented with specific observations (e.g. "ContactForm: all inputs have correct type attributes ✓").

### ⚠️ Issues Found
For each issue:
- **File**: exact path
- **Issue**: what is wrong
- **User impact**: how this affects mobile visitors (e.g. "tap target too small — users will frequently mis-tap", "no click-to-call — mobile visitors cannot call without copying the number")
- **Fix**: exact change needed

### 🔴 Critical (Fix Before Launch)
Separately call out any issues that would make the site unusable or lose conversions on mobile:
- Horizontal overflow at 375px
- No click-to-call on phone numbers
- iOS input zoom on form fields
- Touch targets under 32px

### 📋 Pre-Launch Mobile Checklist
Output the checklist from `blueprints/mobile.md` Section 12 with each item marked [x] (confirmed passing) or [ ] (needs attention) based on your findings.
