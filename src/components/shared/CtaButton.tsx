import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const ctaButton = cva(
  'inline-flex items-center justify-center gap-4 rounded-full text-center font-sans text-[11px] font-normal uppercase tracking-[0.28em] transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        gold: 'bg-gold text-brand ring-offset-background hover:bg-brand hover:text-brand-foreground',
        navy: 'bg-brand text-brand-foreground ring-offset-background hover:bg-gold hover:text-brand',
        'outline-dark':
          'border border-brand/25 text-brand ring-offset-background hover:border-brand hover:bg-brand hover:text-brand-foreground',
        'outline-light':
          'border border-brand-foreground/40 text-brand-foreground ring-offset-brand hover:border-brand-foreground hover:bg-brand-foreground/10',
      },
      size: {
        default: 'px-10 py-[21px]',
        sm: 'px-8 py-4',
      },
    },
    defaultVariants: { variant: 'gold', size: 'default' },
  },
)

type CtaButtonProps = {
  href: string
  children: React.ReactNode
  className?: string
} & VariantProps<typeof ctaButton>

/**
 * The site's primary marketing call-to-action button. Renders a Next.js Link
 * for internal routes and a plain anchor for tel:/mailto:/external targets.
 */
export function CtaButton({ href, children, variant, size, className }: CtaButtonProps) {
  const classes = cn(ctaButton({ variant, size }), className)
  const isInternal = href.startsWith('/')

  if (isInternal) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} className={classes}>
      {children}
    </a>
  )
}
