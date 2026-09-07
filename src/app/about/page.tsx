import type { Metadata } from 'next'
import { generateMetadata as buildMetadata } from '@/lib/metadata'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { GrainOverlay } from '@/components/shared/GrainOverlay'
import { ImageHero } from '@/components/shared/ImageHero'
import { CtaBand } from '@/components/shared/CtaBand'
import { CtaButton } from '@/components/shared/CtaButton'
import { AboutManifesto } from '@/components/about/AboutManifesto'
import { MissionVision } from '@/components/about/MissionVision'
import { CoreValues } from '@/components/about/CoreValues'
import { Process } from '@/components/about/Process'
import { ServiceAreas } from '@/components/about/ServiceAreas'
import { WhyChooseFunGen } from '@/components/about/WhyChooseFunGen'

export const metadata: Metadata = buildMetadata({
  title: 'About the Studio',
  description:
    'Meet FunGen Events & Experiences: the people, values and planning behind birthdays, anniversaries, weddings, corporate lunches and community fundraisers across the Greater Toronto Area.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <GrainOverlay />
      <SiteNav theme="light" />
      <main id="main">
        <ImageHero
          image="/images/gallery/two-guests.jpg"
          imageAlt="Two guests in conversation at an evening event"
          eyebrow="About us"
          className="min-h-[clamp(560px,82vh,860px)]"
          title={
            <>
              We plan celebrations the way we&apos;d want ours <em className="italic text-gold">planned</em>.
            </>
          }
        />
        <AboutManifesto />
        <MissionVision />
        <CoreValues />
        <Process />
        <ServiceAreas />
        <WhyChooseFunGen />
        <CtaBand
          image="/images/gallery/couple-dancing.jpg"
          imageAlt="Couple dancing at their reception"
          align="left"
          title="Tell us about the celebration you're imagining."
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
