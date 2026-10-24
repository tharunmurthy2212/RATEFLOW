/* ============================================= */
/*  RateFlow — Footer                            */
/* ============================================= */

import { ArrowLeftRight } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-white/60 mt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent-600 flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-white/80">
              Rate<span className="text-accent-400">Flow</span>
            </span>
          </div>
          <p className="text-xs text-center sm:text-right">
            © {year} RateFlow. Exchange rates from{' '}
            <a
              href="https://frankfurter.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-400 hover:text-accent-300 transition-colors"
            >
              Frankfurter
            </a>
            . For informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
