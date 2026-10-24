/* ============================================= */
/*  RateFlow — Fallback Currencies Data          */
/*  Ensures dropdown is never empty/stalled even */
/*  if offline, slow, or blocked by network/CORS */
/* ============================================= */

import type { Currency } from '../types';

export const FALLBACK_CURRENCIES: Currency[] = [
  { iso_code: 'USD', iso_numeric: '840', name: 'United States Dollar', symbol: '$', start_date: '1948-06-21', end_date: '2026-10-25' },
  { iso_code: 'EUR', iso_numeric: '978', name: 'Euro', symbol: '€', start_date: '1999-01-01', end_date: '2026-10-25' },
  { iso_code: 'INR', iso_numeric: '356', name: 'Indian Rupee', symbol: '₹', start_date: '1998-07-07', end_date: '2026-10-25' },
  { iso_code: 'GBP', iso_numeric: '826', name: 'British Pound Sterling', symbol: '£', start_date: '1970-01-01', end_date: '2026-10-25' },
  { iso_code: 'JPY', iso_numeric: '392', name: 'Japanese Yen', symbol: '¥', start_date: '1970-01-01', end_date: '2026-10-25' },
  { iso_code: 'AUD', iso_numeric: '036', name: 'Australian Dollar', symbol: 'A$', start_date: '1970-01-01', end_date: '2026-10-25' },
  { iso_code: 'CAD', iso_numeric: '124', name: 'Canadian Dollar', symbol: 'C$', start_date: '1970-01-01', end_date: '2026-10-25' },
  { iso_code: 'CHF', iso_numeric: '756', name: 'Swiss Franc', symbol: 'CHF', start_date: '1970-01-01', end_date: '2026-10-25' },
  { iso_code: 'CNY', iso_numeric: '156', name: 'Chinese Yuan', symbol: '¥', start_date: '1981-01-02', end_date: '2026-10-25' },
  { iso_code: 'SGD', iso_numeric: '702', name: 'Singapore Dollar', symbol: 'S$', start_date: '1981-01-02', end_date: '2026-10-25' },
  { iso_code: 'AED', iso_numeric: '784', name: 'United Arab Emirates Dirham', symbol: 'د.إ', start_date: '1996-04-11', end_date: '2026-10-25' },
  { iso_code: 'NZD', iso_numeric: '554', name: 'New Zealand Dollar', symbol: 'NZ$', start_date: '1970-01-01', end_date: '2026-10-25' },
  { iso_code: 'HKD', iso_numeric: '344', name: 'Hong Kong Dollar', symbol: 'HK$', start_date: '1981-01-02', end_date: '2026-10-25' },
  { iso_code: 'SEK', iso_numeric: '752', name: 'Swedish Krona', symbol: 'kr', start_date: '1949-12-21', end_date: '2026-10-25' },
  { iso_code: 'KRW', iso_numeric: '410', name: 'South Korean Won', symbol: '₩', start_date: '1981-01-02', end_date: '2026-10-25' },
  { iso_code: 'BRL', iso_numeric: '986', name: 'Brazilian Real', symbol: 'R$', start_date: '1994-07-01', end_date: '2026-10-25' },
  { iso_code: 'MXN', iso_numeric: '484', name: 'Mexican Peso', symbol: '$', start_date: '1993-01-01', end_date: '2026-10-25' },
  { iso_code: 'ZAR', iso_numeric: '710', name: 'South African Rand', symbol: 'R', start_date: '1980-01-02', end_date: '2026-10-25' },
  { iso_code: 'NOK', iso_numeric: '578', name: 'Norwegian Krone', symbol: 'kr', start_date: '1970-01-01', end_date: '2026-10-25' },
  { iso_code: 'DKK', iso_numeric: '208', name: 'Danish Krone', symbol: 'kr', start_date: '1970-01-01', end_date: '2026-10-25' },
  { iso_code: 'PLN', iso_numeric: '985', name: 'Polish Zloty', symbol: 'zł', start_date: '1995-01-03', end_date: '2026-10-25' },
  { iso_code: 'THB', iso_numeric: '764', name: 'Thai Baht', symbol: '฿', start_date: '1981-01-02', end_date: '2026-10-25' },
  { iso_code: 'IDR', iso_numeric: '360', name: 'Indonesian Rupiah', symbol: 'Rp', start_date: '1981-01-02', end_date: '2026-10-25' },
  { iso_code: 'MYR', iso_numeric: '458', name: 'Malaysian Ringgit', symbol: 'RM', start_date: '1981-01-02', end_date: '2026-10-25' },
  { iso_code: 'PHP', iso_numeric: '608', name: 'Philippine Peso', symbol: '₱', start_date: '1998-07-07', end_date: '2026-10-23' },
  { iso_code: 'TRY', iso_numeric: '949', name: 'Turkish Lira', symbol: '₺', start_date: '1996-04-16', end_date: '2026-10-25' },
  { iso_code: 'SAR', iso_numeric: '682', name: 'Saudi Riyal', symbol: '﷼', start_date: '1986-06-01', end_date: '2026-10-25' },
  { iso_code: 'ILS', iso_numeric: '376', name: 'Israeli New Shekel', symbol: '₪', start_date: '1998-07-07', end_date: '2026-10-25' },
  { iso_code: 'CZK', iso_numeric: '203', name: 'Czech Koruna', symbol: 'Kč', start_date: '1993-01-01', end_date: '2026-10-25' },
  { iso_code: 'HUF', iso_numeric: '348', name: 'Hungarian Forint', symbol: 'Ft', start_date: '1998-07-07', end_date: '2026-10-25' },
  { iso_code: 'CLP', iso_numeric: '152', name: 'Chilean Peso', symbol: '$', start_date: '1998-07-07', end_date: '2026-10-25' },
  { iso_code: 'PKR', iso_numeric: '586', name: 'Pakistani Rupee', symbol: '₨', start_date: '1998-07-07', end_date: '2026-10-24' },
  { iso_code: 'EGP', iso_numeric: '818', name: 'Egyptian Pound', symbol: 'E£', start_date: '1998-07-07', end_date: '2026-10-25' },
  { iso_code: 'KWD', iso_numeric: '414', name: 'Kuwaiti Dinar', symbol: 'KD', start_date: '1998-07-07', end_date: '2026-10-25' },
  { iso_code: 'QAR', iso_numeric: '634', name: 'Qatari Riyal', symbol: 'QR', start_date: '1998-07-07', end_date: '2026-10-25' },
  { iso_code: 'VND', iso_numeric: '704', name: 'Vietnamese Dong', symbol: '₫', start_date: '1998-07-07', end_date: '2026-10-25' },
];
