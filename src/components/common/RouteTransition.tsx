import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

interface RouteTransitionProps {
  children: React.ReactNode
  variant?: 'public' | 'admin'
  className?: string
}

/**
 * Lightweight, non-blocking route transition wrapper.
 * Eliminates AnimatePresence exit-mode deadlocks and provides instant visual rendering
 * when navigating between public and administrative routes.
 */
export const RouteTransition: React.FC<RouteTransitionProps> = ({
  children,
  className = 'w-full flex-1 flex flex-col',
}) => {
  const location = useLocation()
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      key={location.pathname}
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default RouteTransition
