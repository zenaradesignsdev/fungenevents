import { cn } from '@/lib/cn'

type EyebrowProps = {
  children: React.ReactNode
  /** Show a short rule line before the label. */
  rule?: boolean
  /** Tone against light vs. dark backgrounds. */
  tone?: 'dark' | 'light'
  className?: string
}

/**
 * The gold, wide-tracked uppercase kicker used above section headings
 * throughout the site. Optionally prefixed with a hairline rule.
 */
export function Eyebrow({ children, rule = false, tone = 'dark', className }: EyebrowProps) {
  return (
    <span className={cn('flex items-center gap-4', className)}>
      {rule && <span className="block h-px w-8 shrink-0 bg-gold sm:w-9" aria-hidden="true" />}
      <span
        className={cn(
          'font-sans text-[10px] font-normal uppercase leading-none tracking-[0.34em] text-gold',
          tone === 'light' && 'text-gold',
        )}
      >
        {children}
      </span>
    </span>
  )
}
