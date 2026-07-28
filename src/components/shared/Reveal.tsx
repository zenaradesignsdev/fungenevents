'use client'

import { type ReactNode } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'

const MOTION_TAGS = {
  div: m.div,
  span: m.span,
  p: m.p,
  li: m.li,
  h2: m.h2,
  h3: m.h3,
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
  className?: string
}

/**
 * Scroll-triggered reveal — the React/Framer Motion replacement for the
 * design's `[data-reveal]` IntersectionObserver. Animates once on entry
 * (opacity + transform only) and fully respects `prefers-reduced-motion`.
 */
export function Reveal({ children, as = 'div', delay = 0, y = 28, className }: RevealProps) {
  const prefersReduced = useReducedMotion()
  const MotionTag = MOTION_TAGS[as]

  if (prefersReduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      transition={{ duration: 0.95, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
