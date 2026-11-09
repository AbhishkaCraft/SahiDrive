import React from 'react';

export default function ComparisonTable({
  tableData,
  vehicleA,
  vehicleB,
  prosComparison,
  consComparison,
}) {
  if (!tableData || !vehicleA || !vehicleB) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-slate-100">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <span>📋</span> Head-to-Head Specification & Expense Matrix
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Objective side-by-side parameter comparison based on common usage inputs
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3.5 px-4 sm:px-6 font-semibold text-slate-500 text-xs uppercase tracking-wider w-1/3">
                Metric / Specification
              </th>
              <th className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 w-1/3">
                <div className="flex items-center gap-1.5">
                  <span>{vehicleA.fuel_type === 'electric' ? '⚡' : '⛽'}</span>
                  <span>{vehicleA.name}</span>
                </div>
              </th>
              <th className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 w-1/3">
                <div className="flex items-center gap-1.5">
                  <span>{vehicleB.fuel_type === 'electric' ? '⚡' : '⛽'}</span>
                  <span>{vehicleB.name}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tableData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-600 text-xs sm:text-sm">
                  {row.metric}
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">
                  <div className="flex items-center justify-between">
                    <span>{row.vehicle_a}</span>
                    {row.advantage === 'vehicle_a' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Better
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">
                  <div className="flex items-center justify-between">
                    <span>{row.vehicle_b}</span>
                    {row.advantage === 'vehicle_b' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Better
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pros & Cons Comparison Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 border-t border-slate-200 bg-slate-50/40">
        {/* Vehicle A Pros & Cons */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <span>{vehicleA.fuel_type === 'electric' ? '⚡' : '⛽'}</span>
            <span>{vehicleA.name} &mdash; Practical Strengths & Trade-offs</span>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2 flex items-center gap-1">
              <span>✅</span> Key Advantages
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {(prosComparison?.[vehicleA.id] || vehicleA.pros || []).map((pro, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2 flex items-center gap-1">
              <span>⚠️</span> Considerations / Trade-offs
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {(consComparison?.[vehicleA.id] || vehicleA.cons || []).map((con, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Vehicle B Pros & Cons */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <span>{vehicleB.fuel_type === 'electric' ? '⚡' : '⛽'}</span>
            <span>{vehicleB.name} &mdash; Practical Strengths & Trade-offs</span>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2 flex items-center gap-1">
              <span>✅</span> Key Advantages
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {(prosComparison?.[vehicleB.id] || vehicleB.pros || []).map((pro, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2 flex items-center gap-1">
              <span>⚠️</span> Considerations / Trade-offs
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {(consComparison?.[vehicleB.id] || vehicleB.cons || []).map((con, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
