type PageIntroHeroProps = {
  eyebrow: string
  /** ReactNode so callers can emphasise a word in gold italic. */
  title: React.ReactNode
  description: string
}

/**
 * Light-background page hero with a two-column headline + intro layout.
 * Used by Portfolio and Contact, which open on the warm-white background.
 */
export function PageIntroHero({ eyebrow, title, description }: PageIntroHeroProps) {
  return (
    <section className="bg-background px-5 pb-[clamp(34px,4vw,58px)] pt-[clamp(140px,17vw,240px)] sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1560px]">
        <div className="mb-[26px] flex items-center gap-4">
          <span className="block h-px w-[clamp(34px,5vw,72px)] bg-gold" />
          <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-brand/60">{eyebrow}</span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-end gap-[clamp(28px,4vw,80px)]">
          <h1 className="max-w-[18ch] font-display text-[clamp(38px,6.2vw,96px)] font-normal leading-[0.99] tracking-[-0.015em] text-brand text-balance">
            {title}
          </h1>
          <p className="max-w-[42ch] font-sans text-[15.5px] font-light leading-[1.9] text-foreground/75 text-pretty">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}
