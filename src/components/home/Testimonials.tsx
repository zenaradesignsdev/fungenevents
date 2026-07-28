'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { TESTIMONIALS } from '@/lib/site-data'

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length)
    }, 9000)
    return () => clearInterval(timer)
  }, [prefersReduced])

  const active = TESTIMONIALS[index]

  return (
    <section className="relative overflow-hidden bg-brand px-5 py-[clamp(76px,12vw,168px)] text-brand-foreground sm:px-8 lg:px-16">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-5 top-[clamp(20px,4vw,60px)] font-display text-[clamp(140px,22vw,320px)] leading-[0.7] text-gold/15 sm:left-8 lg:left-16"
      >
        “
      </span>
      <div className="relative mx-auto max-w-[1180px]">
        <span className="mb-[clamp(30px,4vw,54px)] block font-sans text-[10px] uppercase tracking-[0.34em] text-brand-foreground/50">
          04 — In their words
        </span>

        <div className="min-h-[clamp(180px,20vw,300px)]">
          <AnimatePresence mode="wait">
            <m.blockquote
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="font-display text-[clamp(25px,3.6vw,54px)] font-normal italic leading-[1.34] text-brand-foreground text-pretty"
            >
              “{active.quote}”
            </m.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-[clamp(28px,3.5vw,48px)] flex flex-wrap items-center justify-between gap-6 border-t border-brand-foreground/15 pt-[26px]">
          <div>
            <span className="block font-sans text-xs uppercase tracking-[0.22em] text-gold">{active.author}</span>
            <span className="mt-[7px] block font-sans text-[13px] font-light text-brand-foreground/60">
              {active.role}
            </span>
          </div>
          <div className="flex items-center gap-[22px]">
            {TESTIMONIALS.map((item, i) => (
              <button
                key={item.author}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === index}
                className="flex items-center gap-2.5 px-1 py-3"
              >
                <span
                  className={cn(
                    'block h-px transition-all duration-500',
                    i === index ? 'w-[46px] bg-gold' : 'w-4 bg-brand-foreground/40',
                  )}
                />
                <span
                  className={cn(
                    'font-sans text-[10px] tracking-[0.2em] transition-colors duration-500',
                    i === index ? 'text-gold' : 'text-brand-foreground/40',
                  )}
                >
                  0{i + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
