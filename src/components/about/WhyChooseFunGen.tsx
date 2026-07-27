import { Image } from '@/components/ui/image'
import { Reveal } from '@/components/shared/Reveal'
import { ArrowLink } from '@/components/shared/ArrowLink'
import { ABOUT_CHOOSES } from '@/lib/site-data'

export function WhyChooseFunGen() {
  return (
    <section className="bg-background px-5 py-[clamp(70px,10vw,150px)] sm:px-8 lg:px-16">
      <div className="mx-auto grid max-w-[1560px] grid-cols-1 items-center gap-[clamp(40px,5vw,92px)] lg:grid-cols-2">
        {/* Image + badge */}
        <Reveal className="relative">
          <div className="aspect-[3/4] overflow-hidden bg-secondary">
            <Image
              src="/images/gallery/warm-room-guests.jpg"
              alt="Guests gathered in a warmly lit room"
              width={1200}
              height={1600}
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="absolute -bottom-px -right-px max-w-[60%] bg-gold px-7 py-[22px] font-display text-[clamp(20px,2vw,28px)] leading-[1.3] text-brand">
            Fewer events. More attention.
          </span>
        </Reveal>

        {/* Copy */}
        <div>
          <Reveal as="span" className="mb-[22px] block font-sans text-[10px] uppercase tracking-[0.34em] text-gold">
            Why clients choose us
          </Reveal>
          <Reveal
            as="h2"
            delay={0.08}
            className="mb-[30px] max-w-[20ch] font-display text-[clamp(28px,3.6vw,52px)] font-normal leading-[1.12] text-brand text-balance"
          >
            The difference shows up in the quiet parts.
          </Reveal>
          <Reveal delay={0.14} className="border-t border-brand/15">
            {ABOUT_CHOOSES.map((item) => (
              <div key={item} className="flex items-baseline gap-4 border-b border-brand/15 py-[17px]">
                <span className="block h-[5px] w-[5px] shrink-0 rotate-45 bg-gold" />
                <span className="font-sans text-[15px] font-light leading-[1.7] text-foreground text-pretty">
                  {item}
                </span>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.18} className="mt-[38px]">
            <ArrowLink href="/services">See what we do</ArrowLink>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
