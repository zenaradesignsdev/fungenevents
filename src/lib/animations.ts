/**
 * Standard Framer Motion animation presets.
 *
 * Leaf element usage (spread all props at once):
 *   <motion.div {...ANIMATION_VARIANTS.fadeIn} />
 *
 * Stagger usage (parent + children pattern):
 *   <motion.ul {...ANIMATION_VARIANTS.stagger}>
 *     {items.map(item => (
 *       <motion.li key={item.id} {...ANIMATION_VARIANTS.fadeIn}>{item.label}</motion.li>
 *     ))}
 *   </motion.ul>
 * Note: `stagger` is a container variant only — it has no `initial` of its own.
 * Spreading it on a leaf element alone has no visible effect.
 */

const DURATIONS = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
} as const

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DURATIONS.NORMAL },
  },
  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DURATIONS.SLOW },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: DURATIONS.NORMAL },
  },
  slideInRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: DURATIONS.NORMAL },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: DURATIONS.NORMAL },
  },
  stagger: {
    animate: {
      transition: { staggerChildren: 0.1 },
    },
  },
} as const

export const EASING = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
} as const
