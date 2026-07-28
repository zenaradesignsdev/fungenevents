import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { generateMetadata as buildMetadata } from '@/lib/metadata'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { GrainOverlay } from '@/components/shared/GrainOverlay'
import { PageIntroHero } from '@/components/shared/PageIntroHero'
import { CtaBand } from '@/components/shared/CtaBand'
import { CtaButton } from '@/components/shared/CtaButton'
import { ContactDetails } from '@/components/contact/ContactDetails'
import { businessInfo } from '@/lib/metadata'

// The form pulls in react-hook-form + zod; defer it so it doesn't weigh down
// the initial load of the site's most JS-heavy route.
const ContactForm = dynamic(
  () => import('@/components/contact/ContactForm').then((m) => m.ContactForm),
  { loading: () => <div className="h-[600px] animate-pulse rounded bg-secondary" /> },
)

export const metadata: Metadata = buildMetadata({
  title: 'Book a Consultation',
  description:
    'Contact FunGen Events & Experiences to plan a Toronto wedding, birthday, anniversary, social event, entertainment production or nonprofit gala this season.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <>
      <GrainOverlay />
      <SiteNav theme="dark" />
      <main>
        <PageIntroHero
          eyebrow="Contact"
          title={
            <>
              Tell us about the <em className="italic text-gold">evening</em> you&apos;re imagining.
            </>
          }
          description="Consultations are complimentary and about forty-five minutes. Bring a date, a rough guest count, and any feeling you're chasing — we'll handle the rest of the questions."
        />

        <section className="bg-background px-5 pb-[clamp(70px,10vw,140px)] sm:px-8 lg:px-16">
          <div className="mx-auto grid max-w-[1560px] grid-cols-1 items-start gap-[clamp(44px,6vw,110px)] border-t border-brand/15 pt-[clamp(40px,5vw,72px)] lg:grid-cols-2">
            <ContactForm />
            <ContactDetails />
          </div>
        </section>

        <CtaBand
          image="/images/gallery/raising-glasses.jpg"
          imageAlt="Guests raising glasses at a celebration"
          eyebrow="Prefer to talk it through?"
          title="Book Your Consultation"
        >
          <CtaButton href={`tel:${businessInfo.telephone}`} variant="gold">
            {businessInfo.telephoneDisplay}
          </CtaButton>
          <CtaButton href={`mailto:${businessInfo.email}`} variant="outline-light">
            {businessInfo.email}
          </CtaButton>
        </CtaBand>
      </main>
      <SiteFooter />
    </>
  )
}
