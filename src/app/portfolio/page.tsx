import type { Metadata } from 'next'
import { generateMetadata as buildMetadata } from '@/lib/metadata'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { GrainOverlay } from '@/components/shared/GrainOverlay'
import { PageIntroHero } from '@/components/shared/PageIntroHero'
import { Reveal } from '@/components/shared/Reveal'
import { CtaButton } from '@/components/shared/CtaButton'
import { PortfolioGallery } from '@/components/portfolio/PortfolioGallery'
import { ClientStory } from '@/components/portfolio/ClientStory'
import { PORTFOLIO_STORIES } from '@/lib/site-data'

export const metadata: Metadata = buildMetadata({
  title: 'Event Portfolio',
  description:
    'A gallery of GTA birthdays, anniversaries, weddings, corporate events, patio parties and community fundraisers by FunGen Events & Experiences, from Markham and Scarborough to Mississauga and Vaughan.',
  path: '/portfolio',
})

export default function PortfolioPage() {
  return (
    <>
      <GrainOverlay />
      <SiteNav theme="dark" />
      <main id="main">
        <PageIntroHero
          eyebrow="Portfolio"
          title={
            <>
              Rooms that meant something to <em className="italic text-gold-ink">someone</em>.
            </>
          }
          description="Every event here started as a conversation about people, not palettes. Filter by type, or read three of the stories in full below."
        />
        <PortfolioGallery />
        {PORTFOLIO_STORIES.map((story, i) => (
          <ClientStory key={story.index} story={story} shaded={i % 2 === 1} />
        ))}

        <section className="bg-background px-5 py-[clamp(70px,10vw,140px)] text-center sm:px-8 lg:px-16">
          <div className="mx-auto max-w-[820px]">
            <Reveal as="span" className="mx-auto mb-[34px] block h-[52px] w-px bg-gold" />
            <Reveal
              as="h2"
              delay={0.08}
              className="mb-[26px] font-display text-[clamp(30px,4.6vw,66px)] font-normal leading-[1.06] text-brand text-balance"
            >
              Your event belongs in this gallery.
            </Reveal>
            <Reveal delay={0.13} className="flex justify-center">
              <CtaButton href="/contact" variant="gold">
                Book Your Consultation
              </CtaButton>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
