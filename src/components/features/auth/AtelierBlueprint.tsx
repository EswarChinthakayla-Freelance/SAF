import React from 'react'
import { motion } from 'framer-motion'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'

interface AtelierBlueprintProps {
  className?: string
}

/**
 * AtelierBlueprint
 * Architectural drafting blueprint overlay for Sri Anjaneya Furnitures Admin Atelier.
 * Combines 1px precision linework, dimension guides, gold coordinate nodes,
 * and an animated signature gold measurement line (`ACCESS / 01`).
 *
 * Accessibility:
 * - Fully aria-hidden="true" and focusable="false" so screen readers skip decorative linework.
 * - Respects prefers-reduced-motion without drawing delays.
 */
export const AtelierBlueprint: React.FC<AtelierBlueprintProps> = ({ className = '' }) => {
  const prefersReducedMotion = useReducedMotionPreference()

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 select-none overflow-hidden ${className}`}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="goldLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.1" />
            <stop offset="60%" stopColor="#C9A84C" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#E8B84B" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="blueprintFadeH" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F5F0E8" stopOpacity="0.02" />
            <stop offset="40%" stopColor="#F5F0E8" stopOpacity="0.15" />
            <stop offset="90%" stopColor="#F5F0E8" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#F5F0E8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="blueprintFadeV" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5F0E8" stopOpacity="0" />
            <stop offset="20%" stopColor="#F5F0E8" stopOpacity="0.12" />
            <stop offset="80%" stopColor="#F5F0E8" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#F5F0E8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Architectural Drafting Grid Lines */}
        {/* Horizontal construction baselines */}
        <line x1="60" y1="120" x2="820" y2="120" stroke="url(#blueprintFadeH)" strokeWidth="1" strokeDasharray="4 6" />
        <line x1="60" y1="380" x2="860" y2="380" stroke="url(#blueprintFadeH)" strokeWidth="1" />
        <line x1="60" y1="620" x2="800" y2="620" stroke="url(#blueprintFadeH)" strokeWidth="1" strokeDasharray="3 5" />
        <line x1="120" y1="710" x2="750" y2="710" stroke="url(#blueprintFadeH)" strokeWidth="1" />

        {/* Vertical alignment guides */}
        <line x1="160" y1="80" x2="160" y2="720" stroke="url(#blueprintFadeV)" strokeWidth="1" strokeDasharray="2 6" />
        <line x1="420" y1="60" x2="420" y2="740" stroke="url(#blueprintFadeV)" strokeWidth="1" />
        <line x1="680" y1="80" x2="680" y2="720" stroke="url(#blueprintFadeV)" strokeWidth="1" strokeDasharray="3 7" />

        {/* Diagonal drafting datum */}
        <line x1="200" y1="200" x2="520" y2="520" stroke="#F5F0E8" strokeOpacity="0.04" strokeWidth="1" strokeDasharray="6 8" />
        <line x1="380" y1="200" x2="700" y2="520" stroke="#F5F0E8" strokeOpacity="0.03" strokeWidth="1" />

        {/* 2. Precision Crosshairs & Node Circles */}
        <g stroke="#C9A84C" strokeOpacity="0.35" strokeWidth="1">
          {/* Node 1: Top left anchor */}
          <circle cx="160" cy="120" r="3.5" fill="none" />
          <circle cx="160" cy="120" r="1" fill="#C9A84C" />
          <line x1="152" y1="120" x2="168" y2="120" strokeOpacity="0.25" />
          <line x1="160" y1="112" x2="160" y2="128" strokeOpacity="0.25" />

          {/* Node 2: Center joinery datum */}
          <circle cx="420" cy="380" r="4.5" fill="none" strokeDasharray="2 2" />
          <circle cx="420" cy="380" r="1.5" fill="#E8B84B" />
          <line x1="410" y1="380" x2="430" y2="380" strokeOpacity="0.4" />
          <line x1="420" y1="370" x2="420" y2="390" strokeOpacity="0.4" />

          {/* Node 3: Ground contact line */}
          <circle cx="680" cy="620" r="3" fill="none" />
          <circle cx="680" cy="620" r="1" fill="#C9A84C" />
        </g>

        {/* 3. Dimension Ticks & Arc Indicators */}
        <path
          d="M 420 340 A 40 40 0 0 1 460 380"
          stroke="#C9A84C"
          strokeOpacity="0.22"
          strokeWidth="1"
          strokeDasharray="2 3"
          fill="none"
        />
        <text x="466" y="365" fill="#C9A84C" fillOpacity="0.45" fontSize="8" fontFamily="sans-serif" letterSpacing="0.1em">
          R40°
        </text>

        {/* 4. Signature Gold Measurement Line (Points toward specification panel) */}
        {prefersReducedMotion ? (
          <g>
            <line
              x1="280"
              y1="480"
              x2="780"
              y2="480"
              stroke="url(#goldLineGrad)"
              strokeWidth="1.5"
            />
            <circle cx="280" cy="480" r="2.5" fill="#E8B84B" />
            <circle cx="780" cy="480" r="3.5" fill="#C9A84C" fillOpacity="0.3" stroke="#E8B84B" strokeWidth="1" />
            <text
              x="730"
              y="472"
              fill="#E8B84B"
              fillOpacity="0.85"
              fontSize="9"
              fontFamily="sans-serif"
              letterSpacing="0.16em"
              fontWeight="600"
            >
              ACCESS / 01
            </text>
          </g>
        ) : (
          <g>
            <motion.line
              x1="280"
              y1="480"
              x2="780"
              y2="480"
              stroke="url(#goldLineGrad)"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            />
            <motion.circle
              cx="280"
              cy="480"
              r="2.5"
              fill="#E8B84B"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
            <motion.circle
              cx="780"
              cy="480"
              r="3.5"
              fill="#C9A84C"
              fillOpacity="0.3"
              stroke="#E8B84B"
              strokeWidth="1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            />
            <motion.text
              x="730"
              y="472"
              fill="#E8B84B"
              fillOpacity="0.85"
              fontSize="9"
              fontFamily="sans-serif"
              letterSpacing="0.16em"
              fontWeight="600"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.75 }}
            >
              ACCESS / 01
            </motion.text>
          </g>
        )}

        {/* 5. Material & Form Annotation Labels (Decorative) */}
        <g fill="#9B958B" fillOpacity="0.45" fontSize="9" fontFamily="sans-serif" letterSpacing="0.16em">
          <text x="160" y="105">01 / FORM</text>
          <text x="425" y="365">02 / CRAFT</text>
          <text x="160" y="605">03 / MATERIAL</text>
          <text x="680" y="605">04 / DETAIL</text>
        </g>
      </svg>
    </div>
  )
}

export default AtelierBlueprint
