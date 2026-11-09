import React from 'react';

export default function AssumptionsModal({ isOpen, onClose, assumptions }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">
                Calculation Assumptions & Methodology
              </h3>
              <p className="text-xs text-slate-500">
                Transparent benchmarks used across SahiDrive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm text-slate-700">
          {/* Benchmarks Grid */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider text-blue-700">
              1. National Benchmark Baselines
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 font-semibold">Petrol Benchmark</div>
                <div className="text-base font-extrabold text-amber-700 mt-1">₹102.0 / L</div>
                <div className="text-[10px] text-slate-400">Illustrative metro rate</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 font-semibold">Power Tariff</div>
                <div className="text-base font-extrabold text-emerald-700 mt-1">₹8.0 / kWh</div>
                <div className="text-[10px] text-slate-400">Residential slab</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 font-semibold">Default Daily</div>
                <div className="text-base font-extrabold text-blue-700 mt-1">30 km/day</div>
                <div className="text-[10px] text-slate-400">Adjustable in app</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 font-semibold">Monthly Days</div>
                <div className="text-base font-extrabold text-slate-800 mt-1">25 days</div>
                <div className="text-[10px] text-slate-400">Commute basis</div>
              </div>
            </div>
          </div>

          {/* Formulas */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider text-blue-700">
              2. Core Calculation Formulas
            </h4>
            <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono">
              <div>
                <span className="text-slate-500 font-sans block font-semibold mb-0.5">Petrol Running Cost per km:</span>
                <span className="bg-white px-2 py-1 rounded border border-slate-200 inline-block text-slate-800">
                  Cost/km = Petrol Price (₹/L) ÷ Real-World Mileage (km/L)
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-sans block font-semibold mb-0.5">Electric Running Cost per km:</span>
                <span className="bg-white px-2 py-1 rounded border border-slate-200 inline-block text-slate-800">
                  Cost/km = [Battery Capacity (kWh) ÷ Real Range (km)] × Electricity Tariff (₹/kWh)
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-sans block font-semibold mb-0.5">Total Cumulative Ownership Cost (N years):</span>
                <span className="bg-white px-2 py-1 rounded border border-slate-200 inline-block text-slate-800">
                  Total = On-Road Price + (Annual Running × N) + (Annual Maintenance × N)
                </span>
              </div>
            </div>
          </div>

          {/* Inclusions & Disclosures */}
          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
            <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>⚠️</span> Mandatory Disclosures & Excluded Variables
            </h4>
            <ul className="text-xs text-amber-900/80 space-y-1 list-disc pl-4">
              <li>
                <strong>Sample Illustrative Data:</strong> Vehicle prices, ranges, and maintenance rates are indicative models of Indian two-wheelers and not verified live dealer quotes.
              </li>
              <li>
                <strong>Excluded from calculations:</strong> Multi-year insurance renewals, loan financing interest (EMI finance charges), RTO road taxes that vary widely between states, battery replacement costs (most EV batteries have 5-8 year warranties), periodic tyre replacements, and vehicle resale liquidation value.
              </li>
              <li>
                <strong>Neutrality Guarantee:</strong> SahiDrive does not default to electric vehicles. For users without charging access or low monthly travel, petrol two-wheelers are recommended as the economically superior choice.
              </li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            Got it, continue
          </button>
        </div>
      </div>
    </div>
  );
}
