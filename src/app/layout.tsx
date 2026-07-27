import type { Metadata } from 'next'
import { fontSans } from '@/lib/fonts'
import { Providers } from '@/providers/Providers'
import { generateMetadata } from '@/lib/metadata'
import '@/app/globals.css'

export const metadata: Metadata = generateMetadata()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={fontSans.variable}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
