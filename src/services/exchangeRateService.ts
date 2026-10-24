/* ============================================= */
/*  RateFlow — Exchange Rate Service             */
/*  Isolates all API logic from UI components.   */
/*  Provider-agnostic: swap the implementation   */
/*  here to integrate a different data source.   */
/* ============================================= */

import type { Currency, ExchangeRate, RatesResponse } from '../types';

const API_BASE = 'https://api.frankfurter.dev/v2';
const PROVIDER_NAME = 'Frankfurter (blended)';

// In-memory rate cache: key = "BASE/QUOTE", value = ExchangeRate
const rateCache = new Map<string, ExchangeRate>();
// In-memory multi-rate cache: key = "BASE", value = { rates, fetchedAt }
const multiRateCache = new Map<string, { data: RatesResponse; fetchedAt: number }>();

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const REQUEST_TIMEOUT_MS = 12_000;

// ─── Helpers ──────────────────────────────────

function cacheKey(base: string, quote: string): string {
  return `${base.toUpperCase()}/${quote.toUpperCase()}`;
}

function isFresh(fetchedAt: number): boolean {
  return Date.now() - fetchedAt < CACHE_TTL_MS;
}

async function fetchJSON<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(
        (body as { message?: string }).message ||
          `HTTP ${res.status}: ${res.statusText}`
      );
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

import { FALLBACK_CURRENCIES } from '../data/fallbackCurrencies';

// ─── Public API ───────────────────────────────

/** Fetch the list of supported currencies. Falls back to built-in list on network failure. */
export async function fetchCurrencies(): Promise<Currency[]> {
  try {
    const list = await fetchJSON<Currency[]>(`${API_BASE}/currencies`);
    return Array.isArray(list) && list.length > 0 ? list : FALLBACK_CURRENCIES;
  } catch (err) {
    console.warn('Using fallback currencies due to fetch failure:', err);
    return FALLBACK_CURRENCIES;
  }
}

/**
 * Fetch the exchange rate for a single pair.
 * Returns a cached value when still fresh.
 * On network failure, returns a stale cached rate if available.
 */
export async function fetchRate(
  base: string,
  quote: string
): Promise<ExchangeRate> {
  const key = cacheKey(base, quote);

  // Return fresh cache immediately
  const cached = rateCache.get(key);
  if (cached && isFresh(cached.fetchedAt)) {
    return cached;
  }

  try {
    const data = await fetchJSON<{ base: string; quote: string; rate: number; date: string }>(
      `${API_BASE}/rate/${base.toLowerCase()}/${quote.toLowerCase()}`
    );

    const result: ExchangeRate = {
      base: data.base.toUpperCase(),
      quote: data.quote.toUpperCase(),
      rate: data.rate,
      date: data.date,
      provider: PROVIDER_NAME,
      fetchedAt: Date.now(),
    };

    rateCache.set(key, result);
    return result;
  } catch (err) {
    // On failure, return stale cache if available
    if (cached) {
      return { ...cached }; // caller should check fetchedAt to detect staleness
    }
    throw err;
  }
}

/**
 * Fetch rates for the given base against multiple quote currencies.
 * Used for the "Popular Currencies" panel.
 */
export async function fetchRates(
  base: string,
  quotes: string[]
): Promise<RatesResponse> {
  const key = base.toUpperCase();
  const cached = multiRateCache.get(key);
  if (cached && isFresh(cached.fetchedAt)) {
    return cached.data;
  }

  try {
    const quotesParam = quotes.map((q) => q.toLowerCase()).join(',');
    const data = await fetchJSON<{ base: string; date: string; rates: Record<string, number> }>(
      `${API_BASE}/rates?base=${base.toLowerCase()}&quotes=${quotesParam}`
    );

    // Normalize keys to uppercase
    const normalizedRates: Record<string, number> = {};
    for (const [k, v] of Object.entries(data.rates)) {
      normalizedRates[k.toUpperCase()] = v;
    }

    const result: RatesResponse = {
      base: data.base.toUpperCase(),
      date: data.date,
      rates: normalizedRates,
    };

    multiRateCache.set(key, { data: result, fetchedAt: Date.now() });
    return result;
  } catch (err) {
    if (cached) {
      return cached.data;
    }
    throw err;
  }
}

/** Check whether a cached rate is stale */
export function isRateStale(rate: ExchangeRate): boolean {
  return !isFresh(rate.fetchedAt);
}

/** Clear the entire rate cache (useful for testing) */
export function clearRateCache(): void {
  rateCache.clear();
  multiRateCache.clear();
}
