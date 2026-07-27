import { Reveal } from '@/components/shared/Reveal'
import { ABOUT_STEPS } from '@/lib/site-data'

export function Process() {
  return (
    <section className="bg-secondary px-5 py-[clamp(70px,10vw,150px)] sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1560px]">
        <div className="mb-[clamp(42px,5vw,80px)] flex flex-wrap items-end justify-between gap-6">
          <Reveal
            as="h2"
            className="max-w-[20ch] font-display text-[clamp(30px,4.2vw,62px)] font-normal leading-[1.08] text-brand text-balance"
          >
            How a FunGen event comes together.
          </Reveal>
          <Reveal
            as="p"
            delay={0.1}
            className="max-w-[34ch] font-display text-[clamp(15px,1.3vw,20px)] italic text-brand/60 text-pretty"
          >
            Six months or eighteen — the sequence stays the same.
          </Reveal>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-px border-t border-brand/15 bg-brand/15">
          {ABOUT_STEPS.map((step) => (
            <Reveal
              key={step.num}
              className="flex min-h-[clamp(220px,22vw,290px)] flex-col gap-4 bg-secondary p-[clamp(26px,3vw,42px)]"
            >
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold">{step.num}</span>
              <span className="font-display text-[clamp(22px,2vw,29px)] leading-[1.22] text-brand">
                {step.title}
              </span>
              <span className="font-sans text-[13.5px] font-light leading-[1.85] text-foreground/70 text-pretty">
                {step.body}
              </span>
              <span className="mt-auto font-sans text-[10px] uppercase tracking-[0.22em] text-brand/45">
                {step.when}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
