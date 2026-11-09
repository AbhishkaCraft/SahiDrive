import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ onOpenAssumptions }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/compare', label: 'Compare Vehicles', icon: '⚖️' },
    { to: '/calculator', label: 'Cost Calculator', icon: '🧮' },
    { to: '/recommend', label: 'Find My Vehicle', icon: '🎯' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-navy to-brand-blue flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  Sahi<span className="text-blue-600">Drive</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  India Mobility
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-600 -mt-0.5 font-medium">
                The right vehicle. The right cost.
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action / Assumptions Button */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onOpenAssumptions}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
              title="View benchmark data and calculations"
            >
              <span>ℹ️</span>
              <span>Assumptions & Disclaimers</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenAssumptions}
              className="p-2 rounded-lg border border-slate-200 text-xs text-slate-600"
              title="Assumptions"
            >
              ℹ️
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200"
              aria-label="Toggle menu"
            >
              <span className="text-lg">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 ${
                  active
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
