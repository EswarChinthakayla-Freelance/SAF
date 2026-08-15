/**
 * Formats monetary amounts using Intl.NumberFormat for Indian Rupee or specified currency
 */
export function formatCurrency(amount: number | null | undefined, currency: string = 'INR'): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0'
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
