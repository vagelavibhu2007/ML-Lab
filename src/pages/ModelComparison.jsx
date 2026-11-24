import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2,
  TrendingUp,
  Target,
  CheckCircle2,
  Trophy,
  Sliders,
  RotateCcw,
  Plus,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useML } from '../context/MLContext';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';

export const ModelComparison = () => {
  const navigate = useNavigate();
  const { trainedModels, comparisonModelIds, toggleComparisonModel, clearComparisonModels } = useML();

  // Task filter: 'Regression' | 'Classification'
  const [activeTask, setActiveTask] = useState('Regression');

  // Filter trained models by active task
  const taskModels = trainedModels.filter((m) => m.task === activeTask);

  // Selected models for comparison (only those matching activeTask)
  const selectedModels = taskModels.filter((m) => comparisonModelIds.includes(m.id));

  // Determine best values for metrics
  // For Regression: highest R2/adjustedR2 is best; lowest MAE/MSE/RMSE is best
  // For Classification: highest Accuracy/Precision/Recall/F1/ROCAUC is best
  const bestMetrics = {};
  if (selectedModels.length > 0) {
    if (activeTask === 'Regression') {
      bestMetrics.r2 = Math.max(...selectedModels.map((m) => m.metrics?.r2 || 0));
      bestMetrics.adjustedR2 = Math.max(...selectedModels.map((m) => m.metrics?.adjustedR2 || 0));
      bestMetrics.mae = Math.min(...selectedModels.map((m) => m.metrics?.mae || 999));
      bestMetrics.mse = Math.min(...selectedModels.map((m) => m.metrics?.mse || 999));
      bestMetrics.rmse = Math.min(...selectedModels.map((m) => m.metrics?.rmse || 999));
    } else {
      bestMetrics.accuracy = Math.max(...selectedModels.map((m) => m.metrics?.accuracy || 0));
      bestMetrics.precision = Math.max(...selectedModels.map((m) => m.metrics?.precision || 0));
      bestMetrics.recall = Math.max(...selectedModels.map((m) => m.metrics?.recall || 0));
      bestMetrics.f1Score = Math.max(...selectedModels.map((m) => m.metrics?.f1Score || 0));
      bestMetrics.rocAuc = Math.max(...selectedModels.map((m) => m.metrics?.rocAuc || 0));
    }
  }

  // Chart data formatting
  const comparisonChartData = selectedModels.map((m) => {
    if (activeTask === 'Regression') {
      return {
        name: m.name,
        'R² Score': Number((m.metrics?.r2 || 0).toFixed(3)),
        'RMSE (Lower is better)': Number((m.metrics?.rmse || 0).toFixed(3)),
        'MAE (Lower is better)': Number((m.metrics?.mae || 0).toFixed(3))
      };
    } else {
      return {
        name: m.name,
        'Accuracy %': Number(((m.metrics?.accuracy || 0) * 100).toFixed(1)),
        'Precision %': Number(((m.metrics?.precision || 0) * 100).toFixed(1)),
        'Recall %': Number(((m.metrics?.recall || 0) * 100).toFixed(1)),
        'F1 Score %': Number(((m.metrics?.f1Score || 0) * 100).toFixed(1))
      };
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Model Benchmark & Comparison"
        subtitle="Compare multi-model metrics side-by-side, evaluate tradeoffs, and highlight optimal configurations."
        badge={`${selectedModels.length} Models Selected`}
        actions={
          <div className="flex items-center gap-2">
            {comparisonModelIds.length > 0 && (
              <button
                onClick={clearComparisonModels}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Selection</span>
              </button>
            )}
            <button
              onClick={() => navigate('/train')}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Train Another Model</span>
            </button>
          </div>
        }
      />

      {/* Task Filter Tab & Model Selector Panel */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Comparison Mode:
            </span>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTask('Regression')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTask === 'Regression'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Regression Models</span>
              </button>
              <button
                onClick={() => setActiveTask('Classification')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTask === 'Classification'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Classification Models</span>
              </button>
            </div>
          </div>

          <span className="text-xs text-slate-400">
            Select 2 to 4 models from the roster below to compare
          </span>
        </div>

        {/* Model Checkbox Selector Chips */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Available {activeTask} Models ({taskModels.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {taskModels.map((m) => {
              const isSelected = comparisonModelIds.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => toggleComparisonModel(m.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                    isSelected
                      ? activeTask === 'Regression'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-500 shadow-xs'
                        : 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isSelected
                        ? activeTask === 'Regression'
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span>{m.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({m.algorithmName})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedModels.length >= 2 ? (
        <>
          {/* Comparison Table */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Metrics Benchmark Table</h3>
                <p className="text-xs text-slate-500">
                  Green highlights indicate the superior metric across compared models.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
                <Trophy className="w-3.5 h-3.5" />
                <span>Best values highlighted</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Model Name</th>
                    <th className="py-3 px-4 font-semibold">Algorithm</th>
                    <th className="py-3 px-4 font-semibold">Dataset</th>
                    {activeTask === 'Regression' ? (
                      <>
                        <th className="py-3 px-4 font-semibold">R² Score (↑)</th>
                        <th className="py-3 px-4 font-semibold">Adj R² (↑)</th>
                        <th className="py-3 px-4 font-semibold">MAE (↓)</th>
                        <th className="py-3 px-4 font-semibold">MSE (↓)</th>
                        <th className="py-3 px-4 font-semibold">RMSE (↓)</th>
                      </>
                    ) : (
                      <>
                        <th className="py-3 px-4 font-semibold">Accuracy (↑)</th>
                        <th className="py-3 px-4 font-semibold">Precision (↑)</th>
                        <th className="py-3 px-4 font-semibold">Recall (↑)</th>
                        <th className="py-3 px-4 font-semibold">F1 Score (↑)</th>
                        <th className="py-3 px-4 font-semibold">ROC-AUC (↑)</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedModels.map((m) => {
                    const metrics = m.metrics || {};
                    return (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {m.name}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {m.algorithmName}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                          {m.datasetName}
                        </td>

                        {activeTask === 'Regression' ? (
                          <>
                            {/* R2 */}
                            <td className="py-3 px-4 font-mono">
                              <span
                                className={`px-2 py-0.5 rounded-md ${
                                  metrics.r2 === bestMetrics.r2
                                    ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                                    : 'text-slate-700'
                                }`}
                              >
                                {metrics.r2?.toFixed(4)}
                              </span>
                            </td>
                            {/* Adjusted R2 */}
                            <td className="py-3 px-4 font-mono">
                              <span
                                className={`px-2 py-0.5 rounded-md ${
                                  metrics.adjustedR2 === bestMetrics.adjustedR2
                                    ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                                    : 'text-slate-700'
                                }`}
                              >
                                {metrics.adjustedR2?.toFixed(4)}
                              </span>
                            </td>
                            {/* MAE */}
                            <td className="py-3 px-4 font-mono">
                              <span
                                className={`px-2 py-0.5 rounded-md ${
                                  metrics.mae === bestMetrics.mae
                                    ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                                    : 'text-slate-700'
                                }`}
                              >
                                {metrics.mae?.toFixed(4)}
                              </span>
                            </td>
                            {/* MSE */}
                            <td className="py-3 px-4 font-mono">
                              <span
                                className={`px-2 py-0.5 rounded-md ${
                                  metrics.mse === bestMetrics.mse
                                    ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                                    : 'text-slate-700'
                                }`}
                              >
                                {metrics.mse?.toFixed(4)}
                              </span>
                            </td>
                            {/* RMSE */}
                            <td className="py-3 px-4 font-mono">
                              <span
                                className={`px-2 py-0.5 rounded-md ${
                                  metrics.rmse === bestMetrics.rmse
                                    ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                                    : 'text-slate-700'
                                }`}
                              >
                                {metrics.rmse?.toFixed(4)}
                              </span>
                            </td>
                          </>
                        ) : (
                          <>
                            {/* Accuracy */}
                            <td className="py-3 px-4 font-mono">
                              <span
                                className={`px-2 py-0.5 rounded-md ${
                                  metrics.accuracy === bestMetrics.accuracy
                                    ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                                    : 'text-slate-700'
                                }`}
                              >
                                {(metrics.accuracy * 100)?.toFixed(1)}%
                              </span>
                            </td>
                            {/* Precision */}
                            <td className="py-3 px-4 font-mono">
                              <span
                                className={`px-2 py-0.5 rounded-md ${
                                  metrics.precision === bestMetrics.precision
                                    ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                                    : 'text-slate-700'
                                }`}
                              >
                                {(metrics.precision * 100)?.toFixed(1)}%
                              </span>
                            </td>
                            {/* Recall */}
                            <td className="py-3 px-4 font-mono">
                              <span
                                className={`px-2 py-0.5 rounded-md ${
                                  metrics.recall === bestMetrics.recall
                                    ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                                    : 'text-slate-700'
                                }`}
                              >
                                {(metrics.recall * 100)?.toFixed(1)}%
                              </span>
                            </td>
                            {/* F1 Score */}
                            <td className="py-3 px-4 font-mono">
                              <span
                                className={`px-2 py-0.5 rounded-md ${
                                  metrics.f1Score === bestMetrics.f1Score
                                    ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                                    : 'text-slate-700'
                                }`}
                              >
                                {metrics.f1Score?.toFixed(4)}
                              </span>
                            </td>
                            {/* ROC-AUC */}
                            <td className="py-3 px-4 font-mono">
                              <span
                                className={`px-2 py-0.5 rounded-md ${
                                  metrics.rocAuc === bestMetrics.rocAuc
                                    ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                                    : 'text-slate-700'
                                }`}
                              >
                                {metrics.rocAuc?.toFixed(4)}
                              </span>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-500 flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Note: Optimal models should balance error minimization with generalization capacity, rather than relying on a single metric in isolation.
              </span>
            </div>
          </div>

          {/* Performance Comparison Bar Chart */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Visual Metric Comparison
                </h3>
                <p className="text-xs text-slate-500">
                  Side-by-side metric distributions across chosen candidate models
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Multi-Series Bar Chart
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonChartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="p-3 rounded-xl bg-slate-900 text-white text-xs shadow-xl space-y-1">
                            <div className="font-bold border-b border-slate-800 pb-1">{label}</div>
                            {payload.map((entry, idx) => (
                              <div key={idx} className="flex justify-between gap-4">
                                <span style={{ color: entry.color }}>{entry.name}:</span>
                                <span className="font-mono font-bold">{entry.value}</span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                  {activeTask === 'Regression' ? (
                    <>
                      <Bar dataKey="R² Score" fill="#2563eb" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="RMSE (Lower is better)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="MAE (Lower is better)" fill="#ec4899" radius={[6, 6, 0, 0]} />
                    </>
                  ) : (
                    <>
                      <Bar dataKey="Accuracy %" fill="#10b981" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="Precision %" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="Recall %" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="F1 Score %" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          icon={BarChart2}
          title="Select at least 2 models to compare"
          description={`Please select at least 2 ${activeTask} models from the cards above to generate side-by-side benchmark comparison tables and charts.`}
          actionLabel="Train New Model"
          onAction={() => navigate('/train')}
        />
      )}
    </div>
  );
};
