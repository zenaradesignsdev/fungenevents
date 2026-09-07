import { Image } from '@/components/ui/image'
import { cn } from '@/lib/cn'
import { Reveal } from '@/components/shared/Reveal'

type CtaBandProps = {
  image: string
  imageAlt: string
  eyebrow?: string
  title: string
  description?: string
  align?: 'center' | 'left'
  /** CTA buttons. */
  children: React.ReactNode
  /** Slow Ken Burns drift on the background image. */
  animateImage?: boolean
}

/**
 * Full-width image CTA band with a navy scrim — the recurring "Book Your
 * Consultation" closer used across the marketing pages.
 */
export function CtaBand({
  image,
  imageAlt,
  eyebrow,
  title,
  description,
  align = 'center',
  children,
  animateImage = false,
}: CtaBandProps) {
  return (
    <section className="relative flex min-h-[clamp(440px,62vh,660px)] items-center overflow-hidden bg-brand-dark">
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="100vw"
        className={cn('object-cover', animateImage && 'motion-safe:animate-kenburns')}
      />
      <div
        className={cn(
          'absolute inset-0',
          align === 'center'
            ? 'bg-gradient-to-b from-brand-dark/85 to-brand-dark/65'
            : 'bg-gradient-to-r from-brand-dark/90 to-brand-dark/55',
        )}
      />
      <div
        className={cn(
          'relative mx-auto w-full max-w-[1560px] px-5 py-[clamp(56px,7vw,100px)] sm:px-8 lg:px-16',
          align === 'center' && 'max-w-[1000px] text-center',
        )}
      >
        {eyebrow && (
          <Reveal
            as="span"
            className="mb-6 block font-sans text-[10px] uppercase tracking-[0.4em] text-gold"
          >
            {eyebrow}
          </Reveal>
        )}
        <Reveal
          as="h2"
          delay={0.1}
          className={cn(
            'font-display text-[clamp(30px,4.6vw,68px)] font-normal leading-[1.05] text-brand-foreground text-balance',
            align === 'center' && 'mx-auto',
          )}
        >
          {title}
        </Reveal>
        {description && (
          <Reveal
            as="p"
            delay={0.16}
            className={cn(
              'mt-7 font-sans text-base font-light leading-[1.9] text-brand-foreground/80 text-pretty',
              align === 'center' ? 'mx-auto max-w-[52ch]' : 'max-w-[52ch]',
            )}
          >
            {description}
          </Reveal>
        )}
        <Reveal
          delay={0.22}
          className={cn(
            'mt-9 flex flex-wrap gap-3.5',
            align === 'center' ? 'justify-center' : 'justify-start',
          )}
        >
          {children}
        </Reveal>
      </div>
    </section>
  )
}
