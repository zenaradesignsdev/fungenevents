import { Inter } from 'next/font/google'

/**
 * Per-client: swap or extend these font declarations.
 * CSS variable names stay constant — only the font family changes.
 * Tailwind picks them up via tailwind.config.ts fontFamily.
 *
 * To add a display font (recommended for most clients):
 *   import { Playfair_Display } from 'next/font/google'
 *   export const fontDisplay = Playfair_Display({
 *     subsets: ['latin'],
 *     variable: '--font-display',
 *     display: 'swap',
 *     style: ['normal', 'italic'],
 *   })
 *   Then add fontDisplay.variable to the <html> className in layout.tsx.
 *
 * Common pairings for trust-critical clients:
 *   Display: Playfair Display / Cormorant Garamond / Lora
 *   Body:    Inter / DM Sans / Source Sans 3
 */

export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})
