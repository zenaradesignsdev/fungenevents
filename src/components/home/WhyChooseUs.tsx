import { Reveal } from '@/components/shared/Reveal'
import { REASONS } from '@/lib/site-data'

export function WhyChooseUs() {
  return (
    <section className="bg-background px-5 py-[clamp(72px,11vw,160px)] sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1560px]">
        <div className="mb-[clamp(44px,6vw,86px)] grid grid-cols-1 items-end gap-[clamp(30px,4vw,80px)] lg:grid-cols-2">
          <Reveal
            as="h2"
            className="max-w-[20ch] font-display text-[clamp(30px,4vw,60px)] font-normal leading-[1.1] text-brand text-balance"
          >
            Why clients stay with us long after the last toast.
          </Reveal>
          <Reveal
            as="p"
            delay={0.12}
            className="max-w-[44ch] font-sans text-[15.5px] font-light leading-[1.9] text-foreground/75 text-pretty"
          >
            We work with a small number of events each season. That restraint is deliberate — it&apos;s how the
            details stay right and the day stays calm.
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-px bg-brand/15 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason) => (
            <Reveal
              key={reason.num}
              className="flex flex-col gap-[18px] bg-background p-[clamp(28px,3.4vw,48px)] transition-colors duration-500 hover:bg-secondary"
            >
              <span className="font-display text-[44px] leading-none text-gold/55">{reason.num}</span>
              <span className="font-display text-[clamp(22px,2vw,28px)] leading-[1.25] text-brand">
                {reason.title}
              </span>
              <span className="font-sans text-sm font-light leading-[1.85] text-foreground/70 text-pretty">
                {reason.body}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
