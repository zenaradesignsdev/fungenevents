import { Image } from '@/components/ui/image'
import { Reveal } from '@/components/shared/Reveal'
import { ArrowLink } from '@/components/shared/ArrowLink'
import { STUDIO_PILLARS } from '@/lib/site-data'

export function AboutPreview() {
  return (
    <section className="bg-background px-5 py-[clamp(72px,11vw,168px)] sm:px-8 lg:px-16">
      <div className="mx-auto grid max-w-[1560px] grid-cols-1 items-start gap-[clamp(44px,6vw,110px)] lg:grid-cols-2">
        {/* Image cluster */}
        <Reveal className="relative">
          <div className="aspect-[4/5] overflow-hidden bg-secondary">
            <Image
              src="/images/gallery/candlelit-tablescape.jpg"
              alt="Candlelit tablescape with floral centerpiece"
              width={1120}
              height={1400}
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:scale-105"
            />
          </div>
          <div className="absolute -bottom-[6%] -right-[2%] aspect-square w-[46%] max-w-[280px] overflow-hidden border-[10px] border-background bg-secondary lg:-bottom-[11%] lg:-right-[6%]">
            <Image
              src="/images/gallery/place-setting-detail.jpg"
              alt="Place setting detail"
              width={560}
              height={560}
              sizes="(max-width: 1024px) 40vw, 280px"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="absolute left-[-1px] top-6 bg-[rgba(19,30,46,.55)] px-[7px] py-3.5 font-sans text-[9px] uppercase tracking-[0.34em] text-brand-foreground [writing-mode:vertical-rl]">
            Designed in-house
          </span>
        </Reveal>

        {/* Copy */}
        <div className="lg:pt-[clamp(0px,3vw,54px)]">
          <Reveal className="mb-6 flex items-center gap-3.5">
            <span className="font-sans text-[10px] uppercase tracking-[0.34em] text-gold">01 — The Studio</span>
            <span className="block h-px flex-1 bg-brand/15" />
          </Reveal>
          <Reveal
            as="h2"
            delay={0.08}
            className="mb-6 max-w-[22ch] font-display text-[clamp(30px,3.9vw,60px)] font-normal leading-[1.1] tracking-[-0.01em] text-brand text-balance"
          >
            A planning studio built around the people in the room.
          </Reveal>
          <Reveal
            as="p"
            delay={0.14}
            className="mb-[18px] max-w-[52ch] font-sans text-base font-light leading-[1.9] text-foreground text-pretty"
          >
            We started FunGen because the best celebrations aren&apos;t the most expensive ones — they&apos;re
            the ones that feel unmistakably like the people they&apos;re for. Every timeline, floor plan, and
            place card begins with a conversation about you.
          </Reveal>
          <Reveal
            as="p"
            delay={0.18}
            className="mb-[clamp(34px,4vw,52px)] max-w-[52ch] font-sans text-base font-light leading-[1.9] text-foreground/70 text-pretty"
          >
            From a fiftieth birthday in a private dining room to a five-hundred-guest gala, we bring the same
            discipline: careful design, honest budgets, and a team that stays calm so you don&apos;t have to.
          </Reveal>

          <Reveal delay={0.22} className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-[clamp(24px,3vw,48px)] border-t border-brand/15">
            {STUDIO_PILLARS.map((pillar) => (
              <div key={pillar.num} className="flex items-baseline gap-4 border-b border-brand/15 py-[22px]">
                <span className="font-sans text-[10px] tracking-[0.2em] text-gold">{pillar.num}</span>
                <div>
                  <span className="block font-display text-[22px] leading-[1.3] text-brand">{pillar.title}</span>
                  <span className="mt-1 block font-sans text-[13px] font-light leading-[1.7] text-foreground/65">
                    {pillar.body}
                  </span>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.26} className="mt-[clamp(30px,4vw,48px)]">
            <ArrowLink href="/about">Learn more about us</ArrowLink>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
