/* ============================================= */
/*  RateFlow — Conversion History                */
/* ============================================= */

import { useState, useMemo } from 'react';
import {
  History,
  Search,
  Download,
  Trash2,
  RotateCcw,
  Eye,
  X,
  AlertTriangle,
  Clock,
  FileText,
  Filter,
} from 'lucide-react';
import type { ConversionRecord } from '../types';
import { formatTimestamp, formatRate, formatNumber } from '../utils/currencyFormatter';
import { downloadCSV } from '../utils/csvExporter';

interface ConversionHistoryProps {
  records: ConversionRecord[];
  onDelete: (id: string) => void;
  onClear: () => void;
  onConvertAgain: (record: ConversionRecord) => void;
}

export default function ConversionHistory({
  records,
  onDelete,
  onClear,
  onConvertAgain,
}: ConversionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCurrency, setFilterCurrency] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [detailRecord, setDetailRecord] = useState<ConversionRecord | null>(null);

  // Get unique currencies from records
  const uniqueCurrencies = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      set.add(r.sourceCurrency);
      set.add(r.destinationCurrency);
    });
    return Array.from(set).sort();
  }, [records]);

  // Filtered & searched records
  const filtered = useMemo(() => {
    let result = records;

    if (searchQuery.trim()) {
      const q = searchQuery.toUpperCase();
      result = result.filter(
        (r) =>
          r.sourceCurrency.includes(q) ||
          r.destinationCurrency.includes(q)
      );
    }

    if (filterCurrency) {
      result = result.filter(
        (r) =>
          r.sourceCurrency === filterCurrency ||
          r.destinationCurrency === filterCurrency
      );
    }

    return result;
  }, [records, searchQuery, filterCurrency]);

  const handleExport = () => {
    if (filtered.length > 0) downloadCSV(filtered);
  };

  const handleClear = () => {
    onClear();
    setShowClearConfirm(false);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-accent-600" />
          <h2 className="text-lg font-bold text-gray-900">Conversion History</h2>
          {records.length > 0 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
              {records.length}
            </span>
          )}
        </div>

        {records.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              title="Export as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              title="Clear all history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Empty state */}
      {records.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-sm font-semibold text-gray-600 mb-1">No conversions saved yet</h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Convert a currency pair above and click "Save Conversion" to start building your history.
            Records are stored in this browser only and are not synchronised across devices.
          </p>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by currency code…"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 outline-none transition-colors bg-white"
                aria-label="Search conversion history"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterCurrency}
                onChange={(e) => setFilterCurrency(e.target.value)}
                className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 outline-none appearance-none cursor-pointer"
                aria-label="Filter by currency"
              >
                <option value="">All Currencies</option>
                {uniqueCurrencies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Conversion</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Exchange Rate</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Result</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs">{formatTimestamp(r.timestamp)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900">
                        {formatNumber(r.sourceAmount)} {r.sourceCurrency}
                      </span>
                      <span className="text-gray-400 mx-1.5">→</span>
                      <span className="text-gray-600">{r.destinationCurrency}</span>
                      {r.isStale && (
                        <span title="Rate was stale"><AlertTriangle className="w-3 h-3 text-amber-500 inline ml-1" /></span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {formatRate(r.exchangeRate)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      {formatNumber(r.destinationAmount)} {r.destinationCurrency}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setDetailRecord(r)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-accent-600 hover:bg-accent-50 transition-colors"
                          title="View details"
                          aria-label="View conversion details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onConvertAgain(r)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-accent-600 hover:bg-accent-50 transition-colors"
                          title="Convert again"
                          aria-label="Convert again with same values"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(r.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                          aria-label="Delete conversion record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                No records match your search.
              </div>
            )}
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">{formatTimestamp(r.timestamp)}</span>
                  </div>
                  {r.isStale && (
                    <span className="text-xs text-amber-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Stale
                    </span>
                  )}
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-900">
                    {formatNumber(r.sourceAmount)} {r.sourceCurrency}
                  </span>
                  <span className="text-gray-400 mx-1.5">→</span>
                  <span className="font-semibold text-accent-700">
                    {formatNumber(r.destinationAmount)} {r.destinationCurrency}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Rate: {formatRate(r.exchangeRate)}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDetailRecord(r)}
                    className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onConvertAgain(r)}
                    className="flex-1 px-3 py-1.5 text-xs font-medium text-accent-600 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors"
                  >
                    Convert Again
                  </button>
                  <button
                    onClick={() => onDelete(r.id)}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-6 text-gray-400 text-sm">
                No records match your search.
              </div>
            )}
          </div>

          {/* Browser-only notice */}
          <p className="text-xs text-gray-400 mt-4 text-center">
            History is saved in this browser only and is not synchronised across devices.
          </p>
        </>
      )}

      {/* Clear confirmation modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 glass-overlay z-[60] flex items-center justify-center p-4" onClick={() => setShowClearConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Clear All History</h3>
                <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete all {records.length} conversion records?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClear}
                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {detailRecord && (
        <div className="fixed inset-0 glass-overlay z-[60] flex items-center justify-center p-4" onClick={() => setDetailRecord(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Conversion Details</h3>
              <button
                onClick={() => setDetailRecord(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <DetailRow label="Date & Time" value={formatTimestamp(detailRecord.timestamp)} />
              <DetailRow label="Source Amount" value={`${formatNumber(detailRecord.sourceAmount)} ${detailRecord.sourceCurrency}`} />
              <DetailRow label="Destination Amount" value={`${formatNumber(detailRecord.destinationAmount)} ${detailRecord.destinationCurrency}`} />
              <DetailRow label="Exchange Rate" value={`1 ${detailRecord.sourceCurrency} = ${formatRate(detailRecord.exchangeRate)} ${detailRecord.destinationCurrency}`} />
              <DetailRow label="Rate Date" value={detailRecord.rateDate} />
              <DetailRow label="Provider" value={detailRecord.provider} />
              <DetailRow label="Rate Status" value={detailRecord.isStale ? '⚠️ Stale (cached)' : '✓ Fresh'} />
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => { onConvertAgain(detailRecord); setDetailRecord(null); }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-accent-700 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Convert Again
              </button>
              <button
                onClick={() => setDetailRecord(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-gray-500 text-xs">{label}</span>
      <span className="font-medium text-gray-900 text-right ml-4">{value}</span>
    </div>
  );
}
