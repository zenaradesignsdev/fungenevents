'use client'

import Link from 'next/link'
import { m, useReducedMotion } from 'framer-motion'
import { Image } from '@/components/ui/image'
import { HERO_META, HERO_HIGHLIGHTS } from '@/lib/site-data'

const EASE = [0.32, 0.72, 0, 1] as const

const HEADLINE_LINES = [
  { text: 'Every detail,', italic: false },
  { text: 'so you can just', italic: false },
  { text: 'arrive.', italic: true },
]

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden bg-[#101B2B] px-5 pt-[clamp(124px,16vh,180px)] sm:px-8 lg:px-16">
      {/* Background photograph, sat well behind the navy scrim. Quality is
          deliberately low — it never reads at full contrast. */}
      <Image
        src="/images/gallery/candlelit-tablescape.jpg"
        alt=""
        fill
        priority
        quality={55}
        sizes="100vw"
        className="object-cover"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(16,27,43,.92),rgba(16,27,43,.89)_45%,rgba(11,19,31,.94))]"
      />

      {/* Decorative glow + scrims */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-[18vw] left-[38vw] h-[52vw] w-[52vw] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(201,162,39,.085),rgba(201,162,39,0)_62%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(16,27,43,0)_55%,rgba(11,19,31,.85))]"
      />

      <div className="relative mx-auto grid w-full max-w-[1560px] flex-1 content-center gap-[clamp(40px,5vw,72px)]">
        <div className="grid grid-cols-1 items-end gap-[clamp(32px,4.5vw,84px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {/* Copy column */}
          <div className="min-w-0 lg:pl-[clamp(0px,3vw,54px)]">
            <h1 className="max-w-[15ch] font-display text-[clamp(38px,4.9vw,82px)] font-normal leading-[0.98] tracking-[-0.02em] text-brand-foreground">
              {HEADLINE_LINES.map((line, i) => (
                <span key={line.text} className="my-[-0.14em] block overflow-hidden py-[0.14em]">
                  <m.span
                    initial={reduce ? false : { y: '102%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1.15, delay: 0.06 + i * 0.12, ease: EASE }}
                    className="block"
                  >
                    {line.italic ? <em className="italic text-gold">{line.text}</em> : line.text}
                  </m.span>
                </span>
              ))}
            </h1>

            <m.p
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.42, ease: EASE }}
              className="mt-[clamp(24px,2.6vw,36px)] max-w-[44ch] font-sans text-[clamp(14.5px,1.05vw,16.5px)] font-light leading-[1.95] text-brand-foreground/70 text-pretty"
            >
              Scarborough-based and hands-on across the GTA, from Markham and Mississauga to Brampton and
              Vaughan. We plan backyard birthdays, banquet hall weddings, corporate lunches and community
              fundraisers, and we run the day so you can enjoy it.
            </m.p>

            <m.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.52, ease: EASE }}
              className="mt-[clamp(28px,3.2vw,44px)] flex flex-wrap items-center gap-[clamp(16px,2vw,30px)]"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center gap-4 rounded-full bg-background py-2.5 pl-[30px] pr-2.5 font-sans text-[10.5px] uppercase tracking-[0.26em] text-[#101B2B] shadow-[0_30px_60px_-34px_rgba(0,0,0,.7)] transition-colors duration-700 hover:bg-gold"
              >
                Check your date
                <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#101B2B]/10 font-display text-[15px] leading-none transition-transform duration-700 group-hover:translate-x-0.5">
                  ↗
                </span>
              </Link>
              <Link
                href="/portfolio"
                className="group relative inline-flex items-center gap-3 border-b border-gold/85 py-2 font-sans text-[10.5px] uppercase tracking-[0.26em] text-brand-foreground/85 transition-colors duration-700 after:absolute after:inset-x-0 after:-top-1 after:-bottom-1 after:content-[''] hover:border-gold hover:text-gold"
              >
                Recent events{' '}
                <span aria-hidden="true" className="font-display text-[15px] transition-transform duration-700 group-hover:translate-x-1">
                  ⟶
                </span>
              </Link>
            </m.div>
          </div>

          {/* Image collage column — rendered immediately (not animated) so the
              priority LCP image paints without delay. */}
          <div className="min-w-0">
            <div className="grid h-[clamp(320px,58vh,600px)] grid-cols-1 gap-2.5 min-[480px]:grid-cols-[1.4fr_0.6fr]">
              <div className="relative overflow-hidden rounded-lg bg-[#0B131F] shadow-[0_60px_110px_-56px_rgba(0,0,0,.8)] ring-2 ring-gold/50">
                <Image
                  src={HERO_HIGHLIGHTS.primary.image}
                  alt={HERO_HIGHLIGHTS.primary.alt}
                  fill
                  priority
                  sizes="(max-width: 480px) 100vw, (max-width: 1024px) 70vw, 35vw"
                  className="object-cover motion-safe:animate-kenburns"
                />
                {/* Deeper foot than the top stop: this card's photo is pale where the
                    caption sits, and .55 left the gold eyebrow illegible. */}
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,19,31,.06)_45%,rgba(11,19,31,.82))]" />
                <span className="absolute bottom-[18px] left-[18px] flex flex-col gap-1.5">
                  <span className="font-sans text-[8.5px] uppercase tracking-[0.3em] text-gold">
                    {HERO_HIGHLIGHTS.primary.eyebrow}
                  </span>
                  <span className="font-display text-[15px] italic leading-[1.4] text-brand-foreground/95">
                    {HERO_HIGHLIGHTS.primary.caption}
                  </span>
                </span>
              </div>
              <div className="hidden grid-rows-[0.56fr_0.44fr] gap-2.5 pt-[clamp(18px,3.5vw,58px)] min-[480px]:grid">
                <div className="relative overflow-hidden rounded-lg bg-[#0B131F] ring-2 ring-gold/50">
                  <Image
                    src={HERO_HIGHLIGHTS.secondary.image}
                    alt={HERO_HIGHLIGHTS.secondary.alt}
                    fill
                    sizes="(max-width: 1024px) 30vw, 15vw"
                    className="object-cover motion-safe:animate-kenburns"
                  />
                </div>
                <div className="relative overflow-hidden rounded-lg bg-[#0B131F] ring-2 ring-gold/50">
                  <Image
                    src={HERO_HIGHLIGHTS.tertiary.image}
                    alt={HERO_HIGHLIGHTS.tertiary.alt}
                    fill
                    sizes="(max-width: 1024px) 30vw, 15vw"
                    className="object-cover motion-safe:animate-kenburns"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meta bar */}
        <m.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.62, ease: EASE }}
          className="grid grid-cols-1 border-t border-brand-foreground/15 min-[560px]:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]"
        >
          {HERO_META.map((meta) => (
            <span
              key={meta.label}
              className="flex flex-col gap-[7px] border-brand-foreground/10 py-[clamp(18px,2vw,26px)] pl-[clamp(16px,3vw,54px)] pr-[clamp(18px,2vw,30px)] min-[560px]:border-r"
            >
              <span className="font-sans text-[8.5px] uppercase tracking-[0.32em] text-gold">{meta.label}</span>
              <span className="font-sans text-[12.5px] font-light leading-[1.7] text-brand-foreground/75">
                {meta.value}
              </span>
            </span>
          ))}
          <span className="hidden items-end justify-end gap-3.5 py-[clamp(18px,2vw,26px)] min-[560px]:flex">
            <span className="font-sans text-[8.5px] uppercase tracking-[0.38em] text-brand-foreground/45">
              Scroll
            </span>
            <span
              aria-hidden="true"
              className="block h-[clamp(24px,4vh,40px)] w-px bg-brand-foreground/40 motion-safe:animate-scroll-cue"
            />
          </span>
        </m.div>
      </div>
    </section>
  )
}
