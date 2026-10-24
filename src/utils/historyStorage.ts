/* ============================================= */
/*  RateFlow — History Storage (localStorage)    */
/* ============================================= */

import type { ConversionRecord } from '../types';

const STORAGE_KEY = 'rateflow_conversion_history';

/**
 * Load conversion history from localStorage.
 * Validates the stored JSON and returns an empty array on corruption.
 */
export function loadHistory(): ConversionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Basic shape validation
    return parsed.filter(
      (r: unknown): r is ConversionRecord =>
        typeof r === 'object' &&
        r !== null &&
        typeof (r as ConversionRecord).id === 'string' &&
        typeof (r as ConversionRecord).timestamp === 'number' &&
        typeof (r as ConversionRecord).sourceAmount === 'number' &&
        typeof (r as ConversionRecord).sourceCurrency === 'string' &&
        typeof (r as ConversionRecord).destinationCurrency === 'string' &&
        typeof (r as ConversionRecord).exchangeRate === 'number' &&
        typeof (r as ConversionRecord).destinationAmount === 'number'
    );
  } catch {
    return [];
  }
}

/**
 * Save conversion history to localStorage.
 */
export function saveHistory(records: ConversionRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // localStorage full or disabled — silently fail
    console.warn('RateFlow: Unable to save history to localStorage');
  }
}

/**
 * Add a conversion record to history.
 * Returns the updated list (newest first).
 */
export function addRecord(record: ConversionRecord): ConversionRecord[] {
  const history = loadHistory();
  history.unshift(record);
  saveHistory(history);
  return history;
}

/**
 * Delete a single record by ID.
 */
export function deleteRecord(id: string): ConversionRecord[] {
  const history = loadHistory().filter((r) => r.id !== id);
  saveHistory(history);
  return history;
}

/**
 * Clear all conversion history.
 */
export function clearHistory(): ConversionRecord[] {
  saveHistory([]);
  return [];
}

/**
 * Generate a unique record ID.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
