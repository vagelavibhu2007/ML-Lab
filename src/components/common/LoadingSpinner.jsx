import React from 'react';

export const LoadingSpinner = ({ label = 'Processing...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="w-8 h-8 border-3 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 animate-pulse">{label}</span>
    </div>
  );
};
