# Mobile Blueprint
# Zenara Designs — applies to every client project

---

## Philosophy

The majority of visitors to a professional services website arrive on mobile — often while commuting, waiting, or looking up a firm after a referral. They will not tolerate a desktop site that has been squeezed down. The site must feel intentional at 375px, not salvaged.

Mobile-first is not a Tailwind convention here — it is a design requirement. Every layout decision starts at the smallest screen and scales up. A layout that looks great on desktop but breaks at 390px is a broken layout.

---

## 1. Tailwind Mobile-First: The Correct Pattern

Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) apply styles **at and above** that breakpoint. The unprefixed class is the mobile style.

```typescript
// ✓ Correct — mobile-first
<div className="flex flex-col gap-4 md:flex-row md:gap-8">

// ✗ Wrong — desktop-first, fighting the framework
<div className="flex flex-row gap-8 max-md:flex-col max-md:gap-4">
```

### Tailwind breakpoints reference

| Prefix | Min-width | Typical device |
|---|---|---|
| (none) | 0px | All phones, default |
| `sm:` | 640px | Large phones, small tablets |
| `md:` | 768px | Tablets, landscape phones |
| `lg:` | 1024px | Laptops, large tablets |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large desktops |

For professional services sites, the critical breakpoints are **mobile (< 640px)** and **desktop (≥ 1024px)**. Tablet (640–1023px) should work naturally as a middle state — if you need heavy tablet-specific styles, the mobile or desktop layout is probably wrong.

### Common layout mistakes

```typescript
// ✗ Grid that breaks at 375px — 3 columns at base
<div className="grid grid-cols-3 gap-6 lg:grid-cols-4">

// ✓ Stacks on mobile, expands on larger screens
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
```

```typescript
// ✗ Fixed pixel width that overflows on small phones
<div className="w-[500px]">

// ✓ Responsive — full width on mobile, constrained on desktop
<div className="w-full max-w-xl">
```

---

## 2. Viewport and Layout Foundations

### Viewport meta tag

Next.js sets the viewport meta tag by default when you use `export const metadata`. Verify it is present in the rendered HTML:

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

If you set custom metadata at the root layout, ensure you do not accidentally override this. Never set `user-scalable=no` — it breaks accessibility and is technically prohibited in WCAG 2.1.

### Preventing horizontal overflow

The most common mobile bug: content wider than the viewport, causing a horizontal scrollbar.

```css
/* src/app/globals.css — add to the base layer */
html, body {
  overflow-x: hidden;
}
```

Then find the cause — it is almost always a fixed-width element, a negative margin, or a transform that pushes content off-screen. `overflow-x: hidden` on the body masks the symptom; finding the cause is the real fix.

**Debug technique**: add a red outline to everything and find what overflows:
```javascript
// In browser console during development
document.querySelectorAll('*').forEach(el => el.style.outline = '1px solid red')
```

### Safe area insets (iOS notch and home indicator)

On iPhones with a notch or dynamic island, content near screen edges can be obscured. This is most critical for fixed headers and sticky footers.

```typescript
// Fixed header — account for the status bar area
<header className="fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top)]">

// Sticky footer or bottom nav
<nav className="fixed bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)]">
```

