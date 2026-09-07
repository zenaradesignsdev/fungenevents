import { Reveal } from '@/components/shared/Reveal'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { SERVICE_AREA_GROUPS, HOME_BASE_CITY } from '@/lib/site-data'

/**
 * Service area on the About page. Sits on the navy band between Process and
 * WhyChooseFunGen, both of which are light, so the page alternates rather than
 * running three warm-white sections together.
 */
export function ServiceAreas() {
  return (
    <section className="bg-brand px-5 py-[clamp(64px,8vw,124px)] text-brand-foreground sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1560px]">
        <div className="grid grid-cols-1 items-start gap-[clamp(34px,4vw,80px)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          {/* Intro */}
          <div>
            <Reveal>
              <Eyebrow rule>Service area</Eyebrow>
            </Reveal>
            <Reveal
              as="h2"
              delay={0.06}
              className="mt-[22px] max-w-[25ch] font-display text-[clamp(28px,3.2vw,46px)] font-normal leading-[1.12]"
            >
              {/* One sentence per line: text-balance split this as "Based in
                  Scarborough. / Working / across the GTA." at several widths. */}
              <span className="block">Based in Scarborough.</span>
              <span className="block">
                Working across the <em className="italic text-gold">GTA</em>.
              </span>
            </Reveal>
            <Reveal
              as="p"
              delay={0.12}
              className="mt-[26px] max-w-[46ch] font-sans text-[15px] font-light leading-[1.9] text-brand-foreground/70 text-pretty"
            >
              We plan in banquet halls, including the Markham and Scarborough convention centres,
              along with community halls, restaurants, patios and back gardens. If your venue is new
              to us, we will go and walk it before we plan anything in it.
            </Reveal>
          </div>

          {/* Grouped city columns */}
          <Reveal
            delay={0.16}
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-x-[clamp(20px,3vw,44px)] gap-y-[clamp(26px,3vw,38px)]"
          >
            {SERVICE_AREA_GROUPS.map((group) => (
              <div key={group.direction} className="border-t border-gold/45 pt-[18px]">
                <span className="mb-[18px] block font-sans text-[9.5px] uppercase tracking-[0.32em] text-gold">
                  {group.direction}
                </span>
                <ul className="flex flex-col gap-[11px]">
                  {group.cities.map((city) => (
                    <li
                      key={city}
                      className="flex items-baseline gap-2 font-sans text-[15px] font-light leading-[1.5] text-brand-foreground/85"
                    >
                      {city}
                      {city === HOME_BASE_CITY && (
                        <span
                          aria-hidden="true"
                          className="block h-[5px] w-[5px] shrink-0 rotate-45 bg-gold"
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        </div>

        {/* Footnote: carries the home-base key and the travel promise. */}
        <Reveal
          delay={0.2}
          className="mt-[clamp(34px,4vw,56px)] flex flex-wrap items-center gap-x-7 gap-y-2.5 border-t border-brand-foreground/15 pt-[22px] font-sans text-[11.5px] font-light uppercase tracking-[0.2em] text-brand-foreground/55"
        >
          <span className="flex items-center gap-2.5">
            <span aria-hidden="true" className="block h-[5px] w-[5px] rotate-45 bg-gold" />
            Home base
          </span>
          <span>No travel charge inside the GTA</span>
        </Reveal>
      </div>
    </section>
  )
}
