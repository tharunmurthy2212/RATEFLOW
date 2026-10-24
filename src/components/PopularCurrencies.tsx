/* ============================================= */
/*  RateFlow — Popular Currencies Panel          */
/* ============================================= */

import { TrendingUp, Loader2, ArrowRight } from 'lucide-react';
import type { Currency } from '../types';
import { formatRate } from '../utils/currencyFormatter';

interface PopularCurrenciesProps {
  currencies: Currency[];
  sourceCurrency: string;
  rates: Record<string, number>;
  loading: boolean;
  onSelectCurrency: (code: string) => void;
}

export default function PopularCurrencies({
  currencies,
  sourceCurrency,
  rates,
  loading,
  onSelectCurrency,
}: PopularCurrenciesProps) {
  const entries = Object.entries(rates).filter(([code]) => code !== sourceCurrency);

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-accent-600" />
        <h2 className="text-lg font-bold text-gray-900">Popular Currencies</h2>
        <span className="text-sm text-gray-500 ml-1">vs {sourceCurrency}</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-accent-500 animate-spin" />
          <span className="ml-2 text-gray-500 text-sm">Loading rates…</span>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          No popular currency rates available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {entries.map(([code, rate]) => {
            const currency = currencies.find((c) => c.iso_code === code);
            return (
              <button
                key={code}
                onClick={() => onSelectCurrency(code)}
                className="group bg-white rounded-xl p-4 border border-gray-100 hover:border-accent-200 hover:shadow-md transition-all duration-200 text-left"
                aria-label={`Select ${code} as destination currency`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{currency?.symbol || '💱'}</span>
                    <span className="font-bold text-gray-900 text-sm">{code}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-accent-500 transition-colors" />
                </div>
                <p className="text-xs text-gray-500 truncate mb-1">{currency?.name || code}</p>
                <p className="text-sm font-semibold text-gray-800">
                  1 {sourceCurrency} = {formatRate(rate)}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
