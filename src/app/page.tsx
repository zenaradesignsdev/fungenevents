import { generateMetadata as buildMetadata, getLocalBusinessJsonLd } from '@/lib/metadata'
import { HomeLanding } from '@/components/home/HomeLanding'
import type { Metadata } from 'next'

export const metadata: Metadata = buildMetadata({
  path: '/',
})

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getLocalBusinessJsonLd()) }}
      />
      <HomeLanding />
    </>
  )
}
