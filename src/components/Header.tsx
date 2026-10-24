/* ============================================= */
/*  RateFlow — Header Component                  */
/* ============================================= */

import { useState } from 'react';
import { ArrowLeftRight, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const NAV_ITEMS = [
  { id: 'converter', label: 'Converter' },
  { id: 'rates', label: 'Exchange Rates' },
  { id: 'history', label: 'Conversion History' },
  { id: 'about', label: 'About' },
];

export default function Header({ activeSection, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="gradient-navy sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNav('converter')}
            className="flex items-center gap-2.5 group"
            aria-label="RateFlow home"
          >
            <div className="w-9 h-9 rounded-xl bg-accent-500 flex items-center justify-center shadow-md group-hover:bg-accent-400 transition-colors">
              <ArrowLeftRight className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Rate<span className="text-accent-400">Flow</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-white/10 animate-slide-down" aria-label="Mobile navigation">
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
