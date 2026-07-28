'use client'

import { useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { Image } from '@/components/ui/image'
import { cn } from '@/lib/cn'
import { Reveal } from '@/components/shared/Reveal'
import { CtaButton } from '@/components/shared/CtaButton'
import type { Service } from '@/lib/site-data'

type ServiceSectionProps = {
  service: Service
  index: number
}

export function ServiceSection({ service, index }: ServiceSectionProps) {
  const reversed = index % 2 === 1
  const shaded = index % 2 === 1
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <section
      id={service.id}
      className={cn(
        'scroll-mt-[104px] px-5 py-[clamp(66px,9vw,140px)] sm:px-8 lg:px-16',
        shaded ? 'bg-secondary' : 'bg-background',
      )}
    >
      <div className="mx-auto max-w-[1560px]">
        <div className="grid grid-cols-1 items-start gap-[clamp(38px,5vw,92px)] lg:grid-cols-2">
          {/* Image card */}
          <Reveal className={cn('relative', reversed ? 'lg:order-2' : 'lg:order-1')}>
            <div className="rounded-xl border border-brand/10 bg-brand/[0.045] p-2 shadow-[0_56px_100px_-60px_rgba(19,30,46,.42)]">
              <div className="aspect-[4/5] overflow-hidden rounded-md bg-brand">
                <Image
                  src={service.image}
                  alt={service.alt}
                  width={1300}
                  height={1625}
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="h-full w-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(.32,.72,0,1)] hover:scale-[1.06]"
                />
              </div>
            </div>
            <span
              className={cn(
                'absolute top-0 px-5 py-4 font-display text-[clamp(30px,3vw,44px)] leading-none text-brand',
                shaded ? 'bg-secondary' : 'bg-background',
                reversed ? 'left-0' : 'right-0',
              )}
            >
              {service.num}
            </span>
          </Reveal>

          {/* Copy */}
          <div className={cn(reversed ? 'lg:order-1' : 'lg:order-2')}>
            <Reveal as="span" className="mb-[18px] block font-sans text-[10px] uppercase tracking-[0.34em] text-gold">
              {service.kicker}
            </Reveal>
            <Reveal
              as="h2"
              delay={0.06}
              className="mb-[22px] mt-3.5 font-display text-[clamp(32px,4.4vw,66px)] font-normal leading-[1.04] text-brand text-balance"
            >
              {service.title}
            </Reveal>
            <Reveal
              as="p"
              delay={0.1}
              className="mb-[22px] max-w-[44ch] font-display text-[clamp(19px,1.7vw,25px)] font-normal italic leading-[1.6] text-brand/80 text-pretty"
            >
              {service.lede}
            </Reveal>
            <Reveal
              as="p"
              delay={0.14}
              className="mb-[clamp(30px,4vw,46px)] max-w-[52ch] font-sans text-[15.5px] font-light leading-[1.92] text-foreground/80 text-pretty"
            >
              {service.body}
            </Reveal>

            {/* Included / Options */}
            <Reveal delay={0.18} className="mb-[clamp(30px,4vw,46px)] grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-[clamp(26px,3vw,48px)]">
              <div>
                <span className="block border-b border-brand/15 pb-3 font-sans text-[9.5px] uppercase tracking-[0.3em] text-brand/55">
                  What&apos;s included
                </span>
                {service.included.map((item) => (
                  <span
                    key={item}
                    className="flex items-baseline gap-3 border-b border-brand/10 py-2.5 font-sans text-sm font-light leading-[1.65] text-foreground"
                  >
                    <span className="block h-1 w-1 shrink-0 rotate-45 bg-gold" />
                    {item}
                  </span>
                ))}
              </div>
              <div>
                <span className="block border-b border-brand/15 pb-3 font-sans text-[9.5px] uppercase tracking-[0.3em] text-brand/55">
                  Optional enhancements
                </span>
                {service.options.map((item) => (
                  <span
                    key={item}
                    className="flex items-baseline gap-3 border-b border-brand/10 py-2.5 font-sans text-sm font-light leading-[1.65] text-foreground/80"
                  >
                    <span className="font-display text-[15px] leading-none text-gold">+</span>
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>

            {/* FAQs */}
            <Reveal delay={0.2}>
              <span className="block pb-3.5 font-sans text-[9.5px] uppercase tracking-[0.3em] text-brand/55">
                Frequently asked
              </span>
              {service.faqs.map((faq, i) => {
                const isOpen = openFaq === i
                return (
                  <div key={faq.q} className="border-t border-brand/15">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-[18px] py-[18px] text-left font-display text-[clamp(18px,1.5vw,22px)] leading-[1.35] text-brand"
                    >
                      {faq.q}
                      <span
                        className={cn(
                          'shrink-0 font-sans text-base leading-tight text-gold transition-transform duration-500 ease-[cubic-bezier(.32,.72,0,1)]',
                          isOpen && 'rotate-45',
                        )}
                      >
                        +
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <m.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="mb-[22px] max-w-[56ch] font-sans text-[14.5px] font-light leading-[1.9] text-foreground/75 text-pretty">
                            {faq.a}
                          </p>
                        </m.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </Reveal>

            <Reveal delay={0.22} className="mt-[clamp(30px,4vw,44px)]">
              <CtaButton href="/contact" variant="outline-dark" size="sm">
                {service.cta} <span className="font-display text-[15px]">⟶</span>
              </CtaButton>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
