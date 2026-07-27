import Link from 'next/link'
import { cn } from '@/lib/cn'

type ArrowLinkProps = {
  href: string
  children: React.ReactNode
  tone?: 'dark' | 'light'
  className?: string
}

/**
 * Inline text link with a gold underline and trailing arrow — the design's
 * "Learn more →" / "All services" affordance.
 */
export function ArrowLink({ href, children, tone = 'dark', className }: ArrowLinkProps) {
  const isInternal = href.startsWith('/')
  const classes = cn(
    'group inline-flex items-center gap-3.5 border-b border-gold pb-2 font-sans text-[11px] uppercase tracking-[0.28em] transition-colors duration-500 hover:text-gold',
    tone === 'dark' ? 'text-brand' : 'text-brand-foreground',
    className,
  )
  const inner = (
    <>
      {children}
      <span aria-hidden="true" className="text-sm transition-transform duration-500 group-hover:translate-x-1">
        →
      </span>
    </>
  )

  if (isInternal) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    )
  }
  return (
    <a href={href} className={classes}>
      {inner}
    </a>
  )
}
