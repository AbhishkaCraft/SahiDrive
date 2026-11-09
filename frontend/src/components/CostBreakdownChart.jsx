import React, { useState } from 'react';

export default function CostBreakdownChart({
  horizons,
  vehicleName,
  fuelType = 'petrol',
  secondaryVehicle = null, // for comparison mode
}) {
  const [activeYear, setActiveYear] = useState('3_year');

  if (!horizons) return null;

  const currentHorizon = horizons[activeYear] || horizons['3_year'] || horizons['1_year'];
  const secHorizon = secondaryVehicle?.calc?.horizons?.[activeYear];

  const formatRupees = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

  // For stacked calculation
  const totalCost = currentHorizon.total_ownership_cost;
  const purchasePct = Math.max(3, (currentHorizon.purchase_price / totalCost) * 100);
  const runningPct = Math.max(3, (currentHorizon.running_cost_total / totalCost) * 100);
  const maintPct = Math.max(3, (currentHorizon.maintenance_cost_total / totalCost) * 100);

  // For secondary vehicle if present
  let secPurchasePct = 0;
  let secRunningPct = 0;
  let secMaintPct = 0;
  let secTotalCost = 0;
  if (secHorizon) {
    secTotalCost = secHorizon.total_ownership_cost;
    secPurchasePct = Math.max(3, (secHorizon.purchase_price / secTotalCost) * 100);
    secRunningPct = Math.max(3, (secHorizon.running_cost_total / secTotalCost) * 100);
    secMaintPct = Math.max(3, (secHorizon.maintenance_cost_total / secTotalCost) * 100);
  }

  // Max for relative width scaling between the two vehicles
  const maxTotal = secTotalCost ? Math.max(totalCost, secTotalCost) : totalCost;
  const barAWidthPct = (totalCost / maxTotal) * 100;
  const barBWidthPct = secTotalCost ? (secTotalCost / maxTotal) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <span>📊</span> Cumulative Ownership Cost Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Native visual breakdown: Purchase Price + Cumulative Fuel/Power + Maintenance
          </p>
        </div>

        {/* Horizon selector tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200">
          {[
            { id: '1_year', label: '1 Year' },
            { id: '3_year', label: '3 Years' },
            { id: '5_year', label: '5 Years' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveYear(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeYear === tab.id
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <span className="text-slate-400 font-semibold uppercase text-[11px]">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
          <span>On-Road Purchase Price</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
          <span>Petrol Fuel Expense</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
          <span>EV Electricity Expense</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-500 inline-block"></span>
          <span>Routine Servicing</span>
        </div>
      </div>

      {/* Primary Vehicle Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-baseline mb-2">
          <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
            <span>{fuelType === 'electric' ? '⚡' : '⛽'}</span>
            <span>{vehicleName}</span>
          </span>
          <span className="font-extrabold text-base text-slate-900">
            {formatRupees(totalCost)}
          </span>
        </div>

        {/* Stacked Native CSS Bar */}
        <div className="w-full bg-slate-100 rounded-xl overflow-hidden h-9 flex shadow-inner border border-slate-200" style={{ width: `${barAWidthPct}%` }}>
          <div
            style={{ width: `${purchasePct}%` }}
            className="bg-blue-600 h-full flex items-center justify-center text-white text-[11px] font-bold transition-all px-1"
            title={`Purchase Price: ${formatRupees(currentHorizon.purchase_price)}`}
          >
            {purchasePct > 18 ? formatRupees(currentHorizon.purchase_price) : ''}
          </div>
          <div
            style={{ width: `${runningPct}%` }}
            className={`${fuelType === 'electric' ? 'bg-emerald-500' : 'bg-amber-500'} h-full flex items-center justify-center text-white text-[11px] font-bold transition-all px-1`}
            title={`Energy/Fuel: ${formatRupees(currentHorizon.running_cost_total)}`}
          >
            {runningPct > 18 ? formatRupees(currentHorizon.running_cost_total) : ''}
          </div>
          <div
            style={{ width: `${maintPct}%` }}
            className="bg-slate-500 h-full flex items-center justify-center text-white text-[11px] font-bold transition-all px-1"
            title={`Maintenance: ${formatRupees(currentHorizon.maintenance_cost_total)}`}
          >
            {maintPct > 12 ? formatRupees(currentHorizon.maintenance_cost_total) : ''}
          </div>
        </div>
      </div>

      {/* Secondary Vehicle Bar (for comparison) */}
      {secondaryVehicle && secHorizon && (
        <div className="mb-6 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-baseline mb-2">
            <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <span>{secondaryVehicle.fuel_type === 'electric' ? '⚡' : '⛽'}</span>
              <span>{secondaryVehicle.name}</span>
            </span>
            <span className="font-extrabold text-base text-slate-900">
              {formatRupees(secTotalCost)}
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-xl overflow-hidden h-9 flex shadow-inner border border-slate-200" style={{ width: `${barBWidthPct}%` }}>
            <div
              style={{ width: `${secPurchasePct}%` }}
              className="bg-blue-600 h-full flex items-center justify-center text-white text-[11px] font-bold transition-all px-1"
              title={`Purchase Price: ${formatRupees(secHorizon.purchase_price)}`}
            >
              {secPurchasePct > 18 ? formatRupees(secHorizon.purchase_price) : ''}
            </div>
            <div
              style={{ width: `${secRunningPct}%` }}
              className={`${secondaryVehicle.fuel_type === 'electric' ? 'bg-emerald-500' : 'bg-amber-500'} h-full flex items-center justify-center text-white text-[11px] font-bold transition-all px-1`}
              title={`Energy/Fuel: ${formatRupees(secHorizon.running_cost_total)}`}
            >
              {secRunningPct > 18 ? formatRupees(secHorizon.running_cost_total) : ''}
            </div>
            <div
              style={{ width: `${secMaintPct}%` }}
              className="bg-slate-500 h-full flex items-center justify-center text-white text-[11px] font-bold transition-all px-1"
              title={`Maintenance: ${formatRupees(secHorizon.maintenance_cost_total)}`}
            >
              {secMaintPct > 12 ? formatRupees(secHorizon.maintenance_cost_total) : ''}
            </div>
          </div>
        </div>
      )}

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-3 gap-3 pt-3 text-center">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] text-slate-500 font-semibold uppercase">Purchase Price</div>
          <div className="text-sm font-bold text-slate-900 mt-0.5">
            {formatRupees(currentHorizon.purchase_price)}
          </div>
          <div className="text-[10px] text-slate-600 mt-0.5">
            {purchasePct.toFixed(0)}% of total
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] text-slate-500 font-semibold uppercase">Cumulative Running</div>
          <div className={`text-sm font-bold mt-0.5 ${fuelType === 'electric' ? 'text-emerald-700' : 'text-amber-700'}`}>
            {formatRupees(currentHorizon.running_cost_total)}
          </div>
          <div className="text-[10px] text-slate-600 mt-0.5">
            {runningPct.toFixed(0)}% of total
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] text-slate-500 font-semibold uppercase">Routine Servicing</div>
          <div className="text-sm font-bold text-slate-700 mt-0.5">
            {formatRupees(currentHorizon.maintenance_cost_total)}
          </div>
          <div className="text-[10px] text-slate-600 mt-0.5">
            {maintPct.toFixed(0)}% of total
          </div>
        </div>
      </div>
    </div>
  );
}
