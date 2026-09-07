import { Image } from '@/components/ui/image'
import { Reveal } from '@/components/shared/Reveal'

const MANIFESTO_FACTS = [
  { label: 'Based in', value: 'Scarborough, Toronto' },
  { label: 'We plan', value: 'Six kinds of event' },
  { label: 'Service area', value: 'Across the GTA' },
  { label: 'Consultations', value: 'Free, about 30 minutes' },
]

export function AboutManifesto() {
  return (
    <section className="bg-background px-5 py-[clamp(64px,8vw,124px)] sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1180px]">
        {/* Brand seal above the manifesto — signs the statement of belief. */}
        <Reveal className="mb-[clamp(26px,3.2vw,44px)]">
          <Image
            src="/images/fungen-mark-gold-deep.svg"
            alt=""
            width={21}
            height={54}
            className="h-[54px] w-auto"
          />
        </Reveal>
        <Reveal
          delay={0.06}
          as="p"
          className="font-display text-[clamp(24px,3.2vw,46px)] font-normal leading-[1.42] text-brand text-pretty"
        >
          FunGen Events &amp; Experiences began with a simple idea: a party should feel like the people it
          belongs to, not like something the venue sells by the plate. It should feel{' '}
          <em className="italic text-gold">like them.</em>
        </Reveal>
        <div className="mt-[clamp(40px,5vw,72px)] grid grid-cols-1 items-start gap-[clamp(32px,4vw,80px)] border-t border-brand/15 pt-[clamp(34px,4vw,54px)] lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          {/* Lead copy, held to a single comfortable measure. */}
          <div className="flex max-w-[58ch] flex-col gap-[22px]">
            <Reveal
              as="p"
              delay={0.1}
              className="font-sans text-[15.5px] font-light leading-[1.95] text-foreground text-pretty"
            >
              It started as favours for friends: a fortieth in a Scarborough backyard, a retirement dinner in a
              rented Markham hall, a fundraiser in a borrowed one. It became a business because word travelled.
              Clients kept saying the same two things. It felt like ours, and nothing went wrong.
            </Reveal>
            <Reveal
              as="p"
              delay={0.16}
              className="font-sans text-[15.5px] font-light leading-[1.95] text-foreground/70 text-pretty"
            >
              Today we plan and run a few events at a time, across six kinds of occasion and most corners of
              the Greater Toronto Area, from Mississauga to Pickering and Vaughan to Ajax. The size of the job
              changes, but the standard does not: honest budgets, plans you can follow, and a team that keeps
              the day calm enough for you to be in it.
            </Reveal>
          </div>

          {/* Facts strip: gives the eye a step between the 46px statement and
              15px body, and answers the three things people scan an About page for. */}
          <Reveal delay={0.2} className="flex flex-col">
            {MANIFESTO_FACTS.map((fact) => (
              <span
                key={fact.label}
                className="flex flex-col gap-1.5 border-b border-brand/15 py-[15px] first:border-t first:border-gold/50"
              >
                <span className="font-sans text-[9.5px] uppercase tracking-[0.3em] text-gold">
                  {fact.label}
                </span>
                <span className="font-display text-[clamp(17px,1.5vw,21px)] leading-[1.35] text-brand">
                  {fact.value}
                </span>
              </span>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
