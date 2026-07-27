'use client'

import { type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'

const MOTION_TAGS = {
  div: motion.div,
  span: motion.span,
  p: motion.p,
  li: motion.li,
  h2: motion.h2,
  h3: motion.h3,
} as const

type RevealTag = keyof typeof MOTION_TAGS

type RevealProps = {
  children?: ReactNode
  /** Render as a different element (e.g. 'span', 'p', 'h2'). Defaults to div. */
  as?: RevealTag
  /** Stagger delay in seconds. */
  delay?: number
  /** Vertical travel in px. */
  y?: number
  /** Apply a subtle blur-in (used by the hero-adjacent sections). */
  blur?: boolean
  className?: string
}

/**
 * Scroll-triggered reveal — the React/Framer Motion replacement for the
 * design's `[data-reveal]` IntersectionObserver. Animates once on entry and
 * fully respects `prefers-reduced-motion`.
 */
export function Reveal({ children, as = 'div', delay = 0, y = 28, blur = false, className }: RevealProps) {
  const prefersReduced = useReducedMotion()
  const MotionTag = MOTION_TAGS[as]

  if (prefersReduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={cn(className)}
      initial={{ opacity: 0, y, filter: blur ? 'blur(7px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      transition={{ duration: 0.95, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
