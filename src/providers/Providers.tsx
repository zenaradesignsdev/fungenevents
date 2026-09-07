'use client'

import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import { Toaster } from '@/components/ui/sonner'

/**
 * App-wide client providers.
 *
 * LazyMotion + domAnimation ships only the DOM animation features Framer needs
 * (~15KB) instead of the full `motion` bundle (~55KB). `strict` enforces the
 * lightweight `m.*` components everywhere — using `motion.*` will throw, which
 * keeps the bundle small by construction.
 *
 * MotionConfig reducedMotion="user" makes every m.* component honour the OS
 * setting. Hero/Reveal/Testimonials/PortfolioGallery already call
 * useReducedMotion themselves; the mobile menu and the services FAQ accordion
 * did not, and this covers them without duplicating the hook in each.
 *
 * (TanStack Query was removed — nothing in the app issues client queries; the
 * contact form posts with a plain fetch. Re-add QueryClientProvider here if a
 * real client-side query is introduced.)
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {children}
        <Toaster position="bottom-right" richColors />
      </MotionConfig>
    </LazyMotion>
  )
}