In `globals.css`, add to the `<html>` or `<body>`:
```css
body {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

For Tailwind, use arbitrary values: `pt-[env(safe-area-inset-top)]`. This only activates on devices with a notch — it is a no-op on all other devices.

---

## 3. Typography on Mobile

### Minimum font sizes

| Element | Min size | Tailwind |
|---|---|---|
| Body text | 16px | `text-base` |
| Small/caption | 14px | `text-sm` |
| Navigation links | 16px | `text-base` |
| Buttons | 16px | `text-base` |
| Form inputs | 16px | `text-base` — see note below |
| H1 (mobile) | 28–36px | `text-3xl` or `text-4xl` |
| H2 (mobile) | 22–28px | `text-2xl` or `text-3xl` |

**Form input font size is critical.** iOS Safari automatically zooms into any input field with a font size smaller than 16px. This is disorienting and breaks the layout. The shadcn Input component already uses `text-base` — do not override it with a smaller size.

### Fluid type scale

For headings, consider a fluid scale that scales between mobile and desktop without hard breakpoints:

```typescript
// Scales from 28px at 375px viewport to 48px at 1280px
<h1 className="text-[clamp(1.75rem,4vw+1rem,3rem)] font-display font-semibold tracking-tight">
```

Or use explicit breakpoints:
```typescript
<h1 className="text-3xl font-display font-semibold tracking-tight md:text-4xl lg:text-5xl">
```

### Line length on mobile

On mobile, lines that are too wide are hard to read. Constrain content containers:

```typescript
// ✓ Comfortable reading width at all sizes
<div className="mx-auto max-w-prose px-4">
  <p>Body copy...</p>
</div>
```

`max-w-prose` is 65ch — optimal for reading. On mobile it fills the screen (since 65ch > screen width); on desktop it constrains naturally.

### Letter spacing and line height

On mobile, slightly looser line height improves readability on small screens:

```typescript
// Body text
<p className="leading-relaxed text-base">   // leading-relaxed = 1.625

// Tight headings (intentional) — ensure still legible at mobile sizes
<h1 className="leading-tight tracking-tight text-3xl md:text-5xl">
```

---

## 4. Touch Targets

Every tappable element must be large enough to hit accurately with a finger. The minimum is **44×44px** (Apple HIG) or **48×48dp** (Material Design). WCAG 2.5.5 (AAA) recommends 44×44px.

### Buttons

shadcn Button defaults: `h-10` (40px) at default size, `h-11` (44px) at `size="lg"`. Use `size="lg"` for primary CTAs on mobile.

```typescript
// Primary CTA — meets minimum on desktop, explicitly large on mobile
<Button size="lg" className="w-full sm:w-auto">
  Book a consultation
</Button>
```

### Navigation links

Text links in a nav are rarely large enough by default. Add padding to increase the touch area without changing the visual size:

```typescript
<Link href="/about" className="px-3 py-2 text-sm font-medium">
  About
</Link>
```

### Icon-only buttons

An icon alone is almost never 44px. Always add padding or an explicit minimum size:

```typescript
// ✗ Icon alone — touch target is the icon size (~24px)
<button><Menu className="h-6 w-6" /></button>

// ✓ Padded to meet minimum
<button className="p-2.5"><Menu className="h-6 w-6" /></button>
// 24px icon + 10px padding × 2 = 44px total
```

### Spacing between targets

Closely spaced links (e.g. a list of services) are error-prone on mobile. Minimum 8px gap between interactive elements. In a list of links, use `space-y-1` or `space-y-2` at minimum.

---

## 5. Mobile Navigation

The boilerplate does not ship a nav component — it is built per project. When building mobile navigation, follow these patterns.

### State management

Use a `useState` boolean in a `'use client'` component. The rest of the nav (logo, links) can remain a server component.

```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="p-2.5 lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <nav id="mobile-menu" className="lg:hidden">
          {/* links */}
        </nav>
      )}
    </>
  )
}
```

### Preventing body scroll when nav is open

When a full-screen mobile menu is open, the background should not scroll:

```typescript
useEffect(() => {
  if (open) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
  return () => { document.body.style.overflow = '' }
}, [open])
```

### Closing on route change

```typescript
import { usePathname } from 'next/navigation'

const pathname = usePathname()

useEffect(() => {
  setOpen(false)
}, [pathname])
```

### Keyboard and accessibility

- Trap focus inside the open menu (use `focus-trap-react` or a manual implementation)
- Close on `Escape` key:
  ```typescript
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])
  ```
- `aria-expanded` on the toggle button reflects open state (shown above)
- First link in menu should receive focus when menu opens: use a `ref` and call `.focus()`

---

## 6. Click-to-Call and Click-to-Email

For local business clients, calling the firm is the single highest-intent action a mobile visitor can take. Make every phone number and email address tappable — never render them as plain text.

### Phone numbers

```typescript
// ✗ Plain text — not tappable on mobile
<p>Call us: (416) 555-0100</p>

