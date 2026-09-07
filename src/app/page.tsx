import type { Metadata } from 'next'
import { generateMetadata as buildMetadata, getLocalBusinessJsonLd } from '@/lib/metadata'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { GrainOverlay } from '@/components/shared/GrainOverlay'
import { CtaBand } from '@/components/shared/CtaBand'
import { CtaButton } from '@/components/shared/CtaButton'
import { Hero } from '@/components/home/Hero'
import { DisciplineMarquee } from '@/components/home/DisciplineMarquee'
import { AboutPreview } from '@/components/home/AboutPreview'
import { ServicesPreview } from '@/components/home/ServicesPreview'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { FeaturedPortfolio } from '@/components/home/FeaturedPortfolio'
import { Testimonials } from '@/components/home/Testimonials'

export const metadata: Metadata = buildMetadata({
  title: 'GTA Event Planning',
  description:
    'Event planning and day-of coordination across the Greater Toronto Area by FunGen Events & Experiences: backyard birthdays, banquet hall weddings, corporate lunches and community fundraisers in Scarborough, Markham, Mississauga and beyond.',
  path: '/',
})

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getLocalBusinessJsonLd()) }}
      />
      <GrainOverlay />
      <SiteNav theme="light" />
      <main>
        <Hero />
        <DisciplineMarquee />
        <AboutPreview />
        <ServicesPreview />
        <WhyChooseUs />
        <FeaturedPortfolio />
        <Testimonials />
        <CtaBand
          image="/images/gallery/reception-ballroom.jpg"
          imageAlt="Ballroom set for an evening reception"
          eyebrow="Now booking 2026 dates"
          title="Most of our best events start with an email like this one."
          description="Tell us the date, the guest count and roughly what you want the day to feel like. We will come back with a plan and a budget."
          animateImage
        >
          <CtaButton href="/contact" variant="gold">
            Book Your Consultation
          </CtaButton>
        </CtaBand>
      </main>
      <SiteFooter />
    </>
  )
}
