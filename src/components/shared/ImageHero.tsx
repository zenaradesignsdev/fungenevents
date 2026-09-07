import { Image } from '@/components/ui/image'
import { cn } from '@/lib/cn'

type ImageHeroProps = {
  image: string
  imageAlt: string
  eyebrow: string
  /** ReactNode so callers can emphasise a word in gold italic. */
  title: React.ReactNode
  className?: string
  children?: React.ReactNode
}

/**
 * Dark, image-backed page hero used by About and Services. Content is
 * bottom-aligned over a slow Ken Burns image and a navy scrim.
 */
export function ImageHero({ image, imageAlt, eyebrow, title, className, children }: ImageHeroProps) {
  return (
    <section
      className={cn(
        'relative flex items-end overflow-hidden bg-brand',
        'min-h-[clamp(500px,78vh,820px)]',
        className,
      )}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover motion-safe:animate-kenburns"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,30,46,.72),rgba(19,30,46,.48)_43%,rgba(19,30,46,.9))]" />
      <div className="relative mx-auto w-full max-w-[1560px] px-5 pb-[clamp(50px,7vw,96px)] pt-[clamp(120px,16vh,180px)] sm:px-8 lg:px-16">
        <div className="mb-7 flex items-center gap-4">
          <span className="block h-px w-[clamp(34px,5vw,72px)] bg-gold" />
          <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-brand-foreground/80">
            {eyebrow}
          </span>
        </div>
        <h1 className="max-w-[20ch] font-display text-[clamp(38px,6.4vw,100px)] font-normal leading-[0.99] tracking-[-0.015em] text-brand-foreground text-balance">
          {title}
        </h1>
        {children}
      </div>
    </section>
  )
}
