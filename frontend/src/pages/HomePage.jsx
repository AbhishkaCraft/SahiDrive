import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function HomePage({ onOpenAssumptions }) {
  const navigate = useNavigate();
  const [quickDailyKm, setQuickDailyKm] = useState(30);

  // Quick live math for hero teaser
  const monthlyKm = quickDailyKm * 25;
  const annualKm = monthlyKm * 12;

  // Typical petrol: 50 kmpl @ ₹102/L = ₹2.04/km
  const petrolMonthly = Math.round(monthlyKm * 2.04);
  const petrolAnnual = petrolMonthly * 12;

  // Typical EV: 3.5 kWh / 115 km * ₹8 = ₹0.243/km
  const evMonthly = Math.round(monthlyKm * 0.243);
  const evAnnual = evMonthly * 12;

  const annualSaving = petrolAnnual - evAnnual;

  const popularComparisons = [
    {
      title: "The Battle of Scooters",
      aId: "honda-activa-6g",
      aName: "Honda Activa 6G",
      bId: "ola-s1-pro-gen2",
      bName: "Ola S1 Pro (Gen 2)",
      tag: "Most Popular Matchup",
      desc: "India's highest-selling petrol scooter vs the technology-packed high-performance EV."
    },
    {
      title: "Budget Commuters",
      aId: "hero-splendor-plus",
      aName: "Hero Splendor+",
      bId: "ola-s1-x-3kwh",
      bName: "Ola S1 X (3 kWh)",
      tag: "Under ₹1 Lakh Battle",
      desc: "The 65 km/l legendary mileage champion meets the budget electric scooter."
    },
    {
      title: "Family Comfort",
      aId: "tvs-jupiter-110",
      aName: "TVS Jupiter 110",
      bId: "tvs-iqube-3-4kwh",
      bName: "TVS iQube (3.4 kWh)",
      tag: "Legacy Brand Trust",
      desc: "Compare TVS's refined family scooter in both petrol and whisper-quiet electric avatars."
    },
    {
      title: "Motorcycle Commuters",
      aId: "honda-shine-125",
      aName: "Honda Shine 125",
      bId: "revolt-rv400",
      bName: "Revolt RV400",
      tag: "Bike Enthusiast",
      desc: "Buttery smooth 125cc commuter motorcycle vs swappable-battery electric street bike."
    }
  ];

  return (
    <div className="space-y-16 py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Disclaimer */}
      <DisclaimerBanner onOpenAssumptions={onOpenAssumptions} />

      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-brand-navy via-slate-900 to-brand-navyLight text-white p-6 sm:p-12 overflow-hidden shadow-2xl border border-slate-800">
        {/* Background decorative accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide">
              <span>⚡</span> Intelligent Mobility Decision Platform for India
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              The right vehicle. <br />
              The right cost. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">
                The right decision.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Buying a two-wheeler in India is no longer just about the ex-showroom price.
              Compare petrol and electric two-wheelers, calculate true 5-year ownership costs,
              and receive objective, rule-based recommendations tailored to your daily commute and charging realities.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                to="/recommend"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center gap-2"
              >
                <span>🎯</span> Find My Recommended Vehicle
              </Link>
              <Link
                to="/compare"
                className="px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2"
              >
                <span>⚖️</span> Compare Two-Wheelers
              </Link>
              <Link
                to="/calculator"
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/10 transition-all flex items-center gap-2"
              >
                <span>🧮</span> Cost Calculator
              </Link>
            </div>
          </div>

          {/* Hero Right: Live Interactive Teaser Card */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 sm:p-6 text-white shadow-xl">
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
              <span className="font-bold text-sm tracking-wide text-blue-200 uppercase flex items-center gap-1.5">
                <span>⚡</span> Fuel vs Power at a Glance
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Live Preview
              </span>
            </div>

            {/* Slider */}
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Your Daily Commute Distance:</span>
                <span className="font-bold text-white text-sm">{quickDailyKm} km / day</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={quickDailyKm}
                onChange={(e) => setQuickDailyKm(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>5 km</span>
                <span>30 km (Avg)</span>
                <span>60 km</span>
                <span>120 km</span>
              </div>
            </div>

            {/* Teaser Comparison Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-amber-500/30">
                <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                  <span>⛽</span> Petrol Scooter
                </div>
                <div className="text-xl font-extrabold text-white mt-1">
                  ₹{petrolMonthly.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Monthly at ₹102/L (50 kmpl)
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-emerald-500/30">
                <div className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                  <span>⚡</span> Electric Scooter
                </div>
                <div className="text-xl font-extrabold text-emerald-400 mt-1">
                  ₹{evMonthly.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Monthly at ₹8/kWh
                </div>
              </div>
            </div>

            {/* Highlighted Annual Difference */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-950/70 to-slate-900/80 rounded-xl border border-emerald-500/40 text-center">
              <div className="text-xs text-emerald-300 font-medium">
                Annual Fuel & Energy Difference
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">
                ₹{annualSaving.toLocaleString('en-IN')} / year
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Based on {annualKm.toLocaleString()} km annual travel. (Does not include purchase price & maintenance).
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-center">
              <button
                onClick={() => navigate(`/calculator?daily_km=${quickDailyKm}`)}
                className="text-xs font-semibold text-blue-300 hover:text-white transition-colors underline underline-offset-4"
              >
                Open Full 5-Year Ownership Calculator &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Core Value Proposition Cards */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Why SahiDrive?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Solving the Confusion in Indian Mobility
          </h2>
          <p className="text-sm text-slate-600">
            Showroom prices tell only 40% of the financial story. SahiDrive reveals the full picture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl border border-blue-100">
              💰
            </div>
            <h3 className="font-bold text-base text-slate-900">
              Beyond Showroom Price
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              A ₹90,000 petrol scooter often consumes more than ₹1,00,000 in fuel alone over 5 years. We calculate total ownership, not just purchase price.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl border border-emerald-100">
              ⏱️
            </div>
            <h3 className="font-bold text-base text-slate-900">
              Payback & Break-Even
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Curious if an electric scooter is worth the extra ₹40,000 upfront? SahiDrive calculates the exact month and kilometer where you break even.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl border border-amber-100">
              🔌
            </div>
            <h3 className="font-bold text-base text-slate-900">
              Charging Reality First
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never blindly recommend electric vehicles. If you live in an apartment without parking sockets, we objectively recommend reliable petrol alternatives.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-2xl border border-sky-100">
              🛡️
            </div>
            <h3 className="font-bold text-base text-slate-900">
              Full Transparency
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every single formula, benchmark, and exclusion is visible. We clearly state sample data limitations so you can make informed decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Popular Comparisons Section */}
      <div className="bg-slate-100/70 rounded-3xl p-6 sm:p-10 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Head-to-Head Showdowns
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Popular Indian Two-Wheeler Comparisons
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select any matchup to instantly analyze upfront price vs 5-year running expenses.
            </p>
          </div>
          <Link
            to="/compare"
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Compare Custom Models</span> &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {popularComparisons.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {item.tag}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">Matchup #{idx + 1}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">{item.desc}</p>

                {/* Matchup visual pill */}
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-slate-800">
                    <span>⛽</span>
                    <span>{item.aName}</span>
                  </div>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    VS
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-slate-800">
                    <span>⚡</span>
                    <span>{item.bName}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/compare?a=${item.aId}&b=${item.bId}`)}
                className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-blue-200"
              >
                <span>⚖️</span> Compare Head-to-Head &rarr;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works & Transparency Assurance */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-card">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Explainable & Unbiased
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How SahiDrive Recommends Your Next Ride
          </h2>
          <p className="text-sm text-slate-600">
            A transparent 4-factor decision framework designed for real Indian riding conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center mx-auto">
              1
            </div>
            <h4 className="font-bold text-sm text-slate-900">Budget Limits</h4>
            <p className="text-xs text-slate-600">
              Filters on-road purchase price within your strict target without hidden add-ons.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-black text-sm flex items-center justify-center mx-auto">
              2
            </div>
            <h4 className="font-bold text-sm text-slate-900">Charging Setup</h4>
            <p className="text-xs text-slate-600">
              Evaluates home plug access vs apartment parking constraints before suggesting an EV.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-black text-sm flex items-center justify-center mx-auto">
              3
            </div>
            <h4 className="font-bold text-sm text-slate-900">Commute Distance</h4>
            <p className="text-xs text-slate-600">
              Ensures safe 50%+ daily battery reserves or high petrol economy for long rides.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 font-black text-sm flex items-center justify-center mx-auto">
              4
            </div>
            <h4 className="font-bold text-sm text-slate-900">User Priorities</h4>
            <p className="text-xs text-slate-600">
              Weights reliability, performance, low upfront price, or green zero-emission priorities.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/recommend"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all"
          >
            <span>🎯</span> Start the 60-Second Vehicle Recommendation Wizard &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
