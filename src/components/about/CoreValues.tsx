import { Image } from '@/components/ui/image'
import { Reveal } from '@/components/shared/Reveal'
import { ABOUT_VALUES } from '@/lib/site-data'

export function CoreValues() {
  return (
    <section className="bg-background px-5 py-[clamp(70px,10vw,150px)] sm:px-8 lg:px-16">
      <div className="mx-auto grid max-w-[1560px] grid-cols-1 items-start gap-[clamp(40px,5vw,96px)] lg:grid-cols-2">
        {/* Sticky intro */}
        <div className="lg:sticky lg:top-[120px]">
          <span className="mb-[22px] block font-sans text-[10px] uppercase tracking-[0.34em] text-gold">
            Core values
          </span>
          <h2 className="mb-[26px] max-w-[18ch] font-display text-[clamp(30px,4vw,58px)] font-normal leading-[1.1] text-brand text-balance">
            Five things we refuse to compromise on.
          </h2>
          <div className="mt-[34px] aspect-[5/4] overflow-hidden bg-secondary">
            <Image
              src="/images/gallery/place-setting-wood.jpg"
              alt="Place setting detail on a wooden table"
              width={1200}
              height={960}
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Value list */}
        <div className="border-t border-brand/15">
          {ABOUT_VALUES.map((value) => (
            <Reveal
              key={value.num}
              className="grid grid-cols-[52px_1fr] gap-[18px] border-b border-brand/15 py-[clamp(22px,2.6vw,34px)] transition-[padding] duration-500 ease-[cubic-bezier(.22,.61,.36,1)] hover:pl-3"
            >
              <span className="font-display text-3xl leading-none text-gold/70">{value.num}</span>
              <div>
                <h3 className="mb-2.5 font-display text-[clamp(23px,2.1vw,31px)] font-normal leading-[1.25] text-brand">
                  {value.title}
                </h3>
                <p className="max-w-[52ch] font-sans text-[14.5px] font-light leading-[1.85] text-foreground/70 text-pretty">
                  {value.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
