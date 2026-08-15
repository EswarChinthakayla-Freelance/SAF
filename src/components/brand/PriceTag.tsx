import React from 'react'
import { formatCurrency } from '@/utils/formatCurrency'

export interface PriceTagProps {
  price: number
  comparePrice?: number | null
  currency?: string
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export const PriceTag: React.FC<PriceTagProps> = ({
  price,
  comparePrice,
  currency = 'INR',
  size = 'default',
  className = '',
}) => {
  const currentSizeClasses = {
    sm: 'text-sm font-semibold',
    default: 'text-lg font-bold',
    lg: 'text-2xl sm:text-3xl font-bold',
  }[size]

  const compareSizeClasses = {
    sm: 'text-xs',
    default: 'text-xs sm:text-sm',
    lg: 'text-sm sm:text-base',
  }[size]

  const hasDiscount = comparePrice !== null && comparePrice !== undefined && comparePrice > price

  return (
    <div className={`inline-flex items-baseline gap-2.5 ${className}`}>
      <span className={`font-serif text-[#C9A84C] tracking-tight ${currentSizeClasses}`}>
        {formatCurrency(price, currency)}
      </span>
      {hasDiscount && (
        <span className={`font-sans text-[#9B958B] line-through font-normal ${compareSizeClasses}`}>
          {formatCurrency(comparePrice, currency)}
        </span>
      )}
    </div>
  )
}
