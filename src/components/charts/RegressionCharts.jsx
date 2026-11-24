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

  // Diagonal reference line data for Actual vs Predicted
  const minVal = Math.min(...actualVsPredicted.map((d) => d.actual), 1.0);
  const maxVal = Math.max(...actualVsPredicted.map((d) => d.actual), 5.0);
  const lineData = [
    { actual: minVal, predicted: minVal },
    { actual: maxVal, predicted: maxVal }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Actual vs Predicted Plot */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Actual vs Predicted Plot</h3>
            <p className="text-xs text-slate-500">Points closer to the 45° diagonal indicate lower variance.</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Scatter & Ideal Line
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 15, bottom: 15, left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                type="number"
                dataKey="actual"
                name="Actual"
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: 'Actual Values', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#94a3b8' }}
              />
              <YAxis
                type="number"
                dataKey="predicted"
                name="Predicted"
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: 'Predicted Values', angle: -90, position: 'insideLeft', offset: 25, fontSize: 11, fill: '#94a3b8' }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2.5 rounded-xl bg-slate-900 text-white text-xs shadow-xl">
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
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Residual Plot (Error vs Predicted)</h3>
            <p className="text-xs text-slate-500">Residuals randomly dispersed around zero imply homoscedasticity.</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Zero-line reference
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 15, bottom: 15, left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                type="number"
                dataKey="predicted"
                name="Predicted"
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: 'Predicted Target', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#94a3b8' }}
              />
              <YAxis
                type="number"
                dataKey="residual"
                name="Residual"
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: 'Residual (y - ŷ)', angle: -90, position: 'insideLeft', offset: 25, fontSize: 11, fill: '#94a3b8' }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2.5 rounded-xl bg-slate-900 text-white text-xs shadow-xl">
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
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Residual Error Distribution</h3>
            <p className="text-xs text-slate-500">Frequency of errors; bell curve reflects normally distributed noise.</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Error Bins
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={errorDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 15 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2 rounded-xl bg-slate-900 text-white text-xs">
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
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Feature Importance Ranking</h3>
            <p className="text-xs text-slate-500">Gini / permutation importance contributions of input features.</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
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
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 'dataMax + 0.1']} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis
                type="category"
                dataKey="feature"
                tick={{ fontSize: 11, fill: '#334155' }}
                width={85}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2 rounded-xl bg-slate-900 text-white text-xs">
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
