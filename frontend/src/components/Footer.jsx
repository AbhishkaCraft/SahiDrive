import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ onOpenAssumptions }) {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Vision */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Sahi<span className="text-blue-400">Drive</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              An intelligent mobility decision platform for Indian consumers. Helping riders make financially prudent, range-secure, and charging-compatible decisions between petrol and electric two-wheelers.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700">
              <span className="text-emerald-400 font-semibold">Tagline:</span>
              <span>The right vehicle. The right cost. The right decision.</span>
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wide uppercase mb-3">Decision Tools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/compare" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <span>⚖️</span> Compare Petrol vs EV
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <span>🧮</span> Ownership Cost Calculator
                </Link>
              </li>
              <li>
                <Link to="/recommend" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <span>🎯</span> Find My Recommended Vehicle
                </Link>
              </li>
              <li>
                <button
                  onClick={onOpenAssumptions}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-left"
                >
                  <span>ℹ️</span> Assumptions & Methodology
                </button>
              </li>
            </ul>
          </div>

          {/* Hackathon Disclaimers */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wide uppercase mb-3">Hackathon Disclaimers</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              Sample illustrative data for Indian two-wheelers. Not verified live manufacturer or market data.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Calculations exclude insurance premiums, financing interest (EMI), regional RTO road taxes, tyre wear, and resale depreciation.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SahiDrive. Built for Indian consumers & mobility hackathons.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-400">
              <span>🇮🇳</span> Tailored for Indian Road & Commute Realities
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
