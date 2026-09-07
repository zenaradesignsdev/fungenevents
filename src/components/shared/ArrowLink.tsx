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
    // The ::after extends the tap area to ~45px without moving the gold rule
    // or adding any layout box — padding here would push the underline off the
    // baseline it shares with the surrounding copy.
    "group relative inline-flex items-center gap-3.5 border-b border-gold pb-2 font-sans text-[11px] uppercase tracking-[0.28em] transition-colors duration-500 after:absolute after:inset-x-0 after:-top-2 after:-bottom-2 after:content-['']",
    tone === 'dark' ? 'text-brand hover:text-gold-ink' : 'text-brand-foreground hover:text-gold',
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
