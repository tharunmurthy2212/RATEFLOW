/* ============================================= */
/*  RateFlow — Main Application                  */
/* ============================================= */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Currency, ExchangeRate, ConversionRecord } from './types';
import { fetchCurrencies, fetchRate, fetchRates, isRateStale } from './services/exchangeRateService';
import { convert, reciprocal, isValidAmount } from './utils/conversionCalculator';
import { parseAmount } from './utils/currencyFormatter';
import { loadHistory, addRecord, deleteRecord, clearHistory, generateId } from './utils/historyStorage';

import { FALLBACK_CURRENCIES } from './data/fallbackCurrencies';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CurrencyConverter from './components/CurrencyConverter';
import ExchangeRateSummary from './components/ExchangeRateSummary';
import PopularCurrencies from './components/PopularCurrencies';
import ConversionHistory from './components/ConversionHistory';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';

const POPULAR_CODES = ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'SGD'];

export default function App() {
  // ─── State ────────────────────────────────────
  const [currencies, setCurrencies] = useState<Currency[]>(FALLBACK_CURRENCIES);
  const [currenciesLoading, setCurrenciesLoading] = useState(false);
  const [currenciesError, setCurrenciesError] = useState<string | null>(null);

  const [sourceAmount, setSourceAmount] = useState('100');
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [destinationCurrency, setDestinationCurrency] = useState('INR');

  const [currentRate, setCurrentRate] = useState<ExchangeRate | null>(null);
  const [rateLoading, setRateLoading] = useState(false);
  const [rateError, setRateError] = useState<string | null>(null);

  const [popularRates, setPopularRates] = useState<Record<string, number>>({});
  const [popularLoading, setPopularLoading] = useState(false);

  const [history, setHistory] = useState<ConversionRecord[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [activeSection, setActiveSection] = useState('converter');

  // Refs for section scrolling
  const converterRef = useRef<HTMLDivElement>(null);
  const ratesRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  // ─── Load currencies on mount ─────────────────
  useEffect(() => {
    let cancelled = false;
    setCurrenciesLoading(true);
    fetchCurrencies()
      .then((data) => {
        if (!cancelled) {
          setCurrencies(data);
          setCurrenciesError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setCurrenciesError(err.message);
      })
      .finally(() => {
        if (!cancelled) setCurrenciesLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // ─── Load history on mount ────────────────────
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // ─── Fetch rate when pair changes ─────────────
  useEffect(() => {
    if (sourceCurrency === destinationCurrency) {
      setCurrentRate({
        base: sourceCurrency,
        quote: destinationCurrency,
        rate: 1,
        date: new Date().toISOString().slice(0, 10),
        provider: 'Identity',
        fetchedAt: Date.now(),
      });
      setRateError(null);
      return;
    }

    let cancelled = false;
    setRateLoading(true);
    setRateError(null);

    fetchRate(sourceCurrency, destinationCurrency)
      .then((rate) => {
        if (!cancelled) {
          setCurrentRate(rate);
          setRateError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setRateError(err.message);
          setCurrentRate(null);
        }
      })
      .finally(() => {
        if (!cancelled) setRateLoading(false);
      });

    return () => { cancelled = true; };
  }, [sourceCurrency, destinationCurrency]);

  // ─── Fetch popular rates when source changes ──
  useEffect(() => {
    let cancelled = false;
    const quotes = POPULAR_CODES.filter((c) => c !== sourceCurrency);
    setPopularLoading(true);

    fetchRates(sourceCurrency, quotes)
      .then((data) => {
        if (!cancelled) setPopularRates(data.rates);
      })
      .catch(() => {
        if (!cancelled) setPopularRates({});
      })
      .finally(() => {
        if (!cancelled) setPopularLoading(false);
      });

    return () => { cancelled = true; };
  }, [sourceCurrency]);

  // ─── Computed values ──────────────────────────
  const parsedAmount = parseAmount(sourceAmount);
  const destinationAmount =
    isValidAmount(parsedAmount) && currentRate
      ? convert(parsedAmount, currentRate.rate)
      : null;
  const reciprocalRate = currentRate ? reciprocal(currentRate.rate) : null;
  const rateIsStale = currentRate ? isRateStale(currentRate) : false;

  // ─── Handlers ─────────────────────────────────
  const handleSwap = useCallback(() => {
    setSourceCurrency(destinationCurrency);
    setDestinationCurrency(sourceCurrency);
  }, [sourceCurrency, destinationCurrency]);

  const handleSaveConversion = useCallback(() => {
    if (!currentRate || !isValidAmount(parsedAmount) || destinationAmount === null) return;

    const record: ConversionRecord = {
      id: generateId(),
      timestamp: Date.now(),
      sourceAmount: parsedAmount,
      sourceCurrency,
      destinationCurrency,
      exchangeRate: currentRate.rate,
      destinationAmount,
      rateDate: currentRate.date,
      provider: currentRate.provider,
      isStale: rateIsStale,
    };

    const updated = addRecord(record);
    setHistory(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  }, [currentRate, parsedAmount, destinationAmount, sourceCurrency, destinationCurrency, rateIsStale]);

  const handleDeleteRecord = useCallback((id: string) => {
    setHistory(deleteRecord(id));
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory(clearHistory());
  }, []);

  const handleConvertAgain = useCallback((record: ConversionRecord) => {
    setSourceAmount(record.sourceAmount.toString());
    setSourceCurrency(record.sourceCurrency);
    setDestinationCurrency(record.destinationCurrency);
    // Scroll to converter
    converterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleSelectPopularCurrency = useCallback((code: string) => {
    setDestinationCurrency(code);
    converterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleRetryRate = useCallback(() => {
    // Force re-fetch by toggling a dummy state
    const src = sourceCurrency;
    const dst = destinationCurrency;
    setSourceCurrency('');
    setTimeout(() => {
      setSourceCurrency(src);
      setDestinationCurrency(dst);
    }, 0);
  }, [sourceCurrency, destinationCurrency]);

  const scrollTo = useCallback((section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      converter: converterRef,
      rates: ratesRef,
      history: historyRef,
      about: aboutRef,
    };
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // ─── Intersection observer for active section ─
  useEffect(() => {
    const sections = [
      { id: 'converter', ref: converterRef },
      { id: 'rates', ref: ratesRef },
      { id: 'history', ref: historyRef },
      { id: 'about', ref: aboutRef },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = sections.find((s) => s.ref.current === entry.target);
            if (section) setActiveSection(section.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sections.forEach((s) => {
      if (s.ref.current) observer.observe(s.ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // ─── Render ───────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <Header
        activeSection={activeSection}
        onNavigate={scrollTo}
      />

      <main className="flex-1">
        <HeroSection />

        <div ref={converterRef} id="converter" className="scroll-mt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
            <CurrencyConverter
              currencies={currencies}
              currenciesLoading={currenciesLoading}
              currenciesError={currenciesError}
              sourceAmount={sourceAmount}
              onSourceAmountChange={setSourceAmount}
              sourceCurrency={sourceCurrency}
              onSourceCurrencyChange={setSourceCurrency}
              destinationCurrency={destinationCurrency}
              onDestinationCurrencyChange={setDestinationCurrency}
              onSwap={handleSwap}
              rateLoading={rateLoading}
            />

            <ExchangeRateSummary
              currentRate={currentRate}
              reciprocalRate={reciprocalRate}
              sourceAmount={parsedAmount}
              sourceCurrency={sourceCurrency}
              destinationCurrency={destinationCurrency}
              destinationAmount={destinationAmount}
              rateLoading={rateLoading}
              rateError={rateError}
              rateIsStale={rateIsStale}
              onSave={handleSaveConversion}
              onRetry={handleRetryRate}
              saveSuccess={saveSuccess}
            />
          </div>
        </div>

        <div ref={ratesRef} id="rates" className="scroll-mt-20">
          <PopularCurrencies
            currencies={currencies}
            sourceCurrency={sourceCurrency}
            rates={popularRates}
            loading={popularLoading}
            onSelectCurrency={handleSelectPopularCurrency}
          />
        </div>

        <div ref={historyRef} id="history" className="scroll-mt-20">
          <ConversionHistory
            records={history}
            onDelete={handleDeleteRecord}
            onClear={handleClearHistory}
            onConvertAgain={handleConvertAgain}
          />
        </div>

        <div ref={aboutRef} id="about" className="scroll-mt-20">
          <AboutSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
