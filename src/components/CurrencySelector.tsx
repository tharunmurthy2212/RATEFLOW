/* ============================================= */
/*  RateFlow — Currency Selector                 */
/* ============================================= */

import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, X, Check } from 'lucide-react';
import type { Currency } from '../types';

interface CurrencySelectorProps {
  currencies: Currency[];
  selected: string;
  onChange: (code: string) => void;
  disabled?: boolean;
  label: string;
  id: string;
}

const QUICK_CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'SGD'];

export default function CurrencySelector({
  currencies,
  selected,
  onChange,
  disabled,
  label,
  id,
}: CurrencySelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const safeCurrencies = useMemo(() => {
    return Array.isArray(currencies) && currencies.length > 0 ? currencies : [];
  }, [currencies]);

  const selectedCurrency = useMemo(() => {
    return safeCurrencies.find((c) => c.iso_code === selected);
  }, [safeCurrencies, selected]);

  const filtered = useMemo(() => {
    if (!search.trim()) return safeCurrencies;
    const q = search.trim().toLowerCase();
    return safeCurrencies.filter(
      (c) =>
        c.iso_code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        (c.symbol && c.symbol.toLowerCase().includes(q))
    );
  }, [safeCurrencies, search]);

  // Close on outside click / touch
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    if (open) {
      document.addEventListener('mousedown', handler);
      document.addEventListener('touchstart', handler);
    }
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [open]);

  // Focus search input on open
  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSelect = (code: string) => {
    onChange(code);
    setOpen(false);
    setSearch('');
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      setSearch('');
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${open ? 'z-50' : 'z-10'}`}
      onKeyDown={handleKeyDown}
    >
      <label htmlFor={id} className="sr-only">{label}</label>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`
          flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 w-full text-left
          transition-all duration-200 select-none
          ${open
            ? 'border-accent-500 ring-2 ring-accent-500/20 bg-white shadow-sm'
            : 'border-gray-200 hover:border-gray-300 bg-white'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-lg w-7 text-center font-medium" role="img" aria-label={selectedCurrency?.name || selected}>
          {selectedCurrency?.symbol || '💱'}
        </span>
        <div className="flex-1 min-w-0">
          <span className="font-bold text-gray-900 text-sm tracking-wide">{selected}</span>
          {selectedCurrency && (
            <span className="ml-2 text-gray-500 text-xs truncate hidden sm:inline">
              {selectedCurrency.name}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            open ? 'rotate-180 text-accent-500' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
          role="listbox"
          aria-label={`Select ${label}`}
        >
          {/* Search Bar */}
          <div className="p-2 border-b border-gray-100 bg-gray-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search code, currency, symbol..."
                className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 outline-none transition-colors"
                aria-label="Search currencies"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Currency Chips */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5 text-xs">
              <span className="text-gray-400 font-medium px-1 flex-shrink-0">Quick:</span>
              {QUICK_CURRENCIES.map((code) => (
                <button
                  type="button"
                  key={code}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(code);
                  }}
                  onClick={() => handleSelect(code)}
                  className={`px-2 py-0.5 rounded font-semibold text-xs transition-colors flex-shrink-0 ${
                    selected === code
                      ? 'bg-accent-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Currency List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                No currencies matching &quot;{search}&quot;
              </div>
            ) : (
              filtered.map((c) => {
                const isCurrent = c.iso_code === selected;
                return (
                  <button
                    type="button"
                    key={c.iso_code}
                    role="option"
                    aria-selected={isCurrent}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(c.iso_code);
                    }}
                    onClick={() => handleSelect(c.iso_code)}
                    className={`
                      flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors cursor-pointer
                      ${isCurrent
                        ? 'bg-accent-50 text-accent-700 font-semibold'
                        : 'hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    <span className="text-base w-6 text-center flex-shrink-0">
                      {c.symbol || '💱'}
                    </span>
                    <span className="font-bold text-sm w-12 flex-shrink-0 text-gray-900">
                      {c.iso_code}
                    </span>
                    <span className="text-sm text-gray-500 truncate flex-1">
                      {c.name}
                    </span>
                    {isCurrent && (
                      <Check className="w-4 h-4 text-accent-600 flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
