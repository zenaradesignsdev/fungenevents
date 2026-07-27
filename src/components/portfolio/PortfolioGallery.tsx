'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { PortfolioCard } from '@/components/shared/PortfolioCard'
import { PORTFOLIO_CATS, PORTFOLIO_ITEMS } from '@/lib/site-data'

export function PortfolioGallery() {
  const [cat, setCat] = useState('All')

  const countFor = (c: string) =>
    c === 'All' ? PORTFOLIO_ITEMS.length : PORTFOLIO_ITEMS.filter((w) => w.cat === c).length

  const shown = PORTFOLIO_ITEMS.filter((w) => cat === 'All' || w.cat === cat)

  return (
    <section className="bg-background px-5 pb-[clamp(70px,10vw,140px)] sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1560px]">
        {/* Filter bar */}
        <div className="sticky top-[74px] z-50 mb-[clamp(26px,3vw,44px)] flex flex-wrap gap-x-[clamp(16px,2.4vw,36px)] border-y border-brand/15 bg-background/95 backdrop-blur-md">
          {PORTFOLIO_CATS.map((c) => {
            const active = c === cat
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={cn(
                  'relative py-[18px] font-sans text-[10.5px] uppercase tracking-[0.26em] transition-colors duration-300 hover:text-gold',
                  active ? 'text-gold' : 'text-brand/70',
                )}
              >
                {c}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-x-0 -bottom-px h-px bg-gold transition-all duration-500',
                    active ? 'w-full' : 'w-0',
                  )}
                />
                <span className="ml-1.5 align-super font-sans text-[8.5px] tracking-[0.1em] text-brand/35">
                  {countFor(c)}
                </span>
              </button>
            )
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[clamp(14px,1.6vw,26px)]">
          {shown.map((item, i) => (
            <motion.div
              key={item.title}
              layout
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: Math.min(i * 0.04, 0.3), ease: [0.22, 0.61, 0.36, 1] }}
            >
              <PortfolioCard
                href="/contact"
                image={item.image}
                alt={item.alt}
                tag={`${item.tag} · ${item.year}`}
                title={item.title}
                meta={item.meta}
                ratio={item.ratio}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
