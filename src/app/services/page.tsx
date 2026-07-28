import type { Metadata } from 'next'
import Link from 'next/link'
import { generateMetadata as buildMetadata } from '@/lib/metadata'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { GrainOverlay } from '@/components/shared/GrainOverlay'
import { ImageHero } from '@/components/shared/ImageHero'
import { CtaBand } from '@/components/shared/CtaBand'
import { CtaButton } from '@/components/shared/CtaButton'
import { ServiceSection } from '@/components/services/ServiceSection'
import { SERVICES } from '@/lib/site-data'

export const metadata: Metadata = buildMetadata({
  title: 'Event Planning Services',
  description:
    'Event planning services from FunGen Events & Experiences: weddings, birthdays, anniversaries, social events, entertainment production and nonprofit galas.',
  path: '/services',
})

export default function ServicesPage() {
  return (
    <>
      <GrainOverlay />
      <SiteNav theme="light" />
      <main>
        <ImageHero
          image="/images/gallery/candlelit-tablescape.jpg"
          imageAlt="Candlelit table with floral centerpiece"
          eyebrow="Services"
          className="min-h-[clamp(500px,74vh,780px)]"
          title={
            <>
              Six disciplines. One team, start to <em className="italic text-gold">finish</em>.
            </>
          }
        >
          <div className="mt-[clamp(30px,4vw,52px)] flex flex-wrap gap-x-[clamp(20px,3vw,44px)] border-t border-brand-foreground/20 pt-[22px]">
            {SERVICES.map((service) => (
              <Link
                key={service.id}
                href={`#${service.id}`}
                className="flex items-baseline gap-2.5 py-2 font-sans text-[11px] uppercase tracking-[0.24em] text-brand-foreground/80 transition-colors duration-300 hover:text-gold"
              >
                <span className="text-[9px] text-gold">{service.num}</span>
                {service.title}
              </Link>
            ))}
          </div>
        </ImageHero>

        {SERVICES.map((service, i) => (
          <ServiceSection key={service.id} service={service} index={i} />
        ))}

        <CtaBand
          image="/images/gallery/gala-toast.jpg"
          imageAlt="Guests raising glasses in a toast"
          eyebrow="Not sure which one you need?"
          title="Start with a conversation. We'll tell you honestly."
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
