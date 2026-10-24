/* ============================================= */
/*  RateFlow — Conversion Calculator             */
/* ============================================= */

/**
 * Calculate the destination amount from a source amount and exchange rate.
 * Uses native number arithmetic — sufficient for display-level precision.
 */
export function convert(sourceAmount: number, rate: number): number {
  if (rate <= 0 || !isFinite(rate)) return 0;
  return sourceAmount * rate;
}

/**
 * Calculate the reciprocal of a rate.
 * Safely handles zero and invalid rates.
 */
export function reciprocal(rate: number): number {
  if (rate <= 0 || !isFinite(rate)) return 0;
  return 1 / rate;
}

/**
 * Validate that a source amount is usable for conversion.
 */
export function isValidAmount(amount: number | null): amount is number {
  return amount !== null && isFinite(amount) && amount >= 0;
}
