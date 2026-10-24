/* ============================================= */
/*  RateFlow — Exchange Rate Summary             */
/* ============================================= */

import { Save, RefreshCw, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type { ExchangeRate } from '../types';
import { formatRate, formatNumber, formatDate } from '../utils/currencyFormatter';

interface ExchangeRateSummaryProps {
  currentRate: ExchangeRate | null;
  reciprocalRate: number | null;
  sourceAmount: number | null;
  sourceCurrency: string;
  destinationCurrency: string;
  destinationAmount: number | null;
  rateLoading: boolean;
  rateError: string | null;
  rateIsStale: boolean;
  onSave: () => void;
  onRetry: () => void;
  saveSuccess: boolean;
}

export default function ExchangeRateSummary({
  currentRate,
  reciprocalRate,
  sourceAmount,
  sourceCurrency,
  destinationCurrency,
  destinationAmount,
  rateLoading,
  rateError,
  rateIsStale,
  onSave,
  onRetry,
  saveSuccess,
}: ExchangeRateSummaryProps) {
  if (rateError && !currentRate) {
    return (
      <div className="mt-4 bg-white rounded-2xl shadow-xl p-6 animate-fade-in">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-700 text-sm">Unable to fetch exchange rate</p>
            <p className="text-gray-500 text-xs mt-1">{rateError}</p>
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (rateLoading && !currentRate) {
    return (
      <div className="mt-4 bg-white rounded-2xl shadow-xl p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-gray-100 rounded-lg w-3/4"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          <div className="h-4 bg-gray-100 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!currentRate || destinationAmount === null || sourceAmount === null) {
    return null;
  }

  const canSave = sourceAmount > 0 && destinationAmount > 0;

  return (
    <div className="mt-4 bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
      <div className="p-6 sm:p-8">
        {/* Main result */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-1">
            {formatNumber(sourceAmount)} {sourceCurrency} =
          </p>
          <p className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            {formatNumber(destinationAmount)} <span className="text-accent-600">{destinationCurrency}</span>
          </p>
        </div>

        {/* Rate details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-0.5">Exchange Rate</p>
            <p className="text-sm font-semibold text-gray-800">
              1 {sourceCurrency} = {formatRate(currentRate.rate)} {destinationCurrency}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-0.5">Reciprocal Rate</p>
            <p className="text-sm font-semibold text-gray-800">
              1 {destinationCurrency} = {reciprocalRate !== null ? formatRate(reciprocalRate) : '—'} {sourceCurrency}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-0.5">Rate Provider</p>
            <p className="text-sm font-semibold text-gray-800">{currentRate.provider}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-0.5">Rate Date</p>
            <p className="text-sm font-semibold text-gray-800">{formatDate(currentRate.date)}</p>
          </div>
        </div>

        {/* Stale warning */}
        {rateIsStale && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              This rate was cached and may be outdated. The latest rate could not be fetched.
            </p>
          </div>
        )}

        {/* Save button */}
        <div className="flex items-center justify-between">
          <button
            onClick={onSave}
            disabled={!canSave || saveSuccess}
            className={`
              inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-200
              ${saveSuccess
                ? 'bg-emerald-500 text-white'
                : canSave
                  ? 'bg-accent-600 text-white hover:bg-accent-700 active:bg-accent-800 shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Conversion
              </>
            )}
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">
          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <p>
            These are indicative mid-market reference rates from central banks and official sources, updated daily. 
            Actual bank, payment provider, or money-transfer rates may differ due to fees, spreads, and markups.
          </p>
        </div>
      </div>
    </div>
  );
}
