'use client'

import { m, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { PortfolioCard } from '@/components/shared/PortfolioCard'
import { PORTFOLIO_ITEMS } from '@/lib/site-data'

/**
 * Five projects laid out as two feature cards over a row of three. There is no
 * category filter: with this few projects every filter returned one or two
 * results, which made the work look thinner than it is. Reinstate the filter if
 * the list grows past roughly a dozen.
 */
export function PortfolioGallery() {
  const prefersReduced = useReducedMotion()
  const last = PORTFOLIO_ITEMS.length - 1

  return (
    <section className="bg-background px-5 pb-[clamp(70px,10vw,140px)] sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1560px]">
        <div className="grid grid-cols-1 gap-[clamp(14px,1.6vw,26px)] md:grid-cols-2 lg:grid-cols-6">
          {PORTFOLIO_ITEMS.map((item, i) => (
            <m.div
              key={item.title}
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -6% 0px' }}
              transition={{ duration: 0.6, delay: Math.min(i * 0.05, 0.3), ease: [0.22, 0.61, 0.36, 1] }}
              className={cn(
                // Two half-width features, then three thirds: 3+3 and 2+2+2 of
                // a six-column grid, so neither row leaves a hole.
                i < 2 ? 'lg:col-span-3' : 'lg:col-span-2',
                // Deliberately NOT spanning the last card across the 2-up grid:
                // at 768px a full-width 4/5 card renders 689x861, taller than the
                // viewport. A half-width card with one empty cell reads better.
                i === last && last % 2 === 0 && 'lg:col-span-2',
              )}
            >
              <PortfolioCard
                href="/contact"
                image={item.image}
                alt={item.alt}
                tag={`${item.tag} · ${item.year}`}
                title={item.title}
                meta={item.meta}
                ratio={item.ratio}
                sizes={
                  i < 2
                    ? '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 760px'
                    : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px'
                }
              />
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
