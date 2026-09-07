import { Image } from '@/components/ui/image'
import { businessInfo } from '@/lib/metadata'
import { SERVICE_AREA_CITIES, SOCIAL_LINKS } from '@/lib/site-data'

const { address } = businessInfo
const fullAddress = `${address.streetAddress}, ${address.addressLocality} ${address.addressRegion} ${address.postalCode}`
const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`

const valueClass = 'font-sans text-[15px] font-light leading-[1.8] text-foreground text-pretty'
// The ::after grows the tap area to 44px inside the 56px row without shifting
// the baseline the label column is aligned to.
const linkClass = `${valueClass} relative underline-offset-4 transition-colors duration-300 after:absolute after:inset-x-0 after:-top-4 after:-bottom-4 after:content-[''] hover:text-gold`

const DETAILS: { label: string; value: React.ReactNode }[] = [
  {
    label: 'Phone',
    value: (
      <a href={`tel:${businessInfo.telephone}`} className={linkClass}>
        {businessInfo.telephoneDisplay}
      </a>
    ),
  },
  {
    label: 'Email',
    value: (
      <a href={`mailto:${businessInfo.email}`} className={linkClass}>
        {businessInfo.email}
      </a>
    ),
  },
  {
    label: 'Studio',
    value: (
      <a href={mapsHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {fullAddress}
      </a>
    ),
  },
  { label: 'Hours', value: 'Monday to Friday, 9am – 6pm. Saturday by appointment. Closed Sundays and event days.' },
]

export function ContactDetails() {
  return (
    <address className="flex flex-col gap-[clamp(30px,4vw,48px)] not-italic">
      <div className="border-t border-brand/15">
        {DETAILS.map((detail) => (
          <div
            key={detail.label}
            className="grid grid-cols-[minmax(96px,26%)_1fr] items-baseline gap-[18px] border-b border-brand/10 py-5"
          >
            <span className="font-sans text-[9.5px] uppercase tracking-[0.28em] text-gold">{detail.label}</span>
            <span className={valueClass}>{detail.value}</span>
          </div>
        ))}
      </div>

      {/* Map placeholder */}
      <div>
        <span className="mb-4 block font-sans text-[9.5px] uppercase tracking-[0.28em] text-gold">
          Studio &amp; service area
        </span>
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block aspect-[16/10] overflow-hidden bg-brand"
          aria-label="Open the FunGen Events studio location in Google Maps"
        >
          <Image
            src="/images/gallery/reception-ballroom.jpg"
            alt="FunGen Events studio — Scarborough, GTA"
            fill
            sizes="(max-width: 1024px) 90vw, 45vw"
            className="object-cover brightness-[0.42] grayscale transition-[filter] duration-500 group-hover:brightness-50"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 text-center">
            <span className="block h-3 w-3 rotate-45 border border-gold" />
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-foreground/85">
              Scarborough, ON
              <br />
              <span className="text-brand-foreground/45">View on Google Maps</span>
            </span>
          </div>
          <span className="absolute bottom-0 left-0 bg-brand-dark/60 px-[18px] py-3.5 font-sans text-[10px] uppercase tracking-[0.2em] text-brand-foreground/70">
            Studio visits by appointment
          </span>
        </a>
        <p className="mt-4 font-sans text-[14.5px] font-light leading-[1.8] text-foreground/70 text-pretty md:text-[13px]">
          We plan across the Greater Toronto Area, including {SERVICE_AREA_CITIES.join(', ')}. No travel
          charge anywhere inside the GTA.
        </p>
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
    </address>
  )
}
