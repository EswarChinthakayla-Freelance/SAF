import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'
import {
  publicRouteVariants,
  adminRouteVariants,
  reducedMotionRouteVariants,
} from '@/lib/motion'

interface RouteTransitionProps {
  children: React.ReactNode
  variant?: 'public' | 'admin'
  className?: string
}

/**
 * Lightweight route transition wrapper with restrained, non-intrusive animation
 * that instantly respects reduced-motion preference.
 */
export const RouteTransition: React.FC<RouteTransitionProps> = ({
  children,
  variant = 'public',
  className = 'w-full flex-1 flex flex-col',
}) => {
  const location = useLocation()
  const prefersReducedMotion = useReducedMotionPreference()

  // Key on pathname only (excluding query string to avoid re-triggering transitions on pagination/search)
  const routeKey = location.pathname

  const selectedVariants = prefersReducedMotion
    ? reducedMotionRouteVariants
    : variant === 'admin'
    ? adminRouteVariants
    : publicRouteVariants

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={routeKey}
        variants={selectedVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default RouteTransition
