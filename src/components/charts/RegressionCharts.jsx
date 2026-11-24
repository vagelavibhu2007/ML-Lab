import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ComposedChart,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export const RegressionCharts = ({ metricsData }) => {
  if (!metricsData) return null;

  const {
    actualVsPredicted = [],
    residuals = [],
    errorDistribution = [],
    featureImportance = []
  } = metricsData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Actual vs Predicted Plot */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Actual vs Predicted Plot</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Points closer to the 45° diagonal indicate lower variance.</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Scatter & Ideal Line
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 15, bottom: 15, left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis
                type="number"
                dataKey="actual"
                name="Actual"
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                label={{ value: 'Actual Values', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#94a3b8' }}
              />
              <YAxis
                type="number"
                dataKey="predicted"
                name="Predicted"
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                label={{ value: 'Predicted Values', angle: -90, position: 'insideLeft', offset: 25, fontSize: 11, fill: '#94a3b8' }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2.5 rounded-xl bg-slate-900 text-white text-xs shadow-xl border border-slate-800">
                        <div>Actual: <span className="font-mono text-blue-300">{data.actual}</span></div>
                        <div>Predicted: <span className="font-mono text-emerald-300">{data.predicted}</span></div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Diff (Residual): {(data.actual - data.predicted).toFixed(3)}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Predictions" data={actualVsPredicted} fill="#2563eb" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Residual Plot */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Residual Plot (Error vs Predicted)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Residuals randomly dispersed around zero imply homoscedasticity.</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Zero-line reference
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 15, bottom: 15, left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis
                type="number"
                dataKey="predicted"
                name="Predicted"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                label={{ value: 'Predicted Target', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#94a3b8' }}
              />
              <YAxis
                type="number"
                dataKey="residual"
                name="Residual"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                label={{ value: 'Residual (y - ŷ)', angle: -90, position: 'insideLeft', offset: 25, fontSize: 11, fill: '#94a3b8' }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2.5 rounded-xl bg-slate-900 text-white text-xs shadow-xl border border-slate-800">
                        <div>Predicted: <span className="font-mono">{data.predicted}</span></div>
                        <div>Residual: <span className={`font-mono ${data.residual >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{data.residual}</span></div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Residuals" data={residuals} fill="#f43f5e" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Error Distribution (Histogram) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Residual Error Distribution</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Frequency of errors; bell curve reflects normally distributed noise.</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Error Bins
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={errorDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 15 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2 rounded-xl bg-slate-900 text-white text-xs border border-slate-800">
                        <div>Bin: {data.range}</div>
                        <div className="font-bold text-blue-400 font-mono mt-0.5">{data.count} samples</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Feature Importance */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Feature Importance Ranking</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Gini / permutation importance contributions of input features.</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Top Predictors
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={featureImportance}
              margin={{ top: 5, right: 25, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.3} />
              <XAxis type="number" domain={[0, 'dataMax + 0.1']} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis
                type="category"
                dataKey="feature"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                width={85}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2 rounded-xl bg-slate-900 text-white text-xs border border-slate-800">
                        <div className="font-semibold">{data.feature}</div>
                        <div className="text-blue-300 font-mono mt-0.5">
                          Importance: {(data.importance * 100).toFixed(1)}%
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="importance" fill="#2563eb" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
