import { Reveal } from '@/components/shared/Reveal'
import { ABOUT_TENETS } from '@/lib/site-data'

const OFFSETS = ['lg:mt-0', 'lg:mt-[clamp(0px,3vw,52px)]', 'lg:mt-[clamp(0px,6vw,104px)]']

export function MissionVision() {
  return (
    <section className="bg-brand px-5 py-[clamp(70px,10vw,150px)] text-brand-foreground sm:px-8 lg:px-16">
      <div className="mx-auto grid max-w-[1560px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[clamp(34px,4vw,78px)]">
        {ABOUT_TENETS.map((tenet, i) => (
          <Reveal key={tenet.label} delay={i * 0.06} className={cnOffset(i)}>
            <div className="border-t border-gold/50 pt-[26px]">
              <span className="mb-5 block font-sans text-[10px] uppercase tracking-[0.34em] text-gold">
                {tenet.label}
              </span>
              <h2 className="mb-[18px] font-display text-[clamp(26px,2.7vw,40px)] font-normal leading-[1.2] text-balance">
                {tenet.title}
              </h2>
              <p className="font-sans text-[15px] font-light leading-[1.9] text-brand-foreground/70 text-pretty">
                {tenet.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function cnOffset(i: number) {
  return OFFSETS[i] ?? 'lg:mt-0'
}