// ✓ Tappable — opens the phone dialer immediately
<a href="tel:+14165550100" className="font-medium hover:underline">
  (416) 555-0100
</a>
```

Use the international format (`+1XXXXXXXXXX`) in the `href` — it works on all carriers and regions. Display format (`(416) 555-0100`) can stay in the visible text.

### Email addresses

```typescript
// ✓ Tappable — opens the mail client
<a href="mailto:hello@smithlaw.ca" className="font-medium hover:underline">
  hello@smithlaw.ca
</a>
```

### Prominent CTA placement

On mobile, the primary CTA (phone call or contact form) should be reachable without scrolling on the homepage — or at minimum appear in the fixed header. A sticky "Call now" button on mobile only is common for law firms and consultants:

```typescript
// Mobile-only sticky CTA at bottom of viewport
<a
  href="tel:+14165550100"
  className="fixed bottom-4 left-4 right-4 z-40 flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-base font-semibold text-brand-foreground shadow-lg sm:hidden"
>
  <Phone className="h-5 w-5" />
  Call now
</a>
```

This pattern is especially effective for mobile visitors who arrived from a Google search.

---

## 7. Forms on Mobile

The contact form is the most critical conversion point. It must be frictionless on mobile.

### Input type attributes

Using the correct `type` attribute triggers the right keyboard on mobile:

```typescript
<Input type="email" />   // @ symbol and .com key on iOS
<Input type="tel" />     // numeric keypad with +, -, (, )
<Input type="text" />    // default keyboard
<Textarea />             // default keyboard with return key
```

Always use `type="email"` for email fields and `type="tel"` for phone fields. Already implemented in `ContactForm.tsx`.

### Autocomplete attributes

`autoComplete` helps password managers and browser autofill, reducing friction on mobile:

```typescript
<Input autoComplete="name" />       // Full name
<Input autoComplete="email" />      // Email address
<Input autoComplete="tel" />        // Phone number
<Textarea autoComplete="off" />     // Message field — don't autocomplete
```

Already implemented in `ContactForm.tsx`.

### Input sizing

Never reduce input height below 44px on mobile. shadcn Input defaults to `h-10` (40px). For mobile, patch to `h-11`:

```typescript
<Input className="h-11" />  // or add to the form-level className
```

Or update the shadcn Input base to `h-11` for all instances.

### Label placement

Labels above inputs (not placeholder-only) are required for mobile accessibility. When the user taps into a field, the keyboard covers the bottom half of the screen — if the label is a placeholder, it disappears. Always use visible `<FormLabel>` above each field.

### Full-width submit button on mobile

```typescript
<Button type="submit" size="lg" className="w-full sm:w-auto">
  Send message
</Button>
```

Full width on mobile is easier to tap and visually clear. Auto-width on desktop.

### Keyboard obscuring the form

On mobile, the virtual keyboard reduces the visible viewport. Fields near the bottom of a tall form can be hidden behind the keyboard. Ensure the form scrolls: use a scroll container or ensure `overflow-y: auto` on the page. Next.js handles this naturally — avoid `overflow: hidden` on `<body>` during form interaction.

---

## 7. Images on Mobile

### Correct `sizes` for mobile

The `sizes` prop tells the browser which image variant to fetch at each viewport width. Without it, mobile downloads the same image as desktop.

```typescript
// Full-bleed hero — mobile gets full viewport width
<Image
  src="/hero.jpg"
  alt="..."
  width={1600}
  height={900}
  priority
  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1280px"
/>

// Thumbnail grid — 1 col mobile, 2 col tablet, 3 col desktop
<Image
  src="/service.jpg"
  alt="..."
  width={600}
  height={400}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

### Art direction: different crops for mobile

When a landscape image looks poor at mobile aspect ratios (faces cropped out, key content obscured), use separate images per breakpoint. CSS `display` toggle is the simplest approach:

