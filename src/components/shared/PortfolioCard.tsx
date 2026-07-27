import Link from 'next/link'
import { Image } from '@/components/ui/image'
import { cn } from '@/lib/cn'

type PortfolioCardProps = {
  href: string
  image: string
  alt: string
  tag: string
  title: string
  meta?: string
  ratio?: 'portrait' | 'square'
  /** Adds a top offset at wide widths for the staggered masonry look. */
  offset?: boolean
  sizes?: string
}

export function PortfolioCard({
  href,
  image,
  alt,
  tag,
  title,
  meta,
  ratio = 'portrait',
  offset = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px',
}: PortfolioCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative block overflow-hidden bg-brand',
        ratio === 'portrait' ? 'aspect-[4/5]' : 'aspect-square',
        offset && 'lg:mt-[clamp(0px,3vw,54px)]',
      )}
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition-[transform,opacity] duration-[1500ms] ease-[cubic-bezier(.32,.72,0,1)] group-hover:scale-[1.07] group-hover:opacity-60"
      />
      <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-[linear-gradient(180deg,rgba(19,30,46,0),rgba(19,30,46,.82))] p-[clamp(18px,2vw,26px)]">
        <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-gold">{tag}</span>
        <span className="font-display text-[clamp(21px,1.9vw,29px)] font-normal leading-[1.2] text-brand-foreground">
          {title}
        </span>
        {meta && (
          <span className="font-sans text-[12.5px] font-light leading-[1.6] text-brand-foreground/70">{meta}</span>
        )}
      </span>
    </Link>
  )
}
