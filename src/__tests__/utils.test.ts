/* ============================================= */
/*  RateFlow — Unit Tests                        */
/* ============================================= */

import { describe, it, expect, beforeEach } from 'vitest';
import { convert, reciprocal, isValidAmount } from '../utils/conversionCalculator';
import { parseAmount, formatRate, formatNumber } from '../utils/currencyFormatter';
import { toCSV } from '../utils/csvExporter';
import type { ConversionRecord } from '../types';

// ─── Conversion Calculator ──────────────────────

describe('conversionCalculator', () => {
  describe('convert', () => {
    it('multiplies source amount by rate', () => {
      expect(convert(10, 80)).toBe(800);
    });

    it('handles zero amount', () => {
      expect(convert(0, 80)).toBe(0);
    });

    it('handles fractional amounts', () => {
      expect(convert(1.5, 80)).toBe(120);
    });

    it('returns 0 for zero rate', () => {
      expect(convert(100, 0)).toBe(0);
    });

    it('returns 0 for negative rate', () => {
      expect(convert(100, -5)).toBe(0);
    });
  });

  describe('reciprocal', () => {
    it('returns the inverse of the rate', () => {
      expect(reciprocal(80)).toBeCloseTo(0.0125, 6);
    });

    it('handles 1-to-1', () => {
      expect(reciprocal(1)).toBe(1);
    });

    it('returns 0 for zero rate', () => {
      expect(reciprocal(0)).toBe(0);
    });

    it('returns 0 for negative rate', () => {
      expect(reciprocal(-5)).toBe(0);
    });
  });

  describe('isValidAmount', () => {
    it('accepts positive numbers', () => {
      expect(isValidAmount(100)).toBe(true);
    });

    it('accepts zero', () => {
      expect(isValidAmount(0)).toBe(true);
    });

    it('rejects null', () => {
      expect(isValidAmount(null)).toBe(false);
    });

    it('rejects NaN', () => {
      expect(isValidAmount(NaN)).toBe(false);
    });

    it('rejects negative numbers', () => {
      expect(isValidAmount(-1)).toBe(false);
    });
  });
});

// ─── Currency Formatter ─────────────────────────

describe('currencyFormatter', () => {
  describe('parseAmount', () => {
    it('parses valid integer', () => {
      expect(parseAmount('100')).toBe(100);
    });

    it('parses valid decimal', () => {
      expect(parseAmount('10.50')).toBe(10.5);
    });

    it('returns null for empty string', () => {
      expect(parseAmount('')).toBe(null);
    });

    it('returns null for negative values', () => {
      expect(parseAmount('-5')).toBe(null);
    });

    it('returns null for non-numeric', () => {
      expect(parseAmount('abc')).toBe(null);
    });

    it('trims whitespace', () => {
      expect(parseAmount('  42  ')).toBe(42);
    });

    it('parses zero', () => {
      expect(parseAmount('0')).toBe(0);
    });
  });

  describe('formatNumber', () => {
    it('formats with thousands separator', () => {
      expect(formatNumber(1234567.89)).toBe('1,234,567.89');
    });

    it('formats zero', () => {
      expect(formatNumber(0)).toBe('0.00');
    });
  });

  describe('formatRate', () => {
    it('formats normal rate', () => {
      const result = formatRate(80.1234);
      expect(result).toContain('80.12');
    });

    it('formats small rate with more decimals', () => {
      const result = formatRate(0.005);
      expect(result.length).toBeGreaterThan(4);
    });
  });
});

// ─── CSV Exporter ───────────────────────────────

describe('csvExporter', () => {
  const mockRecord: ConversionRecord = {
    id: 'test-1',
    timestamp: 1698100000000,
    sourceAmount: 100,
    sourceCurrency: 'USD',
    destinationCurrency: 'INR',
    exchangeRate: 83.5,
    destinationAmount: 8350,
    rateDate: '2023-10-24',
    provider: 'Frankfurter (blended)',
    isStale: false,
  };

  it('generates valid CSV with headers', () => {
    const csv = toCSV([mockRecord]);
    const lines = csv.split('\n');
    expect(lines.length).toBe(2);
    expect(lines[0]).toContain('Date & Time');
    expect(lines[0]).toContain('Source Amount');
  });

  it('includes record data', () => {
    const csv = toCSV([mockRecord]);
    expect(csv).toContain('100');
    expect(csv).toContain('USD');
    expect(csv).toContain('INR');
    expect(csv).toContain('83.5');
    expect(csv).toContain('8350');
  });

  it('handles empty records', () => {
    const csv = toCSV([]);
    const lines = csv.split('\n');
    expect(lines.length).toBe(1); // just headers
  });
});

// ─── History Storage ────────────────────────────

describe('historyStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads empty array from empty storage', async () => {
    const { loadHistory } = await import('../utils/historyStorage');
    expect(loadHistory()).toEqual([]);
  });

  it('saves and loads records', async () => {
    const { loadHistory, addRecord } = await import('../utils/historyStorage');
    const record: ConversionRecord = {
      id: 'test-1',
      timestamp: Date.now(),
      sourceAmount: 100,
      sourceCurrency: 'USD',
      destinationCurrency: 'INR',
      exchangeRate: 83.5,
      destinationAmount: 8350,
      rateDate: '2023-10-24',
      provider: 'Test',
      isStale: false,
    };

    addRecord(record);
    const loaded = loadHistory();
    expect(loaded.length).toBe(1);
    expect(loaded[0].id).toBe('test-1');
  });

  it('deletes records by ID', async () => {
    const { loadHistory, addRecord, deleteRecord } = await import('../utils/historyStorage');
    const record: ConversionRecord = {
      id: 'del-test',
      timestamp: Date.now(),
      sourceAmount: 50,
      sourceCurrency: 'EUR',
      destinationCurrency: 'USD',
      exchangeRate: 1.1,
      destinationAmount: 55,
      rateDate: '2023-10-24',
      provider: 'Test',
      isStale: false,
    };

    addRecord(record);
    deleteRecord('del-test');
    expect(loadHistory().length).toBe(0);
  });

  it('clears all history', async () => {
    const { loadHistory, addRecord, clearHistory } = await import('../utils/historyStorage');
    addRecord({
      id: 'a', timestamp: Date.now(), sourceAmount: 1, sourceCurrency: 'USD',
      destinationCurrency: 'EUR', exchangeRate: 1, destinationAmount: 1,
      rateDate: '2023-01-01', provider: 'T', isStale: false,
    });
    addRecord({
      id: 'b', timestamp: Date.now(), sourceAmount: 2, sourceCurrency: 'GBP',
      destinationCurrency: 'JPY', exchangeRate: 150, destinationAmount: 300,
      rateDate: '2023-01-01', provider: 'T', isStale: false,
    });

    clearHistory();
    expect(loadHistory().length).toBe(0);
  });

  it('recovers from corrupted JSON', async () => {
    const { loadHistory } = await import('../utils/historyStorage');
    localStorage.setItem('rateflow_conversion_history', '{not valid json!!!');
    expect(loadHistory()).toEqual([]);
  });
});
