import { Image } from '@/components/ui/image'
import { businessInfo } from '@/lib/metadata'
import { SOCIAL_LINKS } from '@/lib/site-data'

const DETAILS: { label: string; value: React.ReactNode }[] = [
  { label: 'Phone', value: `${businessInfo.telephoneDisplay} — Mon to Fri` },
  { label: 'Email', value: businessInfo.email },
  {
    label: 'Studio',
    value: `${businessInfo.address.streetAddress}, ${businessInfo.address.addressLocality} ${businessInfo.address.addressRegion} ${businessInfo.address.postalCode}`,
  },
  { label: 'Hours', value: 'Monday to Friday, 9am – 6pm. Saturday by appointment. Closed Sundays and event days.' },
]

export function ContactDetails() {
  return (
    <div className="flex flex-col gap-[clamp(30px,4vw,48px)]">
      <div className="border-t border-brand/15">
        {DETAILS.map((detail) => (
          <div
            key={detail.label}
            className="grid grid-cols-[minmax(96px,26%)_1fr] items-baseline gap-[18px] border-b border-brand/10 py-5"
          >
            <span className="font-sans text-[9.5px] uppercase tracking-[0.28em] text-gold">{detail.label}</span>
            <span className="font-sans text-[15px] font-light leading-[1.8] text-foreground text-pretty">
              {detail.value}
            </span>
          </div>
        ))}
      </div>

      {/* Map placeholder */}
      <div>
        <span className="mb-4 block font-sans text-[9.5px] uppercase tracking-[0.28em] text-gold">
          Studio &amp; service area
        </span>
        <div className="relative aspect-[16/10] overflow-hidden bg-brand">
          <Image
            src="/images/gallery/reception-ballroom.jpg"
            alt="FunGen Events studio — Toronto"
            fill
            sizes="(max-width: 1024px) 90vw, 45vw"
            className="object-cover brightness-[0.42] grayscale"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 text-center">
            <span className="block h-3 w-3 rotate-45 border border-gold" />
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-foreground/85">
              Toronto, ON
              <br />
              <span className="text-brand-foreground/45">&amp; destination events</span>
            </span>
          </div>
          <span className="absolute bottom-0 left-0 bg-brand-dark/60 px-[18px] py-3.5 font-sans text-[10px] uppercase tracking-[0.2em] text-brand-foreground/70">
            Studio visits by appointment
          </span>
        </div>
      </div>

      {/* Socials */}
      <div>
        <span className="mb-4 block font-sans text-[9.5px] uppercase tracking-[0.28em] text-gold">
          Follow the work
        </span>
        <div className="flex flex-wrap gap-2.5">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="border border-brand/20 px-5 py-3.5 font-sans text-[10.5px] uppercase tracking-[0.22em] text-brand transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-brand-foreground"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
