/* ============================================= */
/*  RateFlow — About Section                     */
/* ============================================= */

import { Shield, Zap, Globe, Database } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-lg font-bold text-gray-900 mb-6">About RateFlow</h2>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 mb-6">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          RateFlow is a free, open currency converter that uses daily reference exchange rates 
          from central banks and official sources. It is designed for informational purposes — 
          to give you a quick, reliable estimate of how much one currency is worth in another.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Exchange rates are provided by the{' '}
          <a
            href="https://frankfurter.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-600 hover:text-accent-700 underline decoration-accent-200 hover:decoration-accent-400 transition-colors"
          >
            Frankfurter API
          </a>
          , which aggregates data from over 100 central banks. Rates are typically updated once 
          per business day and represent mid-market reference rates — not live trading prices.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FeatureCard
          icon={<Zap className="w-5 h-5 text-accent-600" />}
          title="Instant Conversion"
          description="Convert between 200+ currencies with results calculated instantly from the latest available reference rates."
        />
        <FeatureCard
          icon={<Database className="w-5 h-5 text-accent-600" />}
          title="Conversion History"
          description="Save, search, and export your conversion history. All data stays in your browser for privacy."
        />
        <FeatureCard
          icon={<Globe className="w-5 h-5 text-accent-600" />}
          title="Central Bank Data"
          description="Exchange rates sourced from official central bank publications and blended for accuracy."
        />
        <FeatureCard
          icon={<Shield className="w-5 h-5 text-accent-600" />}
          title="No Account Required"
          description="Free to use with no sign-up, no API keys, and no tracking. Your privacy is respected."
        />
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
