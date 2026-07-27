import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/metadata'

/**
 * Per-client: add additional routes as the site grows.
 * Next.js serialises this automatically at /sitemap.xml
 *
 * lastModified uses BUILD_TIME (injected via next.config.mjs) so the value is
 * stable across requests rather than changing on every render. Without this,
 * search engines see a perpetually "just updated" sitemap and may crawl more
 * aggressively than needed.
 *
 * To set a per-page date instead, replace LAST_MODIFIED with an explicit ISO
 * string: lastModified: new Date('2025-01-15')
 */
const LAST_MODIFIED = new Date(process.env.BUILD_TIME ?? Date.now())

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
