import { format, formatDistanceToNow, parseISO } from 'date-fns'

/**
 * Date formatting helpers for catalog and admin workflows
 */
export function formatDate(dateString: string | null | undefined, pattern: string = 'dd MMM yyyy'): string {
  if (!dateString) return '—'
  try {
    return format(parseISO(dateString), pattern)
  } catch {
    return dateString
  }
}

export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return '—'
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true })
  } catch {
    return dateString
  }
}
