import React from 'react';

export default function BreakEvenVisualizer({
  breakEvenData,
  vehicleAName,
  vehicleBName,
}) {
  if (!breakEvenData) return null;

  const {
    has_break_even,
    break_even_months,
    break_even_km,
    cheaper_running_vehicle_id,
    cheaper_upfront_vehicle_id,
    annual_savings_of_running_champ,
    five_year_net_difference,
    verdict,
  } = breakEvenData;

  const formatRupees = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

  // Capped at 60 months (5 years) for the progress bar
  const months = break_even_months ? Math.min(60, Math.max(1, break_even_months)) : 60;
  const progressPct = ((months / 60) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-card">
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <span>⏱️</span> Break-Even & Financial Payback Analysis
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            When does the lower running cost recover the higher purchase price?
          </p>
        </div>
        {has_break_even && break_even_months <= 36 && (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            ⚡ Rapid Payback
          </span>
        )}
      </div>

      {/* Main Verdict Box */}
      <div className={`p-4 rounded-xl border mb-6 ${has_break_even ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0 mt-0.5">{has_break_even ? '🎯' : '⚖️'}</span>
          <div className="space-y-1">
            <h4 className="font-bold text-sm sm:text-base">
              {has_break_even
                ? `Payback in approx ${break_even_months} months (${(break_even_months / 12).toFixed(1)} years)`
                : 'No Crossover / Direct Advantage'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {verdict}
            </p>
          </div>
        </div>
      </div>

      {has_break_even && (
        <div className="space-y-4 mb-6">
          {/* Native CSS Visual Timeline Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
              <span>Day 1 (Purchase)</span>
              <span className="text-emerald-700 font-bold">
                Crossover: Month {break_even_months} ({formatRupees(break_even_km)} km)
              </span>
              <span>Year 5 (Month 60)</span>
            </div>

            <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-200 relative">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all relative flex items-center justify-end pr-2"
                style={{ width: `${progressPct}%` }}
              >
                <span className="text-[10px] text-white font-extrabold">
                  {break_even_months}m
                </span>
              </div>
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Higher initial expense</span>
              <span>Break-even Point</span>
              <span className="text-emerald-600 font-semibold">Net Cumulative Savings</span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <div className="text-[11px] font-semibold uppercase text-slate-500">
                Annual Operational Saving
              </div>
              <div className="text-lg font-bold text-emerald-700 mt-0.5">
                {formatRupees(annual_savings_of_running_champ)}/yr
              </div>
              <div className="text-[10px] text-slate-400">Fuel/energy + routine service</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <div className="text-[11px] font-semibold uppercase text-slate-500">
                Break-Even Distance
              </div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                {break_even_km ? `${Math.round(break_even_km).toLocaleString()} km` : 'N/A'}
              </div>
              <div className="text-[10px] text-slate-400">Cumulative riding needed</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <div className="text-[11px] font-semibold uppercase text-slate-500">
                5-Year Net Difference
              </div>
              <div className="text-lg font-bold text-blue-700 mt-0.5">
                {formatRupees(five_year_net_difference)}
              </div>
              <div className="text-[10px] text-slate-400">Net in pocket after 5 years</div>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimers & Sensitivity Note */}
      <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
        <span className="font-semibold text-slate-700">Usage Sensitivity: </span>
        Break-even depends heavily on monthly distance. If your daily travel increases, the payback period shortens; if daily travel is under 15 km/day, petrol models often remain cheaper overall.
      </div>
    </div>
  );
}
