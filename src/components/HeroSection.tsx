/* ============================================= */
/*  RateFlow — Hero Section                      */
/* ============================================= */

export default function HeroSection() {
  return (
    <section className="gradient-navy pt-12 pb-24 text-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
          Currency Converter
        </h1>
        <p className="text-base sm:text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
          Convert currencies with the latest available reference exchange rates.
        </p>
      </div>
    </section>
  );
}
