import React from 'react';
import { ArrowUpRight, ArrowDownRight, HelpCircle } from 'lucide-react';

export const MetricCard = ({
  title,
  value,
  subtitle,
  change,
  isPositive,
  icon: Icon,
  tooltip,
  badge,
  badgeColor = 'blue',
  highlight = false
}) => {
  return (
    <div
      className={`relative p-5 rounded-2xl bg-white border transition-all duration-200 hover:shadow-md ${
        highlight
          ? 'border-blue-400 ring-1 ring-blue-400 shadow-sm'
          : 'border-slate-200/80 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          {tooltip && (
            <div className="group relative">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl z-30 leading-snug">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
            <Icon className="w-4 h-4 text-blue-600" />
          </div>
        )}
        {badge && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
          {value}
        </div>
        {change && (
          <div
            className={`flex items-center text-xs font-semibold ${
              isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            <span>{change}</span>
          </div>
        )}
      </div>

      {subtitle && (
        <div className="text-xs text-slate-500 truncate">
          {subtitle}
        </div>
      )}
    </div>
  );
};
