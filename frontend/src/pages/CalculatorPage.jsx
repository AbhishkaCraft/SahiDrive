import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchVehicles, calculateCostsApi } from '../api';
import DisclaimerBanner from '../components/DisclaimerBanner';
import MetricCard from '../components/MetricCard';
import CostBreakdownChart from '../components/CostBreakdownChart';

export default function CalculatorPage({ onOpenAssumptions }) {
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [mode, setMode] = useState('preset'); // 'preset' | 'custom'

  // Presets & parameters
  const [selectedVehicleId, setSelectedVehicleId] = useState('honda-activa-6g');
  const [dailyDistanceKm, setDailyDistanceKm] = useState(
    Number(searchParams.get('daily_km')) || 30
  );
  const [monthlyUsageDays, setMonthlyUsageDays] = useState(25);
  const [petrolPrice, setPetrolPrice] = useState(102.0);
  const [electricityTariff, setElectricityTariff] = useState(8.0);

  // Custom vehicle overrides
  const [customFuelType, setCustomFuelType] = useState('petrol');
  const [customPrice, setCustomPrice] = useState(90000);
  const [customMileage, setCustomMileage] = useState(50);
  const [customBatteryKwh, setCustomBatteryKwh] = useState(3.5);
  const [customRangeKm, setCustomRangeKm] = useState(115);
  const [customMaintenance, setCustomMaintenance] = useState(3200);

  // Calculation results
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load vehicles
  useEffect(() => {
    async function load() {
      try {
        const list = await fetchVehicles();
        setVehicles(list);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  // Compute calculation
  useEffect(() => {
    async function compute() {
      try {
        setLoading(true);
        setError(null);

        const payload = {
          daily_distance_km: Number(dailyDistanceKm),
          monthly_usage_days: Number(monthlyUsageDays),
          petrol_price_per_litre: Number(petrolPrice),
          electricity_tariff_per_kwh: Number(electricityTariff),
        };

        if (mode === 'preset') {
          payload.vehicle_id = selectedVehicleId;
        } else {
          payload.custom_fuel_type = customFuelType;
          payload.custom_price = Number(customPrice);
          payload.custom_annual_maintenance = Number(customMaintenance);
          if (customFuelType === 'petrol') {
            payload.custom_mileage_kmpl = Number(customMileage);
          } else {
            payload.custom_battery_kwh = Number(customBatteryKwh);
            payload.custom_range_km = Number(customRangeKm);
          }
        }

        const data = await calculateCostsApi(payload);
        setResult(data);
      } catch (err) {
        console.error(err);
        setError('Error calculating ownership cost.');
      } finally {
        setLoading(false);
      }
    }

    compute();
  }, [
    mode,
    selectedVehicleId,
    dailyDistanceKm,
    monthlyUsageDays,
    petrolPrice,
    electricityTariff,
    customFuelType,
    customPrice,
    customMileage,
    customBatteryKwh,
    customRangeKm,
    customMaintenance,
  ]);

  const formatRupees = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

  const selectedVehicleObj = vehicles.find((v) => v.id === selectedVehicleId);

  return (
    <div className="space-y-8 py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Ownership Cost Calculator
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Calculate Running & 5-Year Ownership Expenses
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Clearly distinguish between immediate fuel/power running expenses and cumulative multi-year ownership costs (purchase + energy + maintenance).
        </p>
      </div>

      <DisclaimerBanner onOpenAssumptions={onOpenAssumptions} />

      {/* Main Grid: Controls on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Panel (5 columns) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-card space-y-6">
          {/* Preset vs Custom Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setMode('preset')}
              className={`w-1/2 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'preset'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Choose from Catalog
            </button>
            <button
              onClick={() => setMode('custom')}
              className={`w-1/2 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'custom'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Custom Specifications
            </button>
          </div>

          {/* Mode 1: Preset Selection */}
          {mode === 'preset' ? (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select Indian Two-Wheeler:
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              >
                <optgroup label="Petrol Two-Wheelers">
                  {vehicles
                    .filter((v) => v.fuel_type === 'petrol')
                    .map((v) => (
                      <option key={v.id} value={v.id}>
                        ⛽ {v.name} ({v.mileage_kmpl} kmpl) &mdash; ₹
                        {v.on_road_price_est.toLocaleString()}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Electric Two-Wheelers">
                  {vehicles
                    .filter((v) => v.fuel_type === 'electric')
                    .map((v) => (
                      <option key={v.id} value={v.id}>
                        ⚡ {v.name} ({v.range_km} km range) &mdash; ₹
                        {v.on_road_price_est.toLocaleString()}
                      </option>
                    ))}
                </optgroup>
              </select>

              {selectedVehicleObj && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800">
                    {selectedVehicleObj.name}
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                    <span>
                      Est On-Road: {formatRupees(selectedVehicleObj.on_road_price_est)}
                    </span>
                    <span>•</span>
                    <span>
                      {selectedVehicleObj.fuel_type === 'petrol'
                        ? `Mileage: ${selectedVehicleObj.mileage_kmpl} km/L`
                        : `Range: ${selectedVehicleObj.range_km} km`}
                    </span>
                    <span>•</span>
                    <span>
                      Service: {formatRupees(selectedVehicleObj.annual_maintenance_base)}/yr
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Mode 2: Custom Vehicle Inputs */
            <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCustomFuelType('petrol')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                    customFuelType === 'petrol'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  ⛽ Petrol
                </button>
                <button
                  type="button"
                  onClick={() => setCustomFuelType('electric')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                    customFuelType === 'electric'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  ⚡ Electric
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Estimated On-Road Price (₹):
                </label>
                <input
                  type="number"
                  step="5000"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-semibold"
                />
              </div>

              {customFuelType === 'petrol' ? (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Expected Petrol Mileage (km / Litre):
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={customMileage}
                    onChange={(e) => setCustomMileage(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Battery (kWh):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={customBatteryKwh}
                      onChange={(e) => setCustomBatteryKwh(Number(e.target.value))}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Real Range (km):
                    </label>
                    <input
                      type="number"
                      step="5"
                      value={customRangeKm}
                      onChange={(e) => setCustomRangeKm(Number(e.target.value))}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Annual Routine Maintenance (₹/year):
                </label>
                <input
                  type="number"
                  step="200"
                  value={customMaintenance}
                  onChange={(e) => setCustomMaintenance(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-semibold"
                />
              </div>
            </div>
          )}

          {/* Commute Sliders */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            {/* Daily Distance */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Daily Travel Distance:</span>
                <span className="text-blue-700 font-bold">{dailyDistanceKm} km / day</span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={dailyDistanceKm}
                onChange={(e) => setDailyDistanceKm(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>5 km</span>
                <span>30 km (Avg)</span>
                <span>80 km</span>
                <span>150 km</span>
              </div>
            </div>

            {/* Monthly Days */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Monthly Usage Days:</span>
                <span className="text-blue-700 font-bold">{monthlyUsageDays} days / mo</span>
              </div>
              <input
                type="range"
                min="10"
                max="31"
                step="1"
                value={monthlyUsageDays}
                onChange={(e) => setMonthlyUsageDays(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="text-[10px] text-slate-400">
                Monthly distance: {(dailyDistanceKm * monthlyUsageDays).toLocaleString()} km
              </div>
            </div>

            {/* Fuel / Power Price Benchmarks */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-700">
                  Petrol Price:
                </div>
                <div className="text-sm font-extrabold text-amber-700">
                  ₹{petrolPrice} / L
                </div>
                <input
                  type="range"
                  min="90"
                  max="120"
                  step="1"
                  value={petrolPrice}
                  onChange={(e) => setPetrolPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg accent-amber-600"
                />
              </div>

              <div className="space-y-1 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-700">
                  Electricity Tariff:
                </div>
                <div className="text-sm font-extrabold text-emerald-700">
                  ₹{electricityTariff} / kWh
                </div>
                <input
                  type="range"
                  min="4"
                  max="15"
                  step="0.5"
                  value={electricityTariff}
                  onChange={(e) => setElectricityTariff(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg accent-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Results Panel (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
              {error}
            </div>
          )}

          {result && (
            <>
              {/* Essential Distinction Box: Running vs Ownership */}
              <div className="bg-gradient-to-br from-slate-900 to-brand-navy rounded-3xl p-6 text-white shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4 pb-3 border-b border-white/10">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-blue-300 font-bold">
                      Vehicle Profile:
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black mt-0.5 flex items-center gap-2">
                      <span>{result.fuel_type === 'electric' ? '⚡' : '⛽'}</span>
                      <span>{result.vehicle_name}</span>
                    </h2>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 border border-white/20 self-start sm:self-auto">
                    {result.annual_distance_km.toLocaleString()} km / year
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* Immediate Running Cost */}
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Immediate Running Expense
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold mt-1 text-emerald-300">
                      ₹{result.cost_per_km.toFixed(2)}
                      <span className="text-sm font-normal text-slate-300"> / km</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1 font-mono">
                      {result.formula_explanation.running_cost_formula}
                    </div>
                    <div className="text-xs text-white font-bold mt-2 pt-2 border-t border-white/10">
                      ₹{result.monthly_running_cost.toLocaleString()} / month &bull; ₹{result.annual_running_cost.toLocaleString()} / year
                    </div>
                  </div>

                  {/* 5-Year Ownership Total */}
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      5-Year Total Ownership Cost
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold mt-1 text-white">
                      {formatRupees(result.horizons['5_year'].total_ownership_cost)}
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      Includes Purchase ({formatRupees(result.purchase_price)}) + 5-Yr Fuel + 5-Yr Service
                    </div>
                    <div className="text-xs text-blue-200 font-semibold mt-2 pt-2 border-t border-white/10">
                      Running expense share: {result.horizons['5_year'].running_cost_share_pct}% of total
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="font-bold text-white">Key Insight: </span>
                  {result.summary_insight}
                </p>
              </div>

              {/* Native CSS Cost Horizon Stacked Visualizer */}
              <CostBreakdownChart
                horizons={result.horizons}
                vehicleName={result.vehicle_name}
                fuelType={result.fuel_type}
              />

              {/* Multi-Year Table Matrix */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card overflow-x-auto">
                <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-1.5">
                  <span>📅</span> 1-Year, 3-Year, and 5-Year Ownership Table
                </h3>
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase">
                      <th className="py-2.5 pr-4">Horizon</th>
                      <th className="py-2.5 px-3">Cumulative Distance</th>
                      <th className="py-2.5 px-3">Fuel / Power</th>
                      <th className="py-2.5 px-3">Maintenance</th>
                      <th className="py-2.5 pl-3 text-right">Total Ownership</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {[1, 3, 5].map((yr) => {
                      const h = result.horizons[`${yr}_year`];
                      return (
                        <tr key={yr} className="hover:bg-slate-50">
                          <td className="py-3 pr-4 font-bold text-slate-900">
                            {yr} Year{yr > 1 ? 's' : ''}
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            {h.distance_total_km.toLocaleString()} km
                          </td>
                          <td className="py-3 px-3 text-amber-700 font-semibold">
                            {formatRupees(h.running_cost_total)}
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            {formatRupees(h.maintenance_cost_total)}
                          </td>
                          <td className="py-3 pl-3 text-right font-extrabold text-blue-700">
                            {formatRupees(h.total_ownership_cost)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Environmental Carbon Tailpipe Metric */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-start gap-3">
                <span className="text-2xl mt-0.5">🌿</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-emerald-950">
                    Environmental Impact & Direct Emissions
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {result.fuel_type === 'electric' ? (
                      <span>
                        Electric propulsion delivers <strong className="text-emerald-700 font-bold">0 direct tailpipe CO2 emissions</strong>.
                        Over 5 years ({result.horizons['5_year'].distance_total_km.toLocaleString()} km), you prevent approx{' '}
                        <strong className="text-emerald-700 font-bold">
                          {((result.horizons['5_year'].distance_total_km * 54) / 1000).toFixed(0)} kg of urban CO2
                        </strong>{' '}
                        compared to a petrol commuter.
                      </span>
                    ) : (
                      <span>
                        Petrol combustion generates approx{' '}
                        <strong className="text-amber-800 font-bold">
                          {result.horizons['5_year'].co2_tailpipe_kg} kg of direct CO2
                        </strong>{' '}
                        over 5 years based on 54g CO2/km benchmark.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
