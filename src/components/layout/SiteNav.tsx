'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, m } from 'framer-motion'
import { Image } from '@/components/ui/image'
import { cn } from '@/lib/cn'
import { PRIMARY_NAV_LINKS } from '@/lib/site-data'
import { useScrollPosition } from '@/hooks/useScrollPosition'

type SiteNavProps = {
  /**
   * 'light' → page opens on a dark hero, so nav text starts cream and inverts
   * to navy once the frosted bar appears on scroll.
   * 'dark'  → page opens on a light background, so nav text is navy throughout.
   */
  theme?: 'light' | 'dark'
}

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteNav({ theme = 'light' }: SiteNavProps) {
  const { isScrolled: scrolled } = useScrollPosition({ scrolledThreshold: 30 })
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Cream text only while sitting over the dark hero, before the bar frosts.
  const lightText = theme === 'light' && !scrolled

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close the menu on route change (fallback beyond per-link onClick).
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Close the menu on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Cream over the dark hero; the deeper gold gradient once the bar frosts,
  // since the logo's own highlight washes out against the warm-white bar.
  const markSrc = lightText ? '/images/fungen-mark-cream.svg' : '/images/fungen-mark-gold-deep.svg'

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[200] px-5 pb-[clamp(14px,2vw,26px)] pt-[calc(env(safe-area-inset-top)+clamp(14px,2vw,26px))] sm:px-8 lg:px-16">
      <div
        className={cn(
          'pointer-events-auto mx-auto flex max-w-[1560px] items-center justify-between gap-8 transition-all duration-700 ease-[cubic-bezier(.32,.72,0,1)]',
          scrolled
            ? 'rounded-md border border-brand/10 bg-background/80 px-4 py-2.5 shadow-[0_26px_60px_-34px_rgba(19,30,46,.34)] backdrop-blur-xl backdrop-saturate-150 sm:px-6'
            : 'border border-transparent px-0 py-2.5',
        )}
      >
        {/* Wordmark */}
        <Link
          href="/"
          className={cn(
            'flex items-center gap-2.5 transition-colors duration-500',
            lightText ? 'text-brand-foreground' : 'text-brand',
          )}
          aria-label="FunGen Events & Experiences — home"
        >
          <Image src={markSrc} alt="" width={34} height={38} className="h-[38px] w-auto" />
          <span className="font-display text-2xl font-normal uppercase leading-none tracking-[0.14em]">
            FunGen
          </span>
          <span
            className={cn(
              'hidden pb-0.5 font-sans text-[9px] font-light uppercase tracking-[0.34em] transition-colors duration-500 sm:inline',
              lightText ? 'text-brand-foreground/60' : 'text-brand/50',
            )}
          >
            Events &amp; Experiences
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-[clamp(18px,2.6vw,42px)] min-[900px]:flex">
          {PRIMARY_NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative block py-1.5 font-sans text-[10.5px] uppercase tracking-[0.26em] transition-colors duration-300 hover:text-gold',
                  active ? 'text-gold' : lightText ? 'text-brand-foreground' : 'text-brand',
                )}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-x-0 bottom-0 h-px bg-gold transition-all duration-500',
                    active ? 'w-full' : 'w-0',
                  )}
                />
              </Link>
            )
          })}
          <Link
            href="/contact"
            className={cn(
              'border px-6 py-3.5 font-sans text-[10.5px] uppercase tracking-[0.26em] transition-colors duration-500 hover:border-gold hover:bg-gold hover:text-brand',
              lightText
                ? 'border-brand-foreground/35 text-brand-foreground'
                : 'border-brand/25 text-brand',
            )}
          >
            Start Planning
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 min-[900px]:hidden"
        >
          <span
            className={cn(
              'block h-px w-6 origin-center transition-all duration-500',
              open ? 'translate-y-[7px] rotate-45 bg-brand-foreground' : lightText ? 'bg-brand-foreground' : 'bg-brand',
            )}
          />
          <span
            className={cn(
              'block h-px w-4 transition-all duration-300',
              open ? 'opacity-0' : lightText ? 'bg-brand-foreground' : 'bg-brand',
            )}
          />
          <span
            className={cn(
              'block h-px w-6 origin-center transition-all duration-500',
              open ? '-translate-y-[7px] -rotate-45 bg-brand-foreground' : lightText ? 'bg-brand-foreground' : 'bg-brand',
            )}
          />
        </button>
      </div>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            className="pointer-events-auto fixed inset-0 z-[190] flex flex-col justify-center bg-brand px-6 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] sm:px-12"
          >
            <Image
              src="/images/fungen-mark-gold.svg"
              alt=""
              width={47}
              height={52}
              className="mb-6 h-[52px] w-auto"
            />
            <span className="mb-8 font-sans text-[9px] uppercase tracking-[0.4em] text-brand-foreground/45">
              Menu
            </span>
            {PRIMARY_NAV_LINKS.map((link, i) => (
              <m.div
                key={link.href}
                initial={{ opacity: 0, y: 38 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.09 + i * 0.07, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              >
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'block border-b border-brand-foreground/10 py-2.5 font-display text-[clamp(38px,11vw,64px)] font-normal leading-[1.18] transition-colors duration-500 hover:text-gold',
                    isActive(pathname, link.href) ? 'text-gold' : 'text-brand-foreground',
                  )}
                >
                  {link.label}
                </Link>
              </m.div>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-9 bg-gold px-8 py-[18px] text-center font-sans text-[11px] uppercase tracking-[0.28em] text-brand"
            >
              Book a Consultation
            </Link>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}
