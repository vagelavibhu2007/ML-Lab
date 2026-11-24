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
  highlight = false
}) => {
  return (
    <div
      className={`relative p-4 rounded-xl bg-white dark:bg-slate-900 border transition-all ${
        highlight
          ? 'border-blue-600/70 dark:border-blue-500 ring-1 ring-blue-600/20 dark:ring-blue-500/30 shadow-xs'
          : 'border-slate-200/90 dark:border-slate-800 shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          {tooltip && (
            <div className="group relative">
              <HelpCircle className="w-3 h-3 text-slate-400 dark:text-slate-500 cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl z-30 leading-snug border border-slate-800">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-300">
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
        {badge && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-mono">
          {value}
        </div>
        {change && (
          <div
            className={`flex items-center text-xs font-semibold ${
              isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
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
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
};
