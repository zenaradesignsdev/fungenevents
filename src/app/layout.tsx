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
      lang="en"
      className={cn(fontSans.variable, fontDisplay.variable)}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
