import { Reveal } from '@/components/shared/Reveal'
import { ArrowLink } from '@/components/shared/ArrowLink'
import { PortfolioCard } from '@/components/shared/PortfolioCard'
import { PORTFOLIO_ITEMS } from '@/lib/site-data'

export function FeaturedPortfolio() {
  const featured = PORTFOLIO_ITEMS.slice(0, 6)

  return (
    <section className="bg-secondary px-5 py-[clamp(72px,11vw,160px)] sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1560px]">
        <div className="mb-[clamp(38px,5vw,68px)] flex flex-wrap items-end justify-between gap-[22px]">
          <div>
            <div className="mb-5 flex items-center gap-3.5">
              <span className="block h-px w-[34px] bg-gold" />
              <span className="font-sans text-[10px] uppercase tracking-[0.34em] text-brand/60">
                03 — Selected work
              </span>
            </div>
            <h2 className="max-w-[22ch] font-display text-[clamp(30px,4.2vw,64px)] font-normal leading-[1.08] text-brand text-balance">
              Evenings we&apos;re still being told stories about.
            </h2>
          </div>
          <ArrowLink href="/portfolio">Full portfolio</ArrowLink>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,290px),1fr))] gap-[clamp(14px,1.6vw,26px)]">
          {featured.map((item) => (
            <Reveal key={item.title}>
              <PortfolioCard
                href="/portfolio"
                image={item.image}
                alt={item.alt}
                tag={item.tag}
                title={item.title}
                ratio={item.ratio}
                offset={item.ratio === 'square'}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
