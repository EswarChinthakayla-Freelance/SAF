import type { Variants, Transition } from 'framer-motion'

/**
 * Centralized motion durations (in seconds) adhering to luxury aesthetic:
 * Calm, restrained, non-intrusive.
 */
export const MOTION_DURATIONS = {
  FAST: 0.15,
  NORMAL: 0.22,
  SLOW: 0.35,
  REDUCED: 0.05,
} as const

/**
 * Curated cubic-bezier curves for organic architectural motion.
 */
export const MOTION_EASING = {
  EASE_OUT: [0.16, 1, 0.3, 1], // Smooth deceleration
  EASE_IN_OUT: [0.4, 0, 0.2, 1],
  STANDARD: [0.25, 0.1, 0.25, 1],
} as const

/**
 * Standard transition presets
 */
export const transitions = {
  fast: {
    duration: MOTION_DURATIONS.FAST,
    ease: MOTION_EASING.EASE_OUT,
  } as Transition,
  normal: {
    duration: MOTION_DURATIONS.NORMAL,
    ease: MOTION_EASING.EASE_OUT,
  } as Transition,
  slow: {
    duration: MOTION_DURATIONS.SLOW,
    ease: MOTION_EASING.EASE_OUT,
  } as Transition,
  reduced: {
    duration: MOTION_DURATIONS.REDUCED,
    ease: 'linear',
  } as Transition,
}

/**
 * Public route transition variants (subtle opacity + 4px Y)
 */
export const publicRouteVariants: Variants = {
  initial: {
    opacity: 0,
    y: 6,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
}

/**
 * Admin route transition variants (instant or minimal fade, 0px translation)
 */
export const adminRouteVariants: Variants = {
  initial: {
    opacity: 0.85,
  },
  animate: {
    opacity: 1,
    transition: transitions.fast,
  },
  exit: {
    opacity: 1,
  },
}

/**
 * Reduced-motion route variants (0px translation, immediate fade)
 */
export const reducedMotionRouteVariants: Variants = {
  initial: {
    opacity: 1,
    y: 0,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0 },
  },
  exit: {
    opacity: 1,
  },
}

/**
 * Product & Collection card hover variants
 */
export const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    transition: transitions.normal,
  },
  hover: {
    scale: 1.03,
    transition: transitions.normal,
  },
}

export const reducedCardHoverVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1 },
}
