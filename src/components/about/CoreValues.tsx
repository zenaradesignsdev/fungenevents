import { Reveal } from '@/components/shared/Reveal'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { ABOUT_VALUES } from '@/lib/site-data'

/**
 * Full-width numbered grid. Deliberately has no photograph: WhyChooseFunGen
 * further down the page is the image-plus-list section, and running both as
 * image-left/list-right made the two read as the same section twice.
 */
export function CoreValues() {
  return (
    <section className="bg-background px-5 py-[clamp(64px,8vw,124px)] sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1560px]">
        <div className="mb-[clamp(38px,4.5vw,72px)] flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <div>
            <Reveal>
              <Eyebrow rule>Core values</Eyebrow>
            </Reveal>
            <Reveal
              as="h2"
              delay={0.06}
              className="mt-[22px] max-w-[18ch] font-display text-[clamp(30px,4vw,58px)] font-normal leading-[1.1] text-brand text-balance"
            >
              Five things we will not cut corners on.
            </Reveal>
          </div>
          <Reveal
            as="p"
            delay={0.1}
            className="max-w-[30ch] font-display text-[clamp(15px,1.3vw,20px)] italic leading-[1.5] text-brand/60 text-pretty"
          >
            The same five whether it is twelve people or a hundred and fifty.
          </Reveal>
        </div>

        {/* Hairline grid: 3-up then 2-up on wide screens, so the last row's
            white space reads as intentional rather than as a gap. */}
        <div className="grid grid-cols-1 gap-px bg-brand/15 sm:grid-cols-2 lg:grid-cols-3">
          {ABOUT_VALUES.map((value, i) => (
            <Reveal
              key={value.num}
              delay={i * 0.05}
              className="group flex flex-col gap-[15px] bg-background p-[clamp(26px,2.8vw,44px)] transition-colors duration-500 hover:bg-secondary"
            >
              <span className="font-display text-[clamp(34px,3.4vw,48px)] leading-none text-gold/55 transition-colors duration-500 group-hover:text-gold">
                {value.num}
              </span>
              <h3 className="font-display text-[clamp(22px,2vw,29px)] font-normal leading-[1.25] text-brand">
                {value.title}
              </h3>
              <p className="max-w-[42ch] font-sans text-[15px] font-light leading-[1.85] text-foreground/70 text-pretty md:text-[14.5px]">
                {value.body}
              </p>
            </Reveal>
          ))}

          {/* Fills the sixth cell on the 3-up grid so the hairline rules close
              off cleanly instead of leaving a ragged edge. */}
          <div className="hidden bg-background lg:block" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
