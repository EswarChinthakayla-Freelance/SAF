/**
 * Utility to parse and format showroom hours JSONB data into structured readable schedule rows.
 */
export interface ShowroomScheduleRow {
  days: string
  hours: string
}

export function formatShowroomHours(rawHours: unknown): ShowroomScheduleRow[] | null {
  if (!rawHours) return null

  // If it's already a clean string
  if (typeof rawHours === 'string') {
    const trimmed = rawHours.trim()
    if (!trimmed) return null

    // Try parsing if string contains JSON
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed)
        return formatShowroomHours(parsed)
      } catch {
        // Return single row
        return [{ days: 'Opening Hours', hours: trimmed }]
      }
    }

    return [{ days: 'Opening Hours', hours: trimmed }]
  }

  // If it's an array of schedule objects or strings
  if (Array.isArray(rawHours)) {
    const rows: ShowroomScheduleRow[] = []
    for (const item of rawHours) {
      if (typeof item === 'string' && item.trim()) {
        const parts = item.split(/:\s*(.+)/)
        if (parts.length >= 2) {
          rows.push({ days: parts[0].trim(), hours: parts[1].trim() })
        } else {
          rows.push({ days: 'Schedule', hours: item.trim() })
        }
      } else if (typeof item === 'object' && item !== null) {
        const days = (item.days || item.day || item.label || 'Schedule') as string
        const hours = (item.hours || item.time || '') as string
        if (hours) {
          rows.push({ days, hours })
        }
      }
    }
    return rows.length > 0 ? rows : null
  }

  // If it's an object mapping days/keys to hours
  if (typeof rawHours === 'object' && rawHours !== null) {
    const obj = rawHours as Record<string, unknown>
    const rows: ShowroomScheduleRow[] = []

    const keyLabels: Record<string, string> = {
      mon_sat: 'Monday – Saturday',
      mon_fri: 'Monday – Friday',
      monday_saturday: 'Monday – Saturday',
      monday_friday: 'Monday – Friday',
      weekdays: 'Monday – Friday',
      weekends: 'Saturday – Sunday',
      sat: 'Saturday',
      sun: 'Sunday',
      sunday: 'Sunday',
      saturday: 'Saturday',
      holidays: 'Public Holidays',
    }

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string' && value.trim()) {
        const formattedDays = keyLabels[key.toLowerCase()] || key.replace(/_/g, ' ')
        rows.push({ days: formattedDays, hours: value.trim() })
      }
    }

    return rows.length > 0 ? rows : null
  }

  return null
}
