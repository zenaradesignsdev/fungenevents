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

const ROUTES: { path: string; priority: number }[] = [
  { path: '', priority: 1 },
  { path: '/services', priority: 0.9 },
  { path: '/portfolio', priority: 0.8 },
  { path: '/about', priority: 0.7 },
  { path: '/contact', priority: 0.7 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority,
  }))
}
