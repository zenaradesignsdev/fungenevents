'use client'

import { useState, useEffect } from 'react'

interface UseScrollPositionOptions {
  /** Pixel threshold after which `isScrolled` becomes true. Default: 90 */
  scrolledThreshold?: number
}

export function useScrollPosition({ scrolledThreshold = 90 }: UseScrollPositionOptions = {}) {
  const [scrollY, setScrollY] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrollY(y)
      setIsScrolled(y > scrolledThreshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrolledThreshold])

  return { scrollY, isScrolled }
}
