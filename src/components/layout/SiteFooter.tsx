import Link from 'next/link'
import { Image } from '@/components/ui/image'
import { NAV_LINKS, SERVICES, SOCIAL_LINKS } from '@/lib/site-data'
import { businessInfo } from '@/lib/metadata'

const linkClass =
  'font-sans text-[13px] font-light tracking-[0.05em] text-brand-foreground/80 transition-colors duration-300 hover:text-gold'

const headingClass =
  'mb-6 block font-sans text-[9px] uppercase tracking-[0.36em] text-gold'

export function SiteFooter() {
  return (
    <footer className="bg-brand-dark px-5 pb-9 pt-[clamp(60px,8vw,110px)] text-brand-foreground sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1560px]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[clamp(40px,5vw,80px)]">
          {/* Brand */}
          <div className="min-w-[250px]">
            <div className="mb-6 flex items-center gap-2.5">
              <Image
                src="/images/fungen-mark-gold.svg"
                alt="FunGen Events & Experiences"
                width={44}
                height={40}
                className="h-11 w-auto"
              />
              <span className="font-display text-3xl uppercase tracking-[0.14em]">FunGen</span>
            </div>
            <p className="max-w-[26ch] font-display text-xl font-normal italic leading-[1.6] text-brand-foreground/70 text-pretty">
              Creating extraordinary moments, one celebration at a time.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <span className={headingClass}>Navigate</span>
            <div className="flex flex-col gap-3.5">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Disciplines */}
          <div>
            <span className={headingClass}>Disciplines</span>
            <div className="flex flex-col gap-3.5">
              {SERVICES.map((service) => (
                <Link key={service.id} href={`/services#${service.id}`} className={linkClass}>
                  {service.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Studio */}
          <div>
            <span className={headingClass}>Studio</span>
            <div className="flex flex-col gap-4 font-sans text-[13px] font-light leading-[1.7] text-brand-foreground/80">
              <a href={`tel:${businessInfo.telephone}`} className="transition-colors duration-300 hover:text-gold">
                {businessInfo.telephoneDisplay}
              </a>
              <a href={`mailto:${businessInfo.email}`} className="transition-colors duration-300 hover:text-gold">
                {businessInfo.email}
              </a>
              <span>
                {businessInfo.address.streetAddress}
                <br />
                {businessInfo.address.addressLocality}, {businessInfo.address.addressRegion}{' '}
                {businessInfo.address.postalCode}
              </span>
              <span className="text-brand-foreground/50">
                Mon–Fri&nbsp;&nbsp;9–6
                <br />
                Sat by appointment
              </span>
            </div>
          </div>
        </div>

        <div className="my-[clamp(46px,6vw,80px)] mb-6 h-px bg-gradient-to-r from-gold/55 to-brand-foreground/10" />

        <div className="flex flex-wrap items-center justify-between gap-5 font-sans text-[10.5px] font-light uppercase tracking-[0.2em] text-brand-foreground/45">
          <span>© {new Date().getFullYear()} FunGen Events &amp; Experiences</span>
          <div className="flex gap-6">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="tracking-[0.2em] text-brand-foreground/60 transition-colors duration-300 hover:text-gold"
              >
                {social.label}
              </a>
            ))}
          </div>
          <span>Event Planning &amp; Experience Design</span>
        </div>
      </div>
    </footer>
  )
}
