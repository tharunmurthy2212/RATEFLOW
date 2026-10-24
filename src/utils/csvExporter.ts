/* ============================================= */
/*  RateFlow — CSV Exporter                      */
/* ============================================= */

import type { ConversionRecord } from '../types';
import { formatTimestamp } from './currencyFormatter';

const HEADERS = [
  'Date & Time',
  'Source Amount',
  'Source Currency',
  'Destination Currency',
  'Exchange Rate',
  'Destination Amount',
  'Rate Date',
  'Provider',
  'Stale',
];

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Export conversion records to a CSV string.
 */
export function toCSV(records: ConversionRecord[]): string {
  const rows = records.map((r) => [
    escapeCSV(formatTimestamp(r.timestamp)),
    r.sourceAmount.toString(),
    r.sourceCurrency,
    r.destinationCurrency,
    r.exchangeRate.toString(),
    r.destinationAmount.toString(),
    r.rateDate,
    escapeCSV(r.provider),
    r.isStale ? 'Yes' : 'No',
  ]);

  return [HEADERS.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Trigger a CSV file download in the browser.
 */
export function downloadCSV(records: ConversionRecord[]): void {
  const csv = toCSV(records);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `rateflow-history-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
