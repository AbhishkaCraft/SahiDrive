import React from 'react';

export default function DisclaimerBanner({ onOpenAssumptions }) {
  return (
    <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm text-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
      <div className="flex items-start gap-2.5">
        <span className="text-blue-600 text-lg flex-shrink-0 mt-0.5">ℹ️</span>
        <div className="space-y-0.5">
          <span className="font-semibold text-slate-900">Illustrative Sample Data: </span>
          <span className="text-slate-600">
            Estimates for Indian two-wheelers based on ₹102/L petrol & ₹8/kWh power. Excludes insurance, EMI interest, registration tax variations, and battery replacement.
          </span>
        </div>
      </div>
      {onOpenAssumptions && (
        <button
          onClick={onOpenAssumptions}
          className="flex-shrink-0 font-medium text-blue-700 hover:text-blue-800 underline underline-offset-2 hover:bg-blue-100/50 px-2 py-1 rounded transition-colors text-xs"
        >
          View Assumptions &rarr;
        </button>
      )}
    </div>
  );
}
