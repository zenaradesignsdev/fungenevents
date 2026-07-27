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
  title: 'Luxury Event Planning & Experience Design',
  description:
    'FunGen Events & Experiences is a Toronto luxury event planning studio designing weddings, milestone birthdays, anniversaries, social events, entertainment and nonprofit galas.',
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
          eyebrow="Consultations open for 2026 & 2027"
          title="Let's create something extraordinary together"
          description="Tell us the date, the guest count, and the feeling you're after. We'll come back with a plan, a budget, and a point of view."
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
