/* ============================================= */
/*  RateFlow — Currency Formatter Utility        */
/* ============================================= */

/**
 * Format a number as a currency amount using Intl.NumberFormat.
 * Falls back gracefully if the currency code is unknown to the locale.
 */
export function formatCurrencyAmount(
  amount: number,
  currencyCode: string,
  options?: { maximumFractionDigits?: number; minimumFractionDigits?: number }
): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: options?.maximumFractionDigits ?? 2,
      minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    }).format(amount);
  } catch {
    // Unknown currency code — fall back to plain number
    return `${amount.toFixed(options?.maximumFractionDigits ?? 2)} ${currencyCode}`;
  }
}

/**
 * Format a plain number with locale-aware thousand separators.
 */
export function formatNumber(
  value: number,
  decimals = 2
): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format an exchange rate with appropriate precision.
 * Small rates (< 0.01) get more decimal places.
 */
export function formatRate(rate: number): string {
  if (rate === 0) return '0';
  const decimals = rate < 0.01 ? 6 : rate < 1 ? 4 : 4;
  return formatNumber(rate, decimals);
}

/**
 * Validate and parse a numeric input string.
 * Returns null for invalid inputs.
 */
export function parseAmount(input: string): number | null {
  const trimmed = input.trim();
  if (trimmed === '' || trimmed === '.') return null;
  const num = Number(trimmed);
  if (isNaN(num) || num < 0) return null;
  return num;
}

/**
 * Format a date string (YYYY-MM-DD) to a readable format.
 */
export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format a unix timestamp to a readable date-time string.
 */
export function formatTimestamp(ms: number): string {
  const date = new Date(ms);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
