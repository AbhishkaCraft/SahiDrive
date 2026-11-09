import React from 'react';

export default function MetricCard({
  icon,
  title,
  value,
  unit,
  subtitle,
  variant = 'default',
  badge,
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'emerald':
        return 'border-emerald-200 bg-emerald-50/50 text-emerald-900';
      case 'blue':
        return 'border-blue-200 bg-blue-50/50 text-blue-900';
      case 'amber':
        return 'border-amber-200 bg-amber-50/50 text-amber-900';
      case 'slate':
        return 'border-slate-200 bg-white text-slate-900';
      default:
        return 'border-slate-200 bg-white text-slate-900';
    }
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border shadow-card transition-all hover:shadow-card-hover ${getVariantStyles()}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-xl">{icon}</span>}
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </span>
        </div>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-semibold text-slate-500">{unit}</span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