```typescript
{/* Portrait crop — shown on mobile */}
<div className="block sm:hidden">
  <Image src="/hero-mobile.jpg" alt="..." width={750} height={1000} priority sizes="100vw" />
</div>

{/* Landscape crop — shown on desktop */}
<div className="hidden sm:block">
  <Image src="/hero-desktop.jpg" alt="..." width={1600} height={900} priority sizes="80vw" />
</div>
```

### Aspect ratio containers

Use Tailwind's `aspect-ratio` utilities to prevent CLS while images load:

```typescript
<div className="relative aspect-video w-full overflow-hidden rounded-md">
  <Image src="/photo.jpg" alt="..." fill className="object-cover" sizes="100vw" />
</div>
```

| Ratio | Tailwind class | Good for |
|---|---|---|
| 16:9 | `aspect-video` | Hero images, video placeholders |
| 1:1 | `aspect-square` | Team headshots, logo blocks |
| 4:3 | `aspect-[4/3]` | Office/location photos |
| 3:2 | `aspect-[3/2]` | Editorial / blog imagery |

---

## 8. Animation on Mobile

### Reduce motion intensity on mobile

Animations that feel polished on desktop can feel excessive on mobile — smaller screens make movement more pronounced. Consider reducing travel distance on mobile:

```typescript
<m.div
  initial={{ opacity: 0, y: 12 }}   // 12px on mobile
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.35 }}
  className="md:data-[initial]:translate-y-6"  // larger travel on desktop only
>
```

Or simply reduce the `y` offset at mobile sizes.

### Always respect `prefers-reduced-motion`

```typescript
import { useReducedMotion } from 'framer-motion'

export function AnimatedSection({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()

  return (
    <m.div
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: reduce ? 0 : 0.4 }}
    >
      {children}
    </m.div>
  )
}
```

This also helps with battery usage on low-power devices and is required for WCAG 2.3.3 (AAA).

### Touch events

Framer Motion's `whileHover` does not fire on touch devices — use `whileTap` for touch feedback:

```typescript
<m.button
  whileHover={{ scale: 1.02 }}  // desktop hover
  whileTap={{ scale: 0.97 }}    // mobile tap feedback
  className="..."
>
  Book a call
</m.button>
```

---

## 9. Performance on Mobile

Mobile devices have slower CPUs, less RAM, and are often on cellular networks. The performance budget on mobile is tighter than desktop.

### LCP on mobile

Lighthouse measures LCP separately for mobile and desktop. A priority image with correct `sizes` is the most impactful fix. Check the mobile Lighthouse score, not just desktop.

### Reduce JavaScript on mobile

`'use client'` components ship JavaScript to the device. On a mid-range Android phone on 4G, parsing and executing JavaScript is the main bottleneck — not the download.

Audit every `'use client'` component before launch. If it only has a click handler with no state, consider whether it can be replaced with a form action or a CSS-only interaction.

### Slow network simulation

Test on a simulated slow 4G connection before every deploy. In Chrome DevTools:
- Open DevTools → Network tab → Throttling dropdown → "Slow 4G"
- Hard reload the page
- Observe: does content appear quickly? Is there a blank screen? Does layout shift?

The Lighthouse "Performance" score on mobile uses a simulated mid-tier device on slow 4G. Match that in manual testing.

### Avoid large payloads on mobile

| Asset type | Mobile budget |
|---|---|
| Total page weight | < 1MB ideally, < 2MB max |
| Hero image | < 200KB (WebP/AVIF) |
| Total JavaScript (first load) | < 150KB gzipped |
| Total CSS | < 30KB |

Next.js + Tailwind handles CSS well by default. Watch JavaScript bundle size — see Performance Blueprint section 5.

---

## 10. Spacing and Padding on Mobile

Professional services sites have generous whitespace — but raw desktop padding values create problems on mobile.

### Responsive padding pattern

```typescript
// Page sections — generous on desktop, tighter on mobile
<section className="px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-32">

// Content container — always includes horizontal padding for breathing room
<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
```

