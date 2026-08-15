import * as React from 'react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { HugeiconsIcon } from '@hugeicons/react'
import { Calendar03Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'

export interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  clearable?: boolean
}

/**
 * Shared DateRangePicker component using Shadcn Calendar and Popover.
 */
export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date range...',
  className = '',
  disabled = false,
  clearable = true,
}) => {
  const [open, setOpen] = React.useState(false)

  const formattedRange = React.useMemo(() => {
    if (!value?.from) return null
    if (value.to) {
      return `${format(value.from, 'LLL dd, y')} - ${format(value.to, 'LLL dd, y')}`
    }
    return format(value.from, 'LLL dd, y')
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative inline-flex items-center">
        <PopoverTrigger
          disabled={disabled}
          className={cn(
            'flex h-9 w-full min-w-[220px] items-center justify-between gap-2.5 rounded-none border border-[#2A2A2A] bg-[#111111] px-3.5 text-xs text-[#F5F0E8] font-mono transition-colors outline-none cursor-pointer hover:border-[#3A3A3A] focus-visible:border-[#C9A84C] focus-visible:ring-1 focus-visible:ring-[#C9A84C] disabled:cursor-not-allowed disabled:opacity-50',
            !formattedRange && 'text-[#7A746B]',
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <HugeiconsIcon
              icon={Calendar03Icon}
              strokeWidth={1.5}
              className="size-3.5 text-[#C9A84C] shrink-0"
            />
            <span className="truncate">{formattedRange || placeholder}</span>
          </div>
        </PopoverTrigger>

        {clearable && formattedRange && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onChange?.(undefined)
            }}
            aria-label="Clear date range"
            className="absolute right-2.5 p-0.5 text-[#7A746B] hover:text-[#F5F0E8] rounded transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-3" />
          </button>
        )}
      </div>

      <PopoverContent
        align="start"
        className="w-auto p-2 bg-[#111111] border border-[#2A2A2A] text-[#F5F0E8] rounded-none shadow-2xl z-50"
      >
        <Calendar
          mode="range"
          selected={value}
          onSelect={(range) => {
            onChange?.(range)
          }}
          numberOfMonths={2}
          className="rounded-none"
        />
      </PopoverContent>
    </Popover>
  )
}

export default DateRangePicker
