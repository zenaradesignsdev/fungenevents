'use client'

import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number
  rootMargin?: string
  freezeOnceVisible?: boolean
}

/**
 * Attach `elementRef` to any element to track its visibility.
 * Generic T ensures the ref type matches the element it is attached to,
 * avoiding strict-mode TypeScript errors (e.g. RefObject<HTMLElement>
 * is not assignable to RefObject<HTMLDivElement>).
 *
 * Usage:
 *   const { elementRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>()
 *   <div ref={elementRef}>...</div>
 */
export function useIntersectionObserver<T extends Element = HTMLElement>({
  threshold = 0.3,
  rootMargin = '0px',
  freezeOnceVisible = false,
}: UseIntersectionObserverOptions = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef<T>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting
        setIsIntersecting(visible)
        if (visible && freezeOnceVisible) setHasIntersected(true)
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.unobserve(element)
  }, [threshold, rootMargin, freezeOnceVisible])

  return {
    elementRef,
    isIntersecting: freezeOnceVisible ? hasIntersected || isIntersecting : isIntersecting,
  }
}