### The 16px horizontal rule

Never let text touch the screen edge. `px-4` (16px) is the minimum horizontal padding for any content container on mobile. `px-6` is better for comfort. This applies to sections, cards, and any full-width element.

### Vertical rhythm on mobile

Long pages on mobile can feel like an endless scroll without visual rhythm. Use consistent vertical spacing:

```typescript
// Between page sections
<section className="py-16 md:py-24">

// Between elements within a section
<div className="space-y-4 md:space-y-6">

// Between a heading and body copy
<p className="mt-4 md:mt-6 text-muted-foreground">
```

---

## 11. Testing

### Viewport sizes to test

Test every page at these widths before considering it complete:

| Width | Device |
|---|---|
| **375px** | iPhone SE, iPhone 12/13/14 mini — the smallest common modern phone |
| **390px** | iPhone 14/15 Pro |
| **414px** | iPhone Plus models |
| **768px** | iPad portrait — ensure tablet layout works |
| **1280px** | Laptop — standard desktop |

375px is the critical minimum. A layout that breaks at 375px is broken for a significant portion of iPhone users.

### Chrome DevTools device toolbar

Use the device toolbar (Ctrl/Cmd + Shift + M) for initial development. Set a custom viewport at exactly 375px for worst-case checks.

Limitations: DevTools emulation does not replicate:
- Real touch events
- iOS Safari quirks (100vh, input zoom, rubber-band scrolling)
- Font rendering on real hardware
- Performance on real CPU/memory

Use a real device or Browserstack for final verification.

### iOS Safari specific checks

iOS Safari has persistent quirks that Chrome DevTools will not reveal:

| Issue | What to check |
|---|---|
| `100vh` includes the browser chrome | Use `100dvh` (dynamic viewport height) or `min-h-screen` which Tailwind handles correctly in modern browsers |
| Input zoom | All inputs ≥ 16px font size? |
| Fixed positioning | Fixed headers scroll with content on some iOS versions — test manually |
| Momentum scrolling | `-webkit-overflow-scrolling: touch` is no longer needed in modern iOS but watch for scroll containers |
| Safe area insets | Test on a physical device with notch/Dynamic Island |

### Android Chrome checks

| Issue | What to check |
|---|---|
| Address bar height | Address bar shows/hides on scroll — ensure fixed headers account for this |
| Back gesture | Swipe-back gesture navigates history — ensure no swipe-sensitive carousels conflict with it |
| Font rendering | Android renders fonts slightly differently — check readability on a real device |

### Automated testing

The `webapp-testing` skill (Playwright) can verify layout at mobile viewports:

```typescript
// Set viewport to mobile before testing
await page.setViewportSize({ width: 375, height: 812 })
```

Use this to catch regressions when components are updated.

---

## 12. Pre-Launch Mobile Checklist

- [ ] Tested at 375px viewport — no horizontal scroll, no overflowing content
- [ ] Tested at 768px (tablet) — layout is intentional, not accidental
- [ ] All touch targets ≥ 44×44px — buttons, links, nav items
- [ ] Form inputs ≥ 16px font size — no iOS zoom on tap
- [ ] `type="email"` and `type="tel"` on correct input fields
- [ ] `autoComplete` attributes on all form fields
- [ ] Submit button full-width on mobile (`w-full sm:w-auto`)
- [ ] Mobile navigation functional — opens, closes, closes on route change
- [ ] Body scroll locked when mobile nav is open
- [ ] Hero image has `priority` and correct `sizes` prop
- [ ] All images use `aspect-ratio` containers to prevent CLS
- [ ] No text touching screen edge — minimum `px-4` on all containers
- [ ] Lighthouse Mobile Performance ≥ 90 (measured on production Vercel URL)
- [ ] Tested on real iOS device (Safari) — input zoom, safe areas, fixed positioning
- [ ] Tested on real Android device (Chrome) — font rendering, back gesture
- [ ] `prefers-reduced-motion` respected in all animated components
