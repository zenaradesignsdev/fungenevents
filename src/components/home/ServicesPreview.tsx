'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Image } from '@/components/ui/image'
import { cn } from '@/lib/cn'
import { ArrowLink } from '@/components/shared/ArrowLink'
import { SERVICES } from '@/lib/site-data'

export function ServicesPreview() {
  const [active, setActive] = useState(1)

  return (
    <section className="bg-brand px-5 py-[clamp(72px,11vw,160px)] text-brand-foreground sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1560px]">
        <div className="mb-[clamp(40px,5vw,74px)] flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-[22px] flex items-center gap-3.5">
              <span className="block h-px w-[34px] bg-gold" />
              <span className="font-sans text-[10px] uppercase tracking-[0.34em] text-brand-foreground/60">
                What we do
              </span>
            </div>
            <h2 className="max-w-[20ch] font-display text-[clamp(30px,4.2vw,64px)] font-normal leading-[1.08] text-balance">
              Six disciplines, one standard of care.
            </h2>
          </div>
          <ArrowLink href="/services" tone="light">
            All services
          </ArrowLink>
        </div>

        <div className="grid grid-cols-1 items-start gap-[clamp(34px,4vw,70px)] lg:grid-cols-2">
          {/* Service list */}
          <div className="border-t border-brand-foreground/15">
            {SERVICES.map((service, i) => {
              const isActive = i === active
              return (
                <Link
                  key={service.id}
                  href={`/services#${service.id}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="grid grid-cols-[1fr_auto] items-center gap-[18px] border-b border-brand-foreground/15 py-[clamp(18px,2.2vw,26px)] transition-[padding] duration-500 ease-[cubic-bezier(.22,.61,.36,1)] hover:pl-3.5"
                >
                  <span className="flex min-w-0 flex-col gap-[5px]">
                    <span
                      className={cn(
                        'font-display text-[clamp(26px,3vw,42px)] font-normal leading-[1.05] transition-colors duration-500',
                        isActive ? 'text-gold' : 'text-brand-foreground',
                      )}
                    >
                      {service.title}
                    </span>
                    <span className="max-w-[46ch] font-sans text-[13.5px] font-light leading-[1.7] text-brand-foreground/60">
                      {service.lede}
                    </span>
                  </span>
                  <span
                    className={cn(
                      // Hidden on the narrowest screens so the title keeps the
                      // full row width.
                      'hidden whitespace-nowrap font-sans text-[10px] uppercase tracking-[0.24em] transition-colors duration-500 min-[420px]:inline',
                      isActive ? 'text-gold' : 'text-brand-foreground/35',
                    )}
                  >
                    Explore →
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Sticky cross-fading image */}
          <div className="sticky top-[120px] hidden aspect-[4/5] overflow-hidden bg-[#131E2E] lg:block">
            {SERVICES.map((service, i) => (
              <Image
                key={service.id}
                src={service.image}
                alt={service.alt}
                fill
                sizes="45vw"
                className={cn(
                  'absolute inset-0 object-cover transition-all duration-1000 ease-[cubic-bezier(.32,.72,0,1)]',
                  i === active ? 'scale-[1.03] opacity-100' : 'scale-[1.12] opacity-0',
                )}
              />
            ))}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,30,46,0)_45%,rgba(19,30,46,.8))]" />
            <div className="absolute bottom-0 left-0 flex items-center gap-3.5 p-[clamp(22px,3vw,38px)]">
              <span className="block h-px w-[26px] bg-gold" />
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-foreground/85">
                {SERVICES[active].title}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
