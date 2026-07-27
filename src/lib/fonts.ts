import { Archivo, Bodoni_Moda } from 'next/font/google'

/**
 * FunGen Events brand typefaces.
 *
 * Loaded via next/font/google so the files are self-hosted at build time —
 * this satisfies the `font-src 'self'` CSP in next.config.mjs (no runtime
 * request to fonts.gstatic.com) and removes render-blocking font CSS.
 *
 * - Archivo (sans)      → body copy, eyebrows, UI. Weights 300/400/500.
 * - Bodoni Moda (serif) → display headings & pull quotes, normal + italic.
 *
 * CSS variable names stay constant (--font-sans / --font-display); Tailwind
 * picks them up via tailwind.config.ts fontFamily.
 */

export const fontSans = Archivo({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500'],
})

export const fontDisplay = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  // Bodoni Moda has no entry in Next's font-metrics table, so the automatic
  // size-adjust fallback can't be computed. Declare an explicit serif fallback
  // and skip the adjustment to keep the build warning-free.
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  adjustFontFallback: false,
})
