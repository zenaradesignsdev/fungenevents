import type { Metadata } from 'next'

/**
 * Per-client: update siteConfig after forking.
 * All pages call generateMetadata() to merge page-level overrides
 * with these site-wide defaults.
 */
export const siteConfig = {
  name: 'FunGen Events and Experiences',
  description:
    'FunGen Events & Experiences plans birthdays, anniversaries, weddings, corporate lunches, patio parties and community fundraisers across the Greater Toronto Area, from Scarborough and Markham to Mississauga, Brampton and Vaughan.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fungenevents.ca',
  ogImage: '/og-image.jpg',
  locale: 'en_CA',
} as const

// Real business contact details, all confirmed with the client.
export const businessInfo = {
  telephone: '+16479269787',
  telephoneDisplay: '(647) 926-9787',
  // The studio's real inbox, confirmed 2026-09-07. This is the address shown on
  // the site and emitted in JSON-LD; it is also where the contact form delivers
  // (CONTACT_TO_EMAIL). It is NOT a valid CONTACT_FROM_EMAIL — Resend can only
  // send from a domain you have verified, and nobody can verify gmail.com.
  email: 'fungeneventsinc@gmail.com',
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
    email: businessInfo.email,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    // Matches the budget ranges the enquiry form actually offers (from under
    // $2,500). '$$$' read as luxury, which is the positioning the copy moved away from.
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      ...businessInfo.address,
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Greater Toronto Area' },
      { '@type': 'City', name: 'Toronto' },
      { '@type': 'Place', name: 'Scarborough' },
      { '@type': 'City', name: 'Markham' },
      { '@type': 'City', name: 'Mississauga' },
      { '@type': 'City', name: 'Brampton' },
      { '@type': 'City', name: 'Vaughan' },
      { '@type': 'City', name: 'Richmond Hill' },
      { '@type': 'City', name: 'Pickering' },
      { '@type': 'City', name: 'Ajax' },
      { '@type': 'City', name: 'Oakville' },
    ],
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
