import type { Metadata } from 'next'
import { fontSans, fontDisplay } from '@/lib/fonts'
import { cn } from '@/lib/cn'
import { Providers } from '@/providers/Providers'
import { generateMetadata } from '@/lib/metadata'
import '@/app/globals.css'

export const metadata: Metadata = generateMetadata()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-CA"
      className={cn(fontSans.variable, fontDisplay.variable)}
    >
      <body>
        {/* WCAG 2.4.1: the nav is fixed and identical on every page, so a
            keyboard user would otherwise tab through it before reaching any
            content. Off-screen until focused, then it lands over the bar. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[300] focus:rounded-full focus:bg-brand focus:px-6 focus:py-3.5 focus:font-sans focus:text-[11px] focus:uppercase focus:tracking-[0.24em] focus:text-brand-foreground"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
