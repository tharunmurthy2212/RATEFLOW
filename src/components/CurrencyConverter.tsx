/* ============================================= */
/*  RateFlow — Currency Converter Panel          */
/* ============================================= */

import { ArrowDownUp, Loader2 } from 'lucide-react';
import type { Currency } from '../types';
import CurrencySelector from './CurrencySelector';

interface CurrencyConverterProps {
  currencies: Currency[];
  currenciesLoading: boolean;
  currenciesError: string | null;
  sourceAmount: string;
  onSourceAmountChange: (val: string) => void;
  sourceCurrency: string;
  onSourceCurrencyChange: (code: string) => void;
  destinationCurrency: string;
  onDestinationCurrencyChange: (code: string) => void;
  onSwap: () => void;
  rateLoading: boolean;
}

export default function CurrencyConverter({
  currencies,
  currenciesLoading,
  currenciesError,
  sourceAmount,
  onSourceAmountChange,
  sourceCurrency,
  onSourceCurrencyChange,
  destinationCurrency,
  onDestinationCurrencyChange,
  onSwap,
  rateLoading,
}: CurrencyConverterProps) {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow empty, digits, decimal point
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      onSourceAmountChange(val);
    }
  };

  if (currenciesError && (!currencies || currencies.length === 0)) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center relative z-20">
        <div className="text-red-500 mb-2 font-semibold">Unable to load currencies</div>
        <p className="text-gray-500 text-sm">{currenciesError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-accent-600 text-white rounded-lg text-sm font-medium hover:bg-accent-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl relative z-20">
      <div className="p-6 sm:p-8">
        {currenciesLoading && (!currencies || currencies.length === 0) ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-accent-500 animate-spin" />
            <span className="ml-3 text-gray-500 text-sm">Loading currencies…</span>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-stretch gap-4">
            {/* FROM panel */}
            <div className="flex-1 space-y-3 relative">
              <label htmlFor="source-amount" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                From
              </label>
              <div className="relative">
                <input
                  id="source-amount"
                  type="text"
                  inputMode="decimal"
                  value={sourceAmount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className="w-full px-4 py-3.5 text-2xl font-bold text-gray-900 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all bg-gray-50/50"
                  aria-label="Amount to convert"
                  autoComplete="off"
                />
                {rateLoading && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-500 animate-spin" />
                )}
              </div>
              <CurrencySelector
                currencies={currencies}
                selected={sourceCurrency}
                onChange={onSourceCurrencyChange}
                label="Source currency"
                id="source-currency"
              />
            </div>

            {/* Swap button */}
            <div className="flex items-center justify-center lg:self-center lg:pt-6">
              <button
                type="button"
                onClick={onSwap}
                className="w-12 h-12 rounded-full bg-accent-500 hover:bg-accent-600 active:bg-accent-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95 cursor-pointer z-10"
                aria-label="Swap currencies"
                title="Swap currencies"
              >
                <ArrowDownUp className="w-5 h-5 lg:rotate-90" />
              </button>
            </div>

            {/* TO panel */}
            <div className="flex-1 space-y-3 relative">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                To
              </label>
              <div className="relative">
                <div className="w-full px-4 py-3.5 text-2xl font-bold text-gray-400 border-2 border-gray-100 rounded-xl bg-gray-50 min-h-[60px] flex items-center">
                  {rateLoading ? (
                    <span className="animate-pulse-gentle">Calculating…</span>
                  ) : (
                    <span className="text-gray-300 select-none">Converted amount</span>
                  )}
                </div>
              </div>
              <CurrencySelector
                currencies={currencies}
                selected={destinationCurrency}
                onChange={onDestinationCurrencyChange}
                label="Destination currency"
                id="destination-currency"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
