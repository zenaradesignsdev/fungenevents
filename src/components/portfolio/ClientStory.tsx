import { Image } from '@/components/ui/image'
import { cn } from '@/lib/cn'
import { Reveal } from '@/components/shared/Reveal'
import type { PORTFOLIO_STORIES } from '@/lib/site-data'

type Story = (typeof PORTFOLIO_STORIES)[number]

export function ClientStory({ story, shaded }: { story: Story; shaded: boolean }) {
  const dark = !shaded // first story sits on navy, second on soft-gray
  const imageBlock = (
    <Reveal
      className={cn(
        'overflow-hidden bg-brand-dark',
        story.imageRatio === 'square' ? 'aspect-square' : 'aspect-[4/5]',
      )}
    >
      <Image
        src={story.image}
        alt={story.imageAlt}
        width={1400}
        height={story.imageRatio === 'square' ? 1400 : 1750}
        sizes="(max-width: 1024px) 90vw, 45vw"
        className="h-full w-full object-cover"
      />
    </Reveal>
  )

  const textBlock = (
    <div>
      <Reveal
        as="h2"
        className={cn(
          'mb-6 max-w-[20ch] font-display text-[clamp(30px,4vw,58px)] font-normal leading-[1.06] text-balance',
          dark ? 'text-brand-foreground' : 'text-brand',
        )}
      >
        {story.title}
      </Reveal>
      {story.paragraphs.map((p, i) => (
        <Reveal
          key={i}
          as="p"
          delay={0.08 + i * 0.04}
          className={cn(
            'mb-[18px] max-w-[52ch] font-sans text-[15.5px] font-light leading-[1.92] text-pretty',
            dark ? (i === 0 ? 'text-brand-foreground/75' : 'text-brand-foreground/60') : i === 0 ? 'text-foreground/80' : 'text-foreground/60',
          )}
        >
          {p}
        </Reveal>
      ))}
      <Reveal
        as="p"
        delay={0.16}
        className={cn(
          'mt-[30px] max-w-[40ch] border-l border-gold pl-[26px] font-display text-[clamp(21px,2.2vw,32px)] font-light italic leading-[1.45] text-pretty',
          dark ? 'text-brand-foreground' : 'text-brand',
        )}
      >
        “{story.quote}”
      </Reveal>
      <Reveal
        as="span"
        delay={0.18}
        className={cn(
          'mt-5 block pl-[27px] font-sans text-[11px] uppercase tracking-[0.22em]',
          dark ? 'text-brand-foreground/50' : 'text-brand/50',
        )}
      >
        {story.attribution}
      </Reveal>
    </div>
  )

  return (
    <section
      className={cn('px-5 py-[clamp(70px,10vw,150px)] sm:px-8 lg:px-16', dark ? 'bg-brand text-brand-foreground' : 'bg-secondary')}
    >
      <div className="mx-auto max-w-[1560px]">
        <Reveal
          as="span"
          className="mb-[clamp(30px,4vw,52px)] block font-sans text-[10px] uppercase tracking-[0.34em] text-gold"
        >
          Client story — {story.index}
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-[clamp(38px,5vw,92px)]">
          {story.imageFirst ? (
            <>
              {imageBlock}
              {textBlock}
            </>
          ) : (
            <>
              {textBlock}
              {imageBlock}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
