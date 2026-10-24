/* ============================================= */
/*  RateFlow — Type Definitions                  */
/* ============================================= */

/** A currency as returned by the Frankfurter API */
export interface Currency {
  iso_code: string;
  iso_numeric: string | null;
  name: string;
  symbol: string | null;
  start_date: string;
  end_date: string;
}

/** A resolved exchange-rate pair */
export interface ExchangeRate {
  base: string;
  quote: string;
  rate: number;
  date: string;
  provider: string;
  fetchedAt: number; // unix ms
}

/** Cached rates response from /v2/rates */
export interface RatesResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

/** A single conversion-history record */
export interface ConversionRecord {
  id: string;
  timestamp: number; // unix ms
  sourceAmount: number;
  sourceCurrency: string;
  destinationCurrency: string;
  exchangeRate: number;
  destinationAmount: number;
  rateDate: string;
  provider: string;
  isStale: boolean;
}

/** UI state for the converter */
export interface ConverterState {
  sourceAmount: string;
  sourceCurrency: string;
  destinationCurrency: string;
}
