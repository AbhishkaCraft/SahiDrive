import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchVehicles, compareVehiclesApi } from '../api';
import DisclaimerBanner from '../components/DisclaimerBanner';
import MetricCard from '../components/MetricCard';
import CostBreakdownChart from '../components/CostBreakdownChart';
import BreakEvenVisualizer from '../components/BreakEvenVisualizer';
import ComparisonTable from '../components/ComparisonTable';

export default function ComparePage({ onOpenAssumptions }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  // Default selection or from URL
  const [vehicleAId, setVehicleAId] = useState(searchParams.get('a') || 'honda-activa-6g');
  const [vehicleBId, setVehicleBId] = useState(searchParams.get('b') || 'ola-s1-pro-gen2');

  // Usage inputs
  const [dailyDistanceKm, setDailyDistanceKm] = useState(30);
  const [monthlyUsageDays, setMonthlyUsageDays] = useState(25);
  const [petrolPrice, setPetrolPrice] = useState(102.0);
  const [electricityTariff, setElectricityTariff] = useState(8.0);

  // Comparison results
  const [compareResult, setCompareResult] = useState(null);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [error, setError] = useState(null);

  // Load vehicles list
  useEffect(() => {
    async function load() {
      try {
        setLoadingVehicles(true);
        const list = await fetchVehicles();
        setVehicles(list);

        // check if url params match existing vehicles
        const paramA = searchParams.get('a');
        const paramB = searchParams.get('b');
        if (paramA && list.some(v => v.id === paramA)) setVehicleAId(paramA);
        if (paramB && list.some(v => v.id === paramB)) setVehicleBId(paramB);
      } catch (err) {
        console.error(err);
        setError('Failed to load vehicle list.');
      } finally {
        setLoadingVehicles(false);
      }
    }
    load();
  }, [searchParams]);

  // Run comparison whenever inputs change
  useEffect(() => {
    if (!vehicleAId || !vehicleBId) return;

    async function runCompare() {
      try {
        setLoadingCompare(true);
        setError(null);
        const data = await compareVehiclesApi({
          vehicle_a_id: vehicleAId,
          vehicle_b_id: vehicleBId,
          daily_distance_km: Number(dailyDistanceKm),
          monthly_usage_days: Number(monthlyUsageDays),
          petrol_price_per_litre: Number(petrolPrice),
          electricity_tariff_per_kwh: Number(electricityTariff),
        });
        setCompareResult(data);
      } catch (err) {
        console.error(err);
        setError('Failed to compute comparison.');
      } finally {
        setLoadingCompare(false);
      }
    }

    runCompare();
  }, [vehicleAId, vehicleBId, dailyDistanceKm, monthlyUsageDays, petrolPrice, electricityTariff]);

  const handleSwapVehicles = () => {
    const temp = vehicleAId;
    setVehicleAId(vehicleBId);
    setVehicleBId(temp);
  };

  const handleSelectPreset = (a, b) => {
    setVehicleAId(a);
    setVehicleBId(b);
    setSearchParams({ a, b });
  };

  const formatRupees = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

  const vehicleA = compareResult?.vehicle_a;
  const vehicleB = compareResult?.vehicle_b;

  return (
    <div className="space-y-8 py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Head-to-Head Comparison
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Compare Petrol vs Electric Two-Wheelers
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Evaluate side-by-side purchase prices, running cost per kilometer, routine maintenance,
          and exact break-even payback timelines based on your riding routine.
        </p>
      </div>

      <DisclaimerBanner onOpenAssumptions={onOpenAssumptions} />

      {/* Preset Matchups */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <span className="text-xs font-semibold text-slate-500 mr-1">Popular Matchups:</span>
        <button
          onClick={() => handleSelectPreset('honda-activa-6g', 'ola-s1-pro-gen2')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            vehicleAId === 'honda-activa-6g' && vehicleBId === 'ola-s1-pro-gen2'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Activa 6G vs Ola S1 Pro
        </button>
        <button
          onClick={() => handleSelectPreset('hero-splendor-plus', 'ola-s1-x-3kwh')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            vehicleAId === 'hero-splendor-plus' && vehicleBId === 'ola-s1-x-3kwh'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Splendor+ vs Ola S1 X
        </button>
        <button
          onClick={() => handleSelectPreset('tvs-jupiter-110', 'tvs-iqube-3-4kwh')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            vehicleAId === 'tvs-jupiter-110' && vehicleBId === 'tvs-iqube-3-4kwh'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Jupiter 110 vs TVS iQube
        </button>
        <button
          onClick={() => handleSelectPreset('honda-shine-125', 'revolt-rv400')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            vehicleAId === 'honda-shine-125' && vehicleBId === 'revolt-rv400'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Shine 125 vs Revolt RV400
        </button>
      </div>

      {/* Vehicle Selection & Commute Parameters Panel */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* Vehicle A Selector */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>Vehicle A:</span>
              <span className="text-blue-600">Primary Model</span>
            </label>
            <select
              value={vehicleAId}
              onChange={(e) => setVehicleAId(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            >
              <optgroup label="Petrol Two-Wheelers">
                {vehicles.filter(v => v.fuel_type === 'petrol').map(v => (
                  <option key={v.id} value={v.id}>
                    ⛽ {v.name} &mdash; ₹{v.on_road_price_est.toLocaleString()}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Electric Two-Wheelers">
                {vehicles.filter(v => v.fuel_type === 'electric').map(v => (
                  <option key={v.id} value={v.id}>
                    ⚡ {v.name} &mdash; ₹{v.on_road_price_est.toLocaleString()}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pt-2 md:pt-6">
            <button
              onClick={handleSwapVehicles}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-300 flex items-center justify-center transition-all hover:rotate-180"
              title="Swap Vehicle A and B"
            >
              🔄
            </button>
          </div>

          {/* Vehicle B Selector */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>Vehicle B:</span>
              <span className="text-emerald-700">Challenger Model</span>
            </label>
            <select
              value={vehicleBId}
              onChange={(e) => setVehicleBId(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            >
              <optgroup label="Electric Two-Wheelers">
                {vehicles.filter(v => v.fuel_type === 'electric').map(v => (
                  <option key={v.id} value={v.id}>
                    ⚡ {v.name} &mdash; ₹{v.on_road_price_est.toLocaleString()}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Petrol Two-Wheelers">
                {vehicles.filter(v => v.fuel_type === 'petrol').map(v => (
                  <option key={v.id} value={v.id}>
                    ⛽ {v.name} &mdash; ₹{v.on_road_price_est.toLocaleString()}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Sliders for Riding Distance & Frequency */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Daily Distance */}
          <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Daily Distance:</span>
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
            <div className="text-[10px] text-slate-400">Total daily round trip</div>
          </div>

          {/* Monthly Days */}
          <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Usage Days / Month:</span>
              <span className="text-blue-700 font-bold">{monthlyUsageDays} days</span>
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
            <div className="text-[10px] text-slate-400">Monthly riding frequency</div>
          </div>

          {/* Petrol Price */}
          <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Petrol Price:</span>
              <span className="text-amber-700 font-bold">₹{petrolPrice} / L</span>
            </div>
            <input
              type="range"
              min="90"
              max="120"
              step="1"
              value={petrolPrice}
              onChange={(e) => setPetrolPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="text-[10px] text-slate-400">State benchmark price</div>
          </div>

          {/* Power Tariff */}
          <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Electricity Tariff:</span>
              <span className="text-emerald-700 font-bold">₹{electricityTariff} / kWh</span>
            </div>
            <input
              type="range"
              min="4"
              max="15"
              step="0.5"
              value={electricityTariff}
              onChange={(e) => setElectricityTariff(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="text-[10px] text-slate-400">Domestic residential rate</div>
          </div>
        </div>
      </div>

      {loadingCompare && (
        <div className="p-12 text-center text-slate-500 font-medium">
          Calculating comparison and break-even timelines...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
          {error}
        </div>
      )}

      {compareResult && vehicleA && vehicleB && (
        <>
          {/* Quick Metrics Head-to-Head Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              icon="💰"
              title="On-Road Price Gap"
              value={formatRupees(Math.abs(vehicleA.on_road_price_est - vehicleB.on_road_price_est))}
              unit=""
              subtitle={`${vehicleA.on_road_price_est < vehicleB.on_road_price_est ? vehicleA.name : vehicleB.name} is cheaper upfront`}
              variant="blue"
            />
            <MetricCard
              icon="⛽"
              title="Running Cost Gap"
              value={`₹${Math.abs(vehicleA.calc.cost_per_km - vehicleB.calc.cost_per_km).toFixed(2)}`}
              unit="/ km"
              subtitle={`${vehicleA.calc.cost_per_km < vehicleB.calc.cost_per_km ? vehicleA.name : vehicleB.name} saves more per km`}
              variant="emerald"
            />
            <MetricCard
              icon="📅"
              title="Monthly Fuel Saving"
              value={formatRupees(Math.abs(vehicleA.calc.monthly_running_cost - vehicleB.calc.monthly_running_cost))}
              unit="/ mo"
              subtitle={`Difference on ${dailyDistanceKm * monthlyUsageDays} km monthly commute`}
              variant="amber"
            />
            <MetricCard
              icon="⏱️"
              title="Payback Horizon"
              value={compareResult.break_even.has_break_even ? `${compareResult.break_even.break_even_months}m` : 'Direct'}
              unit=""
              subtitle={compareResult.break_even.has_break_even ? 'To recover upfront price premium' : 'No crossover required'}
              variant="slate"
            />
          </div>

          {/* Break-Even Visualizer Component */}
          <BreakEvenVisualizer
            breakEvenData={compareResult.break_even}
            vehicleAName={vehicleA.name}
            vehicleBName={vehicleB.name}
          />

          {/* Native CSS Cost Breakdown Chart */}
          <CostBreakdownChart
            horizons={vehicleA.calc.horizons}
            vehicleName={vehicleA.name}
            fuelType={vehicleA.fuel_type}
            secondaryVehicle={vehicleB}
          />

          {/* Detailed Side-by-Side Matrix & Pros/Cons */}
          <ComparisonTable
            tableData={compareResult.comparison_table}
            vehicleA={vehicleA}
            vehicleB={vehicleB}
            prosComparison={compareResult.pros_comparison}
            consComparison={compareResult.cons_comparison}
          />
        </>
      )}
    </div>
  );
}
