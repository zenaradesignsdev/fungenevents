'use client'

import { useEffect, useRef, useState } from 'react'
import { Image } from '@/components/ui/image'
import { cn } from '@/lib/cn'

interface CategoryTile {
  label: string
  image: string
  alt: string
  objectPosition: string
}

const CATEGORIES: CategoryTile[] = [
  { label: 'Birthdays', image: '/images/birthdays.jpg', alt: 'Colourful balloons with ribbons', objectPosition: '50% 35%' },
  { label: 'Weddings', image: '/images/weddings.jpg', alt: 'A bride and groom walking through cheering guests', objectPosition: '50% 40%' },
  { label: 'Anniversaries', image: '/images/anniversaries.jpg', alt: 'An elegant candlelit table setting with flowers', objectPosition: '50% 75%' },
  { label: 'Social', image: '/images/social.jpg', alt: 'Friends toasting drinks together at a bar', objectPosition: '35% 55%' },
  { label: 'Entertainment', image: '/images/entertainment.jpg', alt: 'DJs performing on stage for a crowd', objectPosition: '40% 40%' },
  { label: 'Nonprofits', image: '/images/nonprofits.jpg', alt: 'An elegant gala venue strung with string lights', objectPosition: '50% 55%' },
]

const AUTO_SCROLL_SPEED = 0.4 // pixels per animation frame — slow, continuous right-to-left drift
const RESUME_DELAY_MS = 2500

export function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [isInteracting, setIsInteracting] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let rafId: number
    let lastIndex = 0
    const step = () => {
      const half = el.scrollWidth / 2
      if (half > 0) {
        if (!pausedRef.current) {
          el.scrollLeft += AUTO_SCROLL_SPEED
          if (el.scrollLeft >= half) {
            el.scrollLeft -= half
          }
        }
        const perTile = half / CATEGORIES.length
        const index = Math.round((el.scrollLeft % half) / perTile) % CATEGORIES.length
        if (index !== lastIndex) {
          lastIndex = index
          setActiveIndex(index)
        }
      }
      rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const pause = () => {
    pausedRef.current = true
    setIsInteracting(true)
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
  }

  const scheduleResume = () => {
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false
      setIsInteracting(false)
    }, RESUME_DELAY_MS)
  }

  const goToIndex = (index: number) => {
    const el = scrollRef.current
    if (!el) return
    const half = el.scrollWidth / 2
    const perTile = half / CATEGORIES.length
    pause()
    el.scrollTo({ left: perTile * index, behavior: 'smooth' })
    scheduleResume()
  }

  // Duplicated once so the auto-scroll can loop seamlessly at the halfway point.
  const loopedCategories = [...CATEGORIES, ...CATEGORIES]

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-3">
      <div
        ref={scrollRef}
        className={cn(
          'no-scrollbar flex h-[34vh] w-full gap-3 overflow-x-auto',
          // Snap is only enabled while the user is actively interacting — a
          // permanent snap-mandatory fights the rAF auto-scroll and freezes it.
          isInteracting && 'snap-x snap-mandatory'
        )}
        onPointerDown={pause}
        onPointerUp={scheduleResume}
        onPointerLeave={scheduleResume}
        onTouchStart={pause}
        onTouchEnd={scheduleResume}
      >
        {loopedCategories.map((category, index) => (
          <div
            key={`${category.label}-${index}`}
            className="group relative h-full w-full shrink-0 snap-center overflow-hidden rounded-lg sm:w-[calc((100%-1.5rem)/3)]"
          >
            <Image
              src={category.image}
              alt={category.alt}
              fill
              quality={100}
              sizes="(max-width: 640px) 90vw, 33vw"
              style={{ objectPosition: category.objectPosition }}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/10 to-transparent" />
            <span className="absolute inset-x-0 bottom-2 px-3 text-center text-sm font-semibold tracking-wide text-primary-foreground sm:text-base">
              {category.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {CATEGORIES.map((category, index) => (
          <button
            key={category.label}
            type="button"
            aria-label={`Go to ${category.label}`}
            onClick={() => goToIndex(index)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              index === activeIndex ? 'w-4 bg-gold' : 'w-1.5 bg-primary-foreground/40'
            )}
          />
        ))}
      </div>
    </div>
  )
}
