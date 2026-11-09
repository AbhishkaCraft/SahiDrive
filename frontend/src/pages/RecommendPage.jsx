import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendVehiclesApi } from '../api';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function RecommendPage({ onOpenAssumptions }) {
  const navigate = useNavigate();

  // Wizard state inputs
  const [budgetMax, setBudgetMax] = useState(130000);
  const [dailyDistanceKm, setDailyDistanceKm] = useState(35);
  const [chargingAccess, setChargingAccess] = useState('home_dedicated_plug');
  const [travelPattern, setTravelPattern] = useState('regular_commute_mixed');
  const [primaryPriority, setPrimaryPriority] = useState('lowest_running_expense');
  const [preferredCategory, setPreferredCategory] = useState('all');

  // Results
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runRecommendation = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await recommendVehiclesApi({
        budget_max: Number(budgetMax),
        daily_distance_km: Number(dailyDistanceKm),
        charging_access: chargingAccess,
        travel_pattern: travelPattern,
        primary_priority: primaryPriority,
        preferred_category: preferredCategory,
      });
      setResults(data);
    } catch (err) {
      console.error(err);
      setError('Failed to compute recommendations.');
    } finally {
      setLoading(false);
    }
  };

  // Run automatically on first load or on filter change
  useEffect(() => {
    runRecommendation();
  }, [budgetMax, dailyDistanceKm, chargingAccess, travelPattern, primaryPriority, preferredCategory]);

  const formatRupees = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-8 py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Intelligent Recommendation Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Find My Ideal Vehicle
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Get objective, rule-based recommendations tailored to your daily distance, charging access in India, budget, and real priorities without automatic EV bias.
        </p>
      </div>

      <DisclaimerBanner onOpenAssumptions={onOpenAssumptions} />

      {/* Main Grid: Filters on Left (5 col), Recommendations on Right (7 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Criteria Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
              <span>🎯</span> Your Commute & Reality Profile
            </h3>
            <span className="text-xs text-blue-600 font-semibold">Live Updating</span>
          </div>

          {/* 1. Maximum Budget */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline text-xs font-semibold text-slate-700">
              <span>Maximum On-Road Budget:</span>
              <span className="text-sm font-extrabold text-blue-700">
                {formatRupees(budgetMax)}
              </span>
            </div>
            <input
              type="range"
              min="75000"
              max="250000"
              step="5000"
              value={budgetMax}
              onChange={(e) => setBudgetMax(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[85000, 100000, 130000, 150000, 200000].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudgetMax(b)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                    budgetMax === b
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ₹{(b / 100000).toFixed(1)}L
                </button>
              ))}
            </div>
          </div>

          {/* 2. Daily Distance */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-baseline text-xs font-semibold text-slate-700">
              <span>Daily Commute Distance:</span>
              <span className="text-sm font-extrabold text-blue-700">
                {dailyDistanceKm} km / day
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={dailyDistanceKm}
              onChange={(e) => setDailyDistanceKm(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="text-[11px] text-slate-400">
              Monthly: {(dailyDistanceKm * 25).toLocaleString()} km &bull; Annual: {(dailyDistanceKm * 25 * 12).toLocaleString()} km
            </div>
          </div>

          {/* 3. Charging Reality in India */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Charging Access at Home / Work:
            </label>
            <div className="space-y-1.5">
              {[
                {
                  id: 'home_dedicated_plug',
                  label: 'Dedicated Home Plug (15A)',
                  desc: 'Private ground floor / garage socket. Charge overnight effortlessly.',
                  icon: '🔌',
                },
                {
                  id: 'apartment_shared_socket',
                  label: 'Apartment Shared Socket',
                  desc: 'Society parking area with access to power outlet or meter.',
                  icon: '🏢',
                },
                {
                  id: 'public_chargers_only',
                  label: 'Public Fast Chargers Only',
                  desc: 'Relying on commercial charging stations nearby.',
                  icon: '⚡',
                },
                {
                  id: 'no_charging_access',
                  label: 'No Dedicated Charging Access',
                  desc: 'Street parking / high-rise apartment without wiring access.',
                  icon: '🚫',
                },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    chargingAccess === opt.id
                      ? 'bg-blue-50/80 border-blue-400 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/60'
                  }`}
                >
                  <input
                    type="radio"
                    name="charging"
                    value={opt.id}
                    checked={chargingAccess === opt.id}
                    onChange={(e) => setChargingAccess(e.target.value)}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Travel Pattern */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Travel Pattern:
            </label>
            <select
              value={travelPattern}
              onChange={(e) => setTravelPattern(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
            >
              <option value="short_city_errands">Short City Errands (&lt; 20 km/day)</option>
              <option value="regular_commute_mixed">Regular City & Mixed Commute (20-60 km/day)</option>
              <option value="highway_long_distance">Highway & Long Distance Touring (&gt; 60 km/day)</option>
            </select>
          </div>

          {/* 5. Primary Priority */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Your Primary Buying Priority:
            </label>
            <select
              value={primaryPriority}
              onChange={(e) => setPrimaryPriority(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
            >
              <option value="lowest_running_expense">Lowest Daily Running Expense (Save Fuel)</option>
              <option value="lowest_upfront_price">Lowest Upfront Purchase Price (Tight Budget)</option>
              <option value="convenience_reliability">Convenience, Trusted Brand & Easy Service</option>
              <option value="green_eco_friendly">Green, Zero Smoke & Eco-Friendly</option>
              <option value="performance_and_features">Performance, Acceleration & Smart Tech</option>
            </select>
          </div>

          {/* 6. Vehicle Type Preference */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Preferred Two-Wheeler Type:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'All Types' },
                { id: 'scooter', label: 'Scooter 🛵' },
                { id: 'motorcycle', label: 'Motorcycle 🏍️' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setPreferredCategory(cat.id)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    preferredCategory === cat.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Recommendations Panel (7 col) */}
        <div className="lg:col-span-7 space-y-6">
          {loading && (
            <div className="p-12 text-center text-slate-500 font-medium bg-white rounded-3xl border border-slate-200">
              Evaluating vehicle dataset against your constraints...
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
              {error}
            </div>
          )}

          {results && (
            <>
              {/* Overarching Takeaway Banner */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 to-brand-navy text-white shadow-xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                    Executive Mobility Assessment
                  </span>
                </div>
                <p className="text-sm sm:text-base font-semibold leading-relaxed text-slate-100">
                  {results.key_takeaway}
                </p>
                <div className="pt-2 border-t border-white/10 text-xs text-slate-300 leading-relaxed">
                  {results.charging_guidance}
                </div>
              </div>

              {/* Recommendations List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                  <span>Top Recommended Matches ({results.recommendations.length})</span>
                  <span>Sorted by Compatibility Score</span>
                </div>

                {results.recommendations.slice(0, 5).map((rec, idx) => {
                  const veh = rec.vehicle;
                  const isTop = idx === 0;

                  return (
                    <div
                      key={veh.id}
                      className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-all ${
                        isTop ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 mb-4 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              {rec.badge}
                            </span>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {veh.category.toUpperCase()}
                            </span>
                            <span className="text-xs font-bold text-slate-400">
                              Rank #{idx + 1}
                            </span>
                          </div>

                          <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                            <span>{veh.fuel_type === 'electric' ? '⚡' : '⛽'}</span>
                            <span>{veh.name}</span>
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">{veh.best_suited_for}</p>
                        </div>

                        {/* Match Score Badge */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl border sm:border-0 border-slate-100">
                          <div className="text-xs text-slate-500 font-semibold sm:text-right">
                            Match Score:
                          </div>
                          <div className="text-2xl font-black text-blue-600">
                            {rec.match_score}
                            <span className="text-sm font-normal text-slate-400">/100</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Snapshot Metrics */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 text-center">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase">
                            On-Road Est.
                          </div>
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                            {formatRupees(veh.on_road_price_est)}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase">
                            Cost / km
                          </div>
                          <div className="text-xs sm:text-sm font-extrabold text-emerald-700 mt-0.5">
                            ₹{rec.cost_per_km.toFixed(2)}/km
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase">
                            Monthly Running
                          </div>
                          <div className="text-xs sm:text-sm font-extrabold text-amber-700 mt-0.5">
                            {formatRupees(rec.monthly_cost_estimate)}/mo
                          </div>
                        </div>
                      </div>

                      {/* Reasons For & Trade-offs */}
                      <div className="space-y-3 mb-5">
                        {rec.reasons_for.length > 0 && (
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1 flex items-center gap-1">
                              <span>✅</span> Why SahiDrive Recommends This:
                            </div>
                            <ul className="space-y-1 text-xs text-slate-700 pl-2">
                              {rec.reasons_for.map((r, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-emerald-500 font-bold">•</span>
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {rec.trade_offs.length > 0 && (
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1 flex items-center gap-1">
                              <span>⚠️</span> Key Trade-Offs to Keep in Mind:
                            </div>
                            <ul className="space-y-1 text-xs text-slate-600 pl-2">
                              {rec.trade_offs.map((t, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-amber-500 font-bold">•</span>
                                  <span>{t}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => navigate(`/calculator?daily_km=${dailyDistanceKm}`)}
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <span>🧮</span> Calculate Exact 5-Year Costs
                        </button>
                        <button
                          onClick={() => {
                            const counterpart =
                              veh.fuel_type === 'petrol' ? 'ola-s1-pro-gen2' : 'honda-activa-6g';
                            navigate(`/compare?a=${veh.id}&b=${counterpart}`);
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-blue-200"
                        >
                          <span>⚖️</span> Compare with {veh.fuel_type === 'petrol' ? 'EV' : 'Petrol'} Rival &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
