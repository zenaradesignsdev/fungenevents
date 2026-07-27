import { Reveal } from '@/components/shared/Reveal'

export function AboutManifesto() {
  return (
    <section className="bg-background px-5 py-[clamp(70px,10vw,150px)] sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1180px]">
        <Reveal
          as="p"
          className="font-display text-[clamp(24px,3.2vw,46px)] font-normal leading-[1.42] text-brand text-pretty"
        >
          FunGen Events &amp; Experiences began with a stubborn belief: a celebration should feel like the
          people it belongs to. Not like a venue package. Not like a trend board.{' '}
          <em className="italic text-gold">Like them.</em>
        </Reveal>
        <div className="mt-[clamp(40px,5vw,72px)] grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[clamp(30px,4vw,70px)] border-t border-brand/15 pt-[clamp(34px,4vw,54px)]">
          <Reveal
            as="p"
            delay={0.1}
            className="font-sans text-[15.5px] font-light leading-[1.95] text-foreground text-pretty"
          >
            What started as favours for friends — a fortieth in a backyard, a fundraiser in a borrowed hall —
            became a studio because word travelled. Clients kept saying the same thing: it felt like ours, and
            nothing went wrong.
          </Reveal>
          <Reveal
            as="p"
            delay={0.16}
            className="font-sans text-[15.5px] font-light leading-[1.95] text-foreground/70 text-pretty"
          >
            Today we design and produce a deliberately small number of events each season across six
            disciplines. The scale changes. The standard doesn&apos;t: honest budgets, considered design, and a
            team that keeps the day quiet so you can be present in it.
          </Reveal>
        </div>
      </div>
    </section>
  )
}
