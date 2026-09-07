import { Reveal } from '@/components/shared/Reveal'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { ABOUT_STEPS } from '@/lib/site-data'

/**
 * Five-stage timeline. Runs horizontally along a gold baseline from lg: up and
 * folds to a vertical timeline below that, where five columns of 13px body copy
 * were unreadable.
 */
export function Process() {
  return (
    <section className="bg-secondary px-5 py-[clamp(64px,8vw,124px)] sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1560px]">
        <div className="mb-[clamp(44px,5vw,84px)] flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <div>
            <Reveal>
              <Eyebrow rule>The process</Eyebrow>
            </Reveal>
            <Reveal
              as="h2"
              delay={0.06}
              className="mt-[22px] max-w-[20ch] font-display text-[clamp(30px,4.2vw,62px)] font-normal leading-[1.08] text-brand text-balance"
            >
              How a FunGen event comes together.
            </Reveal>
          </div>
          <Reveal
            as="p"
            delay={0.1}
            className="max-w-[30ch] font-display text-[clamp(15px,1.3vw,20px)] italic leading-[1.5] text-brand/60 text-pretty"
          >
            Six weeks or six months, the sequence stays the same.
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-x-[clamp(20px,2.4vw,40px)] gap-y-[clamp(30px,3vw,44px)] lg:grid-cols-5">
          {ABOUT_STEPS.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.06} className="group relative flex gap-5 lg:block">
              {/* Vertical rail below lg:, horizontal baseline from lg: up. */}
              <span
                aria-hidden="true"
                className="relative flex w-[9px] shrink-0 justify-center lg:mb-[26px] lg:block lg:h-[9px] lg:w-full"
              >
                <span className="block h-full w-px bg-brand/20 lg:h-px lg:w-full lg:translate-y-1" />
                <span className="absolute left-1/2 top-[7px] block h-[9px] w-[9px] -translate-x-1/2 rotate-45 bg-gold transition-transform duration-500 group-hover:scale-125 lg:left-0 lg:top-0 lg:translate-x-0" />
              </span>

              <div className="pb-1 lg:pb-0">
                <span className="mb-3.5 block font-sans text-[10px] uppercase tracking-[0.28em] text-gold-ink">
                  {step.when}
                </span>
                <h3 className="mb-3 font-display text-[clamp(22px,2vw,29px)] font-normal leading-[1.22] text-brand">
                  {step.title}
                </h3>
                <p className="max-w-[40ch] font-sans text-[15px] font-light leading-[1.85] text-foreground/70 text-pretty md:text-[13.5px]">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
