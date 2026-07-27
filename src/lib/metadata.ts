import type { Metadata } from 'next'

/**
 * Per-client: update siteConfig after forking.
 * All pages call generateMetadata() to merge page-level overrides
 * with these site-wide defaults.
 */
export const siteConfig = {
  name: 'FunGen Events and Experiences',
  description:
    'FunGen Events and Experiences plans birthdays, weddings, anniversaries, social gatherings, entertainment, and nonprofit events. Full website coming soon.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fungenevents.ca',
  ogImage: '/og-image.jpg',
  locale: 'en_CA',
} as const

// Real business contact details — email is still a placeholder (see HomeLanding.tsx).
export const businessInfo = {
  telephone: '+16479269787',
  telephoneDisplay: '(647) 926-9787',
  address: {
    streetAddress: 'Unit 312/5, 2855 Markham Road',
    addressLocality: 'Toronto',
    addressRegion: 'ON',
    postalCode: 'M1X 0C3',
    addressCountry: 'CA',
  },
} as const

export function getLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: businessInfo.telephone,
    address: {
      '@type': 'PostalAddress',
      ...businessInfo.address,
    },
  }
}

type MetadataOverrides = {
  title?: string
  description?: string
  ogImage?: string
  path?: string  // page path e.g. '/contact' — used for canonical URL and og:url
  noIndex?: boolean
}

export function generateMetadata(overrides: MetadataOverrides = {}): Metadata {
  const title = overrides.title ? `${overrides.title} | ${siteConfig.name}` : siteConfig.name
  const description = overrides.description ?? siteConfig.description
  const ogImage = overrides.ogImage ?? siteConfig.ogImage
  const pageUrl = overrides.path
    ? `${siteConfig.url}${overrides.path}`
    : siteConfig.url

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: siteConfig.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    icons: {
      icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/site.webmanifest',
    robots: overrides.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  }
}
