import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/metadata'

/**
 * Generates /robots.txt dynamically so the sitemap URL always matches
 * the deployed domain (read from NEXT_PUBLIC_SITE_URL via siteConfig).
 * No manual update required after forking.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
