import React from 'react';

export const LoadingSpinner = ({ label = 'Processing...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <span className="text-xs font-medium text-slate-500 animate-pulse">{label}</span>
    </div>
  );
};
