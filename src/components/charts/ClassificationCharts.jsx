import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';

export const ClassificationCharts = ({ metricsData }) => {
  const [cmType, setCmType] = useState('binary'); // 'binary' | 'multiclass'

  if (!metricsData) return null;

  const {
    confusionMatrixBinary,
    confusionMatrixMulticlass,
    rocCurve = [],
    precisionRecallCurve = [],
    featureImportance = [],
    classificationReport = []
  } = metricsData;

  return (
    <div className="space-y-6">
      {/* Top Grid: Confusion Matrix & ROC Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Confusion Matrix Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Confusion Matrix</h3>
                <p className="text-xs text-slate-500">Cross-tabulation of actual versus predicted classes</p>
              </div>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setCmType('binary')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    cmType === 'binary'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Binary (2x2)
                </button>
                <button
                  onClick={() => setCmType('multiclass')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    cmType === 'multiclass'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Multiclass (3x3)
                </button>
              </div>
            </div>

            {cmType === 'binary' && confusionMatrixBinary ? (
              <div className="max-w-md mx-auto my-4">
                <div className="text-[11px] font-semibold text-center text-slate-400 mb-2 uppercase tracking-wider">
                  Predicted Class
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-[11px] font-semibold text-slate-400 -rotate-90 uppercase tracking-wider whitespace-nowrap">
                    Actual Class
                  </div>

                  <div className="grid grid-cols-2 gap-3 flex-1">
                    {/* True Negative */}
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
                      <div className="text-[10px] uppercase font-semibold text-blue-700 tracking-wider">
                        True Negative (TN)
                      </div>
                      <div className="text-2xl font-bold font-mono text-blue-950 mt-1">
                        {confusionMatrixBinary.tn}
                      </div>
                      <div className="text-[10px] text-blue-600 mt-0.5">Predicted 0 • Actual 0</div>
                    </div>

                    {/* False Positive */}
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
                      <div className="text-[10px] uppercase font-semibold text-amber-700 tracking-wider">
                        False Positive (FP - Type I)
                      </div>
                      <div className="text-2xl font-bold font-mono text-amber-950 mt-1">
                        {confusionMatrixBinary.fp}
                      </div>
                      <div className="text-[10px] text-amber-600 mt-0.5">Predicted 1 • Actual 0</div>
                    </div>

                    {/* False Negative */}
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-center">
                      <div className="text-[10px] uppercase font-semibold text-rose-700 tracking-wider">
                        False Negative (FN - Type II)
                      </div>
                      <div className="text-2xl font-bold font-mono text-rose-950 mt-1">
                        {confusionMatrixBinary.fn}
                      </div>
                      <div className="text-[10px] text-rose-600 mt-0.5">Predicted 0 • Actual 1</div>
                    </div>

                    {/* True Positive */}
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                      <div className="text-[10px] uppercase font-semibold text-emerald-700 tracking-wider">
                        True Positive (TP)
                      </div>
                      <div className="text-2xl font-bold font-mono text-emerald-950 mt-1">
                        {confusionMatrixBinary.tp}
                      </div>
                      <div className="text-[10px] text-emerald-600 mt-0.5">Predicted 1 • Actual 1</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto my-4 overflow-x-auto">
                <table className="w-full text-center text-xs border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                        Actual \ Pred
                      </th>
                      {confusionMatrixMulticlass.classes.map((c) => (
                        <th key={c} className="p-2 border border-slate-200 bg-slate-50 text-slate-700 font-semibold">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {confusionMatrixMulticlass.matrix.map((row, i) => (
                      <tr key={i}>
                        <td className="p-2 border border-slate-200 bg-slate-50 text-slate-700 font-semibold">
                          {confusionMatrixMulticlass.classes[i]}
                        </td>
                        {row.map((val, j) => {
                          const isDiagonal = i === j;
                          return (
                            <td
                              key={j}
                              className={`p-3 border border-slate-200 font-mono font-bold ${
                                isDiagonal ? 'bg-emerald-50 text-emerald-900' : 'bg-slate-50/50 text-slate-600'
                              }`}
                            >
                              {val}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total test samples: 1,704</span>
            <span className="font-medium text-emerald-600">Overall Accuracy: 89.6%</span>
          </div>
        </div>

        {/* 2. ROC Curve Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Receiver Operating Characteristic (ROC)</h3>
              <p className="text-xs text-slate-500">True Positive Rate vs False Positive Rate (AUC: 0.954)</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              AUC = 0.954
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rocCurve} margin={{ top: 10, right: 15, bottom: 15, left: -15 }}>
                <defs>
                  <linearGradient id="rocGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  dataKey="fpr"
                  domain={[0, 1]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  label={{ value: 'False Positive Rate (1 - Specificity)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#94a3b8' }}
                />
                <YAxis
                  type="number"
                  dataKey="tpr"
                  domain={[0, 1]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  label={{ value: 'True Positive Rate (Sensitivity)', angle: -90, position: 'insideLeft', offset: 25, fontSize: 11, fill: '#94a3b8' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-xl bg-slate-900 text-white text-xs shadow-xl">
                          <div>FPR: <span className="font-mono text-rose-300">{data.fpr}</span></div>
                          <div>TPR: <span className="font-mono text-emerald-300">{data.tpr}</span></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tpr"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#rocGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Middle Grid: Precision-Recall Curve & Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Precision-Recall Curve */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Precision-Recall Curve</h3>
              <p className="text-xs text-slate-500">Tradeoff across detection thresholds (ideal for imbalanced classes)</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              PR AUC = 0.918
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={precisionRecallCurve} margin={{ top: 10, right: 15, bottom: 15, left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  dataKey="recall"
                  domain={[0, 1]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  label={{ value: 'Recall', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#94a3b8' }}
                />
                <YAxis
                  type="number"
                  dataKey="precision"
                  domain={[0.3, 1.0]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  label={{ value: 'Precision', angle: -90, position: 'insideLeft', offset: 25, fontSize: 11, fill: '#94a3b8' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-xl bg-slate-900 text-white text-xs shadow-xl">
                          <div>Recall: <span className="font-mono text-blue-300">{data.recall}</span></div>
                          <div>Precision: <span className="font-mono text-emerald-300">{data.precision}</span></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="precision"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Feature Importance */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Feature Importance Ranking</h3>
              <p className="text-xs text-slate-500">Weight of features influencing classification splits</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Random Forest
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={featureImportance}
                margin={{ top: 5, right: 25, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 'dataMax + 0.05']} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  type="category"
                  dataKey="feature"
                  tick={{ fontSize: 10, fill: '#334155' }}
                  width={110}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2 rounded-xl bg-slate-900 text-white text-xs">
                          <div className="font-semibold">{data.feature}</div>
                          <div className="text-emerald-400 font-mono mt-0.5">
                            Importance: {(data.importance * 100).toFixed(1)}%
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="importance" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. Classification Report Table */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Classification Report</h3>
            <p className="text-xs text-slate-500">Precision, Recall, F1-Score & Support breakdown by class label</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Per-class breakdown
          </span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Class / Aggregate</th>
                <th className="py-2.5 px-4 font-semibold">Precision</th>
                <th className="py-2.5 px-4 font-semibold">Recall</th>
                <th className="py-2.5 px-4 font-semibold">F1-Score</th>
                <th className="py-2.5 px-4 font-semibold text-right">Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classificationReport.map((row) => {
                const isAggregate = row.classLabel.includes('Avg');
                return (
                  <tr
                    key={row.classLabel}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isAggregate ? 'bg-slate-50/50 font-semibold' : ''
                    }`}
                  >
                    <td className="py-2.5 px-4 text-slate-800 font-medium">
                      {row.classLabel}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-700">
                      {(row.precision * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-700">
                      {(row.recall * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-4 font-mono text-blue-700 font-semibold">
                      {(row.f1Score * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-500 text-right">
                      {row.support.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
